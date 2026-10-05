// Client-side high-resolution PDF generator for official letters
// Precision A4 (210mm x 297mm) ISO 216 layout with 300 DPI razor-sharp print quality

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ApplicantData } from '../types';

export interface GeneratePdfOptions {
  filename?: string;
  onProgress?: (progress: number) => void;
}

// Global cached canvas for high-performance color conversion
let colorCanvasCtx: CanvasRenderingContext2D | null = null;

function convertOklabToRgb(colorStr: string): string {
  if (!colorStr || (!colorStr.includes('oklab') && !colorStr.includes('oklch'))) {
    return colorStr;
  }
  try {
    if (!colorCanvasCtx && typeof document !== 'undefined') {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      colorCanvasCtx = c.getContext('2d');
    }
    if (colorCanvasCtx) {
      colorCanvasCtx.fillStyle = '#0f172a';
      colorCanvasCtx.fillStyle = colorStr;
      const converted = colorCanvasCtx.fillStyle;
      if (converted && !converted.includes('oklab') && !converted.includes('oklch')) {
        return converted;
      }
    }
  } catch {
    // fallback
  }
  return '#0f172a';
}

function createComputedStyleProxy(origFn: typeof window.getComputedStyle) {
  return function (el: Element, pseudo?: string | null): CSSStyleDeclaration {
    const style = origFn.call(window, el, pseudo);
    return new Proxy(style, {
      get(target, prop) {
        let value: any;
        try {
          // Access target[prop] directly without passing receiver
          // to avoid "TypeError: Illegal invocation" on native DOM accessors
          value = (target as any)[prop];
        } catch {
          return undefined;
        }

        if (typeof value === 'function') {
          if (prop === 'getPropertyValue') {
            return function (propName: string) {
              const raw = target.getPropertyValue(propName);
              if (raw && (raw.includes('oklab') || raw.includes('oklch'))) {
                return convertOklabToRgb(raw);
              }
              return raw;
            };
          }
          return value.bind(target);
        }

        if (typeof value === 'string' && (value.includes('oklab') || value.includes('oklch'))) {
          return convertOklabToRgb(value);
        }
        return value;
      },
    });
  };
}

