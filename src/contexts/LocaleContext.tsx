import React, { createContext, useContext, useState, ReactNode } from 'react';

import { authService } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';

// Supported locales
export type Locale = 'en' | 'vi';

// Locale context type
interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string) => string;
}

// Create the context
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Custom hook to use locale context
export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

// Translation keys and values
const en = {
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.chat': 'Chat',
  'nav.logout': 'Logout',
  'nav.language': 'Language',
  'nav.settings': 'Settings',
  'nav.signout': 'Sign out',

  // Auth - Login
  'auth.login': 'Login',
  'auth.loginTitle': 'Sign in to your account',
  'auth.loginSubtitle':
    'Sign in or sign up to experience more document features.',
  'auth.username': 'Username',
  'auth.password': 'Password',
  'auth.forgotPassword': 'Forgot password?',
  'auth.continue': 'Continue',
  'auth.signingIn': 'Signing in...',
  'auth.dontHaveAccount': "Don't have an account?",
  'auth.signUpNow': 'Sign up now',
  'auth.termsOfUse': 'Terms of Use',
  'auth.privacyPolicy': 'Privacy Policy',

  // Auth - Signup
  'auth.signup': 'Sign Up',
  'auth.signupTitle': 'Create an account',
  'auth.signupSubtitle': 'Sign in or sign up to upload more documents.',
  'auth.firstName': 'First name',
  'auth.lastName': 'Last name',
  'auth.email': 'Email',
  'auth.confirmPassword': 'Confirm password',
  'auth.verifyEmail': 'Verify email',
  'auth.processing': 'Processing...',
  'auth.alreadyHaveAccount': 'Already have an account?',
  'auth.signInNow': 'Sign in now',
  'auth.signupSuccess': 'Registration successful!',
  'auth.checkEmail': 'We have sent a verification email to',
  'auth.verifyEmailPrompt':
    'Please check your email and click the verification link to complete registration.',
  'auth.redirecting': 'Redirecting to login page...',

  // Auth - Password Strength
  'auth.passwordVeryWeak': 'Very weak',
  'auth.passwordWeak': 'Weak',
  'auth.passwordMedium': 'Medium',
  'auth.passwordStrong': 'Strong',
  'auth.passwordVeryStrong': 'Very strong',
  'auth.passwordMinLength': 'At least 8 characters',
  'auth.passwordNumber': 'Number (0-9)',

  // Auth - Forgot Password
  'auth.forgotPasswordTitle': 'Forgot your password?',
  'auth.forgotPasswordSubtitle':
    "Enter your email address and we'll send you a link to reset your password.",
  'auth.emailAddress': 'Email address',
  'auth.enterEmail': 'Enter your email address',
  'auth.sendResetLink': 'Send reset link',
  'auth.sending': 'Sending...',
  'auth.backToSignIn': 'Back to sign in',
  'auth.checkYourEmail': 'Check your email',
  'auth.resetLinkSent': "We've sent a password reset link to",
  'auth.didntReceiveEmail':
    "Didn't receive the email? Check your spam folder or",
  'auth.tryAgain': 'try again',

  // Auth - Reset Password
  'auth.resetPasswordTitle': 'Reset your password',
  'auth.resetPasswordSubtitle': 'Enter your new password below',
  'auth.newPassword': 'New Password',
  'auth.enterNewPassword': 'Enter new password',
  'auth.confirmNewPassword': 'Confirm New Password',
  'auth.confirmNewPasswordPlaceholder': 'Confirm new password',
  'auth.passwordRequirements': 'Must be at least 8 characters with number',
  'auth.resetPassword': 'Reset Password',
  'auth.resetting': 'Resetting...',
  'auth.invalidResetLink': 'Invalid Reset Link',
  'auth.requestNewResetLink': 'Request New Reset Link',
  'auth.passwordResetSuccess': 'Password Reset Successful!',
  'auth.passwordResetSuccessMessage':
    'Your password has been successfully reset. You can now sign in with your new password.',
  'auth.redirectingToSignIn': 'Redirecting to sign in page...',
  'auth.goToSignIn': 'Go to Sign In',

  // Dashboard
  'dashboard.title': 'AI Education Chat',
  'dashboard.welcome': 'Welcome to AI Education Chat',
  'dashboard.uploadFile': 'Upload File',
  'dashboard.addFile': 'Add File',
  'dashboard.addFiles': 'Add files',
  'dashboard.myFiles': 'My Files',
  'dashboard.chatWithAI': 'Chat with AI',
  'dashboard.askQuestion': 'Ask a question...',
  'dashboard.send': 'Send',
  'dashboard.loading': 'Loading...',
  'dashboard.clearConversation': 'Clear conversation',
  'dashboard.startTyping': 'Start typing...',
  'dashboard.startConversation': 'Start conversation with AI Assistant',
  'dashboard.typeQuestion': 'Type your question below',
  'dashboard.sources': 'source(s)',
  'dashboard.sourcesCount': '{count} source(s)',

  // File Management
  'files.upload': 'Upload File',
  'files.uploadFiles': 'Upload Files',
  'files.selectFile': 'Select File',
  'files.fileName': 'File Name',
  'files.fileSize': 'File Size',
  'files.uploadDate': 'Upload Date',
  'files.actions': 'Actions',
  'files.delete': 'Delete',
  'files.view': 'View',
  'files.noFiles': 'No files uploaded yet',
  'files.uploadSuccess': 'File uploaded successfully',
  'files.uploadError': 'Error uploading file',
  'files.deleteSuccess': 'File deleted successfully',
  'files.deleteError': 'Error deleting file',
  'files.dragDrop': 'Drag & drop files here',
  'files.clickBrowse': 'or click to browse',
  'files.supported': 'Supported: DOCX, PDF, TXT, MD',
  'files.unsupportedType':
    'File {fileName} is not supported. Only DOCX, PDF, TXT, and MD files are allowed.',
  'files.selected': '{count} file(s) selected',
  'files.uploading': 'Uploading...',
  'files.uploadedCount': '{success} of {total} files uploaded',
  'files.done': 'Done',
  'files.uploadButton': 'Upload {count} file(s)',
  'files.closeEsc': 'Close (ESC)',
  'files.removeFile': 'Remove file',
  'files.refreshSources': 'Refresh sources',
  'files.noSourcesFound': 'No sources found',
  'files.noSourcesAvailable': 'No sources available',
  'files.uploadFirstFiles': 'Upload your first files',
  'files.addButton': 'Add',
  'files.selectAll': 'Select all',
  'files.source': 'Source',

  // Delete Modal
  'delete.title': 'Delete Source',
  'delete.cannotUndo': 'This action cannot be undone',
  'delete.confirmMessage':
    'Are you sure you want to delete {sourceName}? All associated documents will be permanently removed from your knowledge base.',
  'delete.cancel': 'Cancel',
  'delete.confirm': 'Delete Source',

  // Chat
  'chat.title': 'Chat Interface',
  'chat.copy': 'Copy',
  'chat.copied': 'Copied!',
  'chat.typeMessage': 'Type your message...',
  'chat.send': 'Send',
  'chat.thinking': 'AI is thinking...',
  'chat.error': 'Error occurred while processing your request',

  // Common
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.close': 'Close',
  'common.confirm': 'Confirm',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.warning': 'Warning',
  'common.info': 'Information',
  'common.refresh': 'Refresh',
  'common.retry': 'Retry',

  // Credits
  'credits.balance': 'Credit Balance',
  'credits.of': 'of',
  'credits.total': 'total',
  'credits.used': 'Used',
  'credits.subscription': 'Subscription',
  'credits.purchased': 'Purchased',
  'credits.bonus': 'Bonus',
  'credits.lowBalance': 'Low credit balance! Consider purchasing more credits.',
  'credits.purchaseMore': 'Purchase More',
  'credits.purchase': 'Purchase Credits',
  'credits.history': 'History',
  'credits.insufficientTitle': 'Insufficient Credits',
  'credits.insufficientMessage':
    "You don't have enough credits to complete this request.",

  // Language
  'language.english': 'English',
  'language.vietnamese': 'Tiếng Việt',
  'language.switch': 'Switch Language',

  // Intro Tour
  'tour.uploadTitle': 'Upload Files',
  'tour.uploadContent':
    'Click here to upload your documents (PDF, DOCX, TXT, MD). These files will be used by the AI to answer your questions.',
  'tour.fileListTitle': 'Your Files',
  'tour.fileListContent':
    'View and manage your uploaded files here. Select files to use them in your chat.',
  'tour.chatTitle': 'Chat with AI',
  'tour.chatContent':
    'Type your questions here. The AI will answer based on your uploaded documents.',
  'tour.settingsTitle': 'Settings',
  'tour.settingsContent':
    'Access settings to change language, manage your account, and more.',
  'tour.skip': 'Skip',
  'tour.next': 'Next',
  'tour.finish': 'Finish',
  'tour.back': 'Back',
  'tour.step': 'Step',
  'tour.of': 'of',
  'tour.navigate': 'Navigate',
  'tour.dontShowAgain': "Don't show this again",

  // Landing Page
  'landing.hero.badge': 'Powered by NeuPay Credit System',
  'landing.hero.title': 'Your AI Agent',
  'landing.hero.titleHighlight': 'Built for Personality',
  'landing.hero.subtitle':
    'Chat, generate code, analyze documents, and more. Pay only for what you use with transparent credit-based pricing. Start free, scale as you grow.',
  'landing.hero.ctaPrimary': 'Get Started Free',
  'landing.hero.ctaSecondary': 'View Pricing',
  'landing.hero.trust1': '100 free credits',
  'landing.hero.trust2': 'No credit card required',
  'landing.hero.trust3': 'Cancel anytime',

  'landing.features.title': 'Everything You Need',
  'landing.features.subtitle':
    'Powerful AI capabilities with transparent, usage-based pricing',
  'landing.features.aiChat': 'AI Chat',
  'landing.features.aiChatDesc':
    'Context-aware conversations with advanced reasoning',
  'landing.features.codeGen': 'Code Generation',
  'landing.features.codeGenDesc':
    'Generate, refactor, and debug in any language',
  'landing.features.docProcess': 'Document Processing',
  'landing.features.docProcessDesc': 'Upload, analyze, and summarize instantly',
  'landing.features.semanticSearch': 'Semantic Search',
  'landing.features.semanticSearchDesc':
    'Find relevant information across documents',
  'landing.features.imageAnalysis': 'Image Analysis',
  'landing.features.imageAnalysisDesc':
    'Extract insights and descriptions from images',
  'landing.features.stt': 'Speech-to-Text',
  'landing.features.sttDesc': 'Transcribe audio with high accuracy',
  'landing.features.tts': 'Text-to-Speech',
  'landing.features.ttsDesc': 'Natural-sounding voice synthesis',
  'landing.features.apiAccess': 'API Access',
  'landing.features.apiAccessDesc': 'Integrate AI capabilities into your apps',
  'landing.features.servicesCount': '{count} AI services',
  'landing.features.realTimeTracking': 'Real-time credit tracking',

  'landing.howItWorks.title': 'How It Works',
  'landing.howItWorks.subtitle':
    'Simple, transparent pricing based on what you actually use',
  'landing.howItWorks.step': 'Step',
  'landing.howItWorks.step1.title': 'Choose Your Plan',
  'landing.howItWorks.step1.description':
    'Start free or select a subscription that fits your needs',
  'landing.howItWorks.step1.detail': 'Get monthly credits automatically',
  'landing.howItWorks.step2.title': 'Use AI Services',
  'landing.howItWorks.step2.description':
    'Chat, generate code, analyze documents, and more',
  'landing.howItWorks.step2.detail': 'Credits deducted per request',
  'landing.howItWorks.step3.title': 'Scale as You Grow',
  'landing.howItWorks.step3.description':
    'Upgrade anytime or buy extra credits when needed',
  'landing.howItWorks.step3.detail': 'Transparent usage tracking',
  'landing.howItWorks.creditsReset': 'Credits Reset Monthly',
  'landing.howItWorks.creditsResetDesc':
    'Your subscription credits refresh every month. Need more? Buy extra credits anytime or upgrade your plan for higher limits and more features.',
  'landing.howItWorks.feature1': 'Real-time tracking',
  'landing.howItWorks.feature2': 'No hidden fees',
  'landing.howItWorks.feature3': 'Unused credits roll over',

  'landing.pricing.title': 'Simple, Transparent Pricing',
  'landing.pricing.subtitle':
    'Choose the plan that fits your needs. Upgrade or downgrade anytime.',
  'landing.pricing.mostPopular': 'Most Popular',
  'landing.pricing.perMonth': '/month',
  'landing.pricing.credits': 'credits',
  'landing.pricing.rateLimit': 'req/min',

  'landing.creditUsage.title': 'Credit Usage',
  'landing.creditUsage.subtitle':
    "Know exactly what you're paying for. Every service has a clear credit cost.",
  'landing.creditUsage.realTime':
    'Credits are deducted in real-time. Track your usage in the dashboard.',

  'landing.developers.badge': 'For Developers',
  'landing.developers.title': 'Build with Our API',
  'landing.developers.subtitle':
    'Integrate AI capabilities into your applications with our developer-friendly API. Available on Premium plans.',
  'landing.developers.restfulApi': 'RESTful API',
  'landing.developers.restfulApiDesc':
    'Clean, well-documented API endpoints for all AI services',
  'landing.developers.rateLimits': 'Rate Limits',
  'landing.developers.rateLimitsDesc':
    'Generous rate limits that scale with your plan',
  'landing.developers.jwtAuth': 'JWT Authentication',
  'landing.developers.jwtAuthDesc':
    'Secure API access with industry-standard authentication',
  'landing.developers.analytics': 'Usage Analytics',
  'landing.developers.analyticsDesc':
    'Real-time tracking of API calls and credit consumption',

  'landing.security.title': 'Security & Reliability',
  'landing.security.subtitle':
    'Your data and payments are protected with enterprise-grade security',
  'landing.security.securePayments': 'Secure Payments',
  'landing.security.securePaymentsDesc':
    'PCI DSS compliant payment processing with Stripe',
  'landing.security.jwtAuth': 'JWT Authentication',
  'landing.security.jwtAuthDesc':
    'Industry-standard authentication and authorization',
  'landing.security.usageTracking': 'Usage Tracking',
  'landing.security.usageTrackingDesc':
    'Complete audit logs for all transactions and API calls',
  'landing.security.dataPrivacy': 'Data Privacy',
  'landing.security.dataPrivacyDesc':
    'Your data is encrypted and never shared with third parties',

  'landing.cta.badge': 'Start with 100 free credits',
  'landing.cta.title': 'Ready to Build with AI?',
  'landing.cta.subtitle':
    'Join developers and teams using our AI Agent platform. Start free, no credit card required.',
  'landing.cta.primary': 'Get Started Free',
  'landing.cta.secondary': 'View Pricing',
  'landing.cta.trust1': 'No credit card required',
  'landing.cta.trust2': 'Cancel anytime',
  'landing.cta.trust3': 'Start in 30 seconds',

  'landing.nav.features': 'Features',
  'landing.nav.pricing': 'Pricing',
  'landing.nav.docs': 'Docs',
  'landing.nav.login': 'Login',
  'landing.nav.signup': 'Sign Up',

  'landing.footer.tagline':
    'AI Agent platform with transparent credit-based pricing. Built for developers who value clarity and control.',
  'landing.footer.product': 'Product',
  'landing.footer.features': 'Features',
  'landing.footer.pricing': 'Pricing',
  'landing.footer.signup': 'Sign Up',
  'landing.footer.login': 'Login',
  'landing.footer.developers': 'Developers',
  'landing.footer.documentation': 'Documentation',
  'landing.footer.apiReference': 'API Reference',
  'landing.footer.guides': 'Guides',
  'landing.footer.systemStatus': 'System Status',
  'landing.footer.legal': 'Legal',
  'landing.footer.terms': 'Terms of Service',
  'landing.footer.privacy': 'Privacy Policy',
  'landing.footer.security': 'Security',
  'landing.footer.compliance': 'Compliance',
  'landing.footer.copyright': 'AI Agent Platform. All rights reserved.',
  'landing.footer.allSystemsOperational': 'All systems operational',

  // Docs Page
  'docs.hero.badge': 'Documentation',
  'docs.hero.title': 'Upload. Ask. Learn.',
  'docs.hero.subtitle':
    'Transform your documents into an intelligent knowledge base. Upload files, ask questions, and get instant answers powered by advanced AI.',
  'docs.hero.ctaPrimary': 'Get Started Free',
  'docs.hero.ctaSecondary': 'Read Documentation',

  'docs.nav.overview': 'Overview',
  'docs.nav.upload': 'Upload Documents',
  'docs.nav.processing': 'Processing',
  'docs.nav.chat': 'Ask Questions',
  'docs.nav.features': 'Features',
  'docs.nav.limits': 'Limits & Plans',

  'docs.overview.title': 'Overview',
  'docs.overview.intro':
    'Neura transforms your documents into an intelligent knowledge base. Upload PDFs, Word documents, text files, or markdown files, and our AI will process them using advanced embeddings and vector search technology.',
  'docs.overview.multipleFormats': 'Multiple Formats',
  'docs.overview.multipleFormatsDesc':
    'Support for PDF, DOCX, TXT, and MD files',
  'docs.overview.aiSearch': 'AI-Powered Search',
  'docs.overview.aiSearchDesc':
    'Hybrid search combining semantic and keyword matching',
  'docs.overview.naturalConversations': 'Natural Conversations',
  'docs.overview.naturalConversationsDesc':
    'Ask questions in plain language, get accurate answers',
  'docs.overview.securePrivate': 'Secure & Private',
  'docs.overview.securePrivateDesc':
    'Your documents are encrypted and accessible only to you',

  'docs.upload.title': 'Upload Documents',
  'docs.upload.intro':
    'Getting started is simple. Upload your documents and let our AI process them automatically.',
  'docs.upload.supportedTypes': 'Supported File Types',
  'docs.upload.howToUpload': 'How to Upload',
  'docs.upload.step1': 'Click Upload Button',
  'docs.upload.step1Desc':
    'Navigate to your dashboard and click the upload button in the sidebar',
  'docs.upload.step2': 'Select Files',
  'docs.upload.step2Desc':
    'Choose files from your computer or drag and drop them into the upload area',
  'docs.upload.step3': 'Wait for Processing',
  'docs.upload.step3Desc':
    'Files are automatically processed and embedded into the knowledge base',
  'docs.upload.step4': 'Start Asking',
  'docs.upload.step4Desc':
    'Once processed, you can immediately start asking questions about your documents',

  'docs.processing.title': 'How Processing Works',
  'docs.processing.intro':
    'Behind the scenes, our AI pipeline transforms your documents into searchable knowledge using advanced machine learning.',
  'docs.processing.step1': 'File Upload',
  'docs.processing.step1Desc':
    'Your file is securely uploaded to AWS S3 storage',
  'docs.processing.step2': 'Content Extraction',
  'docs.processing.step2Desc':
    'Text is extracted and converted to markdown format',
  'docs.processing.step3': 'Text Chunking',
  'docs.processing.step3Desc':
    'Content is split into 500-word chunks with 50-word overlap',
  'docs.processing.step4': 'Embedding Generation',
  'docs.processing.step4Desc':
    'Each chunk is converted to 384-dimensional vectors using ONNX models',
  'docs.processing.step5': 'Vector Storage',
  'docs.processing.step5Desc':
    'Embeddings are stored in Qdrant vector database',
  'docs.processing.step6': 'Ready to Query',
  'docs.processing.step6Desc':
    'Your document is now searchable and ready for questions',

  'docs.chat.title': 'Ask Questions',
  'docs.chat.intro':
    'Once your documents are processed, you can ask questions in natural language. Our AI uses RAG (Retrieval Augmented Generation) to provide accurate, sourced answers.',
  'docs.chat.howRagWorks': 'How RAG Works',
  'docs.chat.ragStep1': 'You ask a question',
  'docs.chat.ragStep1Desc': 'Type your question in the chat interface',
  'docs.chat.ragStep2': 'AI searches your documents',
  'docs.chat.ragStep2Desc':
    'Hybrid search finds relevant content using semantic and keyword matching',
  'docs.chat.ragStep3': 'Context is enhanced',
  'docs.chat.ragStep3Desc': 'Retrieved excerpts are added to the AI prompt',
  'docs.chat.ragStep4': 'AI generates answer',
  'docs.chat.ragStep4Desc':
    'Gemini LLM produces a grounded response with source citations',
  'docs.chat.exampleQuestions': 'Example Questions',

  'docs.features.title': 'Key Features',
  'docs.features.hybridSearch': 'Hybrid Search',
  'docs.features.hybridSearchDesc':
    'Combines semantic embeddings with keyword matching for best results',
  'docs.features.realTimeProcessing': 'Real-Time Processing',
  'docs.features.realTimeProcessingDesc':
    'Documents are processed and ready to query within seconds',
  'docs.features.conversationalAI': 'Conversational AI',
  'docs.features.conversationalAIDesc':
    'Natural language interface with context-aware responses',
  'docs.features.privateSecure': 'Private & Secure',
  'docs.features.privateSecureDesc':
    'Your documents are encrypted and only accessible to you',
  'docs.features.smartChunking': 'Smart Chunking',
  'docs.features.smartChunkingDesc':
    'Intelligent text splitting maintains context across chunks',
  'docs.features.sourceAttribution': 'Source Attribution',
  'docs.features.sourceAttributionDesc':
    'Every answer includes citations to source documents',

  'docs.limits.title': 'Limits & Plans',
  'docs.limits.intro':
    'Choose the plan that fits your needs. All plans include document upload and AI-powered Q&A.',
  'docs.limits.feature': 'Feature',
  'docs.limits.free': 'Free',
  'docs.limits.basic': 'Basic',
  'docs.limits.premium': 'Premium',
  'docs.limits.maxFileSize': 'Max File Size',
  'docs.limits.fileUploads': 'File Uploads',
  'docs.limits.creditsPerMonth': 'Credits/Month',
  'docs.limits.chatHistory': 'Chat History',
  'docs.limits.support': 'Support',
  'docs.limits.apiAccess': 'API Access',
  'docs.limits.viewFullPricing': 'View Full Pricing',

  'docs.sidebar.quickLinks': 'Quick Links',
  'docs.sidebar.readyToStart': 'Ready to get started?',
  'docs.sidebar.readyToStartDesc':
    'Upload your first document and experience AI-powered knowledge management.',
  'docs.sidebar.startFreeTrial': 'Start Free Trial',
};

