const axios = require('axios');

const generateThumbnail = async (prompt, baseImageUrl, aspectRatio) => {
  try {
    console.log('🎨 HuggingFace: Starting generation...');
    console.log('📝 Prompt:', prompt);
    console.log('📐 Dimensions:', aspectRatio);

    // Enhance prompt for better thumbnails
    const enhancedPrompt = `${prompt}, high quality, professional, detailed, vibrant colors, sharp focus, 8k resolution`;

    // Using Stable Diffusion 2.1 - more reliable endpoint
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      {
        inputs: enhancedPrompt,
        parameters: {
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 90000
      }
    );

    // Convert to base64
    const base64Image = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log('✅ HuggingFace image generated successfully');
    console.log('📊 Image size:', Math.round(response.data.length / 1024), 'KB');
    
    return imageUrl;

  } catch (error) {
    console.error('❌ HuggingFace error:', error.response?.status, error.message);
    console.error('❌ Full error:', error.response?.data?.toString?.() || error.response?.data);
    
    if (error.response?.status === 503) {
      console.log('⏳ Model is loading, this may take 20-30 seconds on first use...');
      throw new Error('Model is loading, please try again in 20 seconds');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid HuggingFace API key');
    } else if (error.response?.status === 410) {
      throw new Error('Model endpoint deprecated. Please contact support.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - image generation took too long');
    }
    
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

module.exports = { generateThumbnail };