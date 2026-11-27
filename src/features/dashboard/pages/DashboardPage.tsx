import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getDashboardData } from '../services/dashboardService';
import { generateClientInvoiceLink } from '../../invoices/services/invoiceService'; 
import { DashboardData } from '../../../types';
import OnboardingTour from '../../../components/ui/OnboardingTour';

const TOUR_STEPS = [
  { target: '.header-right', title: 'Profile & Settings', description: 'Access your profile, notifications, and theme settings here.', placement: 'bottom' as const },
  { target: '.account-balance', title: 'Available Balance', description: 'Track your funds. Click the eye icon to hide your balance for privacy.', placement: 'bottom' as const },
  { target: '.quick-actions', title: 'Quick Actions', description: 'Create invoices, generate client links, or view your history instantly.', placement: 'top' as const },
  { target: '.recent-activity', title: 'Recent Activity', description: 'Stay updated with your latest business transactions and events.', placement: 'top' as const },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [showSetupBanner, setShowSetupBanner] = useState(false);
  
  // New state for link generation
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setData(response);
        
        const isAccountIncomplete = typeof response.account === 'boolean' 
          ? !response.account 
          : !(response.account?.bank_name && response.account?.account_number);
          
        const dismissed = localStorage.getItem('setupBannerDismissedAt');
        const hoursSince = dismissed ? (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60) : Infinity;
        
        if (isAccountIncomplete && hoursSince > 24) {
          setShowSetupBanner(true);
        }

        if (!localStorage.getItem('dashboardTourCompleted')) {
          setTimeout(() => setShowTour(true), 1000);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDismissSetup = () => {
    setShowSetupBanner(false);
    localStorage.setItem('setupBannerDismissedAt', Date.now().toString());
  };

  // New handler for generating the client invoice link
  const handleGenerateClientLink = async () => {
    setIsGeneratingLink(true);
    try {
      const response = await generateClientInvoiceLink();
      
      // Copy the generated URL to the clipboard
      await navigator.clipboard.writeText(response.share_url);
      
      // Show a brief, non-intrusive success message (you can replace this with a toast component)
      alert(`Client link generated and copied to clipboard!\n\n${response.share_url}`);
    } catch (error: any) {
      console.error('Failed to generate client link', error);
      alert(error.message || 'Failed to generate link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const formatCurrency = (amount, currencyCode = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currencyCode, // Must be "NGN", "USD", etc.
    minimumFractionDigits: 2
  }).format(amount / 100); // Assuming amount is in kobo, divide by 100
};

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="skeleton-dashboard">
          <div className="skeleton skeleton-title" style={{ width: '300px', height: '40px' }}></div>
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-card"></div>)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return <DashboardLayout><div>Failed to load dashboard.</div></DashboardLayout>;

  const isPro = data.plan === 'pro';
  const isTrial = data.plan === 'trial';

  return (
    <DashboardLayout>
      {showTour && <OnboardingTour steps={TOUR_STEPS} onComplete={() => localStorage.setItem('dashboardTourCompleted', 'true')} />}

      {/* Trial Upgrade Banner */}
      {isTrial && (
        <div className="upgrade-banner">
          <div className="banner-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div className="banner-content">
            <div className="banner-title">Upgrade to Pro Plan</div>
            <div className="banner-text">Unlock advanced features like custom branding, priority support, and unlimited invoices.</div>
          </div>
          <Link to="/dashboard/billing" className="upgrade-btn">Upgrade Now</Link>
        </div>
      )}

      {/* Account Setup Banner */}
      {showSetupBanner && (
        <div className="setup-banner">
          <div className="setup-banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div className="setup-banner-content">
            <div className="setup-banner-title">Complete Your Account Setup</div>
            <div className="setup-banner-text">Add your bank details to start receiving payments and sending invoices.</div>
          </div>
          <div className="setup-banner-actions">
            <Link to="/dashboard/profile" className="setup-banner-btn">Setup Now</Link>
            <button className="setup-banner-close" onClick={handleDismissSetup} aria-label="Dismiss">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      <div className="greeting-section">
        <h1>Good {getTimeOfDay()}, {data.username} 👋</h1>
        <p>Here's an overview of your invoicing activity today</p>
      </div>

      {/* Balance Card */}
      <div className="account-balance">
        <div className="balance-header">
          <div className="balance-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
            Available Balance
          </div>
          <button className="icon-btn" onClick={() => setHideBalance(!hideBalance)} aria-label="Toggle balance visibility">
            {hideBalance ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        <div className="balance-amount">
          {hideBalance ? '••••••' : formatCurrency(data.balance, data.currency_symbol)}
        </div>
        <div className="balance-footer">
          <Link to="/dashboard/transactions" className="transactions-link">Transactions History →</Link>
          <button className="add-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Money
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Invoices</div>
          <div className="stat-value">{data.total_invoices}</div>
        </div>
        <div className="stat-card paid">
          <div className="stat-label">Paid</div>
          <div className="stat-value">{data.paid_invoices}</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{data.pending_invoices}</div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-label">Revenue</div>
          <div className="stat-value">{formatCurrency(data.total_revenue, data.currency_symbol)}</div>
        </div>
      </div>

      {/* Advanced Analytics (Pro Only) */}
      {isPro && data.company_data && (
        <div className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Advanced Analytics
              <span className="pro-badge">PRO</span>
            </h2>
          </div>
          <div className="analytics-stats">
            <div className="analytics-stat-card">
              <div className="analytics-stat-label">Revenue Growth</div>
              <div className="analytics-stat-value" style={{ color: data.company_data.revenue_growth >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {data.company_data.revenue_growth >= 0 ? '+' : ''}{data.company_data.revenue_growth}%
              </div>
              <div className="analytics-stat-trend">vs last month</div>
            </div>
            <div className="analytics-stat-card">
              <div className="analytics-stat-label">Payment Success</div>
              <div className="analytics-stat-value">
                {data.company_data.total_payments > 0 ? Math.round((data.company_data.successful_payments / data.company_data.total_payments) * 100) : 0}%
              </div>
              <div className="analytics-stat-trend">{data.company_data.successful_payments} of {data.company_data.total_payments} payments</div>
            </div>
            <div className="analytics-stat-card">
              <div className="analytics-stat-label">Avg Invoice Value</div>
              <div className="analytics-stat-value">
                {formatCurrency(data.company_data.total_invoices > 0 ? data.company_data.total_revenue / data.company_data.total_invoices : 0, data.currency_symbol)}
              </div>
              <div className="analytics-stat-trend">per invoice</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="section quick-actions">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="actions-grid">
          <Link to="/dashboard/invoices/new" className="action-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Invoice
          </Link>
          
          {/* UPDATED: Generate Client Link Button */}
          <button 
            className="action-btn secondary" 
            onClick={handleGenerateClientLink} 
            disabled={isGeneratingLink}
          >
            {isGeneratingLink ? (
              <span className="spinner-small" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            )}
            {isGeneratingLink ? 'Generating...' : 'Generate Client Link'}
          </button>

          <Link to="/dashboard/invoices" className="action-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            View Invoices
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section recent-activity">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <Link to="/dashboard/activity" className="view-all">View All →</Link>
        </div>
        <div className="activity-list">
          {data.activities.length === 0 ? (
            <div className="empty-state">
              <p>No recent activity. Get started by creating your first invoice!</p>
            </div>
          ) : (
            data.activities.slice(0, 5).map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.created_at}</div>
                </div>
                <div className="activity-amount">{formatCurrency(activity.amount, data.currency_symbol)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
