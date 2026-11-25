import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import PasswordInput from '../../../components/ui/PasswordInput';
import { registerUser, googleSignIn } from '../services/authServices';
import { useAuth } from '../../../hooks/useAuth';

declare global {
  interface Window {
    google: any;
  }
}

interface RegisterFormState {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormState>({
    full_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google?.accounts) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleSignIn = () => {
    if (!window.google?.accounts) {
      setErrorMessage('Google Sign-In is loading. Please try again in a moment.');
      setStatus('error');
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: '706651628151-cauj54pj60fo50sho897c99dh8l44rf8.apps.googleusercontent.com',
      callback: async (response: any) => {
        setStatus('loading');
        setErrorMessage('');
        try {
          await googleSignIn({ credential: response.credential });
          await refreshUser();
          navigate('/dashboard');
        } catch (err: any) {
          setStatus('error');
          setErrorMessage(err.message || 'Google Sign-In failed');
        }
      },
    });
    
    window.google.accounts.id.prompt();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await registerUser(formData);
      setStatus('success');
      setTimeout(() => navigate('/login?registered=true'), 2000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <AuthLayout title="Account Created!" subtitle="Redirecting you to login...">
        <div className="auth-success-state">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p>Your account has been created successfully. Please check your email to verify your account.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start managing your business in minutes"
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
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Jane Doe"
            autoComplete="name"
            disabled={status === 'loading'}
            className={fieldErrors.full_name ? 'input-error' : ''}
          />
          {fieldErrors.full_name && <span className="form-error">{fieldErrors.full_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            autoComplete="email"
            disabled={status === 'loading'}
            className={fieldErrors.email ? 'input-error' : ''}
          />
          {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
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
          label="Confirm Password"
          value={formData.password_confirm}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={status === 'loading'}
          error={fieldErrors.password_confirm}
        />

        <div className="divider" style={{ margin: '8px 0' }}>
          <span>or continue with</span>
        </div>

        <button type="button" className="btn google-btn" onClick={handleGoogleSignIn} disabled={status === 'loading'}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button 
          type="submit" 
          className="btn btn-primary btn-block" 
          disabled={status === 'loading'}
          style={{ marginTop: '8px' }}
        >
          {status === 'loading' ? (
            <>
              <span className="spinner"></span>
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}