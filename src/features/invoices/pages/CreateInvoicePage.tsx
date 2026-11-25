import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { createInvoice } from '../services/invoiceService';
import { getSettings } from '../../settings/services/settingsService';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');

  const [loadingDefaults, setLoadingDefaults] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [taxRate, setTaxRate] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [notes, setNotes] = useState('Thank you for your business! Payment is due within 30 days.');
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 }
  ]);

  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const settings = await getSettings();
        setCurrency(settings.currency || 'NGN');
        setTaxRate(settings.default_tax_rate || 0);
        if (settings.footer_note) setNotes(settings.footer_note);
        
        const today = new Date();
        const due = new Date();
        due.setDate(today.getDate() + (settings.default_due_date || 30));
        
        setInvoiceDate(today.toISOString().split('T')[0]);
        setDueDate(due.toISOString().split('T')[0]);
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setLoadingDefaults(false);
      }
    };
    fetchDefaults();
  }, []);

  // Real-time Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const balance = total - amountPaid;

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const handleSubmit = async (e: FormEvent, status: 'draft' | 'pending') => {
    e.preventDefault();
    
    if (!clientName || !clientEmail) {
      alert('Please enter client name and email.');
      return;
    }
    if (items.some(item => !item.description || item.quantity <= 0 || item.unit_price < 0)) {
      alert('Please ensure all items have a description, quantity > 0, and price >= 0.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        client_name: clientName,
        client_email: clientEmail,
        invoice_date: invoiceDate,
        due_date: dueDate,
        currency,
        items,
        tax_rate: taxRate,
        amount_paid: amountPaid,
        notes,
        status,
        ...(draftId ? { draft_id: draftId } : {}),
      };

      await createInvoice(payload);
      navigate(status === 'draft' ? '/dashboard/drafts' : '/dashboard/invoices');
    } catch (error: any) {
      alert(error.message || 'Failed to save invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDefaults) {
    return (
      <DashboardLayout>
        <div className="settings-loading">
          <div className="skeleton" style={{ width: '100%', height: '600px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Invoice">
      <div className="create-invoice-container">
        <div className="page-header-actions">
          <button className="btn secondary" onClick={() => navigate('/dashboard/invoices')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Back to Invoices
          </button>
        </div>

        <form className="invoice-form" onSubmit={(e) => e.preventDefault()}>
          
          {/* Client & Dates */}
          <div className="form-section">
            <h3>Client & Dates</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name *</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Client Email *</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@example.com" required />
              </div>
              <div className="form-group">
                <label>Invoice Date *</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="NGN">₦ NGN</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="form-section">
            <h3>Invoice Items</h3>
            <div className="items-header">
              <span className="col-desc">Description</span>
              <span className="col-qty">Qty</span>
              <span className="col-price">Price</span>
              <span className="col-total">Total</span>
              <span className="col-action"></span>
            </div>
            {items.map((item) => (
              <div key={item.id} className="item-row">
                <input 
                  type="text" 
                  className="col-desc" 
                  placeholder="Item description" 
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                  required 
                />
                <input 
                  type="number" 
                  className="col-qty" 
                  placeholder="Qty" 
                  min="1" 
                  value={item.quantity} 
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} 
                  required 
                />
                <input 
                  type="number" 
                  className="col-price" 
                  placeholder="Price" 
                  min="0" 
                  step="0.01" 
                  value={item.unit_price} 
                  onChange={(e) => updateItem(item.id, 'unit_price', Number(e.target.value))} 
                  required 
                />
                <div className="col-total item-total">
                  {formatCurrency(item.quantity * item.unit_price)}
                </div>
                <button 
                  type="button" 
                  className="col-action remove-item-btn" 
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  aria-label="Remove item"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
            <button type="button" className="add-item-btn" onClick={addItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Item
            </button>
          </div>

          {/* Summary & Payments */}
          <div className="form-section summary-section">
            <div className="summary-grid">
              <div className="notes-group">
                <label>Notes</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Optional notes..." 
                  rows={4} 
                />
              </div>
              <div className="calculations-group">
                <div className="calc-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="calc-row">
                  <span>Tax Rate (%)</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.01" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(Number(e.target.value))} 
                  />
                </div>
                <div className="calc-row">
                  <span>Tax Amount</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="calc-row total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="calc-row">
                  <span>Amount Paid</span>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={amountPaid} 
                    onChange={(e) => setAmountPaid(Number(e.target.value))} 
                  />
                </div>
                <div className="calc-row balance">
                  <span>Balance Due</span>
                  <span>{formatCurrency(balance)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn secondary" 
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={submitting}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {submitting ? 'Saving...' : 'Save as Draft'}
            </button>
            <button 
              type="button" 
              className="btn primary" 
              onClick={(e) => handleSubmit(e, 'pending')}
              disabled={submitting}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {submitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}