const vi = {
  // Navigation
  'nav.dashboard': 'Bảng điều khiển',
  'nav.chat': 'Trò chuyện',
  'nav.logout': 'Đăng xuất',
  'nav.language': 'Ngôn ngữ',
  'nav.settings': 'Cài đặt',
  'nav.signout': 'Đăng xuất',

  // Auth - Login
  'auth.login': 'Đăng nhập',
  'auth.loginTitle': 'Đăng nhập vào tài khoản',
  'auth.loginSubtitle':
    'Đăng nhập hoặc đăng ký để có thể trải nghiệm các tính năng tài liệu hơn.',
  'auth.username': 'Tên đăng nhập',
  'auth.password': 'Mật khẩu',
  'auth.forgotPassword': 'Quên mật khẩu?',
  'auth.continue': 'Tiếp tục',
  'auth.signingIn': 'Đang đăng nhập...',
  'auth.dontHaveAccount': 'Bạn chưa có tài khoản?',
  'auth.signUpNow': 'Đăng ký ngay',
  'auth.termsOfUse': 'Điều khoản sử dụng',
  'auth.privacyPolicy': 'Chính sách bảo mật',

  // Auth - Signup
  'auth.signup': 'Đăng ký',
  'auth.signupTitle': 'Đăng kí tài khoản',
  'auth.signupSubtitle':
    'Đăng nhập hoặc đăng kí để có thể tải lên nhiều tài liệu hơn.',
  'auth.firstName': 'Tên',
  'auth.lastName': 'Họ',
  'auth.email': 'Email',
  'auth.confirmPassword': 'Xác nhận mật khẩu',
  'auth.verifyEmail': 'Xác thực email',
  'auth.processing': 'Đang xử lý...',
  'auth.alreadyHaveAccount': 'Đã có tài khoản?',
  'auth.signInNow': 'Đăng nhập ngay',
  'auth.signupSuccess': 'Đăng ký thành công!',
  'auth.checkEmail': 'Chúng tôi đã gửi email xác thực đến',
  'auth.verifyEmailPrompt':
    'Vui lòng kiểm tra email và nhấp vào liên kết xác thực để hoàn tất đăng ký.',
  'auth.redirecting': 'Đang chuyển hướng đến trang đăng nhập...',

  // Auth - Password Strength
  'auth.passwordVeryWeak': 'Rất yếu',
  'auth.passwordWeak': 'Yếu',
  'auth.passwordMedium': 'Trung bình',
  'auth.passwordStrong': 'Mạnh',
  'auth.passwordVeryStrong': 'Rất mạnh',
  'auth.passwordMinLength': 'Ít nhất 8 ký tự',
  'auth.passwordNumber': 'Số (0-9)',

  // Auth - Forgot Password
  'auth.forgotPasswordTitle': 'Quên mật khẩu?',
  'auth.forgotPasswordSubtitle':
    'Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.',
  'auth.emailAddress': 'Địa chỉ email',
  'auth.enterEmail': 'Nhập địa chỉ email của bạn',
  'auth.sendResetLink': 'Gửi liên kết đặt lại',
  'auth.sending': 'Đang gửi...',
  'auth.backToSignIn': 'Quay lại đăng nhập',
  'auth.checkYourEmail': 'Kiểm tra email của bạn',
  'auth.resetLinkSent': 'Chúng tôi đã gửi liên kết đặt lại mật khẩu đến',
  'auth.didntReceiveEmail': 'Không nhận được email? Kiểm tra thư mục spam hoặc',
  'auth.tryAgain': 'thử lại',

  // Auth - Reset Password
  'auth.resetPasswordTitle': 'Đặt lại mật khẩu',
  'auth.resetPasswordSubtitle': 'Nhập mật khẩu mới của bạn bên dưới',
  'auth.newPassword': 'Mật khẩu mới',
  'auth.enterNewPassword': 'Nhập mật khẩu mới',
  'auth.confirmNewPassword': 'Xác nhận mật khẩu mới',
  'auth.confirmNewPasswordPlaceholder': 'Xác nhận mật khẩu mới',
  'auth.passwordRequirements': 'Phải có ít nhất 8 ký tự và số',
  'auth.resetPassword': 'Đặt lại mật khẩu',
  'auth.resetting': 'Đang đặt lại...',
  'auth.invalidResetLink': 'Liên kết đặt lại không hợp lệ',
  'auth.requestNewResetLink': 'Yêu cầu liên kết đặt lại mới',
  'auth.passwordResetSuccess': 'Đặt lại mật khẩu thành công!',
  'auth.passwordResetSuccessMessage':
    'Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.',
  'auth.redirectingToSignIn': 'Đang chuyển hướng đến trang đăng nhập...',
  'auth.goToSignIn': 'Đi đến đăng nhập',

  // Dashboard
  'dashboard.title': 'Trò chuyện AI Giáo dục',
  'dashboard.welcome': 'Chào mừng đến với Trò chuyện AI Giáo dục',
  'dashboard.uploadFile': 'Tải lên tệp',
  'dashboard.addFile': 'Thêm tệp',
  'dashboard.addFiles': 'Thêm tệp',
  'dashboard.myFiles': 'Tệp của tôi',
  'dashboard.chatWithAI': 'Trò chuyện với AI',
  'dashboard.askQuestion': 'Đặt câu hỏi...',
  'dashboard.send': 'Gửi',
  'dashboard.loading': 'Đang tải...',
  'dashboard.clearConversation': 'Xóa cuộc trò chuyện',
  'dashboard.startTyping': 'Bắt đầu nhập...',
  'dashboard.startConversation': 'Bắt đầu cuộc trò chuyện với AI Assistant',
  'dashboard.typeQuestion': 'Nhập câu hỏi của bạn bên dưới',
  'dashboard.sources': 'nguồn',
  'dashboard.sourcesCount': '{count} nguồn',

  // File Management
  'files.upload': 'Tải lên tệp',
  'files.uploadFiles': 'Tải lên tệp',
  'files.selectFile': 'Chọn tệp',
  'files.fileName': 'Tên tệp',
  'files.fileSize': 'Kích thước',
  'files.uploadDate': 'Ngày tải lên',
  'files.actions': 'Thao tác',
  'files.delete': 'Xóa',
  'files.view': 'Xem',
  'files.noFiles': 'Chưa có tệp nào được tải lên',
  'files.uploadSuccess': 'Tải lên tệp thành công',
  'files.uploadError': 'Lỗi khi tải lên tệp',
  'files.deleteSuccess': 'Xóa tệp thành công',
  'files.deleteError': 'Lỗi khi xóa tệp',
  'files.dragDrop': 'Kéo và thả tệp vào đây',
  'files.clickBrowse': 'hoặc nhấp để chọn',
  'files.supported': 'Hỗ trợ: DOCX, PDF, TXT, MD',
  'files.unsupportedType':
    'Tệp {fileName} không được hỗ trợ. Chỉ cho phép tệp DOCX, PDF, TXT và MD.',
  'files.selected': '{count} tệp đã chọn',
  'files.uploading': 'Đang tải lên...',
  'files.uploadedCount': '{success} trong số {total} tệp đã tải lên',
  'files.done': 'Hoàn tất',
  'files.uploadButton': 'Tải lên {count} tệp',
  'files.closeEsc': 'Đóng (ESC)',
  'files.removeFile': 'Xóa tệp',
  'files.refreshSources': 'Làm mới nguồn',
  'files.noSourcesFound': 'Không tìm thấy nguồn',
  'files.noSourcesAvailable': 'Không có nguồn nào',
  'files.uploadFirstFiles': 'Tải lên tệp đầu tiên của bạn',
  'files.addButton': 'Thêm',
  'files.selectAll': 'Chọn tất cả',
  'files.source': 'Nguồn',

  // Delete Modal
  'delete.title': 'Xóa nguồn',
  'delete.cannotUndo': 'Hành động này không thể hoàn tác',
  'delete.confirmMessage':
    'Bạn có chắc chắn muốn xóa {sourceName}? Tất cả tài liệu liên quan sẽ bị xóa vĩnh viễn khỏi cơ sở kiến thức của bạn.',
  'delete.cancel': 'Hủy',
  'delete.confirm': 'Xóa nguồn',

  // Chat
  'chat.title': 'Giao diện trò chuyện',
  'chat.copy': 'Sao chép',
  'chat.copied': 'Đã sao chép!',
  'chat.typeMessage': 'Nhập tin nhắn của bạn...',
  'chat.send': 'Gửi',
  'chat.thinking': 'AI đang suy nghĩ...',
  'chat.error': 'Có lỗi xảy ra khi xử lý yêu cầu của bạn',

  // Common
  'common.save': 'Lưu',
  'common.cancel': 'Hủy',
  'common.delete': 'Xóa',
  'common.edit': 'Sửa',
  'common.close': 'Đóng',
  'common.confirm': 'Xác nhận',
  'common.yes': 'Có',
  'common.no': 'Không',
  'common.loading': 'Đang tải...',
  'common.error': 'Lỗi',
  'common.success': 'Thành công',
  'common.warning': 'Cảnh báo',
  'common.info': 'Thông tin',
  'common.refresh': 'Làm mới',
  'common.retry': 'Thử lại',

  // Credits
  'credits.balance': 'Số dư Credit',
  'credits.of': 'trên',
  'credits.total': 'tổng',
  'credits.used': 'Đã dùng',
  'credits.subscription': 'Gói đăng ký',
  'credits.purchased': 'Đã mua',
  'credits.bonus': 'Thưởng',
  'credits.lowBalance':
    'Số dư credit thấp! Hãy mua thêm credit để tiếp tục sử dụng.',
  'credits.purchaseMore': 'Mua thêm Credit',
  'credits.purchase': 'Mua Credit',
  'credits.history': 'Lịch sử',
  'credits.insufficientTitle': 'Không đủ Credit',
  'credits.insufficientMessage':
    'Bạn không có đủ credit để hoàn thành yêu cầu này.',

  // Language
  'language.english': 'English',
  'language.vietnamese': 'Tiếng Việt',
  'language.switch': 'Chuyển ngôn ngữ',

  // Intro Tour
  'tour.uploadTitle': 'Tải lên tệp',
  'tour.uploadContent':
    'Nhấp vào đây để tải lên tài liệu của bạn (PDF, DOCX, TXT, MD). Các tệp này sẽ được AI sử dụng để trả lời câu hỏi của bạn.',
  'tour.fileListTitle': 'Tệp của bạn',
  'tour.fileListContent':
    'Xem và quản lý các tệp đã tải lên tại đây. Chọn tệp để sử dụng chúng trong cuộc trò chuyện.',
  'tour.chatTitle': 'Trò chuyện với AI',
  'tour.chatContent':
    'Nhập câu hỏi của bạn tại đây. AI sẽ trả lời dựa trên các tài liệu bạn đã tải lên.',
  'tour.settingsTitle': 'Cài đặt',
  'tour.settingsContent':
    'Truy cập cài đặt để thay đổi ngôn ngữ, quản lý tài khoản và nhiều hơn nữa.',
  'tour.skip': 'Bỏ qua',
  'tour.next': 'Tiếp theo',
  'tour.finish': 'Hoàn thành',
  'tour.back': 'Quay lại',
  'tour.step': 'Bước',
  'tour.of': 'của',
  'tour.navigate': 'Điều hướng',
  'tour.dontShowAgain': 'Không hiển thị lại',

  // Landing Page
  'landing.hero.badge': 'Hệ thống Credit NeuPay',
  'landing.hero.title': 'AI Agent cho',
  'landing.hero.titleHighlight': 'Cá Nhân Bạn',
  'landing.hero.subtitle':
    'Chat, code, phân tích tài liệu và hơn thế nữa. Chỉ trả cho những gì bạn dùng với hệ thống credit minh bạch. Dùng thử miễn phí, mở rộng theo nhu cầu.',
  'landing.hero.ctaPrimary': 'Dùng thử miễn phí',
  'landing.hero.ctaSecondary': 'Xem bảng giá',
  'landing.hero.trust1': '100 credit miễn phí',
  'landing.hero.trust2': 'Không cần thẻ',
  'landing.hero.trust3': 'Hủy bất cứ lúc nào',

  'landing.features.title': 'Đầy đủ tính năng',
  'landing.features.subtitle': 'AI mạnh mẽ, giá rõ ràng theo mức dùng thực tế',
  'landing.features.aiChat': 'AI Chat',
  'landing.features.aiChatDesc':
    'Trò chuyện thông minh với khả năng suy luận nâng cao',
  'landing.features.codeGen': 'Code Generation',
  'landing.features.codeGenDesc': 'Tạo, refactor và debug code mọi ngôn ngữ',
  'landing.features.docProcess': 'Xử lý tài liệu',
  'landing.features.docProcessDesc':
    'Upload, phân tích và tóm tắt tài liệu tức thì',
  'landing.features.semanticSearch': 'Semantic Search',
  'landing.features.semanticSearchDesc':
    'Tìm kiếm thông tin chính xác trong tài liệu',
  'landing.features.imageAnalysis': 'Phân tích hình ảnh',
  'landing.features.imageAnalysisDesc': 'Trích xuất insights và mô tả từ ảnh',
  'landing.features.stt': 'Speech-to-Text',
  'landing.features.sttDesc': 'Chuyển đổi giọng nói thành văn bản chính xác',
  'landing.features.tts': 'Text-to-Speech',
  'landing.features.ttsDesc': 'Tổng hợp giọng nói tự nhiên',
  'landing.features.apiAccess': 'API Access',
  'landing.features.apiAccessDesc': 'Tích hợp AI vào ứng dụng của bạn',
  'landing.features.servicesCount': '{count} dịch vụ AI',
  'landing.features.realTimeTracking': 'Theo dõi credit real-time',

  'landing.howItWorks.title': 'Cách thức hoạt động',
  'landing.howItWorks.subtitle':
    'Giá đơn giản, minh bạch - chỉ tính những gì bạn dùng',
  'landing.howItWorks.step': 'Bước',
  'landing.howItWorks.step1.title': 'Chọn gói phù hợp',
  'landing.howItWorks.step1.description':
    'Bắt đầu miễn phí hoặc chọn gói theo nhu cầu',
  'landing.howItWorks.step1.detail': 'Credit tự động làm mới mỗi tháng',
  'landing.howItWorks.step2.title': 'Sử dụng dịch vụ AI',
  'landing.howItWorks.step2.description':
    'Chat, code, phân tích tài liệu và nhiều hơn nữa',
  'landing.howItWorks.step2.detail': 'Credit trừ theo từng request',
  'landing.howItWorks.step3.title': 'Mở rộng linh hoạt',
  'landing.howItWorks.step3.description':
    'Nâng cấp hoặc mua thêm credit bất cứ lúc nào',
  'landing.howItWorks.step3.detail': 'Theo dõi usage minh bạch',
  'landing.howItWorks.creditsReset': 'Credit làm mới hàng tháng',
  'landing.howItWorks.creditsResetDesc':
    'Credit trong gói được làm mới mỗi tháng. Cần thêm? Mua credit bổ sung hoặc nâng cấp gói để có limit cao hơn và nhiều tính năng hơn.',
  'landing.howItWorks.feature1': 'Theo dõi real-time',
  'landing.howItWorks.feature2': 'Không phí ẩn',
  'landing.howItWorks.feature3': 'Credit chuyển sang tháng sau',

  'landing.pricing.title': 'Bảng giá đơn giản, minh bạch',
  'landing.pricing.subtitle':
    'Chọn gói phù hợp. Nâng cấp hoặc hạ cấp bất cứ lúc nào.',
  'landing.pricing.mostPopular': 'Phổ biến nhất',
  'landing.pricing.perMonth': '/tháng',
  'landing.pricing.credits': 'credit',
  'landing.pricing.rateLimit': 'request/phút',

  'landing.creditUsage.title': 'Chi phí credit',
  'landing.creditUsage.subtitle':
    'Biết chính xác bạn trả cho cái gì. Mỗi dịch vụ có mức credit rõ ràng.',
  'landing.creditUsage.realTime':
    'Credit trừ real-time. Theo dõi usage trong dashboard.',

  'landing.developers.badge': 'Dành cho Developer',
  'landing.developers.title': 'Build với API',
  'landing.developers.subtitle':
    'Tích hợp AI vào app của bạn với API thân thiện developer. Có sẵn trong gói Premium.',
  'landing.developers.restfulApi': 'RESTful API',
  'landing.developers.restfulApiDesc':
    'API endpoints rõ ràng, đầy đủ docs cho mọi dịch vụ AI',
  'landing.developers.rateLimits': 'Rate Limits',
  'landing.developers.rateLimitsDesc':
    'Rate limit hợp lý, tăng theo gói của bạn',
  'landing.developers.jwtAuth': 'JWT Authentication',
  'landing.developers.jwtAuthDesc':
    'Truy cập API bảo mật với xác thực chuẩn industry',
  'landing.developers.analytics': 'Usage Analytics',
  'landing.developers.analyticsDesc':
    'Theo dõi API calls và credit usage real-time',

  'landing.security.title': 'Bảo mật & Tin cậy',
  'landing.security.subtitle':
    'Dữ liệu và thanh toán được bảo vệ bằng bảo mật enterprise-grade',
  'landing.security.securePayments': 'Thanh toán bảo mật',
  'landing.security.securePaymentsDesc':
    'Xử lý thanh toán tuân thủ PCI DSS qua Stripe',
  'landing.security.jwtAuth': 'JWT Authentication',
  'landing.security.jwtAuthDesc': 'Xác thực và phân quyền chuẩn industry',
  'landing.security.usageTracking': 'Theo dõi Usage',
  'landing.security.usageTrackingDesc':
    'Audit logs đầy đủ cho mọi transaction và API call',
  'landing.security.dataPrivacy': 'Quyền riêng tư',
  'landing.security.dataPrivacyDesc':
    'Dữ liệu được mã hóa và không bao giờ chia sẻ với bên thứ ba',

  'landing.cta.badge': 'Bắt đầu với 100 credit miễn phí',
  'landing.cta.title': 'Sẵn sàng build với AI?',
  'landing.cta.subtitle':
    'Tham gia cùng các developer và team đang dùng AI Agent platform. Dùng thử miễn phí, không cần thẻ.',
  'landing.cta.primary': 'Dùng thử miễn phí',
  'landing.cta.secondary': 'Xem bảng giá',
  'landing.cta.trust1': 'Không cần thẻ',
  'landing.cta.trust2': 'Hủy bất cứ lúc nào',
  'landing.cta.trust3': 'Setup trong 30 giây',

  'landing.nav.features': 'Tính năng',
  'landing.nav.pricing': 'Bảng giá',
  'landing.nav.docs': 'Docs',
  'landing.nav.login': 'Đăng nhập',
  'landing.nav.signup': 'Đăng ký',

  'landing.footer.tagline':
    'AI Agent platform với giá credit minh bạch. Được build cho developer coi trọng sự rõ ràng và kiểm soát.',
  'landing.footer.product': 'Sản phẩm',
  'landing.footer.features': 'Tính năng',
  'landing.footer.pricing': 'Bảng giá',
  'landing.footer.signup': 'Đăng ký',
  'landing.footer.login': 'Đăng nhập',
  'landing.footer.developers': 'Developer',
  'landing.footer.documentation': 'Documentation',
  'landing.footer.apiReference': 'API Reference',
  'landing.footer.guides': 'Guides',
  'landing.footer.systemStatus': 'System Status',
  'landing.footer.legal': 'Legal',
  'landing.footer.terms': 'Terms of Service',
  'landing.footer.privacy': 'Privacy Policy',
  'landing.footer.security': 'Security',
  'landing.footer.compliance': 'Compliance',
  'landing.footer.copyright': 'AI Agent Platform. All rights reserved.',
  'landing.footer.allSystemsOperational': 'All systems operational',

  // Docs Page
  'docs.hero.badge': 'Documentation',
  'docs.hero.title': 'Upload. Hỏi. Học.',
  'docs.hero.subtitle':
    'Biến tài liệu thành knowledge base thông minh. Upload file, đặt câu hỏi, nhận câu trả lời tức thì từ AI.',
  'docs.hero.ctaPrimary': 'Dùng thử miễn phí',
  'docs.hero.ctaSecondary': 'Đọc docs',

  'docs.nav.overview': 'Tổng quan',
  'docs.nav.upload': 'Upload tài liệu',
  'docs.nav.processing': 'Xử lý',
  'docs.nav.chat': 'Đặt câu hỏi',
  'docs.nav.features': 'Tính năng',
  'docs.nav.limits': 'Giới hạn & Gói',

  'docs.overview.title': 'Tổng quan',
  'docs.overview.intro':
    'Neura biến tài liệu thành knowledge base thông minh. Upload PDF, Word, text file hoặc markdown, AI sẽ xử lý bằng embedding và vector search công nghệ cao.',
  'docs.overview.multipleFormats': 'Nhiều định dạng',
  'docs.overview.multipleFormatsDesc': 'Hỗ trợ PDF, DOCX, TXT và MD',
  'docs.overview.aiSearch': 'AI Search',
  'docs.overview.aiSearchDesc':
    'Hybrid search kết hợp semantic và keyword matching',
  'docs.overview.naturalConversations': 'Trò chuyện tự nhiên',
  'docs.overview.naturalConversationsDesc':
    'Hỏi bằng ngôn ngữ thông thường, nhận câu trả lời chính xác',
  'docs.overview.securePrivate': 'Bảo mật & Riêng tư',
  'docs.overview.securePrivateDesc':
    'Tài liệu được mã hóa và chỉ bạn truy cập được',

  'docs.upload.title': 'Upload tài liệu',
  'docs.upload.intro':
    'Bắt đầu rất đơn giản. Upload tài liệu và để AI xử lý tự động.',
  'docs.upload.supportedTypes': 'File types hỗ trợ',
  'docs.upload.howToUpload': 'Cách upload',
  'docs.upload.step1': 'Click nút Upload',
  'docs.upload.step1Desc': 'Vào dashboard và click nút upload ở sidebar',
  'docs.upload.step2': 'Chọn file',
  'docs.upload.step2Desc': 'Chọn file từ máy tính hoặc kéo thả vào vùng upload',
  'docs.upload.step3': 'Đợi xử lý',
  'docs.upload.step3Desc': 'File tự động xử lý và embed vào knowledge base',
  'docs.upload.step4': 'Bắt đầu hỏi',
  'docs.upload.step4Desc':
    'Sau khi xử lý xong, bạn có thể hỏi ngay về tài liệu',

  'docs.processing.title': 'Cách xử lý hoạt động',
  'docs.processing.intro':
    'Đằng sau hậu trường, AI pipeline biến tài liệu thành knowledge có thể search bằng machine learning.',
  'docs.processing.step1': 'Upload file',
  'docs.processing.step1Desc': 'File được upload bảo mật lên AWS S3',
  'docs.processing.step2': 'Trích xuất nội dung',
  'docs.processing.step2Desc': 'Text được trích xuất và convert sang markdown',
  'docs.processing.step3': 'Chia nhỏ text',
  'docs.processing.step3Desc':
    'Nội dung chia thành chunks 500 từ, overlap 50 từ',
  'docs.processing.step4': 'Tạo embedding',
  'docs.processing.step4Desc':
    'Mỗi chunk convert thành vector 384 chiều bằng ONNX models',
  'docs.processing.step5': 'Lưu vector',
  'docs.processing.step5Desc': 'Embeddings lưu trong Qdrant vector database',
  'docs.processing.step6': 'Sẵn sàng query',
  'docs.processing.step6Desc': 'Tài liệu giờ có thể search và sẵn sàng trả lời',

  'docs.chat.title': 'Đặt câu hỏi',
  'docs.chat.intro':
    'Sau khi tài liệu được xử lý, bạn có thể hỏi bằng ngôn ngữ tự nhiên. AI dùng RAG (Retrieval Augmented Generation) để trả lời chính xác với nguồn trích dẫn.',
  'docs.chat.howRagWorks': 'RAG hoạt động thế nào',
  'docs.chat.ragStep1': 'Bạn đặt câu hỏi',
  'docs.chat.ragStep1Desc': 'Gõ câu hỏi trong chat interface',
  'docs.chat.ragStep2': 'AI search tài liệu',
  'docs.chat.ragStep2Desc':
    'Hybrid search tìm nội dung liên quan bằng semantic và keyword matching',
  'docs.chat.ragStep3': 'Context được enhance',
  'docs.chat.ragStep3Desc': 'Đoạn trích xuất được thêm vào AI prompt',
  'docs.chat.ragStep4': 'AI tạo câu trả lời',
  'docs.chat.ragStep4Desc': 'Gemini LLM tạo response có nguồn trích dẫn',
  'docs.chat.exampleQuestions': 'Câu hỏi mẫu',

  'docs.features.title': 'Tính năng chính',
  'docs.features.hybridSearch': 'Hybrid Search',
  'docs.features.hybridSearchDesc':
    'Kết hợp semantic embeddings với keyword matching cho kết quả tốt nhất',
  'docs.features.realTimeProcessing': 'Xử lý Real-time',
  'docs.features.realTimeProcessingDesc':
    'Tài liệu xử lý và sẵn sàng query trong vài giây',
  'docs.features.conversationalAI': 'Conversational AI',
  'docs.features.conversationalAIDesc':
    'Giao diện ngôn ngữ tự nhiên với response nhận biết context',
  'docs.features.privateSecure': 'Riêng tư & Bảo mật',
  'docs.features.privateSecureDesc':
    'Tài liệu được mã hóa và chỉ bạn truy cập được',
  'docs.features.smartChunking': 'Smart Chunking',
  'docs.features.smartChunkingDesc':
    'Chia text thông minh giữ nguyên context giữa các chunks',
  'docs.features.sourceAttribution': 'Trích dẫn nguồn',
  'docs.features.sourceAttributionDesc':
    'Mọi câu trả lời đều có trích dẫn từ tài liệu nguồn',

  'docs.limits.title': 'Giới hạn & Gói',
  'docs.limits.intro':
    'Chọn gói phù hợp. Tất cả gói đều có upload tài liệu và AI Q&A.',
  'docs.limits.feature': 'Tính năng',
  'docs.limits.free': 'Free',
  'docs.limits.basic': 'Basic',
  'docs.limits.premium': 'Premium',
  'docs.limits.maxFileSize': 'File size tối đa',
  'docs.limits.fileUploads': 'Upload file',
  'docs.limits.creditsPerMonth': 'Credit/tháng',
  'docs.limits.chatHistory': 'Lịch sử chat',
  'docs.limits.support': 'Support',
  'docs.limits.apiAccess': 'API Access',
  'docs.limits.viewFullPricing': 'Xem bảng giá đầy đủ',

  'docs.sidebar.quickLinks': 'Quick Links',
  'docs.sidebar.readyToStart': 'Sẵn sàng bắt đầu?',
  'docs.sidebar.readyToStartDesc':
    'Upload tài liệu đầu tiên và trải nghiệm AI-powered knowledge management.',
  'docs.sidebar.startFreeTrial': 'Dùng thử miễn phí',
};

