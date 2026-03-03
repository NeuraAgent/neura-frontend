import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-[#0F1428]/60 rounded w-64 mx-auto" />
            <div className="h-6 bg-[#0F1428]/60 rounded w-96 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};
