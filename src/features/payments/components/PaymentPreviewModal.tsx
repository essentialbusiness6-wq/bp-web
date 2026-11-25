import { Payment } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface PaymentPreviewModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentPreviewModal({ payment, isOpen, onClose }: PaymentPreviewModalProps) {
  const navigate = useNavigate();
  if (!isOpen || !payment) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const statusColors: Record<string, string> = {
    paid: 'var(--success)',
    pending: 'var(--warning)',
    overdue: 'var(--danger)',
    failed: 'var(--gray)',
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card payment-preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} aria-label="Close">&times;</button>
        
        <div className="modal-icon" style={{ background: `${statusColors[payment.status]}20`, color: statusColors[payment.status] }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
        </div>
        
        <h2>Payment Details</h2>
        
        <div className="preview-details-grid">
          <div className="preview-item">
            <span className="preview-label">Invoice</span>
            <span className="preview-value">{payment.invoice_number}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Client</span>
            <span className="preview-value">{payment.client_name}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Date</span>
            <span className="preview-value">{formatDate(payment.date)}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Amount</span>
            <span className="preview-value">{formatCurrency(payment.amount, payment.currency)}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Status</span>
            <span className="preview-value" style={{ color: statusColors[payment.status], textTransform: 'capitalize' }}>
              {payment.status}
            </span>
          </div>
          {payment.payment_method && (
            <div className="preview-item">
              <span className="preview-label">Method</span>
              <span className="preview-value">{payment.payment_method}</span>
            </div>
          )}
          {payment.transaction_reference && (
            <div className="preview-item" style={{ gridColumn: '1 / -1' }}>
              <span className="preview-label">Transaction Reference</span>
              <span className="preview-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {payment.transaction_reference}
              </span>
            </div>
          )}
        </div>

        <div className="modal-buttons">
          <button className="btn secondary" onClick={onClose}>Close</button>
          <button 
            className="btn primary" 
            onClick={() => { onClose(); navigate(`/dashboard/invoices/${payment.invoice_id}`); }}
          >
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
}