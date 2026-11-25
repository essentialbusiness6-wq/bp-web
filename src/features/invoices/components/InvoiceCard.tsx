import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Invoice } from '../../../types';

interface InvoiceCardProps {
  invoice: Invoice;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: 'Paid', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' },
  pending: { label: 'Pending', color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' },
  unpaid: { label: 'Unpaid', color: 'var(--gray)', bg: 'rgba(100, 116, 139, 0.1)' },
  overdue: { label: 'Overdue', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' },
  draft: { label: 'Draft', color: 'var(--medium-gray)', bg: 'rgba(148, 163, 184, 0.1)' },
};

export default function InvoiceCard({ invoice, onDelete }: InvoiceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const config = statusConfig[invoice.status] || statusConfig.unpaid;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoice_number}? This cannot be undone.`)) {
      setIsDeleting(true);
      try {
        await onDelete(invoice.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="invoice-card">
      <div className="invoice-header">
        <div className="invoice-number">{invoice.invoice_number}</div>
        <span className="status-badge" style={{ color: config.color, background: config.bg }}>
          {config.label}
        </span>
      </div>
      
      <div className="invoice-client">{invoice.client_name}</div>
      
      <div className="invoice-details">
        <div className="detail-item">
          <span className="detail-label">Amount</span>
          <span className="detail-value">{formatCurrency(invoice.amount, invoice.currency)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Due Date</span>
          <span className="detail-value">{formatDate(invoice.due_date)}</span>
        </div>
      </div>

      <div className="invoice-actions">
        <Link to={`/dashboard/invoices/${invoice.id}`} className="action-btn view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          View
        </Link>
        <button 
          className="action-btn delete" 
          onClick={handleDelete} 
          disabled={isDeleting}
          aria-label="Delete invoice"
        >
          {isDeleting ? (
            <span className="spinner-small"></span>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}