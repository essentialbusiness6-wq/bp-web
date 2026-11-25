import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../ui/AnimatedBackground';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <AnimatedBackground variant="auth" intensity="medium" />
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <img src="/static/media/app-logo.png" alt="Business Essentials Prime Logo" />
              <span>Business Essentials Prime</span>
            </Link>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          
          <div className="auth-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}