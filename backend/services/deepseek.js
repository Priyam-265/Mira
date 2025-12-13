const axios = require('axios');

const improvePrompt = async (userIdea, platform) => {
  try {
    const platformSpecs = {
      youtube: 'YouTube thumbnail (16:9) - bold text, high contrast, clickbait-friendly',
      instagram: 'Instagram post (1:1) - aesthetic, clean, engaging',
      tiktok: 'TikTok thumbnail (9:16) - vertical, dynamic, attention-grabbing',
      linkedin: 'LinkedIn post (1.91:1) - professional, clean, business-focused'
    };

    console.log('🤖 Calling OpenRouter API with DeepSeek V3.1...');
    console.log('🔑 API Key exists:', !!process.env.OPENROUTER_API_KEY);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nex-agi/deepseek-v3.1-nex-n1:free',  // ← Correct DeepSeek model
        messages: [
          {
            role: 'system',
            content: 'You are a thumbnail prompt expert. Create detailed, visual prompts for SDXL image generation. Focus on composition, colors, text placement, and visual impact.'
          },
          {
            role: 'user',
            content: `Create a detailed SDXL prompt for a ${platformSpecs[platform]}. User idea: "${userIdea}". Make it vivid and specific.

Respond in this EXACT format:
PROMPT: [detailed image generation prompt]
CAPTION: [engaging social media caption with emojis]`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Mira Thumbnail Generator'
        },
        timeout: 30000
      }
    );

    console.log('✅ DeepSeek V3.1 response received');
    console.log('📝 Response:', response.data.choices[0].message.content);
    return response.data.choices[0].message.content;

  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenRouter API key. Please check your .env file');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 400) {
      throw new Error(`Bad request: ${error.response?.data?.error?.message || 'Invalid request'}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    throw new Error('Failed to improve prompt with AI');
  }
};

module.exports = { improvePrompt };