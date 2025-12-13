const { improvePrompt } = require('../services/deepseek');
const { generateThumbnail } = require('../services/pollination');
const { incrementUsage,userGenerations, DAILY_LIMIT} = require('../middleware/rateLimiter');

const ASPECT_RATIOS = {
  youtube: { width: 1280, height: 720 },
  instagram: { width: 1080, height: 1080 },
  tiktok: { width: 1080, height: 1920 },
  linkedin: { width: 1200, height: 627 }
};

const generateCreatorContent = async (req, res) => {
  try {
    console.log('📥 Request received:', {
      userIdea: req.body.userIdea,
      platform: req.body.platform,
      hasImage: !!req.body.imageUrl,
      simpleMode: req.body.simpleMode
    });

    const { userIdea, platform, imageUrl, simpleMode } = req.body;

    if (!userIdea || !platform || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userIdea, platform, imageUrl'
      });
    }

    console.log('✅ Validation passed');
    console.log('🎨 Starting generation for:', platform);
    console.log('💡 User idea:', userIdea);

    let finalPrompt;
    let caption;

    // If simple mode is enabled, skip AI enhancement
    if (simpleMode) {
      console.log('⚡ Simple mode: Using user prompt as-is');
      finalPrompt = userIdea;
      caption = `Check out this amazing ${platform} content! 🚀`;
    } else {
      // Step 1: Improve prompt with AI
      console.log('🔄 Step 1: Calling OpenRouter API...');
      let improvedContent;
      try {
        improvedContent = await improvePrompt(userIdea, platform);
        console.log('✅ OpenRouter response received');
      } catch (aiError) {
        console.error('❌ OpenRouter API failed:', aiError.message);
        // Fallback to user's original idea
        console.log('⚠️ Falling back to user prompt');
        finalPrompt = userIdea;
        caption = `Check out this amazing ${platform} content! 🚀`;
      }
      
      if (improvedContent) {
        // Parse the AI response
        const promptMatch = improvedContent.match(/PROMPT:\s*(.+?)(?=CAPTION:|$)/is);
        const captionMatch = improvedContent.match(/CAPTION:\s*(.+?)$/is);
        
        finalPrompt = promptMatch ? promptMatch[1].trim() : userIdea;
        caption = captionMatch ? captionMatch[1].trim() : `Amazing ${platform} content! 🚀`;
      }
    }

    console.log('📝 Final prompt:', finalPrompt);
    console.log('📱 Caption:', caption);

    // Step 2: Generate thumbnail with Pollinations
    console.log('🔄 Step 2: Generating image with Pollinations.ai...');
    const aspectRatio = ASPECT_RATIOS[platform];
    
    let thumbnailUrl;
    try {
      thumbnailUrl = await generateThumbnail(finalPrompt, imageUrl, aspectRatio);
      console.log('✅ Thumbnail generated successfully');
    } catch (imageError) {
      console.error('❌ Image generation failed:', imageError.message);
      throw imageError;
    }

    // Step 3: Increment usage
    const remaining = incrementUsage(req);
    console.log('📊 Remaining generations:', remaining);

    console.log('✅ Generation completed successfully');

    res.json({
      success: true,
      data: {
        thumbnail: thumbnailUrl,
        caption: caption,
        prompt: finalPrompt,
        platform: platform,
        remaining: remaining
      }
    });

  } catch (error) {
    console.error('❌❌❌ GENERATION ERROR ❌❌❌');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate content'
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

const generateCaption = async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;
    const userIP = req.ip;
    const today = new Date().toDateString();
    const key = `caption-${userIP}-${today}`;

    // Check usage
    const count = captionGenerations.get(key) || 0;
    if (count >= CAPTION_LIMIT) {
      return res.status(429).json({
        success: false,
        message: 'Daily caption limit reached!'
      });
    }

    console.log('📝 Generating caption...');
    console.log('Topic:', topic);
    console.log('Tone:', tone);
    console.log('Platform:', platform);

    // Call AI to generate caption
    const axios = require('axios');
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nex-agi/deepseek-v3.1-nex-n1:free',
        messages: [
          {
            role: 'system',
            content: `You are a social media caption expert. Create engaging, platform-appropriate captions.`
          },
          {
            role: 'user',
            content: `Create a ${tone} caption for ${platform} about: "${topic}". 
            
Make it engaging, include relevant emojis, and keep it appropriate for ${platform}.
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
        }
      }
    );

    const caption = response.data.choices[0].message.content.trim();

    // Update usage
    captionGenerations.set(key, count + 1);

    console.log('✅ Caption generated:', caption);

    res.json({
      success: true,
      data: {
        caption: caption,
        remaining: CAPTION_LIMIT - (count + 1)
      }
    });

  } catch (error) {
    console.error('❌ Caption generation error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate caption'
    });
  }
};

const checkCaptionUsage = (req, res) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `caption-${userIP}-${today}`;
  
  const count = captionGenerations.get(key) || 0;
  
  res.json({
    success: true,
    used: count,
    remaining: CAPTION_LIMIT - count,
    total: CAPTION_LIMIT
  });
};

// ==================== HASHTAG GENERATOR ====================

const HASHTAG_LIMIT = 10;
const hashtagGenerations = new Map();

const generateHashtags = async (req, res) => {
  try {
    const { topic, niche, count } = req.body;
    const userIP = req.ip;
    const today = new Date().toDateString();
    const key = `hashtag-${userIP}-${today}`;

    // Check usage
    const usageCount = hashtagGenerations.get(key) || 0;
    if (usageCount >= HASHTAG_LIMIT) {
      return res.status(429).json({
        success: false,
        message: 'Daily hashtag limit reached!'
      });
    }

    console.log('🏷️ Generating hashtags...');
    console.log('Topic:', topic);
    console.log('Niche:', niche);
    console.log('Count:', count);

    // Call AI to generate hashtags
    const axios = require('axios');
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nex-agi/deepseek-v3.1-nex-n1:free',
        messages: [
          {
            role: 'system',
            content: `You are a social media hashtag expert. Generate relevant, trending hashtags.`
          },
          {
            role: 'user',
            content: `Generate ${count} hashtags for ${niche} content about: "${topic}".

Mix of:
- Popular hashtags (high reach)
- Niche hashtags (targeted audience)  
- Branded hashtags (unique)

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
        }
      }
    );

    const hashtagsText = response.data.choices[0].message.content.trim();
    const hashtags = hashtagsText.split(/\s+/).filter(h => h.startsWith('#'));

    // Update usage
    hashtagGenerations.set(key, usageCount + 1);

    console.log('✅ Hashtags generated:', hashtags);

    res.json({
      success: true,
      data: {
        hashtags: hashtags,
        remaining: HASHTAG_LIMIT - (usageCount + 1)
      }
    });

  } catch (error) {
    console.error('❌ Hashtag generation error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate hashtags'
    });
  }
};

