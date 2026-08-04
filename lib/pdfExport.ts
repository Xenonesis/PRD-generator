import { jsPDF } from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  margin?: number | [number, number, number, number];
  scale?: number;
  watermark?: string;
  fontTheme?: 'sans' | 'serif' | 'mono';
  density?: 'standard' | 'compact';
  includeToc?: boolean;
  onProgress?: (stage: string, progress: number) => void;
}

/**
 * High-fidelity PDF generation using html2pdf.js backed by jsPDF.
 * Preserves exact document structure, font hierarchy, borders, colors, and custom watermark.
 */
export async function exportToHighFidelityPDF(
  elementId: string = 'prd-document-preview',
  options: PDFExportOptions = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  const reportProgress = (stage: string, progress: number) => {
    if (options.onProgress) options.onProgress(stage, progress);
  };

  reportProgress('Initializing PDF engine', 5);

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Target document element with id '${elementId}' was not found.`);
  }

  const filename = options.filename || 'PRD_Document_Agreement.pdf';
  const margin = options.margin ?? [12, 10, 12, 10]; // top, left, bottom, right in mm
  const scale = options.scale ?? 2;
  const watermarkText = options.watermark?.trim();

  const html2pdfModule = await new Promise<any>((resolve, reject) => {
    if ((window as any).html2pdf) {
      return resolve((window as any).html2pdf);
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve((window as any).html2pdf);
    script.onerror = (e) => reject(new Error('Failed to load html2pdf.js script'));
    document.head.appendChild(script);
  });

  const opt = {
    margin: margin,
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.92 },
    html2canvas: {
      scale: 1.5,
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      allowTaint: false,
      foreignObjectRendering: false,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' as const,
      compress: true
    },
    pagebreak: { 
      mode: ['css', 'legacy'],
      before: '.pdf-page-break-before',
      after: '.pdf-page-break-after',
      avoid: ['.pdf-keep-together']
    }
  };


  let watermarkContainer: HTMLDivElement | null = null;
  let tocContainer: HTMLDivElement | null = null;
  const originalPosition = element.style.position;
  const originalClassName = element.className;
  
  reportProgress('Styling content', 15);
  // Force light mode for PDF rendering
  const wasDark = document.documentElement.classList.contains('dark');
  if (wasDark) {
    document.documentElement.classList.remove('dark');
  }

  // Apply PDF styling options
  if (options.fontTheme || options.density) {
    let newClassName = originalClassName;
    if (options.fontTheme === 'serif') {
      newClassName += ' font-serif';
    } else if (options.fontTheme === 'mono') {
      newClassName += ' font-mono';
    }
    
    if (options.density === 'compact') {
      newClassName += ' pdf-compact-density';
    }
    element.className = newClassName;
  }

  try {
    if (options.includeToc) {
      reportProgress('Adding table of contents', 30);
      const headers = element.querySelectorAll('h1, h2, h3');
      if (headers.length > 0) {
        tocContainer = document.createElement('div');
        tocContainer.className = 'pdf-toc-container pdf-page-break-after';
        tocContainer.style.cssText = `
          padding: 40px;
          font-family: inherit;
          min-height: 297mm; /* Ensure it takes at least a page roughly */
          box-sizing: border-box;
        `;
        
        const tocTitle = document.createElement('h1');
        tocTitle.innerText = 'Table of Contents';
        tocTitle.style.cssText = 'font-size: 28px; font-weight: bold; margin-bottom: 32px; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 12px;';
        tocContainer.appendChild(tocTitle);
        
        const tocList = document.createElement('div');
        tocList.style.cssText = 'display: flex; flex-direction: column; gap: 14px;';
        
        let headerIdCounter = 1;
        
        headers.forEach((header) => {
          if (!header.id) {
            header.id = 'pdf-header-' + headerIdCounter++;
          }
          
          const tag = header.tagName.toLowerCase();
          const level = parseInt(tag.charAt(1));
          
          // Skip h1 as they are document titles
          if (level === 1) return;
          
          let text = (header.textContent || '').trim().split('\n')[0];
          // Remove the double dash if it got concatenated
          if (text.includes('--')) {
            text = text.split('--')[0].trim();
          }
          
          if (!text) return;

          const item = document.createElement('div');
          item.style.cssText = `
            margin-left: ${(level - 1) * 24}px;
            font-size: ${level === 1 ? '16px' : level === 2 ? '14px' : '12px'};
            font-weight: ${level <= 2 ? 'bold' : 'normal'};
            line-height: 1.4;
          `;
          
          const link = document.createElement('a');
          link.href = '#' + header.id;
          link.innerText = text;
          link.style.cssText = 'color: #000; text-decoration: none; border-bottom: 1px dotted #ccc; display: block; width: 100%;';
          
          item.appendChild(link);
          tocList.appendChild(item);
        });
        
        tocContainer.appendChild(tocList);
        element.insertBefore(tocContainer, element.firstChild);
      }
    }

    if (watermarkText) {
      reportProgress('Applying watermark', 40);
      if (!originalPosition || originalPosition === 'static') {
        element.style.position = 'relative';
      }

      watermarkContainer = document.createElement('div');
      watermarkContainer.id = 'pdf-export-watermark-overlay';
      watermarkContainer.className = 'pdf-watermark-layer';
      watermarkContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        opacity: 0.13;
        user-select: none;
      `;

      const docHeight = element.scrollHeight || 1200;
      const numWatermarks = Math.max(2, Math.ceil(docHeight / 450));

      for (let i = 0; i < numWatermarks; i++) {
        const wmItem = document.createElement('div');
        wmItem.innerText = watermarkText;
        wmItem.style.cssText = `
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 900;
          font-size: 42px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #000000;
          transform: rotate(-32deg);
          white-space: nowrap;
          margin: 100px 0;
          text-align: center;
        `;
        watermarkContainer.appendChild(wmItem);
      }

      element.appendChild(watermarkContainer);
    }

    reportProgress('Opening system print dialog...', 50);

    // Hide the progress modal so it doesn't get printed
    const progressModal = document.querySelector('.fixed.inset-0.z-\\[100\\]');
    const originalDisplay = progressModal ? (progressModal as HTMLElement).style.display : '';
    if (progressModal) {
      (progressModal as HTMLElement).style.display = 'none';
    }

    // Give the browser a tiny tick to apply the style changes and hide the modal
    await new Promise(resolve => setTimeout(resolve, 150));

    // Trigger native browser print dialog
    // This perfectly supports Tailwind v4's oklch colors, flex, grid, and avoids the html2canvas parsing crashes
    window.print();

    // Restore the modal
    if (progressModal) {
      (progressModal as HTMLElement).style.display = originalDisplay;
    }

    reportProgress('Done', 100);

  } finally {
    if (wasDark) {
      document.documentElement.classList.add('dark');
    }
    if (tocContainer && tocContainer.parentNode) {
      tocContainer.parentNode.removeChild(tocContainer);
    }
    if (watermarkContainer && watermarkContainer.parentNode) {
      watermarkContainer.parentNode.removeChild(watermarkContainer);
    }
    if (element) {
      if (originalPosition !== undefined) {
        element.style.position = originalPosition;
      }
      element.className = originalClassName;
    }
  }

}

