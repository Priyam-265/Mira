const generateThumbnail = async (prompt, baseImageUrl, aspectRatio) => {
  try {
    console.log('🌸 Pollinations: Starting generation...');
    console.log('📝 Prompt:', prompt);
    console.log('📐 Dimensions:', aspectRatio);

    // Enhance prompt for better thumbnails
    const enhancedPrompt = `${prompt}, high quality, professional thumbnail, detailed, vibrant colors, sharp focus, 8k resolution`;
    
    // Pollinations.ai - FREE, no API key needed, unlimited use!
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${aspectRatio.width}&height=${aspectRatio.height}&nologo=true&enhance=true&model=flux`;

    console.log('✅ Pollinations image URL generated:', imageUrl);
    return imageUrl;

  } catch (error) {
    console.error('❌ Pollinations error:', error.message);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

module.exports = { generateThumbnail };