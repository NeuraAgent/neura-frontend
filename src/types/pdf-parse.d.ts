declare module 'pdfjs-dist' {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  export interface TextContent {
    items: TextItem[];
  }

  export interface TextItem {
    str: string;
    transform: number[];
    width: number;
    height: number;
    dir: string;
    fontName: string;
  }

  export interface PDFWorker {
    destroy(): void;
  }

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(src: Uint8Array | ArrayBuffer): {
    promise: Promise<PDFDocumentProxy>;
  };
}