/**
 * Fallback / alternative jsPDF custom renderer for text-heavy summary exports with watermark
 */
export function exportTextSummaryWithJsPDF(
  title: string,
  projectName: string,
  sections: { title: string; content: string }[],
  filename: string = 'PRD_Summary.pdf',
  watermarkText?: string
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  let cursorY = 20;

  const renderPageWatermark = () => {
    if (!watermarkText?.trim()) return;
    try {
      doc.saveGraphicsState();
      doc.setTextColor(220, 220, 220);
      doc.setFontSize(36);
      doc.setFont('helvetica', 'bold');
      doc.text(watermarkText.trim().toUpperCase(), pageWidth / 2, pageHeight / 2, {
        angle: 45,
        align: 'center'
      });
      doc.restoreGraphicsState();
    } catch {
      // ignore graphics state fallback
    }
  };

  renderPageWatermark();

  // High-End Centered Cover Page Layout on Page 1
  doc.setLineWidth(1);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  cursorY = 55;
  doc.setFont('sans-serif', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('CONFIDENTIAL & PROPRIETARY', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 20;
  doc.setFont('serif', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text(title.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 15;
  doc.setFont('serif', 'bold');
  doc.setFontSize(26);
  const splitProjectTitle = doc.splitTextToSize(projectName.toUpperCase(), pageWidth - 40);
  doc.text(splitProjectTitle, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += (splitProjectTitle.length * 10);

  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 30, cursorY, pageWidth / 2 + 30, cursorY);

  cursorY += 20;
  doc.setFont('sans-serif', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('EXECUTIVE SPECIFICATION & AGREEMENT SUMMARY', pageWidth / 2, cursorY, { align: 'center' });

  cursorY = pageHeight - 35;
  doc.setFontSize(9);
  doc.text('Authorized Copy • Generated via DataForge PRD Studio', pageWidth / 2, cursorY, { align: 'center' });

  // Add Page 2 for Executive Summary Content
  doc.addPage();
  renderPageWatermark();
  cursorY = 20;

  sections.forEach((sec) => {
    if (cursorY > pageHeight - 25) {
      doc.addPage();
      renderPageWatermark();
      cursorY = 20;
    }

    doc.setFont('serif', 'bold');
    doc.setFontSize(13);
    doc.text(sec.title, 14, cursorY);
    cursorY += 6;

    doc.setFont('sans-serif', 'normal');
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(sec.content, pageWidth - 28);
    
    splitText.forEach((line: string) => {
      if (cursorY > pageHeight - 15) {
        doc.addPage();
        renderPageWatermark();
        cursorY = 20;
      }
      doc.text(line, 14, cursorY);
      cursorY += 5;
    });

    cursorY += 4;
  });

  // Footer page numbering pass
  const totalPages = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('sans-serif', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Executive Summary', 14, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
  }

  doc.save(filename);
}
