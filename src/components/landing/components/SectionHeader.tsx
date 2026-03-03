import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-center mb-20">
      <h2
        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7FF] mb-6"
        style={{ letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      <p className="text-lg sm:text-xl text-[#AAB0C4] max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};
