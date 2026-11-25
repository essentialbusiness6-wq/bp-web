import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PaymentSummary from '../components/PaymentSummary';
import PaymentPreviewModal from '../components/PaymentPreviewModal';
import { getPayments, getPaymentSummary } from '../services/paymentService';
import { Payment, PaymentSummary as PaymentSummaryType } from '../../../types';

type FilterStatus = 'all' | 'paid' | 'pending' | 'overdue' | 'failed';

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Overdue', value: 'overdue' },
];

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  
  // Modal State
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async (search: string, status: FilterStatus) => {
    setLoading(true);
    setError(null);
    try {
      const [paymentsData, summaryData] = await Promise.all([
        getPayments({ search: search || undefined, status }),
        getPaymentSummary()
      ]);
      setPayments(paymentsData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(searchQuery, activeFilter);
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'var(--success)';
      case 'pending': return 'var(--warning)';
      case 'overdue': return 'var(--danger)';
      default: return 'var(--gray)';
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Payment Overview</h1>
          <p className="muted-text">Track and manage all invoice payments</p>
        </div>
        <button className="btn primary" onClick={() => navigate('/dashboard/invoices/new')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Invoice
        </button>
      </div>

      {summary && !loading && <PaymentSummary data={summary} />}

      <div className="payments-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search payments..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`filter-tab ${activeFilter === filter.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="skeleton-table">
          {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-row"></div>)}
        </div>
      ) : error ? (
        <div className="empty-state">
          <p className="error-text">⚠️ {error}</p>
          <button className="btn secondary" onClick={() => fetchData(searchQuery, activeFilter)}>Try Again</button>
        </div>
      ) : payments.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="14" y2="16"/>
          </svg>
          <h3>No payments yet</h3>
          <p>Create your first invoice to start receiving payments</p>
          <button className="btn primary" onClick={() => navigate('/dashboard/invoices/new')}>Create Invoice</button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="payments-table-container">
            <div className="payments-table-header">
              <span>Invoice</span>
              <span>Client</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            {payments.map(payment => (
              <div key={payment.id} className="payment-item" onClick={() => { setSelectedPayment(payment); setIsModalOpen(true); }}>
                <div className="payment-invoice">{payment.invoice_number}</div>
                <div className="payment-client">{payment.client_name}</div>
                <div className="payment-date">{formatDate(payment.date)}</div>
                <div className="payment-amount">{formatCurrency(payment.amount, payment.currency)}</div>
                <div className="payment-status">
                  <span className="status-badge" style={{ color: getStatusColor(payment.status), background: `${getStatusColor(payment.status)}15` }}>
                    {payment.status}
                  </span>
                </div>
                <div className="payment-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="icon-btn-sm" onClick={() => { setSelectedPayment(payment); setIsModalOpen(true); }} title="View Details">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="payment-cards-container">
            {payments.map(payment => (
              <div key={payment.id} className="payment-card" onClick={() => { setSelectedPayment(payment); setIsModalOpen(true); }}>
                <div className="payment-card-header">
                  <div>
                    <div className="payment-card-invoice">{payment.invoice_number}</div>
                    <div className="payment-card-client">{payment.client_name}</div>
                  </div>
                  <span className="status-badge" style={{ color: getStatusColor(payment.status), background: `${getStatusColor(payment.status)}15` }}>
                    {payment.status}
                  </span>
                </div>
                <div className="payment-card-details">
                  <span>{formatDate(payment.date)}</span>
                  <span className="payment-card-amount">{formatCurrency(payment.amount, payment.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <PaymentPreviewModal 
        payment={selectedPayment}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPayment(null); }}
      />
    </DashboardLayout>
  );
}