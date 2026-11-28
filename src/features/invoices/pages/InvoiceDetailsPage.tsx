import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getInvoiceDetails, shareInvoice } from '../services/invoiceService';
import { getProfile } from '../../profile/services/profileService'; 
import { Invoice } from '../../../types';
import InvoiceExportDialog from '../components/InvoiceExportDialog';
import InvoiceImageDocument from '../export/InvoiceImageDocument';
import { handleExport, ExportFormat } from '../export/invoiceExportService';

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  
  // Export State
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (invoiceId) {
      Promise.all([getInvoiceDetails(invoiceId!), getProfile()])
        .then(([invData, profData]) => {
          setInvoice(invData);
          setUserProfile(profData);
        })
        .catch(err => console.error('Failed to fetch data', err))
        .finally(() => setLoading(false));
    }
  }, [invoiceId]);

  // --- Export Handlers ---
  const handleDownloadClick = () => {
    setExportError(null);
    setExportStatus('');
    setIsExportDialogOpen(true);
  };

  const handleExportRequest = async (format: ExportFormat) => {
    if (!invoice || !userProfile) return;
    setIsGenerating(true);
    setExportError(null);
    
    try {
      await handleExport(format, invoice, userProfile, imageContainerRef, setExportStatus);
      setTimeout(() => setIsExportDialogOpen(false), 1500);
    } catch (err: any) {
      setExportError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Utility Functions ---
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!invoice) return;
    setIsSharing(true);
    try {
      await shareInvoice(invoice.id);
      const shareUrl = `${window.location.origin}/pay/${invoice.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Invoice ${invoice.invoice_number}`,
          text: `Please find attached invoice ${invoice.invoice_number} for ${formatCurrency(invoice.total_amount, invoice.currency)}.`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Invoice link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share', error);
      alert('Failed to share invoice.');
    } finally {
      setIsSharing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number | undefined, currency: string) => {
    const safeAmount = typeof amount === 'number' ? amount : 0;
    const safeCurrency = currency || 'NGN';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: safeCurrency }).format(safeAmount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'var(--success)';
      case 'pending': return 'var(--warning)';
      case 'overdue': return 'var(--danger)';
      case 'draft': return 'var(--gray)';
      default: return 'var(--text-secondary)';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="settings-loading">
          <div className="skeleton" style={{ width: '100%', height: '800px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!invoice) {
    return (
      <DashboardLayout>
        <div className="empty-state">
          <h2>Invoice Not Found</h2>
          <button className="btn primary" onClick={() => navigate('/dashboard/invoices')}>Back to Invoices</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Invoice ${invoice.invoice_number}`}>
      <div className="invoice-details-page no-print-sidebar">
        
        {/* Action Header */}
        <div className="invoice-actions-header no-print">
          <button className="icon-btn" onClick={() => navigate('/dashboard/invoices')} aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <h1>Invoice Details</h1>
          <div className="header-actions">
            <button className="icon-btn" onClick={handlePrint} aria-label="Print" title="Print">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
            </button>
            
            {/* Export Button - Opens the format selection dialog */}
            <button className="icon-btn" onClick={handleDownloadClick} aria-label="Export Invoice" title="Export Invoice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </button>

            <button className="icon-btn" onClick={handleShare} disabled={isSharing} aria-label="Share" title="Share">
              {isSharing ? (
                <span className="spinner-small" style={{ width: '16px', height: '16px' }}></span>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ==================== VISIBLE INVOICE DOCUMENT ==================== */}
        <div className="invoice-document" id="invoice-to-print">
          <div className="watermark">INVOICE</div>
          
          <div className="invoice-header-content">
            <div className="company-info">
              <div className="company-logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div className="company-name">Powered by Business Essentials Prime</div>
              </div>
            </div>
            
            <div className="invoice-meta">
              <div className="invoice-title">TAX INVOICE</div>
              <div className="invoice-number">#{invoice.invoice_number}</div>
              
              <div className="meta-row">
                <div className="meta-label">Invoice Date</div>
                <div className="meta-value">{formatDate(invoice.invoice_date)}</div>
              </div>
              <div className="meta-row">
                <div className="meta-label">Due Date</div>
                <div className="meta-value">{formatDate(invoice.due_date)}</div>
              </div>
              
              <div className="status-badge" style={{ background: `${getStatusColor(invoice.status)}20`, color: getStatusColor(invoice.status) }}>
                {invoice.status.toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="invoice-details-grid">
            <div className="detail-section">
              <h3>BILLED FROM</h3>
              <div className="detail-content">
                <strong>{userProfile?.full_name || userProfile?.display_name || 'Your Business Name'}</strong><br/>
                <span>{userProfile?.email || 'N/A'}</span><br/>
                <span>{userProfile?.phone || 'N/A'}</span><br/>
                <span>{userProfile?.address || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>BILLED TO</h3>
              <div className="detail-content">
                <strong>{invoice.client_name}</strong><br/>
                <span>{invoice.client_email}</span><br/>
                <span>{invoice.client_address || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>INVOICE DETAILS</h3>
              <div className="detail-content">
                <div className="detail-row">
                  <span className="detail-label">Invoice Number</span>
                  <span className="detail-value">{invoice.invoice_number}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Terms</span>
                  <span className="detail-value">Net 30</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="invoice-items-section">
            <table className="items-table">
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th className="text-right">QTY</th>
                  <th className="text-right">UNIT PRICE</th>
                  <th className="text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td>{item.description}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{formatCurrency(item.unit_price, invoice.currency)}</td>
                    <td className="text-right">{formatCurrency(item.total, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="total-section">
              <div className="total-row">
                <span className="label">Subtotal</span>
                <span className="value">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="total-row">
                  <span className="label">Tax ({invoice.tax_rate}%)</span>
                  <span className="value">{formatCurrency(invoice.tax_amount || 0, invoice.currency)}</span>
                </div>
              )}
              <div className="total-row grand-total">
                <span className="label">TOTAL</span>
                <span className="value">{formatCurrency(invoice.total_amount, invoice.currency)}</span>
              </div>
              {invoice.amount_paid > 0 && (
                <div className="total-row">
                  <span className="label">Amount Paid</span>
                  <span className="value" style={{ color: 'var(--success)' }}>- {formatCurrency(invoice.amount_paid, invoice.currency)}</span>
                </div>
              )}
              {invoice.balance > 0 && (
                <div className="total-row balance-due">
                  <span className="label">BALANCE DUE</span>
                  <span className="value">{formatCurrency(invoice.balance, invoice.currency)}</span>
                </div>
              )}
            </div>
          </div>
          
          {invoice.notes && (
            <div className="invoice-footer">
              <div className="footer-section">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Notes
                </h3>
                <div className="footer-content">
                  <p>{invoice.notes}</p>
                </div>
              </div>
            </div>
          )}

          <div className="thank-you-banner">
            Thank you for your business!
          </div>
        </div>

        {/* ==================== HIDDEN CONTAINER FOR PNG GENERATION ==================== */}
        {/* This renders a dedicated, high-resolution invoice layout off-screen for html-to-image to capture */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0, opacity: 0, pointerEvents: 'none', width: '800px' }}>
          {invoice && userProfile && (
            <InvoiceImageDocument ref={imageContainerRef} invoice={invoice} profile={userProfile} />
          )}
        </div>

        {/* ==================== EXPORT FORMAT DIALOG ==================== */}
        <InvoiceExportDialog 
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          onExport={handleExportRequest}
          isGenerating={isGenerating}
          statusMessage={exportStatus}
          error={exportError}
        />
      </div>
    </DashboardLayout>
  );
}