const translations: Record<Locale, Record<string, string>> = {
  en,
  vi,
};

// Add settings translations
const settingsTranslations = {
  en: {
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account and preferences',
    'settings.credits': 'Credits',
    'settings.profile': 'Profile',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.profileInfo': 'Profile Information',
    'settings.notificationPreferences': 'Notification Preferences',
    'settings.securitySettings': 'Security Settings',
    'credits.usageStats': 'Usage Statistics',
    'credits.today': 'Today',
    'credits.thisWeek': 'This Week',
    'credits.thisMonth': 'This Month',
    'credits.creditsUsed': 'credits used',
    'credits.purchaseOptions': 'Purchase Credits',
    'credits.popular': 'POPULAR',
    'credits.credits': 'credits',
    'profile.email': 'Email',
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'notifications.lowCredits': 'Low Credit Alerts',
    'notifications.lowCreditsDesc': 'Get notified when credits are running low',
    'notifications.newFeatures': 'New Features',
    'notifications.newFeaturesDesc':
      'Stay updated on new features and improvements',
    'security.currentPassword': 'Current Password',
    'security.newPassword': 'New Password',
    'security.confirmPassword': 'Confirm New Password',
    'security.updatePassword': 'Update Password',
  },
  vi: {
    'settings.title': 'Cài đặt',
    'settings.subtitle': 'Quản lý tài khoản và tùy chọn',
    'settings.credits': 'Credit',
    'settings.profile': 'Hồ sơ',
    'settings.notifications': 'Thông báo',
    'settings.security': 'Bảo mật',
    'settings.profileInfo': 'Thông tin hồ sơ',
    'settings.notificationPreferences': 'Tùy chọn thông báo',
    'settings.securitySettings': 'Cài đặt bảo mật',
    'credits.usageStats': 'Thống kê sử dụng',
    'credits.today': 'Hôm nay',
    'credits.thisWeek': 'Tuần này',
    'credits.thisMonth': 'Tháng này',
    'credits.creditsUsed': 'credit đã dùng',
    'credits.purchaseOptions': 'Mua Credit',
    'credits.popular': 'PHỔ BIẾN',
    'credits.credits': 'credit',
    'profile.email': 'Email',
    'profile.firstName': 'Tên',
    'profile.lastName': 'Họ',
    'notifications.lowCredits': 'Cảnh báo credit thấp',
    'notifications.lowCreditsDesc': 'Nhận thông báo khi credit sắp hết',
    'notifications.newFeatures': 'Tính năng mới',
    'notifications.newFeaturesDesc': 'Cập nhật về tính năng và cải tiến mới',
    'security.currentPassword': 'Mật khẩu hiện tại',
    'security.newPassword': 'Mật khẩu mới',
    'security.confirmPassword': 'Xác nhận mật khẩu mới',
    'security.updatePassword': 'Cập nhật mật khẩu',
  },
};

// Merge settings translations
Object.keys(settingsTranslations).forEach(lang => {
  translations[lang as Locale] = {
    ...translations[lang as Locale],
    ...settingsTranslations[lang as Locale],
  };
});

// Locale provider props
interface LocaleProviderProps {
  children: ReactNode;
}

// Locale provider component
export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const getInitialLocale = (): Locale => {
    try {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'vi')) {
        return savedLocale;
      }
    } catch (error) {
      console.error('Error loading locale from localStorage:', error);
    }
    return 'vi'; // Default to Vietnamese
  };

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  // Save locale to localStorage when changed
  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('locale', newLocale);

      // Only update user's language preference on the server if authenticated
      const { isAuthenticated } = useUserStore.getState();
      if (isAuthenticated) {
        try {
          await authService.updateLanguage(newLocale);
        } catch (apiError) {
          console.error(
            'Failed to update language preference on server:',
            apiError
          );
          // Don't fail the language switch if API call fails
        }
      }
    } catch (error) {
      console.error('Error saving locale to localStorage:', error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[locale]?.[key] || key;
  };

  const value: LocaleContextType = {
    locale,
    setLocale,
    t,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export default LocaleContext;
