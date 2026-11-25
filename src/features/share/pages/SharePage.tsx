import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getReferralData, ReferralData } from '../services/shareService';

export default function SharePage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getReferralData();
      setData(res);
    } catch (error) {
      console.error('Failed to fetch referral data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!data) return;
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(data.referral_code);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      setIsCopying(false);
    }
  };

  const getShareMessage = () => {
    return `Join me on Business Essentials Prime and get ₦500 off your first payment! Use my referral code: ${data?.referral_code}. Sign up here: https://businessessentia.net/register?ref=${data?.referral_code}`;
  };

  const handleShare = (platform: string) => {
    if (!data) return;
    const message = encodeURIComponent(getShareMessage());
    const url = encodeURIComponent(`https://businessessentia.net/register?ref=${data.referral_code}`);

    switch (platform) {
      case 'email':
        window.location.href = `mailto:?subject=Join me on Business Essentials Prime&body=${message}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${message}`, '_blank');
        break;
      case 'sms':
        window.location.href = `sms:?body=${message}`;
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'more':
        if (navigator.share) {
          navigator.share({
            title: 'Join Business Essentials Prime',
            text: getShareMessage(),
            url: `https://businessessentia.net/register?ref=${data.referral_code}`,
          }).catch(console.error);
        } else {
          handleCopyCode();
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="settings-loading">
          <div className="skeleton" style={{ width: '100%', height: '400px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="empty-state">
          <p>Failed to load referral data.</p>
          <button className="btn primary" onClick={fetchData}>Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Share With Others">
      <div className="share-page-container">
        
        {/* Header */}
        <div className="share-header">
          <div className="share-icon-container">
            <div className="share-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <div className="share-icon-glow"></div>
          </div>
          <h1>Invite Friends & Earn</h1>
          <p className="subtitle">Share Business Essentials Prime with others and earn rewards when they sign up</p>
        </div>

        {/* Referral Card */}
        <div className="referral-card">
          <div className="referral-badge">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Exclusive Code</span>
          </div>
          <h2 className="referral-title">Your Referral Code</h2>
          <p className="referral-subtitle">Share this unique code with friends and colleagues</p>
          
          <div className="referral-code-box">
            <code className="referral-code">{data.referral_code}</code>
            <button 
              className={`copy-btn ${isCopying ? 'copied' : ''}`} 
              onClick={handleCopyCode}
            >
              {isCopying ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Code
                </>
              )}
            </button>
          </div>
          <p className="referral-hint">Your friends get ₦500 off their first payment when they use your code</p>
        </div>

        {/* Share Options */}
        <div className="share-options">
          <button className="share-option" onClick={() => handleShare('email')}>
            <div className="share-icon email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22 6 12 13 2 6"/>
              </svg>
            </div>
            <span>Email</span>
          </button>
          
          <button className="share-option" onClick={() => handleShare('whatsapp')}>
            <div className="share-icon whatsapp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>
            <span>WhatsApp</span>
          </button>
          
          <button className="share-option" onClick={() => handleShare('sms')}>
            <div className="share-icon sms">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span>SMS</span>
          </button>
          
          <button className="share-option" onClick={() => handleShare('twitter')}>
            <div className="share-icon twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </div>
            <span>Twitter</span>
          </button>
          
          <button className="share-option" onClick={() => handleShare('linkedin')}>
            <div className="share-icon linkedin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </div>
            <span>LinkedIn</span>
          </button>
          
          <button className="share-option" onClick={() => handleShare('more')}>
            <div className="share-icon more">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </div>
            <span>More</span>
          </button>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h2 className="section-title">Referral Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h3>Get 1 Month Free</h3>
                <p>For every friend who signs up with your code, get 1 month of Business Essentials Prime Pro free</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h3>Earn Cash Rewards</h3>
                <p>Receive ₦1,000 for each friend who upgrades to a paid plan within 30 days</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h3>Exclusive Features</h3>
                <p>Unlock premium features like advanced analytics and priority support for each successful referral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h3 className="stats-title">Your Referral Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{data.invites_sent}</div>
              <div className="stat-label">Invites Sent</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{data.signups}</div>
              <div className="stat-label">Sign Ups</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{data.currency}{data.earned.toLocaleString()}</div>
              <div className="stat-label">Earned</div>
            </div>
          </div>
        </div>

        {/* Invite More */}
        <div className="invite-friends">
          <h3 className="invite-title">Invite More Friends</h3>
          <p className="invite-subtitle">The more friends you invite, the more rewards you earn. There's no limit to how much you can earn!</p>
          <button className="invite-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0v7a4 4 0 0 0 8 0v-1"/>
              <path d="M14 16a2 2 0 0 1-4 0"/>
              <path d="M2 15a10 10 0 0 0 20 0"/>
            </svg>
            Invite Friends Now
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}