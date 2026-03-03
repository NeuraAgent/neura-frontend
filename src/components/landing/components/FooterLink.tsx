import type { FC, MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  to?: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  children: ReactNode;
}

export const FooterLink: FC<FooterLinkProps> = ({
  to,
  href,
  onClick,
  disabled = false,
  children,
}) => {
  const baseClasses =
    'group inline-flex items-center text-sm transition-all duration-200';
  const enabledClasses = 'text-[#7B8199] hover:text-cyan-400';
  const disabledClasses = 'text-[#4B5563] cursor-not-allowed opacity-50';

  const content = (
    <span
      className={`${disabled ? '' : 'group-hover:translate-x-1 transition-transform duration-200'}`}
    >
      {children}
    </span>
  );

  if (disabled) {
    return (
      <span className={`${baseClasses} ${disabledClasses}`}>{content}</span>
    );
  }

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${enabledClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${enabledClasses}`}
    >
      {content}
    </a>
  );
};
