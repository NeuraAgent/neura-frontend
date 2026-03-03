import type { LucideIcon } from 'lucide-react';
import type { FC } from 'react';

interface BadgeProps {
  icon: LucideIcon;
  text: string;
  isVisible: boolean;
}

export const Badge: FC<BadgeProps> = ({ icon: Icon, text, isVisible }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 mb-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Icon className="w-4 h-4 text-cyan-400 animate-pulse" />
      <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
        {text}
      </span>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 blur-xl -z-10" />
    </div>
  );
};
