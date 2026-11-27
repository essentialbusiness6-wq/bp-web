import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../../components/ui/AnimatedBackground';
import PasswordInput from '../../../components/ui/PasswordInput';
import { loginUser, verify2FA, verifyBackupCode, googleSignIn } from '../services/authServices';
import { useAuth } from '../../../hooks/useAuth';

type LoginView = 'login' | '2fa' | 'backup';

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [view, setView] = useState<LoginView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [backupCode, setBackupCode] = useState('');

  useEffect(() => {
    if (window.google?.accounts) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (view !== '2fa' || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await loginUser({ email, password });
      if (response.requires_2fa) {
        setTempToken(response.temp_token || '');
        setView('2fa');
        setTimeLeft(30);
      } else {
        await refreshUser();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FA = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await verify2FA({ temp_token: tempToken, code });
      await refreshUser();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid 2FA code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await verifyBackupCode({ temp_token: tempToken, backup_code: backupCode });
      await refreshUser();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid backup code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!window.google?.accounts) {
      setError('Google Sign-In is loading. Please try again in a moment.');
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: '706651628151-g84mt1cfhamp6etoji1ntt3i431nuck0.apps.googleusercontent.com',
      callback: async (response: any) => {
        setIsLoading(true);
        setError('');
        try {
          await googleSignIn({ credential: response.credential });
          await refreshUser();
          navigate('/dashboard');
        } catch (err: any) {
          setError(err.message || 'Google Sign-In failed');
        } finally {
          setIsLoading(false);
        }
      },
    });
    
    window.google.accounts.id.prompt();
  };

  return (
    <div className="signin-page">
      <AnimatedBackground variant="auth" intensity="medium" />
      
      <div className="container">
        <div className="logo">
          <div className="logo-orbit"></div>
          <div className="app-logo">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h1>Business Essentials Prime</h1>
        </div>

        {/* 1. Login Form */}
        <div className={`wrapper ${view === 'login' ? 'active' : ''}`} id="login">
          <form onSubmit={handleLogin}>
            <h2>Access Your Receipts</h2>
            {error && view === 'login' && (
              <div className="auth-alert auth-alert--error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="input-box">
              <input className="joy" type="text" name="username" placeholder="Username or Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label className="happy">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </label>
            </div>
            
            {/* Using the shared PasswordInput component with the icon prop */}
            <PasswordInput
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              icon={
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              }
            />

            <div className="remember-forget">
              <label className="checkbox-label">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> 
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn loginbtn" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : 'Sign In'}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <button type="button" className="btn google-btn" onClick={handleGoogleSignIn} disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <nav className="bottom-nav">
              <Link to="/register" className="nav-item">
                <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 1-12 0"></path><path d="M12 2v8"></path><path d="M21 12h-9a3 3 0 0 0-3 3v6"></path><path d="M3 12h9a3 3 0 0 1 3 3v6"></path></svg>
                Sign up
              </Link>
            </nav>
          </form>
        </div>
        
        {/* 2. 2FA Verification Form */}
        <div className={`wrapper ${view === '2fa' ? 'active' : ''}`} id="verify-2fa">
          <form onSubmit={handle2FA}>
            <h2>Two-Factor Authentication</h2>
            <p className="verify-subtitle">Enter the 6-digit code from your authenticator app</p>
            {error && view === '2fa' && (
              <div className="auth-alert auth-alert--error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="input-box code-input-box">
              <input className="joy" type="text" name="verification_code" placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} inputMode="numeric" autoComplete="one-time-code" required />
              <label className="happy">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </label>
            </div>

            <div className="code-timer">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
                <polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></polyline>
              </svg>
              <span>Code expires in <strong>{timeLeft}</strong>s</span>
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : (
                <>
                  <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2"></path><polyline points="9 12 11 14 15 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline></svg>
                  Verify & Sign In
                </>
              )}
            </button>

            <div className="verify-options">
              <button type="button" className="verify-link" onClick={() => { setTimeLeft(30); setError(''); }}>
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M21 12a9 9 0 1 1-9-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><polyline points="21 3 21 9 15 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline></svg>
                Resend Code
              </button>
              <span className="divider-dot">•</span>
              <button type="button" className="verify-link" onClick={() => { setView('backup'); setError(''); }}>
                <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
                Use Backup Code
              </button>
            </div>

            <div className="back-to-login">
              <button type="button" className="back-link" onClick={() => { setView('login'); setError(''); }}>
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 12H5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><polyline points="12 19 5 12 12 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline></svg>
                Back to Sign In
              </button>
            </div>
          </form>
        </div>

        {/* 3. Backup Code Form */}
        <div className={`wrapper ${view === 'backup' ? 'active' : ''}`} id="backup-code">
          <form onSubmit={handleBackup}>
            <h2>Backup Code</h2>
            <p className="verify-subtitle">Enter one of your backup recovery codes</p>
            {error && view === 'backup' && (
              <div className="auth-alert auth-alert--error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="input-box">
              <input className="joy" type="text" name="backup_code" placeholder="XXXX-XXXX-XXXX" value={backupCode} onChange={(e) => setBackupCode(e.target.value)} required />
              <label className="happy">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </label>
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : 'Verify Backup Code'}
            </button>

            <div className="back-to-login">
              <button type="button" className="back-link" onClick={() => { setView('2fa'); setError(''); }}>
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 12H5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path><polyline points="12 19 5 12 12 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline></svg>
                Back to 2FA
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
