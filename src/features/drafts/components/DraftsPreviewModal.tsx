import { Draft } from '../../../types';

interface DraftPreviewModalProps {
  draft: Draft | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onConvert: (id: string) => void;
}

export default function DraftPreviewModal({ 
  draft, isOpen, onClose, onEdit, onDelete, onConvert 
}: DraftPreviewModalProps) {
  if (!isOpen || !draft) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="invoice-paper" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} aria-label="Close modal">&times;</button>
        
        <div className="invoice-top">
          <div>
            <h2>Invoice Draft</h2>
            <p id="draft-number">{draft.draft_number}</p>
          </div>
        </div>
        
        <div className="status">
          <h3 style={{ color: 'var(--medium-gray)' }}>Draft</h3>
        </div>
        
        <div className="invoice-meta">
          <div>
            <h4>Billed To</h4>
            <p id="draft-client">{draft.client_name || 'Unknown Client'}</p>
            {draft.client_email && <p id="draft-email">{draft.client_email}</p>}
            {draft.client_address && <p>{draft.client_address}</p>}
          </div>
          <div>
            <p><strong>Date:</strong> <span id="draft-date">{formatDate(draft.date)}</span></p>
            <p><strong>Due:</strong> <span id="draft-due">{formatDate(draft.due_date)}</span></p>
            <p><strong>Draft #:</strong> <span id="draft-id">{draft.draft_number}</span></p>
          </div>
        </div>

        <table className="invoice-items">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="draft-items">
            {draft.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unit_price, draft.currency)}</td>
                <td>{formatCurrency(item.total, draft.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <p>Subtotal: <span id="draft-subtotal">{formatCurrency(draft.subtotal, draft.currency)}</span></p>
          <p>Tax: <span id="draft-tax">{formatCurrency(draft.tax, draft.currency)}</span></p>
          <h3>Total: <span id="draft-total">{formatCurrency(draft.amount, draft.currency)}</span></h3>
        </div>

        {draft.notes && (
          <p className="invoice-notes" id="draft-notes">{draft.notes}</p>
        )}



<div className="invoice-actions-modal">
  <button className="btn primary" onClick={() => onConvert(draft.id)}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Save as Invoice
  </button>
  
  {/* This button now opens the Editor Modal instead of navigating away */}
  <button className="btn secondary" onClick={() => onEdit(draft.id)}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
    Edit Draft
  </button>
  
  <button className="btn danger" onClick={() => onDelete(draft.id)}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
    Delete Draft
  </button>
</div>
      </div>
    </div>
  );
}

