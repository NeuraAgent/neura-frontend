import type { LucideIcon } from 'lucide-react';
import type { FC } from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  credits: string;
  gradient: string;
  isVisible: boolean;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  credits,
  gradient,
  isVisible,
}) => {
  return (
    <div
      className={`group relative transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative p-6 rounded-2xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full">
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-300 -z-10`}
        />

        <div
          className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-[1px] mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <div className="w-full h-full rounded-xl bg-[#0A0F1F] flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2 group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[#AAB0C4] mb-4 leading-relaxed">
          {description}
        </p>

        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0A0F1F]/80 border border-white/10">
          <span
            className={`text-xs font-mono font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {credits}
          </span>
        </div>

        <div className="absolute inset-0 rounded-2xl shadow-lg shadow-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>
    </div>
  );
};
