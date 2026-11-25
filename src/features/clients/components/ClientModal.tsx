import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Client, CreateClientData } from '../../../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateClientData) => Promise<void>;
  initialData?: Client | null;
  mode: 'add' | 'edit';
}

export default function ClientModal({ isOpen, onClose, onSave, initialData, mode }: ClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateClientData>({
    name: '', email: '', phone: '', company: '', notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone || '',
          company: initialData.company || '',
          notes: initialData.notes || '',
        });
      } else {
        setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: CreateClientData): CreateClientData => ({ ...prev, [e.target.name as keyof CreateClientData]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card client-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} aria-label="Close">&times;</button>
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h2>{mode === 'add' ? 'Add New Client' : 'Edit Client'}</h2>
        
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-group">
            <label htmlFor="clientName">Client Name *</label>
            <input type="text" id="clientName" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter client name" />
          </div>
          <div className="form-group">
            <label htmlFor="clientEmail">Email Address *</label>
            <input type="email" id="clientEmail" name="email" value={formData.email} onChange={handleChange} required placeholder="client@example.com" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientPhone">Phone Number</label>
              <input type="tel" id="clientPhone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label htmlFor="clientCompany">Company Name</label>
              <input type="text" id="clientCompany" name="company" value={formData.company} onChange={handleChange} placeholder="Company name" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="clientNotes">Notes</label>
            <textarea id="clientNotes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Additional notes about the client" />
          </div>
          
          <div className="modal-buttons">
            <button type="button" className="btn secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (mode === 'add' ? 'Add Client' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}