import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicInvoice, verifyPublicPayment } from '../services/publicService';
import { PublicInvoice } from '../../../types';

export default function PayInvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack Script
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Fetch Invoice Data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!invoiceId) throw new Error('Invalid invoice link.');
        const data = await getPublicInvoice(invoiceId);
        
        if (data.status === 'paid') {
          navigate('/payment-already-paid');
          return;
        }
        
        setInvoice(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId, navigate]);

  // Particles Animation
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;
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
  }, []);

  const handlePay = () => {
    if (!window.PaystackPop || !invoice) return;

    setPaying(true);
    const amountInKobo = Math.round(invoice.balance * 100);

    const handler = window.PaystackPop.setup({
      key: (import.meta as ImportMeta & { env: { VITE_PAYSTACK_PUBLIC_KEY: string } }).env.VITE_PAYSTACK_PUBLIC_KEY,
      email: invoice.client_email,
      amount: amountInKobo,
      currency: invoice.currency || 'NGN',
      subaccount: invoice.subaccount_code,
      metadata: {
        invoice_id: invoice.id,
        client_name: invoice.client_name
      },
      callback: async (response: any) => {
        try {
          showToast('Verifying payment...', 'info');
          const result = await verifyPublicPayment({
            reference: response.reference,
            invoice_id: invoice.id,
            client_name: invoice.client_name
          });
          
          if (result.success) {
            showToast('Payment successful!', 'success');
            setTimeout(() => {
              // Redirect to a public success page or back to the invoice (which will now show as paid)
              window.location.href = `/pay/${invoice.id}/success`; 
            }, 1500);
          } else {
            throw new Error(result.message || 'Verification failed');
          }
        } catch (err: any) {
          showToast(err.message || 'Payment verification failed', 'error');
          setPaying(false);
        }
      },
      onClose: () => {
        showToast('Payment cancelled', 'warning');
        setPaying(false);
      }
    });

    handler.openIframe();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `${invoice?.currency_symbol || '₦'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    else if (type === 'error') icon = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    else if (type === 'warning') icon = '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    
    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  if (loading) {
    return (
      <div className="pay-invoice-page loading-state">
        <div className="spinner-large"></div>
        <p>Loading invoice details...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="pay-invoice-page error-state">
        <div className="error-icon-large">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h2>Invoice Not Found</h2>
        <p>{error || 'The invoice you are looking for does not exist or has been removed.'}</p>
        <button className="btn primary" onClick={() => navigate('/')}>Go to Homepage</button>
      </div>
    );
  }

  return (
    <div className="pay-invoice-page">
      <div className="particles" id="particles"></div>

      {/* Top Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <a href="/" className="logo">
            <img src="/static/media/app-logo.png" alt="Business Essentials Prime" />
            <span>Business Essentials Prime</span>
          </a>
          <span className="invoice-badge">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            {invoice.invoice_number}
          </span>
        </div>
        <div className="top-bar-right">
          <button className="icon-btn" title="Print Invoice" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Invoice Document */}
        <div className="invoice-document">
          <div className="invoice-header">
            <div className="invoice-brand">
              <div className="invoice-logo">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
              </div>
              <div className="invoice-brand-info">
                <strong>{invoice.company_name}</strong>
                <span>{invoice.company_address}</span>
                <span>{invoice.company_email}</span>
              </div>
            </div>
            <div className="invoice-title-block">
              <div className="invoice-title">INVOICE</div>
              <div className="invoice-number">#{invoice.invoice_number}</div>
              <div className={`invoice-status ${invoice.status}`}>
                <span className="status-dot"></span>
                <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
              </div>
            </div>
          </div>

          <div className="parties-grid">
            <div className="party-block">
              <div className="party-label">Billed From</div>
              <div className="party-name">{invoice.company_name}</div>
              <div className="party-details">
                <span>{invoice.company_address}</span>
                <a href={`mailto:${invoice.company_email}`}>{invoice.company_email}</a>
              </div>
            </div>
            <div className="party-block">
              <div className="party-label">Billed To</div>
              <div className="party-name">{invoice.client_name}</div>
              <div className="party-details">
                <span>{invoice.client_address}</span>
                <a href={`mailto:${invoice.client_email}`}>{invoice.client_email}</a>
              </div>
            </div>
          </div>

          <div className="dates-row">
            <div className="date-block">
              <span className="date-label">Issue Date</span>
              <span className="date-value">{formatDate(invoice.invoice_date)}</span>
            </div>
            <div className="date-block">
              <span className="date-label">Due Date</span>
              <span className="date-value due">{formatDate(invoice.due_date)}</span>
            </div>
            <div className="date-block">
              <span className="date-label">Amount Due</span>
              <span className="date-value due">{formatCurrency(invoice.balance)}</span>
            </div>
          </div>

          <div className="items-section">
            <div className="section-heading">
              <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              Items & Services
            </div>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="right hide-mobile">Qty</th>
                  <th className="right hide-mobile">Rate</th>
                  <th className="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="desc"><strong>{item.description}</strong></td>
                    <td className="right hide-mobile">{item.quantity}</td>
                    <td className="right hide-mobile">{formatCurrency(item.unit_price)}</td>
                    <td className="right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals-section">
            <div className="totals-box">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="total-row discount">
                  <span>Discount</span>
                  <span>-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Tax ({invoice.tax_rate}%)</span>
                <span>{formatCurrency(invoice.tax_amount)}</span>
              </div>
              <div className="total-row grand">
                <span>Total Due</span>
                <span>{formatCurrency(invoice.balance)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="notes-section">
              <h4>Notes</h4>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Payment Panel (Sticky) */}
        <aside className="payment-panel">
          <div className="payment-card">
            <div className="payment-header">
              <div className="payment-label">Amount Due</div>
              <div className="payment-amount">{formatCurrency(invoice.balance)}</div>
              <div className="payment-currency">{invoice.currency} - {invoice.currency === 'NGN' ? 'Nigerian Naira' : invoice.currency}</div>
            </div>

            <button 
              className={`pay-btn ${paying ? 'loading' : ''}`} 
              onClick={handlePay}
              disabled={paying || !paystackLoaded || invoice.balance <= 0}
            >
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span className="btn-text">Pay Now - {formatCurrency(invoice.balance)}</span>
              <span className="btn-loader"><span className="spinner"></span> Processing</span>
            </button>

            <div className="security-badges">
              <div className="security-badge">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>256-bit SSL encryption</span>
              </div>
              <div className="security-badge">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Secured by Paystack</span>
              </div>
              <div className="security-badge">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>PCI DSS compliant</span>
              </div>
            </div>

            <div className="secondary-actions">
              <button className="secondary-btn" onClick={() => window.print()}>
                <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="toast-container" id="toastContainer"></div>
    </div>
  );
}