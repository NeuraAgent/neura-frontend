import type { FC } from 'react';

import Logo from '@/components/Logo';

interface BrandSectionProps {
  tagline: string;
}

export const BrandSection: FC<BrandSectionProps> = ({ tagline }) => {
  return (
    <div className="group">
      <Logo className="mb-6 transition-all duration-300 group-hover:scale-[1.02]" />
      <p className="text-[#AAB0C4] text-sm leading-relaxed mb-6 max-w-sm">
        {tagline}
      </p>
      <div className="relative w-20 h-1 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};
