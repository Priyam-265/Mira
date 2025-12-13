import React from 'react';
import { Download, RefreshCw, Check, Image } from 'lucide-react';

const PLATFORMS = {
  youtube: { name: 'YouTube', ratio: '16:9' },
  instagram: { name: 'Instagram', ratio: '1:1' },
  tiktok: { name: 'TikTok', ratio: '9:16' },
  linkedin: { name: 'LinkedIn', ratio: '1.91:1' }
};

function GeneratedResult({ generatedData, platform, onDownload, onRegenerate, onReset }) {
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedData.caption);
    alert('Caption copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
          <Check className="w-5 h-5" />
          <span className="font-semibold">Generated Successfully!</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Your {PLATFORMS[platform].name} Content is Ready
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Thumbnail Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Image className="w-5 h-5 text-pink-500" />
            Generated Thumbnail
          </h3>
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
            <img
              src={generatedData.thumbnail}
              alt="Generated thumbnail"
              className="w-full h-auto"
            />
            <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {PLATFORMS[platform].ratio}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onDownload}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={onRegenerate}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              New One
            </button>
          </div>
        </div>

        {/* Caption Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            ✍️ Generated Caption
          </h3>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 mb-4 max-h-64 overflow-y-auto">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
              {generatedData.caption}
            </p>
          </div>
          
          <button
            onClick={handleCopyCaption}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            📋 Copy Caption
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 mb-3">🎨 AI Prompt Used:</h4>
            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed max-h-32 overflow-y-auto">
              {generatedData.prompt}
            </p>
          </div>

          <button
            onClick={onReset}
            className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            ✨ Create Another
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneratedResult;