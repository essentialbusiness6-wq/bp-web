import { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import { forgotPassword } from '../services/authServices';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldError, setFieldError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldError) setFieldError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setFieldError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('Invalid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await forgotPassword({ email });
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send reset link. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <AuthLayout title="Check your email" subtitle={`We've sent a password reset link to ${email}`}>
        <div className="auth-success-state">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <p>If an account exists with that email, you'll receive a reset link shortly. The link will expire in 1 hour.</p>
          <Link to="/login" className="btn btn-secondary btn-block" style={{ marginTop: '24px' }}>
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot password?" 
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} noValidate>
        {status === 'error' && errorMessage && (
          <div className="auth-alert auth-alert--error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="you@company.com"
            autoComplete="email"
            disabled={status === 'loading'}
            className={fieldError ? 'input-error' : ''}
          />
          {fieldError && <span className="form-error">{fieldError}</span>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block" 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <span className="spinner"></span>
              Sending link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>

        <p className="auth-footer-text">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}