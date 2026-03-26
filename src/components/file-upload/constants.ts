export const UPLOAD_CONSTANTS = {
  SUPPORTED_FORMATS: '.pdf,.docx,.txt,.md',
  SUPPORTED_FORMATS_TEXT: 'PDF, DOCX, TXT, MD',
  AUTO_UPLOAD_DELAY: 100,
  SUCCESS_CLOSE_DELAY: 2000,
  PDF_DPI: 150,
} as const;

export const PROGRESS_STAGES = {
  PDF: {
    START: 10,
    CONVERSION: 30,
    OCR_COMPLETE: 40,
    UPLOAD_START: 60,
    UPLOAD_RANGE: 20,
    CHUNKING: 80,
    USER_PROFILE: 90,
    COMPLETE: 100,
  },
  NON_PDF: {
    START: 20,
    UPLOAD_START: 40,
    UPLOAD_RANGE: 30,
    CHUNKING: 70,
    USER_PROFILE: 90,
    COMPLETE: 100,
  },
} as const;

export const FILE_METADATA = {
  DEFAULT_SUBJECT: 'Uploaded File',
  DEFAULT_WEEK: 'week01',
  DEFAULT_TAGS: 'uploaded',
} as const;
