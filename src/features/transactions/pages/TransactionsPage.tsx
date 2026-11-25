import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getTransactions, getTransactionSummary, exportTransactions } from '../services/transactionService';
import { Transaction, TransactionSummary } from '../../../types';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(currentYear);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [month, year, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, sumRes] = await Promise.all([
        getTransactions({ month, year, status: statusFilter }),
        getTransactionSummary({ month, year })
      ]);
      setTransactions(txRes);
      setSummary(sumRes);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const blob = await exportTransactions({ month, year, status: statusFilter });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${months[month]}-${year}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export transactions. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
    <DashboardLayout title="Transactions">
      <div className="transactions-page-container">
        
        {/* Page Header */}
        <div className="transactions-header">
          <div className="header-left">
            <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h2>Transactions</h2>
            <button className="icon-btn" onClick={handleDownload} disabled={isExporting} aria-label="Download">
              {isExporting ? (
                <span className="spinner-small" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              )}
              <span className="desktop-only">Download</span>
            </button>
          </div>

          <div className="date-selector">
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="status-filters">
            {['all', 'paid', 'pending', 'overdue'].map(status => (
              <button 
                key={status}
                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        {summary && (
          <section className="summary-section">
            <h3 className="summary-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="14" y2="16"/>
              </svg>
              Transaction Summary
            </h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Transactions</span>
                <span className="summary-value total">{summary.total}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Paid</span>
                <span className="summary-value paid">{summary.paid}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Pending</span>
                <span className="summary-value pending">{summary.pending}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Overdue</span>
                <span className="summary-value overdue">{summary.overdue}</span>
              </div>
            </div>
          </section>
        )}

        {/* Transactions List */}
        <div className="transactions-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="14" y2="16"/>
              </svg>
              <h3>No transactions yet</h3>
              <p>Create your first invoice to start tracking payments</p>
              <button className="btn primary" onClick={() => navigate('/dashboard/invoices/new')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Invoice
              </button>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map(tx => (
                <div 
                  key={tx.id} 
                  className="transaction-item"
                  onClick={() => { setSelectedTransaction(tx); setIsModalOpen(true); }}
                >
                  <div className="tx-icon" style={{ background: `${getStatusColor(tx.status)}20`, color: getStatusColor(tx.status) }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="14" y2="16"/>
                    </svg>
                  </div>
                  <div className="tx-details">
                    <h4>{tx.invoice_number}</h4>
                    <p>{tx.client_name}</p>
                  </div>
                  <div className="tx-meta">
                    <span className="tx-date">{formatDate(tx.date)}</span>
                    <span className={`tx-status status-${tx.status}`}>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
                  </div>
                  <div className="tx-amount" style={{ color: tx.status === 'paid' ? 'var(--success)' : 'var(--text-primary)' }}>
                    {formatCurrency(tx.amount, tx.currency)}
                  </div>
                  <div className="tx-action">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {isModalOpen && selectedTransaction && (
          <div className="modal-overlay active" onClick={() => setIsModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
              <div className="modal-icon" style={{ background: `${getStatusColor(selectedTransaction.status)}20`, color: getStatusColor(selectedTransaction.status) }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="14" y2="16"/>
                </svg>
              </div>
              <h2>Transaction Details</h2>
              <div className="modal-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Invoice Number</span>
                  <span className="detail-value">{selectedTransaction.invoice_number}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Client</span>
                  <span className="detail-value">{selectedTransaction.client_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{formatDate(selectedTransaction.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value" style={{ color: getStatusColor(selectedTransaction.status), textTransform: 'capitalize' }}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Total Amount</span>
                  <span className="detail-value" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                  </span>
                </div>
              </div>
              <div className="modal-buttons">
                <button className="btn secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                <button className="btn primary" onClick={() => navigate(`/dashboard/invoices/${selectedTransaction.invoice_id}`)}>
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}