import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import PasswordInput from '../../../components/ui/PasswordInput';
import { resetPassword } from '../services/authServices';

interface ResetFormState {
  password: string;
  password_confirm: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  
  const [formData, setFormData] = useState<ResetFormState>({
    password: '',
    password_confirm: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!token) {
      setErrorMessage('Invalid or missing reset token.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await resetPassword({ ...formData, token });
      setStatus('success');
      setTimeout(() => navigate('/login?reset=success'), 2500);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to reset password. The link may have expired.');
    }
  };

  if (status === 'success') {
    return (
      <AuthLayout title="Password Reset!" subtitle="Redirecting you to login...">
        <div className="auth-success-state">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p>Your password has been reset successfully. You can now sign in with your new password.</p>
        </div>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid Reset Link" subtitle="This password reset link is invalid or has expired.">
        <div className="auth-success-state">
          <Link to="/forgot-password" className="btn btn-primary btn-block">
            Request a New Link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Set new password" 
      subtitle="Create a strong password for your account"
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

        <PasswordInput
          id="password"
          name="password"
          label="New Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={status === 'loading'}
          error={fieldErrors.password}
        />

        <PasswordInput
          id="password_confirm"
          name="password_confirm"
          label="Confirm New Password"
          value={formData.password_confirm}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={status === 'loading'}
          error={fieldErrors.password_confirm}
        />

        <button 
          type="submit" 
          className="btn btn-primary btn-block" 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <span className="spinner"></span>
              Resetting password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        <p className="auth-footer-text">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}