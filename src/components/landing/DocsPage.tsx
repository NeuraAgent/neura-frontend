import {
  Upload,
  FileText,
  MessageSquare,
  Search,
  Zap,
  Shield,
  Database,
  Brain,
  CheckCircle,
  ArrowRight,
  FileCode,
  Sparkles,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useLocale } from '@/contexts/LocaleContext';

import Footer from './Footer';
import LandingNav from './LandingNav';

const DocsPage: React.FC = () => {
  const { t } = useLocale();
  const [activeSection, setActiveSection] = useState('overview');
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => [...prev, entry.target.id]);
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'overview', label: t('docs.nav.overview'), icon: Sparkles },
    { id: 'upload', label: t('docs.nav.upload'), icon: Upload },
    { id: 'processing', label: t('docs.nav.processing'), icon: Brain },
    { id: 'chat', label: t('docs.nav.chat'), icon: MessageSquare },
    { id: 'features', label: t('docs.nav.features'), icon: Zap },
    { id: 'limits', label: t('docs.nav.limits'), icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1F]">
      {/* Add Landing Nav */}
      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[180px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1428]/60 backdrop-blur-xl border border-cyan-500/30 mb-6">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-cyan-400">
                {t('docs.hero.badge')}
              </span>
            </div>
            <h1
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F5F7FF] mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              {t('docs.hero.title')}
            </h1>
            <p className="text-xl text-[#AAB0C4] max-w-3xl mx-auto leading-relaxed">
              {t('docs.hero.subtitle')}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/neura/signup"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('docs.hero.ctaPrimary')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
            <a
              href="#overview"
              onClick={e => {
                e.preventDefault();
                scrollToSection('overview');
              }}
              className="px-8 py-4 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 text-[#F5F7FF] font-semibold hover:bg-white/5 hover:border-white/20 transition-all duration-300"
            >
              {t('docs.hero.ctaSecondary')}
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-[#0A0F1F]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            {sections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-[#7B8199] hover:text-[#AAB0C4] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Content */}
          <div className="lg:col-span-8 space-y-20">
            {/* Overview Section */}
            <section
              id="overview"
              data-section
              className={`transition-all duration-700 ${
                visibleSections.includes('overview')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#F5F7FF]">
                  {t('docs.overview.title')}
                </h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-[#AAB0C4] leading-relaxed mb-6">
                  {t('docs.overview.intro')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                  <div className="p-6 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
                    <FileText className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2">
                      {t('docs.overview.multipleFormats')}
                    </h3>
                    <p className="text-sm text-[#7B8199]">
                      {t('docs.overview.multipleFormatsDesc')}
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
                    <Brain className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2">
                      {t('docs.overview.aiSearch')}
                    </h3>
                    <p className="text-sm text-[#7B8199]">
                      {t('docs.overview.aiSearchDesc')}
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
                    <MessageSquare className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2">
                      {t('docs.overview.naturalConversations')}
                    </h3>
                    <p className="text-sm text-[#7B8199]">
                      {t('docs.overview.naturalConversationsDesc')}
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
                    <Shield className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2">
                      {t('docs.overview.securePrivate')}
                    </h3>
                    <p className="text-sm text-[#7B8199]">
                      {t('docs.overview.securePrivateDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Upload Section */}
            <section
              id="upload"
              data-section
              className={`transition-all duration-700 ${
                visibleSections.includes('upload')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#F5F7FF]">
                  {t('docs.upload.title')}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-[#AAB0C4] leading-relaxed">
                  {t('docs.upload.intro')}
                </p>

                <div className="p-6 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-cyan-500/30">
                  <h3 className="text-xl font-semibold text-[#F5F7FF] mb-4 flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-cyan-400" />
                    {t('docs.upload.supportedTypes')}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { type: 'PDF', desc: 'PDF documents', icon: '📄' },
                      { type: 'DOCX', desc: 'Word documents', icon: '📝' },
                      { type: 'TXT', desc: 'Plain text files', icon: '📃' },
                      { type: 'MD', desc: 'Markdown files', icon: '📋' },
                    ].map(format => (
                      <div
                        key={format.type}
                        className="p-4 rounded-lg bg-[#0A0F1F]/80 border border-white/10"
                      >
                        <div className="text-2xl mb-2">{format.icon}</div>
                        <div className="font-mono text-sm font-semibold text-cyan-400 mb-1">
                          .{format.type.toLowerCase()}
                        </div>
                        <div className="text-xs text-[#7B8199]">
                          {format.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#F5F7FF]">
                    {t('docs.upload.howToUpload')}
                  </h3>
                  <ol className="space-y-4">
                    {[
                      {
                        step: '1',
                        title: t('docs.upload.step1'),
                        desc: t('docs.upload.step1Desc'),
                      },
                      {
                        step: '2',
                        title: t('docs.upload.step2'),
                        desc: t('docs.upload.step2Desc'),
                      },
                      {
                        step: '3',
                        title: t('docs.upload.step3'),
                        desc: t('docs.upload.step3Desc'),
                      },
                      {
                        step: '4',
                        title: t('docs.upload.step4'),
                        desc: t('docs.upload.step4Desc'),
                      },
                    ].map(item => (
                      <li key={item.step} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#F5F7FF] mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-[#7B8199]">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* Processing Section */}
            <section
              id="processing"
              data-section
              className={`transition-all duration-700 ${
                visibleSections.includes('processing')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#F5F7FF]">
                  {t('docs.processing.title')}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-[#AAB0C4] leading-relaxed">
                  {t('docs.processing.intro')}
                </p>

                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-violet-500" />

                  <div className="space-y-8">
                    {[
                      {
                        icon: Upload,
                        title: t('docs.processing.step1'),
                        desc: t('docs.processing.step1Desc'),
                        tech: 'S3 Storage',
                      },
                      {
                        icon: FileText,
                        title: t('docs.processing.step2'),
                        desc: t('docs.processing.step2Desc'),
                        tech: 'Format Conversion',
                      },
                      {
                        icon: Database,
                        title: t('docs.processing.step3'),
                        desc: t('docs.processing.step3Desc'),
                        tech: 'Smart Chunking',
                      },
                      {
                        icon: Brain,
                        title: t('docs.processing.step4'),
                        desc: t('docs.processing.step4Desc'),
                        tech: 'Dense + Sparse Vectors',
                      },
                      {
                        icon: Database,
                        title: t('docs.processing.step5'),
                        desc: t('docs.processing.step5Desc'),
                        tech: 'Qdrant DB',
                      },
                      {
                        icon: CheckCircle,
                        title: t('docs.processing.step6'),
                        desc: t('docs.processing.step6Desc'),
                        tech: 'Hybrid Search',
                      },
                    ].map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="relative flex gap-4 pl-2">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center relative z-10">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-[#F5F7FF]">
                                {step.title}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono">
                                {step.tech}
                              </span>
                            </div>
                            <p className="text-sm text-[#7B8199]">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Chat Section */}
            <section
              id="chat"
              data-section
              className={`transition-all duration-700 ${
                visibleSections.includes('chat')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#F5F7FF]">
                  {t('docs.chat.title')}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-[#AAB0C4] leading-relaxed">
                  {t('docs.chat.intro')}
                </p>

                <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                  <h3 className="text-xl font-semibold text-[#F5F7FF] mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-cyan-400" />
                    {t('docs.chat.howRagWorks')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                      <div>
                        <p className="text-sm text-[#AAB0C4]">
                          <span className="font-semibold text-[#F5F7FF]">
                            {t('docs.chat.ragStep1')}
                          </span>{' '}
                          - {t('docs.chat.ragStep1Desc')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        2
                      </div>
                      <div>
                        <p className="text-sm text-[#AAB0C4]">
                          <span className="font-semibold text-[#F5F7FF]">
                            {t('docs.chat.ragStep2')}
                          </span>{' '}
                          - {t('docs.chat.ragStep2Desc')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <div>
                        <p className="text-sm text-[#AAB0C4]">
                          <span className="font-semibold text-[#F5F7FF]">
                            {t('docs.chat.ragStep3')}
                          </span>{' '}
                          - {t('docs.chat.ragStep3Desc')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        4
                      </div>
                      <div>
                        <p className="text-sm text-[#AAB0C4]">
                          <span className="font-semibold text-[#F5F7FF]">
                            {t('docs.chat.ragStep4')}
                          </span>{' '}
                          - {t('docs.chat.ragStep4Desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#F5F7FF]">
                    {t('docs.chat.exampleQuestions')}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      'What are the main points in this document?',
                      'Summarize the key findings from my research papers',
                      'What does the contract say about payment terms?',
                      'Compare the recommendations across all uploaded reports',
                      'Find all mentions of [specific topic] in my documents',
                    ].map((question, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-[#0F1428]/60 border border-white/10 hover:border-cyan-500/30 transition-colors"
                      >
                        <p className="text-sm text-[#AAB0C4] flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section
              id="features"
              data-section
              className={`transition-all duration-700 ${
                visibleSections.includes('features')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#F5F7FF]">
                  {t('docs.features.title')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Brain,
                    title: t('docs.features.hybridSearch'),
                    desc: t('docs.features.hybridSearchDesc'),
                    tech: 'Dense + Sparse Vectors',
                  },
                  {
                    icon: Zap,
                    title: t('docs.features.realTimeProcessing'),
                    desc: t('docs.features.realTimeProcessingDesc'),
                    tech: 'ONNX Optimization',
                  },
                  {
                    icon: MessageSquare,
                    title: t('docs.features.conversationalAI'),
                    desc: t('docs.features.conversationalAIDesc'),
                    tech: 'Google Gemini',
                  },
                  {
                    icon: Shield,
                    title: t('docs.features.privateSecure'),
                    desc: t('docs.features.privateSecureDesc'),
                    tech: 'User Isolation',
                  },
                  {
                    icon: Database,
                    title: t('docs.features.smartChunking'),
                    desc: t('docs.features.smartChunkingDesc'),
                    tech: '500-word chunks',
                  },
                  {
                    icon: CheckCircle,
                    title: t('docs.features.sourceAttribution'),
                    desc: t('docs.features.sourceAttributionDesc'),
                    tech: 'Metadata Tracking',
                  },
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="p-6 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-[#7B8199] mb-3">
                            {feature.desc}
                          </p>
                          <span className="inline-block px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono">
                            {feature.tech}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Limits Section */}
            <section
              id="limits"
              data-section
              className={`transition-all duration-700 ${
                visibleSections.includes('limits')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#F5F7FF]">
                  {t('docs.limits.title')}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-[#AAB0C4] leading-relaxed">
                  {t('docs.limits.intro')}
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 text-sm font-semibold text-[#AAB0C4]">
                          {t('docs.limits.feature')}
                        </th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#AAB0C4]">
                          {t('docs.limits.free')}
                        </th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#AAB0C4]">
                          {t('docs.limits.basic')}
                        </th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-cyan-400">
                          {t('docs.limits.premium')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          feature: t('docs.limits.maxFileSize'),
                          free: '5 MB',
                          basic: '20 MB',
                          premium: '100 MB',
                        },
                        {
                          feature: t('docs.limits.fileUploads'),
                          free: '5 files/month',
                          basic: '50 files/month',
                          premium: 'Unlimited',
                        },
                        {
                          feature: t('docs.limits.creditsPerMonth'),
                          free: '100',
                          basic: '1,000',
                          premium: '5,000',
                        },
                        {
                          feature: t('docs.limits.chatHistory'),
                          free: '7 days',
                          basic: '30 days',
                          premium: 'Unlimited',
                        },
                        {
                          feature: t('docs.limits.support'),
                          free: 'Community',
                          basic: 'Email (24h)',
                          premium: 'Priority (4h)',
                        },
                        {
                          feature: t('docs.limits.apiAccess'),
                          free: '—',
                          basic: '—',
                          premium: '✓',
                        },
                      ].map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4 text-sm text-[#F5F7FF]">
                            {row.feature}
                          </td>
                          <td className="py-4 px-4 text-sm text-center text-[#7B8199]">
                            {row.free}
                          </td>
                          <td className="py-4 px-4 text-sm text-center text-[#7B8199]">
                            {row.basic}
                          </td>
                          <td className="py-4 px-4 text-sm text-center text-cyan-400 font-semibold">
                            {row.premium}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center pt-6">
                  <Link
                    to="/#pricing"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    {t('docs.limits.viewFullPricing')}
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Quick Links */}
              <div className="p-6 rounded-xl bg-[#0F1428]/60 backdrop-blur-xl border border-white/10">
                <h3 className="text-lg font-semibold text-[#F5F7FF] mb-4">
                  {t('docs.sidebar.quickLinks')}
                </h3>
                <div className="space-y-2">
                  {sections.map(section => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-300 ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'text-[#7B8199] hover:text-[#AAB0C4] hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <h3 className="text-lg font-semibold text-[#F5F7FF] mb-2">
                  {t('docs.sidebar.readyToStart')}
                </h3>
                <p className="text-sm text-[#AAB0C4] mb-4">
                  {t('docs.sidebar.readyToStartDesc')}
                </p>
                <Link
                  to="/neura/signup"
                  className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  {t('docs.sidebar.startFreeTrial')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Landing Footer */}
      <Footer />
    </div>
  );
};

export default DocsPage;
