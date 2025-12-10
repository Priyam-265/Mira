import React from 'react';
import { Smile } from 'lucide-react';

const STICKERS = [
  // Hearts & Love
  '❤️', '💕', '💖', '💝', '💗', '💓', '💘', '💞',
  // Flowers
  '🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '🏵️', '💐',
  // Stars & Sparkles
  '⭐', '✨', '💫', '🌟', '⚡', '🔆', '☀️', '🌙',
  // Party & Celebration
  '🎀', '🎈', '🎉', '🎊', '🎁', '🎂', '🎆', '🎇',
  // Emojis
  '😊', '😍', '🥰', '😘', '😎', '🤩', '😇', '🥳',
  // Nature
  '🦋', '🌈', '☁️', '🍓', '🍒', '🍉', '🍑', '🍊',
  // Symbols
  '💎', '👑', '🎵', '🎶', '🔥', '💥', '🌟', '🪐',
  // Animals
  '🐱', '🐶', '🐰', '🐻', '🐼', '🦄', '🦊', '🐝',
  '💋'
];

function StickerPanel({ onAddSticker }) {
  const handleStickerClick = (emoji) => {
    onAddSticker(emoji);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-5 border border-pink-200">
      <h3 
        className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <Smile className="text-pink-500" size={20} />
        Stickers
      </h3>
      <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#f472b6 #fce7f3' }}>
        {STICKERS.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => handleStickerClick(emoji)}
            className="text-3xl hover:scale-110 transition-transform bg-pink-50 rounded-lg p-2 hover:bg-pink-100 border border-pink-200 active:scale-95"
          >
            {emoji}
          </button>
        ))}
      </div>
      <p 
        className="text-xs text-gray-500 mt-3 text-center"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Click to add, then drag to position
      </p>
    </div>
  );
}

export default StickerPanel;