import React from 'react';
import { ExportFormat } from '../export/invoiceExportService';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
  isGenerating: boolean;
  statusMessage: string;
  error: string | null;
}

const InvoiceExportDialog: React.FC<DialogProps> = ({ isOpen, onClose, onExport, isGenerating, statusMessage, error }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" style={{ zIndex: 1000 }} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <button className="close-modal" onClick={onClose}>&times;</button>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(67, 97, 238, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <h2 style={{ margin: 0 }}>Export Invoice</h2>
          <p style={{ color: '#64748b', margin: '8px 0 0' }}>Choose your preferred format</p>
        </div>

        {error && <div className="form-error-alert" style={{ marginBottom: '16px' }}>{error}</div>}
        {isGenerating && <div style={{ textAlign: 'center', color: '#4361ee', marginBottom: '16px', fontSize: '14px' }}>{statusMessage}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn primary" 
            disabled={isGenerating} 
            onClick={() => onExport('pdf')}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>📄 Download PDF Only</span>
          </button>
          
          <button 
            className="btn secondary" 
            disabled={isGenerating} 
            onClick={() => onExport('png')}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>🖼️ Download Image (PNG)</span>
          </button>
          
          <button 
            className="btn primary" 
            disabled={isGenerating} 
            onClick={() => onExport('both')}
            style={{ width: '100%', justifyContent: 'space-between', background: '#1e293b' }}
          >
            <span>📦 Download Both (PDF + PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceExportDialog;
