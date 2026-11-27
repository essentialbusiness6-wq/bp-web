import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getSubscription, createCheckoutSession } from '../services/billingServices';
import { Subscription, BillingCycle } from '../../../types';

export default function BillingPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const data = await getSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpgrade = async (plan: 'basic' | 'pro', amount: number) => {
    setUpgrading(plan);
    try {
      const response = await createCheckoutSession(plan, billingCycle);
            
      const checkoutUrl = 
        response.checkout_url || 
        response.url || 
        response.data?.authorization_url || 
        reponse.authorization_url ||
        response.data?.checkout_url;
      
      if (checkoutUrl) {
        // Redirect to the actual Paystack checkout page
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL was returned by the server.");
      }
      
    } catch (error: any) {
      console.error("Checkout initialization failed:", error);
      alert(error.message || 'Failed to initialize checkout. Please try again.');
      setUpgrading(null);
    }
  };
  const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: 'var(--success)', flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const CrossIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: 'var(--medium-gray)', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="settings-loading">
          <div className="skeleton" style={{ width: '100%', height: '200px', marginBottom: '24px' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '400px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  const isTrial = subscription?.plan === 'trial';

  return (
    <DashboardLayout title="Billing & Plans">
      <div className="billing-page-container">
        
        {/* Trial Banner */}
        {isTrial && subscription?.days_left !== undefined && (
          <div className="trial-banner">
            <div className="trial-banner-content">
              <h2>Current Plan: Trial</h2>
              <p>Your trial ends in <strong>{subscription.days_left} days</strong>.</p>
              <div className="countdown">
                <div className="countdown-item">
                  <span>{subscription.days_left}</span>
                  <small>days</small>
                </div>
                <div className="countdown-item">
                  <span>{subscription.hours_left || 0}</span>
                  <small>hours</small>
                </div>
                <div className="countdown-item">
                  <span>{subscription.minutes_left || 0}</span>
                  <small>min</small>
                </div>
              </div>
            </div>
            <span className="trial-badge">Trial</span>
          </div>
        )}

        {/* Page Header */}
        <div className="billing-header">
          <div>
            <h2>Choose Your Plan</h2>
            <p>Unlock full access to Business Essentials Prime</p>
          </div>
          <div className="billing-toggle">
            <span className={!isTrial && billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={billingCycle === 'yearly'} 
                onChange={(e) => setBillingCycle(e.target.checked ? 'yearly' : 'monthly')}
                disabled={isTrial}
              />
              <span className="slider"></span>
            </label>
            <span className={!isTrial && billingCycle === 'yearly' ? 'active' : ''}>
              Yearly <span className="save-badge">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid">
          
          {/* Trial Plan */}
          <div className="pricing-card muted">
            <h4>Trial</h4>
            <p className="price">₦0</p>
            <p className="period">Limited time</p>
            <ul>
              <li><CheckIcon /> <span>Create invoices</span></li>
              <li><CheckIcon /> <span>Client management</span></li>
              <li className="inactive"><CrossIcon /> <span>Payments tracking</span></li>
              <li className="inactive"><CrossIcon /> <span>Email reminders</span></li>
              <li className="inactive"><CrossIcon /> <span>Priority support</span></li>
            </ul>
            <button className="btn ghost" disabled>
              {isTrial ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* Basic Plan */}
          <div className="pricing-card featured">
            <span className="popular-badge">Most Popular</span>
            <h4>Basic</h4>
            <p className="price">
              {billingCycle === 'monthly' ? '₦1,000' : '₦12,000'}
            </p>
            <p className="period">
              {billingCycle === 'monthly' ? 'per month' : 'per year'}
            </p>
            <ul>
              <li><CheckIcon /> <span>Unlimited invoices</span></li>
              <li><CheckIcon /> <span>Client & payment tracking</span></li>
              <li><CheckIcon /> <span>Email reminders</span></li>
              <li><CheckIcon /> <span>Invoice branding</span></li>
              <li><CheckIcon /> <span>Priority support</span></li>
            </ul>
            <button 
              className={`btn ${subscription?.plan === 'basic' ? 'ghost' : 'primary'}`}
              disabled={subscription?.plan === 'basic' || upgrading === 'basic'}
              onClick={() => handleUpgrade('basic', billingCycle === 'monthly' ? 1000 : 12000)}
            >
              {upgrading === 'basic' ? 'Processing...' : (subscription?.plan === 'basic' ? 'Current Plan' : 'Upgrade Now')}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card featured pro-plan">
            <h4>Pro</h4>
            <p className="price">
              {billingCycle === 'monthly' ? '₦10,000' : '₦120,000'}
            </p>
            <p className="period">
              {billingCycle === 'monthly' ? 'per month' : 'per year'}
            </p>
            <ul>
              <li><CheckIcon /> <span>Everything in Basic</span></li>
              <li><CheckIcon /> <span>Get Paid Easily (Paystack)</span></li>
              <li><CheckIcon /> <span>Automatic Payment Reminders</span></li>
              <li><CheckIcon /> <span>Team & Organization Accounts</span></li>
              <li><CheckIcon /> <span>Advanced Business Reports & Analytics</span></li>
              <li><CheckIcon /> <span>API access & Integrations</span></li>
              <li><CheckIcon /> <span>Custom Branded Invoices</span></li>
              <li><CheckIcon /> <span>Priority Support</span></li>
            </ul>
            <button 
              className={`btn ${subscription?.plan === 'pro' ? 'ghost' : 'primary'}`}
              disabled={subscription?.plan === 'pro' || upgrading === 'pro'}
              onClick={() => handleUpgrade('pro', billingCycle === 'monthly' ? 10000 : 120000)}
            >
              {upgrading === 'pro' ? 'Processing...' : (subscription?.plan === 'pro' ? 'Current Plan' : 'Upgrade Now')}
            </button>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="trust-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Secure payments • Cancel anytime • No hidden fees • 30-day money-back guarantee</span>
        </div>

      </div>
    </DashboardLayout>
  );
}
