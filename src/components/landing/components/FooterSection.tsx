import type { FC, ReactNode } from 'react';

interface FooterSectionProps {
  title: string;
  children: ReactNode;
}

export const FooterSection: FC<FooterSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h3 className="text-[#F5F7FF] font-semibold text-xs uppercase tracking-[0.1em] mb-5 opacity-90">
        {title}
      </h3>
      <ul className="space-y-3.5">{children}</ul>
    </div>
  );
};
