const axios = require('axios');
const { improvePrompt } = require('../services/deepseek');
const { generateThumbnail } = require('../services/pollination');
const { incrementUsage, userGenerations, DAILY_LIMIT } = require('../middleware/rateLimiter');

const ASPECT_RATIOS = {
  youtube: { width: 1280, height: 720 },
  instagram: { width: 1080, height: 1080 },
  tiktok: { width: 1080, height: 1920 },
  linkedin: { width: 1200, height: 627 }
};

const VALID_PLATFORMS = Object.keys(ASPECT_RATIOS);
const MAX_STRING_LENGTH = 500;
const MAX_HASHTAG_COUNT = 30;

const sanitizeInput = (str, maxLen = MAX_STRING_LENGTH) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
};

const sanitizeError = (error) => {
  const msg = error?.message || 'Unknown error';
  if (msg.includes('api') || msg.includes('key') || msg.includes('token') || msg.includes('Bearer')) {
    return 'An external service error occurred. Please try again.';
  }
  return msg.slice(0, 200);
};

const generateCreatorContent = async (req, res) => {
  try {
    const { userIdea, platform, imageUrl, simpleMode } = req.body;

    if (!userIdea || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userIdea, platform'
      });
    }

    const cleanIdea = sanitizeInput(userIdea);
    if (!cleanIdea) {
      return res.status(400).json({ success: false, message: 'Invalid userIdea' });
    }

    if (!VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}`
      });
    }

    let finalPrompt;
    let caption;

    if (simpleMode) {
      finalPrompt = cleanIdea;
      caption = `Check out this amazing ${platform} content!`;
    } else {
      let improvedContent;
      try {
        improvedContent = await improvePrompt(cleanIdea, platform);
      } catch (aiError) {
        finalPrompt = cleanIdea;
        caption = `Check out this amazing ${platform} content!`;
      }

      if (improvedContent) {
        const promptMatch = improvedContent.match(/PROMPT:\s*(.+?)(?=CAPTION:|$)/is);
        const captionMatch = improvedContent.match(/CAPTION:\s*(.+?)$/is);
        finalPrompt = promptMatch ? promptMatch[1].trim() : cleanIdea;
        caption = captionMatch ? captionMatch[1].trim() : `Amazing ${platform} content!`;
      }
    }

    const aspectRatio = ASPECT_RATIOS[platform];
    const thumbnailUrl = await generateThumbnail(finalPrompt, imageUrl, aspectRatio);

    const remaining = incrementUsage(req);

    res.json({
      success: true,
      data: {
        thumbnail: thumbnailUrl,
        caption,
        prompt: finalPrompt,
        platform,
        remaining
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: sanitizeError(error)
    });
  }
};

const checkUsage = (req, res) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `${userIP}-${today}`;
  const count = userGenerations?.get?.(key) || 0;

  res.json({
    success: true,
    used: count,
    remaining: DAILY_LIMIT - count,
    total: DAILY_LIMIT
  });
};

// ==================== CAPTION GENERATOR ====================

const CAPTION_LIMIT = 10;
const captionGenerations = new Map();

setInterval(() => {
  const today = new Date().toDateString();
  for (const key of captionGenerations.keys()) {
    if (!key.endsWith(today)) captionGenerations.delete(key);
  }
}, 60 * 60 * 1000);

const generateCaption = async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;
    const userIP = req.ip;
    const today = new Date().toDateString();
    const key = `caption-${userIP}-${today}`;

    const count = captionGenerations.get(key) || 0;
    if (count >= CAPTION_LIMIT) {
      return res.status(429).json({ success: false, message: 'Daily caption limit reached!' });
    }

    if (!topic || !tone || !platform) {
      return res.status(400).json({ success: false, message: 'Missing required fields: topic, tone, platform' });
    }

    const cleanTopic = sanitizeInput(topic);
    const cleanTone = sanitizeInput(tone, 50);
    const cleanPlatform = sanitizeInput(platform, 20);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nex-agi/deepseek-v3.1-nex-n1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a social media caption expert. Create engaging, platform-appropriate captions.'
          },
          {
            role: 'user',
            content: `Create a ${cleanTone} caption for ${cleanPlatform} about: "${cleanTopic}".
