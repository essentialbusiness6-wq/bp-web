import { Invoice } from '../../../types';

// Format currency safely without floating-point errors
export const formatCurrency = (amount: number | undefined, currency: string): string => {
  const safeAmount = typeof amount === 'number' ? amount : 0;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency || 'NGN',
    minimumFractionDigits: 2
  }).format(safeAmount);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Trigger browser download
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Native Share API fallback
export const shareFiles = async (files: File[], title: string, text: string) => {
  if (navigator.share && navigator.canShare({ files })) {
    await navigator.share({ files, title, text });
    return true;
  }
  return false;
};
