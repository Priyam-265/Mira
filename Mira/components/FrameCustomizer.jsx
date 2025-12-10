import React from 'react';
import { Palette } from 'lucide-react';

const FRAME_COLORS = [
  { id: 'gradient-pink', name: 'Pink', bg: 'linear-gradient(135deg, #fce7f3, #f9a8d4)', border: '#f472b6', preview: 'bg-gradient-to-br from-pink-100 to-pink-300' },
  { id: 'white', name: 'White', bg: '#ffffff', border: '#e5e7eb', preview: 'bg-white border-2 border-gray-300' },
  { id: 'pastel-blue', name: 'Blue', bg: 'linear-gradient(135deg, #dbeafe, #93c5fd)', border: '#60a5fa', preview: 'bg-gradient-to-br from-blue-100 to-blue-300' },
  { id: 'lavender', name: 'Lavender', bg: 'linear-gradient(135deg, #f3e8ff, #d8b4fe)', border: '#c084fc', preview: 'bg-gradient-to-br from-purple-100 to-purple-300' },
  { id: 'mint', name: 'Mint', bg: 'linear-gradient(135deg, #d1fae5, #6ee7b7)', border: '#34d399', preview: 'bg-gradient-to-br from-green-100 to-green-300' },
  { id: 'peach', name: 'Peach', bg: 'linear-gradient(135deg, #ffedd5, #fdba74)', border: '#fb923c', preview: 'bg-gradient-to-br from-orange-100 to-orange-300' },
  { id: 'sunset', name: 'Sunset', bg: 'linear-gradient(135deg, #fef3c7, #fca5a5)', border: '#f87171', preview: 'bg-gradient-to-br from-yellow-100 to-red-300' },
  { id: 'ocean', name: 'Ocean', bg: 'linear-gradient(135deg, #cffafe, #67e8f9)', border: '#06b6d4', preview: 'bg-gradient-to-br from-cyan-100 to-cyan-300' },
  { id: 'rose', name: 'Rose', bg: 'linear-gradient(135deg, #ffe4e6, #fda4af)', border: '#fb7185', preview: 'bg-gradient-to-br from-rose-100 to-rose-300' },
];

const FRAME_PATTERNS = [
  { id: 'none', name: 'None', emoji: '⬜', color: 'rgba(0, 0, 0, 0.4)' },
  { id: 'hearts', name: 'Hearts', emoji: '💕', color: 'rgba(236, 72, 153, 0.6)' },
  { id: 'stars', name: 'Stars', emoji: '⭐', color: 'rgba(251, 191, 36, 0.6)' },
  { id: 'flowers', name: 'Flowers', emoji: '🌸', color: 'rgba(244, 114, 182, 0.6)' },
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', color: 'rgba(251, 207, 232, 0.7)' },
  { id: 'diamonds', name: 'Diamonds', emoji: '💎', color: 'rgba(96, 165, 250, 0.6)' },
  { id: 'butterflies', name: 'Butterflies', emoji: '🦋', color: 'rgba(139, 92, 246, 0.6)' },
  { id: 'music', name: 'Music', emoji: '🎵', color: 'rgba(168, 85, 247, 0.6)' },
  { id: 'clouds', name: 'Clouds', emoji: '☁️', color: 'rgba(147, 197, 253, 0.6)' }
];

function FrameCustomizer({ frameColor, framePattern, onColorChange, onPatternChange }) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-5 border border-pink-200">
      <h3 
        className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <Palette className="text-pink-500" size={18} />
        Frame Design
      </h3>
      
      {/* Frame Colors */}
      <div className="mb-4 sm:mb-5">
        <h4 
          className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Frame Color
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {FRAME_COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => onColorChange(color)}
              className={`h-10 sm:h-12 rounded-lg transition-all ${color.preview} ${
                frameColor.id === color.id
                  ? 'ring-2 ring-pink-400 scale-105 shadow-md'
                  : 'hover:scale-105 shadow-sm'
              }`}
              title={color.name}
              aria-label={`Select ${color.name} frame color`}
            />
          ))}
        </div>
      </div>

      {/* Frame Patterns */}
      <div>
        <h4 
          className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Border Pattern
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {FRAME_PATTERNS.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => onPatternChange(pattern)}
              className={`py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                framePattern.id === pattern.id
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md scale-105'
                  : 'bg-pink-50 text-gray-700 hover:bg-pink-100 border border-pink-200'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
              aria-label={`Select ${pattern.name} border pattern`}
            >
              <span className="text-lg sm:text-xl block mb-0.5">{pattern.emoji}</span>
              <span className="text-xs block">{pattern.name}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
          Patterns appear at the edges of your frame
        </p>
      </div>
    </div>
  );
}

export default FrameCustomizer;