import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { getMeOverview } from '../services/meService';

interface MeOverviewData {
  balance: number;
  currency: string;
}

const ACTION_CARDS = [
  { 
    id: 'transactions', 
    title: 'Transaction History', 
    description: 'View all your past payments and receipts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="8" y1="14" x2="8" y2="16"/>
        <line x1="16" y1="14" x2="16" y2="16"/>
      </svg>
    ),
    href: '/dashboard/transactions'
  },
  { 
    id: 'security', 
    title: 'Security Center', 
    description: 'Manage your password and 2FA settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M8 12l4-4 4 4"/>
        <path d="M12 16V8"/>
      </svg>
    ),
    href: '/dashboard/security'
  },
  { 
    id: 'billing', 
    title: 'Billing & Plans', 
    description: 'Manage your subscription and payment methods',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    href: '/dashboard/billing'
  },
  { 
    id: 'share', 
    title: 'Share With Others', 
    description: 'Invite your team or share your referral link',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
    href: '/dashboard/share' // Or a dedicated share page
  },
  { 
    id: 'rate', 
    title: 'Rate Us', 
    description: 'Let us know how we can improve your experience',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    href: '/dashboard/rate'
  },
];

export default function MePage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<MeOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMeOverview();
        setOverview(data);
      } catch (error) {
        console.error('Failed to fetch me overview', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency || 'USD' 
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const displayCurrency = overview?.currency || 'USD';

  return (
    <DashboardLayout title="My Account">
      <div className="me-page-container">
        
        {/* Profile & Balance Hero */}
        <div className="me-hero">
          <div className="profile-section">
            {/* Clickable Profile Avatar */}
            <Link to="/dashboard/profile" className="profile-avatar-link" aria-label="Go to profile page">
              <div className="profile-avatar-large">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt={user.full_name} />
                ) : (
                  <span>{getInitials(user?.full_name || 'User')}</span>
                )}
              </div>
            </Link>
            
            <div className="profile-info">
              <h1>{user?.full_name || 'User'}</h1>
              <p>{user?.email}</p>
              <span className={`plan-badge ${user?.subscription_plan || 'trial'}`}>
                {user?.subscription_plan ? user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1) : 'Trial'} Plan
              </span>
            </div>
          </div>

          <div className="balance-card">
            <div className="balance-header">
              <span>Available Balance</span>
              <button 
                className="icon-btn-sm" 
                onClick={() => setHideBalance(!hideBalance)}
                aria-label={hideBalance ? 'Show balance' : 'Hide balance'}
                title={hideBalance ? 'Show balance' : 'Hide balance'}
              >
                {hideBalance ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="balance-amount">
              {loading ? (
                <div className="skeleton" style={{ width: '150px', height: '36px', borderRadius: '8px' }}></div>
              ) : (
                hideBalance ? '••••••' : formatCurrency(overview?.balance || 0, displayCurrency)
              )}
            </div>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="me-actions-grid">
          {ACTION_CARDS.map((card) => (
            <Link key={card.id} to={card.href} className="me-action-card">
              <div className="action-icon">
                {card.icon}
              </div>
              <div className="action-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="action-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}