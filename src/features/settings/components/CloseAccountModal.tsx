import { useState, FormEvent, ChangeEvent } from 'react';
import { closeAccount } from '../services/settingsService';
import { useAuth } from '../../../hooks/useAuth';

interface CloseAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REASONS = [
  { value: 'not_useful', label: "I don't find it useful" },
  { value: 'too_expensive', label: "It's too expensive" },
  { value: 'missing_features', label: "Missing features I need" },
  { value: 'switching', label: "Switching to another service" },
  { value: 'business_closed', label: "My business is closed" },
  { value: 'other', label: "Other reason" },
];

type ModalStep = 'reason' | 'confirm' | 'loading' | 'success';

export default function CloseAccountModal({ isOpen, onClose }: CloseAccountModalProps) {
  const { logout } = useAuth();
  const [step, setStep] = useState<ModalStep>('reason');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setStep('reason');
    setReason('');
    setDetails('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleReasonSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleConfirmSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password to confirm');
      return;
    }
    
    setStep('loading');
    setError('');

    try {
      await closeAccount({ reason, details: details || undefined, password });
      setStep('success');
      setTimeout(async () => {
        onClose();
        await logout();
      }, 2500);
    } catch (err: any) {
      setStep('confirm');
      setError(err.message || 'Failed to close account. Please check your password and try again.');
    }
  };

  const handleClose = () => {
    if (step === 'loading') return;
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={handleClose}>
      <div className="modal-card close-account-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={handleClose} aria-label="Close">&times;</button>
        
        {/* Step 1: Reason */}
        {step === 'reason' && (
          <>
            <div className="modal-icon warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2>We're sorry to see you go</h2>
            <p className="modal-subtitle">Before you close your account, please let us know why you're leaving.</p>
            
            <form onSubmit={handleReasonSubmit}>
              <div className="reason-list">
                {REASONS.map((r) => (
                  <label key={r.value} className={`reason-option ${reason === r.value ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="reason" 
                      value={r.value} 
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <span className="reason-radio"></span>
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>

              {reason === 'other' && (
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <textarea 
                    placeholder="Please share more details..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {error && <div className="form-error-alert">{error}</div>}

              <div className="modal-buttons">
                <button type="button" className="btn secondary" onClick={handleClose}>Cancel</button>
                <button type="submit" className="btn danger">Continue</button>
              </div>
            </form>
          </>
        )}

        {/* Step 2: Password Confirmation */}
        {step === 'confirm' && (
          <>
            <div className="modal-icon danger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2>Confirm Account Closure</h2>
            <p className="modal-subtitle">
              This action is <strong>permanent and irreversible</strong>. All your data, invoices, and client records will be deleted.
            </p>

            <div className="warning-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <strong>Warning:</strong> You will lose access to all invoices, client data, and payment history. Consider exporting your data first.
              </div>
            </div>

            <form onSubmit={handleConfirmSubmit}>
              <div className="form-group">
                <label>Enter your password to confirm</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your account password"
                    autoFocus
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <div className="form-error-alert">{error}</div>}

              <div className="modal-buttons">
                <button type="button" className="btn secondary" onClick={() => { setStep('reason'); setError(''); }}>
                  Back
                </button>
                <button type="submit" className="btn danger">
                  Permanently Close Account
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Loading */}
        {step === 'loading' && (
          <div className="modal-loading-state">
            <div className="spinner-large"></div>
            <h2>Closing your account...</h2>
            <p>Please wait while we process your request.</p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="modal-success-state">
            <div className="success-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Account Closed</h2>
            <p>Your account has been permanently closed. You will be redirected shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}