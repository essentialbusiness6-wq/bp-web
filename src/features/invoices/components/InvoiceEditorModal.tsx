import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Invoice } from '../../../types';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface InvoiceFormData {
  client_name: string;
  client_email: string;
  issue_date: string;
  due_date: string;
  items: InvoiceLineItem[];
  tax_rate: number;
  discount: number;
  notes: string;
  status: 'draft' | 'pending';
}

interface InvoiceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvoiceFormData, isDraft: boolean) => Promise<void>;
  initialData?: Partial<Invoice> & { client_email?: string; items?: InvoiceLineItem[]; notes?: string };
  mode: 'create' | 'edit_invoice' | 'edit_draft';
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function InvoiceEditorModal({ isOpen, onClose, onSave, initialData, mode }: InvoiceEditorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<InvoiceFormData>({
    client_name: '',
    client_email: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: generateId(), description: '', quantity: 1, unit_price: 0, total: 0 }],
    tax_rate: 0,
    discount: 0,
    notes: 'Thank you for your business!',
    status: 'pending',
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        client_name: initialData.client_name || '',
        client_email: initialData.client_email || '',
        issue_date: initialData.created_at ? initialData.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        due_date: initialData.due_date ? initialData.due_date.split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: initialData.items && initialData.items.length > 0 
          ? initialData.items.map(item => ({ ...item, id: item.id || generateId() }))
          : [{ id: generateId(), description: '', quantity: 1, unit_price: 0, total: 0 }],
        tax_rate: 0, // Backend should provide this if saved
        discount: 0,
        notes: initialData.notes || 'Thank you for your business!',
        status: initialData.status === 'draft' ? 'draft' : 'pending',
      });
    } else if (!initialData && isOpen) {
      // Reset for new creation
      setFormData({
        client_name: '', client_email: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ id: generateId(), description: '', quantity: 1, unit_price: 0, total: 0 }],
        tax_rate: 0, discount: 0, notes: 'Thank you for your business!', status: 'pending',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setFormData(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unit_price);
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: generateId(), description: '', quantity: 1, unit_price: 0, total: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  // Frontend calculations for UX (Backend will authoritatively recalculate)
  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (Number(formData.tax_rate) / 100);
  const discountAmount = Number(formData.discount);
  const grandTotal = subtotal + taxAmount - discountAmount;

  const handleSubmit = async (isDraft: boolean) => {
    if (formData.items.some(item => !item.description || item.quantity <= 0 || item.unit_price < 0)) {
      alert('Please fill in all line item descriptions, quantities, and prices.');
      return;
    }
    if (!formData.client_name) {
      alert('Please enter a client name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ ...formData, status: isDraft ? 'draft' : 'pending' }, isDraft);
      onClose();
    } catch (error) {
      console.error('Failed to save invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isDraftMode = mode === 'edit_draft' || mode === 'create';

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="invoice-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <h2>{mode === 'create' ? 'Create New Invoice' : mode === 'edit_draft' ? 'Edit Draft' : 'Edit Invoice'}</h2>
          <button className="close-modal" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="editor-body">
          {/* Client & Dates */}
          <div className="editor-grid-2">
            <div className="form-group">
              <label>Client Name</label>
              <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Acme Corp" required />
            </div>
            <div className="form-group">
              <label>Client Email</label>
              <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} placeholder="billing@acme.com" />
            </div>
            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required />
            </div>
          </div>

          {/* Line Items */}
          <div className="line-items-section">
            <h3>Line Items</h3>
            <div className="line-items-table-wrapper">
              <table className="line-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style={{ width: '80px' }}>Qty</th>
                    <th style={{ width: '120px' }}>Price</th>
                    <th style={{ width: '120px' }}>Total</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input 
                          type="text" 
                          value={item.description} 
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} 
                          placeholder="Web design services" 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={item.unit_price} 
                          onChange={(e) => handleItemChange(item.id, 'unit_price', Number(e.target.value))} 
                        />
                      </td>
                      <td className="item-total">
                        {item.total.toFixed(2)}
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="remove-item-btn" 
                          onClick={() => removeItem(item.id)} 
                          disabled={formData.items.length === 1}
                          aria-label="Remove item"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="add-item-btn" onClick={addItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Line Item
            </button>
          </div>

          {/* Summary & Notes */}
          <div className="editor-grid-2 summary-notes-grid">
            <div className="form-group">
              <label>Notes / Payment Instructions</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={5} placeholder="Bank details, thank you message, etc." />
            </div>
            <div className="summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (%)</span>
                <input type="number" name="tax_rate" min="0" max="100" step="0.1" value={formData.tax_rate} onChange={handleChange} style={{ width: '60px', textAlign: 'right', padding: '4px 8px' }} />
              </div>
              <div className="summary-row">
                <span>Tax Amount</span>
                <span>{taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <input type="number" name="discount" min="0" step="0.01" value={formData.discount} onChange={handleChange} style={{ width: '80px', textAlign: 'right', padding: '4px 8px' }} />
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="editor-footer">
          <button type="button" className="btn secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <div className="footer-actions">
            {isDraftMode && (
              <button type="button" className="btn secondary" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
            )}
            <button type="button" className="btn primary" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : (mode === 'edit_invoice' ? 'Update Invoice' : 'Send Invoice')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}