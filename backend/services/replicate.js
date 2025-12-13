const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const generateThumbnail = async (prompt, baseImageUrl, aspectRatio) => {
  try {
    console.log('🎨 Replicate: Starting generation...');
    console.log('📝 Prompt:', prompt);
    console.log('🖼️ Base image:', baseImageUrl?.substring(0, 50) + '...');
    console.log('📐 Aspect ratio:', aspectRatio);

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          image: baseImageUrl,
          width: aspectRatio.width,
          height: aspectRatio.height,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        }
      }
    );

    console.log('✅ Replicate output:', output);

    if (!output || !output[0]) {
      throw new Error('No image generated from Replicate');
    }

    return output[0];

  } catch (error) {
    console.error('❌ Replicate error:', error);
    throw new Error(`Replicate API failed: ${error.message}`);
  }
};

module.exports = { generateThumbnail };