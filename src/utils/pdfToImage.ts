import * as pdfjsLib from 'pdfjs-dist';

// Set worker path - using fixed version
pdfjsLib.GlobalWorkerOptions.workerSrc =
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export interface PDFPageImage {
  pageNumber: number;
  imageBase64: string;
  width: number;
  height: number;
}

export async function convertPDFToImages(
  file: File,
  dpi: number = 150,
  onProgress?: (current: number, total: number) => void
): Promise<PDFPageImage[]> {
  console.log('📄 [PDF] Starting PDF to images conversion');
  console.log(
    `📏 [PDF] File: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(`🎯 [PDF] DPI: ${dpi}`);

  try {
    // Read file as ArrayBuffer
    console.log('📖 [PDF] Reading file as ArrayBuffer...');
    const arrayBuffer = await file.arrayBuffer();
    console.log(`✅ [PDF] ArrayBuffer loaded: ${arrayBuffer.byteLength} bytes`);

    // Load PDF document
    console.log('📚 [PDF] Loading PDF document...');
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const totalPages = pdf.numPages;
    console.log(`✅ [PDF] PDF loaded: ${totalPages} pages`);

    const images: PDFPageImage[] = [];

    // Convert each page to image
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      console.log(`🖼️ [PDF] Converting page ${pageNum}/${totalPages}...`);

      const page = await pdf.getPage(pageNum);

      // Calculate scale based on DPI (default 72 DPI)
      const scale = dpi / 72;
      const viewport = (page as any).getViewport({ scale });
      console.log(
        `📐 [PDF] Page ${pageNum} viewport: ${viewport.width}x${viewport.height}`
      );

      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page to canvas
      console.log(`🎨 [PDF] Rendering page ${pageNum} to canvas...`);
      await (page as any).render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert canvas to base64 JPEG
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
      console.log(
        `✅ [PDF] Page ${pageNum} converted: ${imageBase64.length} chars base64`
      );

      images.push({
        pageNumber: pageNum,
        imageBase64,
        width: viewport.width,
        height: viewport.height,
      });

      // Report progress
      if (onProgress) {
        onProgress(pageNum, totalPages);
      }
    }

    console.log(
      `🎉 [PDF] Conversion complete: ${images.length} pages converted`
    );
    return images;
  } catch (error) {
    console.error('❌ [PDF] Failed to convert PDF to images:', error);
    throw error;
  }
}

export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    return pdf.numPages;
  } catch (error) {
    console.error('Failed to get PDF page count:', error);
    throw error;
  }
}