export async function generateOfficialLetterPdf(
  elementId: string,
  data: ApplicantData,
  options?: GeneratePdfOptions
): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`Elemen dokumen #${elementId} tidak ditemukan.`);
  }

  // Find all individual pages (.official-letter-page)
  let pages = Array.from(container.querySelectorAll<HTMLElement>('.official-letter-page'));
  if (pages.length === 0) {
    pages = [container];
  }

  // Sanitize filename
  const cleanNumber = (data.nomorSurat || 'Surat').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanName = (data.namaLengkap || 'Pemohon').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = options?.filename || `${cleanNumber}_${cleanName}.pdf`;

  // Intercept window.getComputedStyle during generation
  const origGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = createComputedStyleProxy(origGetComputedStyle);

  // Initialize jsPDF with standard International A4 portrait (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  try {
    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];

      // Create an exact A4 off-screen rendering sandbox (794px x 1123px at 96 DPI)
      const renderSandbox = document.createElement('div');
      renderSandbox.style.position = 'fixed';
      renderSandbox.style.left = '-10000px';
      renderSandbox.style.top = '0';
      renderSandbox.style.width = '794px';
      renderSandbox.style.height = '1123px';
      renderSandbox.style.maxWidth = '794px';
      renderSandbox.style.minWidth = '794px';
      renderSandbox.style.maxHeight = '1123px';
      renderSandbox.style.minHeight = '1123px';
      renderSandbox.style.padding = '0';
      renderSandbox.style.margin = '0';
      renderSandbox.style.backgroundColor = '#ffffff';
      renderSandbox.style.overflow = 'visible';
      renderSandbox.style.zIndex = '-99999';

      // Clone page element into sandbox with strict A4 dimensions
      const pageClone = pageEl.cloneNode(true) as HTMLElement;
      pageClone.style.width = '794px';
      pageClone.style.maxWidth = '794px';
      pageClone.style.minWidth = '794px';
      pageClone.style.height = '1123px';
      pageClone.style.maxHeight = '1123px';
      pageClone.style.minHeight = '1123px';
      pageClone.style.boxSizing = 'border-box';
      pageClone.style.padding = '2.0cm 2.5cm 2.0cm 2.5cm';
      pageClone.style.margin = '0';
      pageClone.style.border = 'none';
      pageClone.style.boxShadow = 'none';
      pageClone.style.backgroundColor = '#ffffff';
      pageClone.style.color = '#0f172a';
      pageClone.style.fontFamily = '"Times New Roman", Times, "Liberation Serif", serif';
      pageClone.style.overflow = 'visible';

      // Ensure no text hyphenation cuts words awkwardly and preserve explicit colors
      const allTextElements = pageClone.querySelectorAll<HTMLElement>('*');
      allTextElements.forEach((el) => {
        el.style.hyphens = 'none';
        (el.style as any).webkitHyphens = 'none';
        el.style.wordBreak = 'normal';
        el.style.overflowWrap = 'normal';
      });

      // Explicitly color the specific tagline and link classes only
      pageClone.querySelectorAll<HTMLElement>('.text-kop-tagline').forEach((el) => {
        el.style.color = '#065f46';
      });
      pageClone.querySelectorAll<HTMLElement>('.text-kop-link').forEach((el) => {
        el.style.color = '#1d4ed8';
        el.style.textDecoration = 'underline';
      });

      // Remove any preview borders or shadows from clone
      pageClone.classList.remove('border', 'border-slate-300', 'shadow-sm', 'shadow-md', 'rounded-2xl', 'rounded-xl');

      renderSandbox.appendChild(pageClone);
      document.body.appendChild(renderSandbox);

      // Render high-res canvas at scale: 2 (300 DPI print quality)
      const canvas = await html2canvas(pageClone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        onclone: (clonedDoc) => {
          if (clonedDoc.defaultView) {
            clonedDoc.defaultView.getComputedStyle = createComputedStyleProxy(
              clonedDoc.defaultView.getComputedStyle
            );
          }

          // Reinforce colors on cloned document
          clonedDoc.querySelectorAll<HTMLElement>('.text-kop-tagline').forEach((el) => {
            el.style.color = '#0d5526';
          });
          clonedDoc.querySelectorAll<HTMLElement>('.text-kop-link').forEach((el) => {
            el.style.color = '#1d4ed8';
            el.style.textDecoration = 'underline';
          });

          // Sanitize any remaining oklab/oklch colors in stylesheets
          try {
            const styleTags = clonedDoc.querySelectorAll('style');
            styleTags.forEach((tag) => {
              if (tag.textContent && (tag.textContent.includes('oklab') || tag.textContent.includes('oklch'))) {
                tag.textContent = tag.textContent
                  .replace(/oklab\([^)]+\)/gi, '#0f172a')
                  .replace(/oklch\([^)]+\)/gi, '#0f172a');
              }
            });
          } catch {
            // ignore
          }
        },
      });

      // Cleanup sandbox from document body
      if (document.body.contains(renderSandbox)) {
        document.body.removeChild(renderSandbox);
      }

      // Add page to PDF (210mm x 297mm)
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    // Trigger download reliably via Blob URL
    const pdfBlob = pdf.output('blob');
    if (pdfBlob && pdfBlob.size > 0) {
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        try {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(blobUrl);
        } catch {
          // ignore
        }
      }, 2000);
    } else {
      // Direct save fallback
      pdf.save(filename);
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    window.getComputedStyle = origGetComputedStyle;
  }
}

/**
 * Print fallback that works safely across iframes
 */
export function printLetterDocument(): void {
  try {
    window.print();
  } catch (err) {
    console.warn('Standard window.print() failed:', err);
  }
}
