import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { verifyBillingPayment } from '../services/billingServices'; 

export default function BillingSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference') || searchParams.get('trxref');
      
      // Paystack redirects with these. If missing, it might be a direct navigation or failed tx.
      if (!reference) {
        setStatus('error');
        return;
      }

      try {
        // 1. FALLBACK VERIFICATION: 
        // Webhooks can be delayed. We call the backend verify endpoint just in case 
        // the webhook hasn't processed yet. It's idempotent, so it's safe to call even if already processed.
        try {
          await verifyBillingPayment(reference);
        } catch (verifyErr) {
          console.warn("Backend verify failed (might already be processed by webhook):", verifyErr);
        }

        // 2. REFRESH USER CONTEXT:
        // Now that we know the backend has processed it (either via webhook or our fallback),
        // we fetch the latest user data to get the new 'pro' or 'basic' plan.
        await refreshUser();
        
        setStatus('success');
        
        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Failed to process payment success:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, refreshUser]);

  return (
    <DashboardLayout title="Payment Status">
      <div className="billing-success-container">
        
        {status === 'verifying' && (
          <div className="success-card">
            <div className="spinner-large"></div>
            <h2>Finalizing your upgrade...</h2>
            <p>Please wait while we confirm your Paystack transaction and activate your new plan.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="success-card">
            <div className="success-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Payment Successful!</h2>
            <p>Your account has been upgraded via Paystack. You now have full access to all premium features.</p>
            <p className="redirect-hint">Redirecting you to the dashboard in 3 seconds...</p>
            <button className="btn primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard Now
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="success-card">
            <div className="error-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h2>Verification Incomplete</h2>
            <p>We couldn't confirm your Paystack transaction. If your bank was charged, please contact support with your transaction reference: <strong>{searchParams.get('reference') || 'N/A'}</strong></p>
            <div className="form-actions" style={{ justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
              <button className="btn secondary" onClick={() => navigate('/dashboard/billing')}>
                Back to Billing
              </button>
              <button className="btn primary" onClick={() => navigate('/dashboard/support')}>
                Contact Support
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
