import React from 'react';

interface TechnicalNoteProps {
  realTimeLabel: string;
  features: string[];
}

export const TechnicalNote: React.FC<TechnicalNoteProps> = ({
  realTimeLabel,
  features,
}) => {
  return (
    <div className="mt-16 text-center">
      <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-mono text-[#AAB0C4]">
            {realTimeLabel}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#7B8199]">
          {features.map((feature, index) => (
            <span key={index}>• {feature}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
