import { Client } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface ClientPreviewModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClientPreviewModal({ client, isOpen, onClose, onEdit, onDelete }: ClientPreviewModalProps) {
  const navigate = useNavigate();
  if (!isOpen || !client) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card client-preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} aria-label="Close">&times;</button>
        
        <div className="preview-header">
          <div className="preview-avatar">
            {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2>{client.name}</h2>
            <span className={`status-badge ${client.status}`}>{client.status}</span>
          </div>
        </div>

        <div className="preview-details-grid">
          <div className="preview-item">
            <span className="preview-label">Email</span>
            <span className="preview-value">{client.email}</span>
          </div>
          {client.phone && (
            <div className="preview-item">
              <span className="preview-label">Phone</span>
              <span className="preview-value">{client.phone}</span>
            </div>
          )}
          {client.company && (
            <div className="preview-item">
              <span className="preview-label">Company</span>
              <span className="preview-value">{client.company}</span>
            </div>
          )}
          <div className="preview-item">
            <span className="preview-label">Total Invoices</span>
            <span className="preview-value">{client.total_invoices}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Outstanding Balance</span>
            <span className="preview-value" style={{ color: client.outstanding_balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {formatCurrency(client.outstanding_balance, client.currency)}
            </span>
          </div>
        </div>

        {client.notes && (
          <div className="preview-notes">
            <h4>Notes</h4>
            <p>{client.notes}</p>
          </div>
        )}

        <div className="modal-buttons preview-actions">
          <button className="btn danger-outline" onClick={() => { onDelete(); onClose(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
          <button className="btn secondary" onClick={onEdit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Edit
          </button>
          <button className="btn primary" onClick={() => { onClose(); navigate(`/dashboard/invoices/new?clientId=${client.id}`); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}