import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface CreditUsageTileProps {
  icon: LucideIcon;
  serviceName: string;
  creditDisplay: string;
  showTokenInfo: boolean;
  isVisible: boolean;
}

export const CreditUsageTile: React.FC<CreditUsageTileProps> = ({
  icon: Icon,
  serviceName,
  creditDisplay,
  showTokenInfo,
  isVisible,
}) => {
  return (
    <div
      className={`group relative transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative flex items-center justify-between p-4 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-[1px]">
            <div className="w-full h-full rounded-lg bg-[#0A0F1F] flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>

          <div>
            <div className="font-medium text-[#F5F7FF] text-sm">
              {serviceName}
            </div>
            {showTokenInfo && (
              <div className="text-xs text-[#7B8199] font-mono">
                per 1k tokens
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {creditDisplay}
          </div>
          <div className="text-xs text-[#7B8199]">credits</div>
        </div>

        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
      </div>
    </div>
  );
};
