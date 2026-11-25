import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Draft } from '../../../types';

interface DraftCardProps {
  draft: Draft;
  onDelete: (id: string) => void;
  onView: (draft: Draft) => void;
}

export default function DraftCard({ draft, onDelete, onView }: DraftCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    if (window.confirm(`Are you sure you want to delete draft ${draft.draft_number}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(draft.id);
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
    <div className="invoice-card" onClick={() => onView(draft)} style={{ cursor: 'pointer' }}>
      <div className="invoice-header">
        <div className="invoice-number">{draft.draft_number}</div>
        <span className="status-badge" style={{ color: 'var(--medium-gray)', background: 'rgba(148, 163, 184, 0.1)' }}>
          Draft
        </span>
      </div>
      
      <div className="invoice-client">{draft.client_name || 'No Client'}</div>
      
      <div className="invoice-details">
        <div className="detail-item">
          <span className="detail-label">Amount</span>
          <span className="detail-value">{formatCurrency(draft.amount, draft.currency)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Created</span>
          <span className="detail-value">{formatDate(draft.created_at)}</span>
        </div>
      </div>

      <div className="invoice-actions" onClick={(e) => e.stopPropagation()}>
        <button 
          className="action-btn view" 
          onClick={() => onView(draft)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </button>
        <button 
          className="action-btn delete" 
          onClick={handleDelete} 
          disabled={isDeleting}
          aria-label="Delete draft"
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