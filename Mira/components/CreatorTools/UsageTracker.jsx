import React from 'react';
import { Zap } from 'lucide-react';

function UsageTracker({ usage }) {
  const percentage = (usage.used / usage.total) * 100;
  
  return (
    <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4 border border-pink-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-pink-600" />
          <h3 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Daily Usage
          </h3>
        </div>
        <span className="text-lg font-bold text-pink-600">
          {usage.remaining}/{usage.total}
        </span>
      </div>
      
      <div className="w-full bg-white rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        {usage.remaining > 0 
          ? `${usage.remaining} generation${usage.remaining !== 1 ? 's' : ''} remaining today`
          : 'Daily limit reached. Come back tomorrow!'
        }
      </p>
    </div>
  );
}

export default UsageTracker;