const checkHashtagUsage = (req, res) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `hashtag-${userIP}-${today}`;
  
  const count = hashtagGenerations.get(key) || 0;
  
  res.json({
    success: true,
    used: count,
    remaining: HASHTAG_LIMIT - count,
    total: HASHTAG_LIMIT
  });
};

// ==================== BACKGROUND REMOVER ====================

const BG_REMOVAL_LIMIT = 2;
const bgRemovalGenerations = new Map();

const removeBackground = async (req, res) => {
  try {
    const userIP = req.ip;
    const today = new Date().toDateString();
    const key = `bg-removal-${userIP}-${today}`;

    // Check usage
    const count = bgRemovalGenerations.get(key) || 0;
    if (count >= BG_REMOVAL_LIMIT) {
      return res.status(429).json({
        success: false,
        message: 'Daily limit reached! You can remove 2 backgrounds per day.'
      });
    }

    console.log('🎨 Removing background...');

    // Check if image was uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }

    const imageFile = req.files.image;
    const FormData = require('form-data');
    const fs = require('fs');
    const axios = require('axios');

    // Create form data for Remove.bg API
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(imageFile.tempFilePath), {
      filename: imageFile.name,
      contentType: imageFile.mimetype
    });
    formData.append('size', 'auto');

    // Call Remove.bg API
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

    // Convert to base64
    const base64Image = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // Update usage
    bgRemovalGenerations.set(key, count + 1);

    // Clean up temp file
    if (imageFile.tempFilePath) {
      fs.unlinkSync(imageFile.tempFilePath);
    }

    console.log('✅ Background removed successfully');

    res.json({
      success: true,
      data: {
        imageUrl: imageUrl,
        remaining: BG_REMOVAL_LIMIT - (count + 1)
      }
    });

  } catch (error) {
    console.error('❌ Background removal error:', error.message);
    
    // Clean up temp file on error
    if (req.files && req.files.image && req.files.image.tempFilePath) {
      try {
        require('fs').unlinkSync(req.files.image.tempFilePath);
      } catch (e) {}
    }
    
    res.status(500).json({
      success: false,
      message: error.response?.data?.errors?.[0]?.title || error.message || 'Failed to remove background'
    });
  }
};

const checkBgRemovalUsage = (req, res) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `bg-removal-${userIP}-${today}`;
  
  const count = bgRemovalGenerations.get(key) || 0;
  
  res.json({
    success: true,
    used: count,
    remaining: BG_REMOVAL_LIMIT - count,
    total: BG_REMOVAL_LIMIT
  });
};

// Export all functions
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
