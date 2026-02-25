import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import TurndownService from 'turndown';

// Set up PDF.js worker - use specific version to match the library
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * Utility function to format uploaded files (DOCX, PDF, TXT) to Markdown
 * @param file - The uploaded file
 * @returns Promise<string> - Formatted markdown content
 */
export async function formatFileToMarkdown(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  try {
    switch (fileExtension) {
      case 'docx':
        return await formatDocxToMarkdown(file);
      case 'pdf':
        return await formatPdfToMarkdown(file);
      case 'txt':
      case 'md':
        return await formatTextToMarkdown(file);
      default:
        throw new Error(`Unsupported file format: ${fileExtension}`);
    }
  } catch (error) {
    console.error('Error formatting file:', error);
    throw new Error(
      `Failed to format file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Convert DOCX file to Markdown
 * @param file - DOCX file
 * @returns Promise<string> - Markdown content
 */
async function formatDocxToMarkdown(file: File): Promise<string> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Use mammoth to convert DOCX to HTML
    const result = await mammoth.convertToHtml({ arrayBuffer });

    if (result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }

    // Convert HTML to Markdown using Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      fence: '```',
      emDelimiter: '*',
      strongDelimiter: '**',
      linkStyle: 'inlined',
      linkReferenceStyle: 'full',
    });

    const markdown = turndownService.turndown(result.value);

    return cleanMarkdown(markdown);
  } catch (error) {
    console.error('Error converting DOCX to Markdown:', error);
    throw new Error(
      `Failed to convert DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Convert PDF file to Markdown
 * @param file - PDF file
 * @returns Promise<string> - Markdown content
 */
async function formatPdfToMarkdown(file: File): Promise<string> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument(uint8Array);
    const pdf = await loadingTask.promise;

    let fullText = '';

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items from the page
      const pageText = textContent.items
        .map(item => (item as any).str)
        .join(' ');

      fullText += pageText + '\n\n';
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    // Convert plain text to basic Markdown format
    const markdown = formatPlainTextToMarkdown(fullText);

    return cleanMarkdown(markdown);
  } catch (error) {
    console.error('Error converting PDF to Markdown:', error);
    throw new Error(
      `Failed to convert PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Convert TXT/MD file to Markdown
 * @param file - Text file
 * @returns Promise<string> - Markdown content
 */
async function formatTextToMarkdown(file: File): Promise<string> {
  try {
    const text = await file.text();

    if (!text || text.trim().length === 0) {
      throw new Error('No text content found in file');
    }

    // If it's already a markdown file, return as is
    if (file.name.toLowerCase().endsWith('.md')) {
      return cleanMarkdown(text);
    }

    // Convert plain text to basic Markdown format
    const markdown = formatPlainTextToMarkdown(text);

    return cleanMarkdown(markdown);
  } catch (error) {
    console.error('Error reading text file:', error);
    throw new Error(
      `Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Format plain text to basic Markdown structure
 * @param text - Plain text content
 * @returns string - Formatted markdown
 */
function formatPlainTextToMarkdown(text: string): string {
  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  return paragraphs
    .map(paragraph => {
      const trimmed = paragraph.trim();

      // Check if paragraph looks like a heading (short line, possibly all caps or title case)
      if (
        trimmed.length < 100 &&
        (trimmed === trimmed.toUpperCase() ||
          /^[A-Z][a-z\s]+$/.test(trimmed) ||
          /^\d+\.?\s/.test(trimmed))
      ) {
        return `## ${trimmed}\n`;
      }

      // Regular paragraph
      return `${trimmed}\n`;
    })
    .join('\n');
}

/**
 * Clean and normalize markdown content
 * @param markdown - Raw markdown content
 * @returns string - Cleaned markdown
 */
function cleanMarkdown(markdown: string): string {
  return (
    markdown
      // Remove excessive whitespace
      .replace(/\n{3,}/g, '\n\n')
      // Remove trailing whitespace from lines
      .replace(/[ \t]+$/gm, '')
      // Ensure proper spacing around headers
      .replace(/^(#{1,6})\s*(.+)$/gm, '$1 $2')
      // Clean up list formatting
      .replace(/^[\s]*[-*+]\s+/gm, '- ')
      // Remove empty lines at start and end
      .trim()
  );
}

/**
 * Get supported file extensions
 * @returns string[] - Array of supported extensions
 */
export function getSupportedFileExtensions(): string[] {
  return ['docx', 'pdf', 'txt', 'md'];
}

/**
 * Check if file type is supported
 * @param file - File to check
 * @returns boolean - Whether file is supported
 */
export function isFileTypeSupported(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension ? getSupportedFileExtensions().includes(extension) : false;
}
