import React from 'react';
import { Wand2 } from 'lucide-react';

function ThumbnailEditor({ userIdea, setUserIdea, simpleMode, setSimpleMode }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <Wand2 className="w-5 h-5 text-pink-500" />
        Describe Your Vision
      </h3>
      
      <textarea
        value={userIdea}
        onChange={(e) => setUserIdea(e.target.value)}
        placeholder="E.g., Add text 'Capture your moments perfectly' in elegant font with hearts around it, cozy vibe"
        className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        rows="5"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
      
      {/* Simple Mode Toggle */}
      <div className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          id="simpleMode"
          checked={simpleMode}
          onChange={(e) => setSimpleMode(e.target.checked)}
          className="w-4 h-4 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
        />
        <label htmlFor="simpleMode" className="text-sm text-gray-700 cursor-pointer">
          <strong>Simple Mode:</strong> Use my exact description without AI changes
        </label>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        {simpleMode 
          ? "✓ Your prompt will be used exactly as written" 
          : "✨ AI will enhance your idea for better results"}
      </p>

      {/* Tips Section */}
      <div className="mt-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
        <p className="text-sm text-gray-700 font-medium mb-2">💡 Tips for best results:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Be specific about colors and style</li>
          <li>• Mention text you want included</li>
          <li>• Describe the mood or emotion</li>
          <li>• Reference specific visual elements</li>
        </ul>
      </div>
    </div>
  );
}

export default ThumbnailEditor;