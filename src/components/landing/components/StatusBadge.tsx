import type { FC } from 'react';

interface StatusBadgeProps {
  label: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ label }) => {
  return (
    <div className="group relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
      <div className="absolute inset-0 rounded-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
      </div>

      <span className="relative text-xs font-medium text-[#7B8199] group-hover:text-[#AAB0C4] transition-colors duration-300">
        {label}
      </span>
    </div>
  );
};
