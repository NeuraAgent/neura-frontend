import React from 'react';

import neuraLogo from '@/images/neura_logo.png';
import neuraLogoWithName from '@/images/neura_logo_with_name.png';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  // Size configurations - optimized for better visual presence
  const sizeClasses = {
    icon: {
      sm: 'h-7 w-7',
      md: 'h-9 w-9',
      lg: 'h-11 w-11',
    },
    full: {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12',
    },
  };

  // Container styling - reduced padding for better logo visibility
  // Modern, calm, premium aesthetic with minimal padding
  const containerClasses = {
    icon: 'p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center',
    full: 'px-2.5 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center',
  };

  const logoSrc = variant === 'full' ? neuraLogoWithName : neuraLogo;
  const logoSize = sizeClasses[variant][size];
  const containerClass = containerClasses[variant];

  return (
    <div className={`${containerClass} ${className}`}>
      <img
        src={logoSrc}
        alt="Neura"
        className={`${logoSize} ${variant === 'full' ? 'w-auto' : ''} object-contain`}
      />
    </div>
  );
};

export default Logo;
