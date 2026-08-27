import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingInputProps {
  value: number; // 1 to 5
  onChange: (value: number) => void;
  label?: string;
  sublabel?: string;
  minLabel?: string;
  maxLabel?: string;
  id?: string;
}

const RATING_LEVELS: Record<number, string> = {
  1: 'Novice / Conceptual',
  2: 'Fundamental / Working Knowledge',
  3: 'Intermediate / Production Practical',
  4: 'Advanced / High Proficiency',
  5: 'Expert / Staff Architect'
};

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  label,
  sublabel,
  minLabel = '1 - Novice',
  maxLabel = '5 - Expert',
  id
}) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const activeDisplayValue = hoveredValue !== null ? hoveredValue : value;

  return (
    <div id={id} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          {label && (
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {label}
            </div>
          )}
          {sublabel && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {sublabel}
            </div>
          )}
        </div>
        <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md self-start sm:self-auto">
          {activeDisplayValue}/5 • {RATING_LEVELS[activeDisplayValue] || ''}
        </div>
      </div>

      {/* Star rating buttons */}
      <div className="flex items-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoveredValue !== null ? hoveredValue : value) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoveredValue(star)}
              onMouseLeave={() => setHoveredValue(null)}
              className={`p-1.5 rounded-lg transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                isFilled
                  ? 'text-amber-400 hover:text-amber-500'
                  : 'text-slate-300 dark:text-slate-700 hover:text-slate-400'
              }`}
              title={`Rate ${star} of 5 - ${RATING_LEVELS[star]}`}
            >
              <Star
                className="w-5 h-5"
                fill={isFilled ? 'currentColor' : 'none'}
                strokeWidth={isFilled ? 1.5 : 2}
              />
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-400 font-medium">
          <span>{minLabel}</span>
          <span>→</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
};
