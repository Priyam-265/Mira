import React from 'react';
import { TrendingUp } from 'lucide-react';

const PLATFORMS = {
  youtube: {
    name: 'YouTube',
    ratio: '16:9',
    icon: '📺',
    description: 'Perfect for thumbnails'
  },
  instagram: {
    name: 'Instagram',
    ratio: '1:1',
    icon: '📸',
    description: 'Square posts & feed'
  },
  tiktok: {
    name: 'TikTok',
    ratio: '9:16',
    icon: '🎵',
    description: 'Vertical video covers'
  },
  linkedin: {
    name: 'LinkedIn',
    ratio: '1.91:1',
    icon: '💼',
    description: 'Professional posts'
  }
};

function PlatformSelector({ selectedPlatform, onSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <TrendingUp className="w-5 h-5 text-pink-500" />
        Choose Platform
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(PLATFORMS).map(([key, platform]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedPlatform === key
                ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="text-3xl mb-2">{platform.icon}</div>
            <div className="text-left">
              <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {platform.name}
              </div>
              <div className="text-xs text-gray-500">{platform.ratio}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PlatformSelector;