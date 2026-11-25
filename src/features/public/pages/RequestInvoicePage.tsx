import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyShareToken, submitInvoiceRequest } from '../services/publicService';
import { ShareContext, InvoiceRequestItem, InvoiceRequestData } from '../../../types';

export default function RequestInvoicePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [context, setContext] = useState<ShareContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceRequestItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 }
  ]);

  useEffect(() => {
    // Initialize particles
    const container = document.getElementById('particles');
    if (container) {
      const count = window.innerWidth > 768 ? 15 : 8;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
          width: ${Math.random() * 6 + 2}px;
          height: ${Math.random() * 6 + 2}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation-duration: ${Math.random() * 10 + 15}s;
          animation-delay: ${Math.random() * 5}s;
          opacity: ${Math.random() * 0.5 + 0.1};
        `;
        container.appendChild(p);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing invitation link.');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const data = await verifyShareToken(token);
        if (!data.is_valid) {
          setError('This invitation link has expired or is invalid.');
        } else {
          setContext(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to verify link.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceRequestItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    return `${context?.currency_symbol || '$'}${amount.toFixed(2)}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (items.some(item => !item.description || item.quantity <= 0 || item.unit_price < 0)) {
      alert('Please ensure all items have a description, quantity > 0, and price >= 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: InvoiceRequestData = {
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone || undefined,
        client_address: clientAddress || undefined,
        items,
        tax_rate: taxRate,
        notes: notes || undefined,
      };

      await submitInvoiceRequest(token, payload);
      setShowSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit invoice request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="public-page-container loading-state">
        <div className="spinner-large"></div>
        <p>Verifying invitation...</p>
      </div>
    );
  }

  if (error || !context) {
    return (
      <div className="public-page-container error-state">
        <div className="error-icon-large">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2>Link Invalid</h2>
        <p>{error || 'This invitation link is no longer valid.'}</p>
        <button className="btn primary" onClick={() => navigate('/')}>Go to Homepage</button>
      </div>
    );
  }

  return (
    <div className="public-page-container">
      <div className="particles" id="particles"></div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-card">
            <div className="welcome-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h1>Welcome to Business Essentials Prime</h1>
            <p className="welcome-subtitle">You've been invited to request an invoice.</p>
            
            <div className="welcome-info">
              <div className="info-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Requested by: <strong>{context.creator_name}</strong></span>
              </div>
              <div className="info-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Secure, fast, and professional invoicing.</span>
              </div>
            </div>

            <p className="welcome-desc">
              Please review the details below and fill in your billing information to generate your invoice request. 
              Once submitted, it will be sent directly for approval.
            </p>

            <button className="btn primary large-btn" onClick={() => setShowWelcome(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Invoice
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`main-container ${showWelcome ? 'blurred' : ''}`}>
        <header className="page-header">
          <div className="header-content">
            <h1>Invoice Request</h1>
            <p>Fill in your details to request an invoice from <strong>{context.creator_name}</strong></p>
          </div>
          <div className="header-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Secure Link</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="invoice-form">
          {/* Client Details */}
          <div className="form-section">
            <h2 className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Your Billing Details
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name / Company Name *</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  required 
                  placeholder="e.g., John Doe or Acme Corp" 
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  value={clientEmail} 
                  onChange={(e) => setClientEmail(e.target.value)} 
                  required 
                  placeholder="you@example.com" 
                />
              </div>
              <div className="form-group">
                <label>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  value={clientPhone} 
                  onChange={(e) => setClientPhone(e.target.value)} 
                  placeholder="+1 (555) 123-4567" 
                />
              </div>
              <div className="form-group">
                <label>Billing Address (Optional)</label>
                <input 
                  type="text" 
                  value={clientAddress} 
                  onChange={(e) => setClientAddress(e.target.value)} 
                  placeholder="123 Business St, City, Country" 
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="form-section">
            <div className="section-header-row">
              <h2 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                Invoice Items
              </h2>
              <button type="button" className="btn secondary small-btn" onClick={addItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Item
              </button>
            </div>
            
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Description</th>
                    <th style={{ width: '15%' }}>Qty</th>
                    <th style={{ width: '20%' }}>Price ({context.currency_symbol})</th>
                    <th style={{ width: '15%' }}>Total</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input 
                          type="text" 
                          value={item.description} 
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                          required 
                          placeholder="Item description" 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} 
                          required 
                          min="1" 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={item.unit_price} 
                          onChange={(e) => updateItem(item.id, 'unit_price', Number(e.target.value))} 
                          required 
                          min="0" 
                          step="0.01" 
                        />
                      </td>
                      <td className="text-right">
                        {formatCurrency(item.quantity * item.unit_price)}
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="icon-btn-sm danger" 
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="form-section totals-section">
            <div className="totals-wrapper">
              <div className="notes-area">
                <label>Additional Notes (Optional)</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  rows={4} 
                  placeholder="Any specific instructions, PO number, or project details..." 
                />
              </div>
              <div className="calculation-area">
                <div className="calc-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="calc-row">
                  <span>Tax (%)</span>
                  <input 
                    type="number" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(Number(e.target.value))} 
                    min="0" 
                    max="100" 
                    step="0.01" 
                  />
                </div>
                <div className="calc-row total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="form-actions">
            <button type="submit" className="btn primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                'Submit Invoice Request'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Request Submitted Successfully!</h2>
            <p>Your invoice request has been sent to <strong>{context.creator_name}</strong>. You will receive a confirmation email shortly.</p>
            <button className="btn primary" onClick={() => navigate('/')}>Return to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}