Make it engaging, include relevant emojis, and keep it appropriate for ${cleanPlatform}.
For Instagram: 150-200 characters with line breaks and emojis
For Twitter: Under 280 characters, punchy
For Facebook: Conversational, 100-150 characters
For LinkedIn: Professional, 150-200 characters
Just return the caption, nothing else.`
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const captionText = response.data?.choices?.[0]?.message?.content?.trim();
    if (!captionText) {
      throw new Error('Empty response from AI');
    }

    captionGenerations.set(key, count + 1);

    res.json({
      success: true,
      data: {
        caption: captionText,
        remaining: CAPTION_LIMIT - (count + 1)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: sanitizeError(error)
    });
  }
};

const checkCaptionUsage = (req, res) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `caption-${userIP}-${today}`;
  const count = captionGenerations.get(key) || 0;

  res.json({ success: true, used: count, remaining: CAPTION_LIMIT - count, total: CAPTION_LIMIT });
};

// ==================== HASHTAG GENERATOR ====================

const HASHTAG_LIMIT = 10;
const hashtagGenerations = new Map();

setInterval(() => {
  const today = new Date().toDateString();
  for (const key of hashtagGenerations.keys()) {
    if (!key.endsWith(today)) hashtagGenerations.delete(key);
  }
}, 60 * 60 * 1000);

const generateHashtags = async (req, res) => {
  try {
    const { topic, niche, count } = req.body;
    const userIP = req.ip;
    const today = new Date().toDateString();
    const key = `hashtag-${userIP}-${today}`;

    const usageCount = hashtagGenerations.get(key) || 0;
    if (usageCount >= HASHTAG_LIMIT) {
      return res.status(429).json({ success: false, message: 'Daily hashtag limit reached!' });
    }

    if (!topic || !niche) {
      return res.status(400).json({ success: false, message: 'Missing required fields: topic, niche' });
    }

    const cleanTopic = sanitizeInput(topic);
    const cleanNiche = sanitizeInput(niche, 100);
    const tagCount = Math.min(Math.max(parseInt(count) || 10, 1), MAX_HASHTAG_COUNT);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nex-agi/deepseek-v3.1-nex-n1:free',
        messages: [
          {
            role: 'system',
            content: 'You are a social media hashtag expert. Generate relevant, trending hashtags.'
          },
          {
            role: 'user',
            content: `Generate ${tagCount} hashtags for ${cleanNiche} content about: "${cleanTopic}".
Mix of: popular hashtags (high reach), niche hashtags (targeted audience), branded hashtags (unique).
Format: Return ONLY hashtags separated by spaces, like: #example #another #third
No explanations, just the hashtags.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const hashtagsText = response.data?.choices?.[0]?.message?.content?.trim();
    if (!hashtagsText) {
      throw new Error('Empty response from AI');
    }

    const hashtags = hashtagsText.split(/\s+/).filter(h => h.startsWith('#') && h.length > 1);
    hashtagGenerations.set(key, usageCount + 1);

    res.json({
      success: true,
      data: {
        hashtags: hashtags.slice(0, tagCount),
        remaining: HASHTAG_LIMIT - (usageCount + 1)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: sanitizeError(error)
    });
  }
};

const checkHashtagUsage = (req, res) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `hashtag-${userIP}-${today}`;
  const count = hashtagGenerations.get(key) || 0;

  res.json({ success: true, used: count, remaining: HASHTAG_LIMIT - count, total: HASHTAG_LIMIT });
};

// ==================== BACKGROUND REMOVER ====================

const BG_REMOVAL_LIMIT = 2;
const bgRemovalGenerations = new Map();

setInterval(() => {
  const today = new Date().toDateString();
  for (const key of bgRemovalGenerations.keys()) {
    if (!key.endsWith(today)) bgRemovalGenerations.delete(key);
  }
}, 60 * 60 * 1000);

const removeBackground = async (req, res) => {
  const fs = require('fs');
  let tempPath = null;

  try {
    const userIP = req.ip;
    const today = new Date().toDateString();
    const key = `bg-removal-${userIP}-${today}`;

    const count = bgRemovalGenerations.get(key) || 0;
    if (count >= BG_REMOVAL_LIMIT) {
      return res.status(429).json({ success: false, message: 'Daily limit reached! You can remove 2 backgrounds per day.' });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    if (!process.env.REMOVEBG_API_KEY) {
      return res.status(503).json({ success: false, message: 'Background removal service is not configured' });
    }

    const imageFile = req.files.image;
    tempPath = imageFile.tempFilePath;

    if (!imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({ success: false, message: 'Uploaded file must be an image' });
    }

    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(imageFile.tempFilePath), {
      filename: imageFile.name,
      contentType: imageFile.mimetype
    });
    formData.append('size', 'auto');

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': process.env.REMOVEBG_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 60000
      }
    );

    const base64Image = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    bgRemovalGenerations.set(key, count + 1);

    res.json({
      success: true,
      data: { imageUrl, remaining: BG_REMOVAL_LIMIT - (count + 1) }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: sanitizeError(error)
    });
  } finally {
    if (tempPath) {
      try { fs.unlinkSync(tempPath); } catch (e) { /* already cleaned */ }
    }
  }
};

const checkBgRemovalUsage = (req, res) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `bg-removal-${userIP}-${today}`;
  const count = bgRemovalGenerations.get(key) || 0;

  res.json({ success: true, used: count, remaining: BG_REMOVAL_LIMIT - count, total: BG_REMOVAL_LIMIT });
};

module.exports = {
  generateCreatorContent,
  checkUsage,
  generateCaption,
  checkCaptionUsage,
  generateHashtags,
  checkHashtagUsage,
  removeBackground,
  checkBgRemovalUsage
};
