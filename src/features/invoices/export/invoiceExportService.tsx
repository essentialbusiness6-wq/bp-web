import { pdf } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import InvoicePDFDocument from './InvoicePDFDocument';
import { Invoice } from '../../../types';
import { downloadBlob, shareFiles } from './invoiceExportUtils';

export type ExportFormat = 'pdf' | 'png' | 'both';

export const generatePDFBlob = async (invoice: Invoice, profile: any): Promise<Blob> => {
  return await pdf(<InvoicePDFDocument invoice={invoice} profile={profile} />).toBlob();
};

// export const generatePNGBlob = async (containerRef: React.RefObject<HTMLDivElement | null>): Promise<Blob | null> => {
//   if (!containerRef.current) return null;
//   // High scale for crisp text
//   return await toPng(containerRef.current, { 
//     cacheBust: true, 
//     pixelRatio: 3, 
//     backgroundColor: '#ffffff' 
//   }).then(dataUrl => {
//     const byteString = atob(dataUrl.split(',')[1]);
//     const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   });


export const generatePNGBlob = async (containerRef: React.RefObject<HTMLDivElement | null>): Promise<Blob | null> => {
  if (!containerRef.current) return null;
  
  return await toPng(containerRef.current, { 
    cacheBust: true, 
    pixelRatio: 3, 
    backgroundColor: '#ffffff',
    
    // ✅ FIX: Skip external stylesheets (like Google Fonts) to avoid CORS errors
    filter: (node) => {
      // Skip <link> tags that load external stylesheets
      if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
        return false;
      }
      return true;
    },
    
    // ✅ FIX: Don't try to inline external fonts
    fontEmbedCSS: '',
    
    // ✅ FIX: Skip images that might cause CORS issues
    imagePlaceholder: undefined,
  }).then(dataUrl => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  });
};



export const handleExport = async (
  format: ExportFormat, 
  invoice: Invoice, 
  profile: any, 
  imageContainerRef: React.RefObject<HTMLDivElement | null>,
  onStatusChange: (msg: string) => void
) => {
  const filenameBase = `BEP-Invoice-${invoice.invoice_number}`;
  const filesToShare: File[] = [];

  try {
    if (format === 'pdf' || format === 'both') {
      onStatusChange('Generating PDF...');
      const pdfBlob = await generatePDFBlob(invoice, profile);
      const pdfFile = new File([pdfBlob], `${filenameBase}.pdf`, { type: 'application/pdf' });
      filesToShare.push(pdfFile);
      downloadBlob(pdfBlob, `${filenameBase}.pdf`);
    }

    if (format === 'png' || format === 'both') {
      onStatusChange('Generating High-Res Image...');
      const pngBlob = await generatePNGBlob(imageContainerRef);
      if (pngBlob) {
        const pngFile = new File([pngBlob], `${filenameBase}.png`, { type: 'image/png' });
        filesToShare.push(pngFile);
        downloadBlob(pngBlob, `${filenameBase}.png`);
      }
    }

    // Attempt native share if available and supported
    if (filesToShare.length > 0) {
      await shareFiles(filesToShare, `Invoice ${invoice.invoice_number}`, 'Please find attached invoice.');
    }
    
    onStatusChange('Export successful!');
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to generate export files. Please try again.');
  }
};
