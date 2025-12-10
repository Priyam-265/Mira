import React from 'react';
import { Sparkles } from 'lucide-react';

const FILTERS = [
  { id: 'none', name: 'Original' },
  { id: 'warm', name: 'Warm' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'cool', name: 'Cool' },
  { id: 'bw', name: 'B&W' },
  { id: 'soft', name: 'Soft' },
  { id: 'vivid', name: 'Vivid' },
  { id: 'pastel', name: 'Pastel' },
  { id: 'sunset', name: 'Sunset' },
  { id: 'arctic', name: 'Arctic' },
  { id: 'drama', name: 'Drama' },
  { id: 'retro', name: 'Retro' },
];

function FiltersPanel({ currentFilter, onFilterChange }) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-5 border border-pink-200">
      <h3 
        className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <Sparkles className="text-pink-500" size={20} />
        Filters
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
              currentFilter === filter.id
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md scale-105'
                : 'bg-pink-50 text-gray-700 hover:bg-pink-100 border border-pink-200'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FiltersPanel;