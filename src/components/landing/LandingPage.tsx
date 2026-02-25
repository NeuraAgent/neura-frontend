import React from 'react';

import CreditUsageSection from './CreditUsageSection';
import CTASection from './CTASection';
import DevelopersSection from './DevelopersSection';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import LandingNav from './LandingNav';
import PricingSection from './PricingSection';
import SecuritySection from './SecuritySection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050814] text-white overflow-hidden">
      {/* Unified dark background with subtle depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#050814] via-[#0A0F1F] to-[#050814]" />

      {/* Subtle animated gradient mesh - very low opacity */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/8 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Noise texture overlay - very subtle */}
      <div className="fixed inset-0 noise-texture opacity-40 pointer-events-none" />

      {/* Vignette effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,8,20,0.4)_100%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <LandingNav />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <PricingSection />
          <CreditUsageSection />
          <DevelopersSection />
          <SecuritySection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
