import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { 
  getSecuritySettings, getActiveSessions, initiate2FA, verify2FA, disable2FA, 
  changePassword, revokeSession, revokeAllOtherSessions, sendVerificationEmail 
} from '../services/securityService';
import { SecuritySettings, ActiveSession } from '../../../types';

export default function SecurityPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [targetSession, setTargetSession] = useState<ActiveSession | null>(null);

  // 2FA Setup State
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [twoFAError, setTwoFAError] = useState('');

  // Password Change State
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, sessionsRes] = await Promise.all([
        getSecuritySettings(),
        getActiveSessions()
      ]);
      setSettings(settingsRes);
      setSessions(sessionsRes);
    } catch (error) {
      console.error('Failed to fetch security data', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2FA Handlers ---
  const handle2FAToggle = async (enabled: boolean) => {
    if (enabled) {
      setIs2FAModalOpen(true);
    } else {
      const password = prompt('Enter your password to disable Two-Factor Authentication:');
      if (password) {
        try {
          await disable2FA(password);
          setSettings(prev => prev ? { ...prev, two_factor_enabled: false } : null);
          alert('2FA disabled successfully.');
        } catch (err: any) {
          alert(err.message || 'Failed to disable 2FA. Please check your password.');
        }
      }
    }
  };

  const handleInitiate2FA = async () => {
    setIs2FALoading(true);
    setTwoFAError('');
    try {
      const data = await initiate2FA();
      setQrCodeUrl(data.qr_code_url);
      setSecretKey(data.secret_key);
    } catch (err: any) {
      setTwoFAError(err.message || 'Failed to generate 2FA setup.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      setTwoFAError('Please enter a valid 6-digit code.');
      return;
    }
    setIs2FALoading(true);
    try {
      await verify2FA(verificationCode);
      setSettings(prev => prev ? { ...prev, two_factor_enabled: true } : null);
      setIs2FAModalOpen(false);
      alert('Two-Factor Authentication enabled successfully!');
    } catch (err: any) {
      setTwoFAError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setIs2FALoading(false);
    }
  };

  // --- Password Handlers ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setIsPasswordLoading(true);
    try {
      await changePassword({ 
        current_password: passwordData.current_password, 
        new_password: passwordData.new_password 
      });
      setIsPasswordModalOpen(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      alert('Password updated successfully!');
      fetchData(); // Refresh last changed date
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // --- Session Handlers ---
  const handleRevokeSession = async () => {
    if (!targetSession) return;
    try {
      await revokeSession(targetSession.id);
      setSessions(prev => prev.filter(s => s.id !== targetSession.id));
      setIsRevokeModalOpen(false);
      setTargetSession(null);
    } catch (err: any) {
      alert(err.message || 'Failed to revoke session.');
    }
  };

  const handleRevokeAllOthers = async () => {
    if (!window.confirm('Are you sure you want to log out from all other devices?')) return;
    try {
      await revokeAllOtherSessions();
      setSessions(prev => prev.filter(s => s.is_current));
      alert('All other sessions have been terminated.');
    } catch (err: any) {
      alert(err.message || 'Failed to revoke sessions.');
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      alert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      alert(err.message || 'Failed to send verification email.');
    }
  };

  if (loading || !settings) {
    return (
      <DashboardLayout>
        <div className="settings-loading">
          <div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const daysSincePasswordChange = Math.floor((Date.now() - new Date(settings.last_password_change).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <DashboardLayout title="Security Center">
      <div className="security-page-container">
        
        {/* Header & Score */}
        <div className="security-header">
          <div className="security-icon-container">
            <svg viewBox="0 0 24 24" className="security-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="security-pulse"></div>
          </div>
          <h1>Security Center</h1>
          <p className="subtitle">Manage your account security settings and review active sessions</p>
        </div>

        <div className="security-status">
          <div className="score-circle">
            <div className="score-inner">{settings.security_score}</div>
          </div>
          <div className="score-info">
            <h2 className="status-title">
              {settings.security_score >= 90 ? 'Excellent' : settings.security_score >= 70 ? 'Good' : 'Needs Improvement'}
            </h2>
            <p className="security-score-text">Your account security is in great shape.</p>
          </div>
          <div className="security-level">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`level-indicator ${i <= Math.floor(settings.security_score / 20) ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="security-section">
          <h2 className="section-title">Security Settings</h2>
          
          {/* 2FA */}
          <div className="security-option" data-status={settings.two_factor_enabled ? 'enabled' : 'disabled'}>
            <div className="option-left">
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <div className="option-text">
                <h3>Two-Factor Authentication</h3>
                <p>Extra layer of security for your account</p>
              </div>
            </div>
            <div className="option-right">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.two_factor_enabled} 
                  onChange={(e) => handle2FAToggle(e.target.checked)} 
                />
                <span className="slider"></span>
              </label>
              <span className={`status-label ${settings.two_factor_enabled ? 'enabled' : 'disabled'}`}>
                {settings.two_factor_enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Biometric (Mocked for UI) */}
          <div className="security-option" data-status={settings.biometric_enabled ? 'enabled' : 'disabled'}>
            <div className="option-left">
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.3 2.07-.84 3M12 10V8c0-1.5-1.5-3-3-3s-3 1.5-3 3c0 2.8 2.89 5.43 6 7.27.55.32 1.1.67 1.6.98.19.12.37.24.55.36.18-.12.36-.24.55-.36.5-.31 1.05-.66 1.6-.98 3.11-1.84 6-4.47 6-7.27 0-1.5-1.5-3-3-3s-3 1.5-3 3"/>
                </svg>
              </div>
              <div className="option-text">
                <h3>Biometric Login</h3>
                <p>Use fingerprint or face ID to log in</p>
              </div>
            </div>
            <div className="option-right">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.biometric_enabled} 
                  onChange={() => alert('Biometric login setup is coming soon!')} 
                />
                <span className="slider"></span>
              </label>
              <span className={`status-label ${settings.biometric_enabled ? 'enabled' : 'disabled'}`}>
                {settings.biometric_enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Change Password */}
          <div className="security-option" data-status={daysSincePasswordChange > 90 ? 'warning' : 'enabled'}>
            <div className="option-left">
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="option-text">
                <h3>Change Password</h3>
                <p>Last changed: {daysSincePasswordChange} days ago {daysSincePasswordChange > 90 && <span className="warning-text">• Consider updating</span>}</p>
              </div>
            </div>
            <div className="option-right">
              <button className="action-btn primary" onClick={() => setIsPasswordModalOpen(true)}>Change</button>
            </div>
          </div>

          {/* Email Verification */}
          <div className="security-option" data-status={settings.email_verified ? 'enabled' : 'warning'}>
            <div className="option-left">
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22 6 12 13 2 6"/>
                </svg>
              </div>
              <div className="option-text">
                <h3>Email Verification</h3>
                <p>{settings.email_verified ? 'Your email address is verified.' : 'Your email address is not yet verified.'}</p>
              </div>
            </div>
            <div className="option-right">
              {!settings.email_verified && (
                <button className="action-btn secondary" onClick={handleSendVerificationEmail}>Verify</button>
              )}
            </div>
          </div>

          {/* Transaction PIN */}
          <div className="security-option" data-status={settings.pin_enabled ? 'enabled' : 'disabled'}>
            <div className="option-left">
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div className="option-text">
                <h3>Transaction PIN</h3>
                <p>Required for sensitive operations</p>
              </div>
            </div>
            <div className="option-right">
              <button className="action-btn secondary" onClick={() => navigate('/dashboard/settings')}>Manage</button>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="security-section sessions-section">
          <h2 className="section-title">Active Sessions</h2>
          <div className="sessions-list">
            {sessions.map(session => (
              <div key={session.id} className={`session-card ${session.is_current ? 'current' : ''}`}>
                <div className="session-info">
                  <div className="session-device">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    <div>
                      <h4>{session.device} {session.is_current && <span className="current-badge">(This Device)</span>}</h4>
                      <p>{session.browser} on {session.os} • {session.location}</p>
                      <p className="session-meta">IP: {session.ip_address} • Last active: {formatDate(session.last_active)}</p>
                    </div>
                  </div>
                </div>
                {!session.is_current && (
                  <button 
                    className="action-btn danger-outline" 
                    onClick={() => { setTargetSession(session); setIsRevokeModalOpen(true); }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
          {sessions.length > 1 && (
            <button className="action-btn danger full-width" onClick={handleRevokeAllOthers} style={{ marginTop: '16px' }}>
              Log Out From All Other Devices
            </button>
          )}
        </div>

        {/* Security Tips */}
        <div className="security-tips">
          <h3 className="tips-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Security Tips
          </h3>
          <ul className="tips-list">
            <li>Use a unique password for your Business Essentials Prime account.</li>
            <li>Enable two-factor authentication for an extra layer of security.</li>
            <li>Review active sessions regularly and log out from unused devices.</li>
            <li>Never share your password or PIN with anyone.</li>
            <li>Keep your recovery email up to date.</li>
          </ul>
        </div>

        {/* ================= MODALS ================= */}

        {/* 2FA Setup Modal */}
        {is2FAModalOpen && (
          <div className="modal-overlay active" onClick={() => !is2FALoading && setIs2FAModalOpen(false)}>
            <div className="modal-card twofa-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setIs2FAModalOpen(false)}>&times;</button>
              <div className="modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <h2>Set up Two-Factor Authentication</h2>
              
              {is2FALoading && !qrCodeUrl ? (
                <div className="loading-state">
                  <div className="spinner-large"></div>
                  <p>Generating secure setup data...</p>
                </div>
              ) : (
                <>
                  <p className="modal-subtitle">
                    1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="qr-code-container">
                    <img src={qrCodeUrl} alt="2FA QR Code" className="qr-code-img" />
                  </div>
                  
                  <p className="modal-subtitle" style={{ marginTop: '20px' }}>
                    2. Or enter this secret key manually:
                  </p>
                  <div className="secret-key-row">
                    <code className="secret-key">{secretKey}</code>
                    <button 
                      className="icon-btn-sm" 
                      onClick={() => { navigator.clipboard.writeText(secretKey); alert('Copied!'); }}
                      title="Copy to clipboard"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>

                  <div className="form-group" style={{ marginTop: '24px' }}>
                    <label>3. Enter the 6-digit code from your app</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      placeholder="000000" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="twofa-input"
                    />
                    {twoFAError && <div className="form-error-alert">{twoFAError}</div>}
                  </div>

                  <div className="modal-buttons">
                    <button className="btn secondary" onClick={() => setIs2FAModalOpen(false)}>Cancel</button>
                    <button className="btn primary" onClick={handleVerify2FA} disabled={is2FALoading}>
                      {is2FALoading ? 'Verifying...' : 'Verify & Enable'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {isPasswordModalOpen && (
          <div className="modal-overlay active" onClick={() => setIsPasswordModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setIsPasswordModalOpen(false)}>&times;</button>
              <div className="modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                    required 
                  />
                </div>
                {passwordError && <div className="form-error-alert">{passwordError}</div>}
                <div className="modal-buttons">
                  <button type="button" className="btn secondary" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn primary" disabled={isPasswordLoading}>
                    {isPasswordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Revoke Session Modal */}
        {isRevokeModalOpen && targetSession && (
          <div className="modal-overlay active" onClick={() => setIsRevokeModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setIsRevokeModalOpen(false)}>&times;</button>
              <div className="modal-icon warning">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12" fill="none" stroke="white" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" fill="none" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h2>Log Out From Device?</h2>
              <p className="modal-subtitle">
                Are you sure you want to log out from this <strong>{targetSession.device}</strong> ({targetSession.location})? 
                The user will need to log in again with their credentials.
              </p>
              <div className="modal-buttons">
                <button className="btn secondary" onClick={() => setIsRevokeModalOpen(false)}>Cancel</button>
                <button className="btn danger" onClick={handleRevokeSession}>Log Out</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}