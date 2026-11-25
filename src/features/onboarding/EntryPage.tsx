import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../components/ui/AnimatedBackground';

const STEPS = [
  {
    id: 'invoicing',
    title: 'Create Invoices in Seconds',
    description: 'Build professional, branded invoices with smart auto-calculations and send them instantly.',
  },
  {
    id: 'clients',
    title: 'Manage Clients Effortlessly',
    description: 'Keep all contact details, project history, and communication logs in one centralized hub.',
  },
  {
    id: 'payments',
    title: 'Track Payments in Real-Time',
    description: 'Know exactly who has paid, who is overdue, and get your money faster with automated reminders.',
  },
];

export default function EntryPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToRegister = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigate('/register');
  };

  // Auto-advance logic
  useEffect(() => {
    if (currentStep < STEPS.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3500); // 3.5 seconds per step
    } else {
      // On the last step, wait 3 seconds then redirect
      timerRef.current = setTimeout(() => {
        navigate('/register');
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, navigate]);

  return (
    <div className="entry-page">
      <AnimatedBackground variant="dashboard" intensity="low" />
      
      {/* Skip Button */}
      <button className="skip-btn" onClick={goToRegister}>
        Skip Intro 
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <div className="entry-container">
        {/* 3D Stage */}
        <div className="stage-3d">
          {currentStep === 0 && (
            <div className="anim-3d anim-invoice" key="invoice">
              <div className="doc-card">
                <div className="doc-header">
                  <div className="doc-logo"></div>
                  <div className="doc-lines">
                    <div className="line w-60"></div>
                    <div className="line w-40"></div>
                  </div>
                </div>
                <div className="doc-body">
                  <div className="line w-80"></div>
                  <div className="line w-70"></div>
                  <div className="line w-90"></div>
                </div>
                <div className="doc-footer">
                  <div className="line w-30"></div>
                </div>
                <div className="stamp-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>SENT</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="anim-3d anim-clients" key="clients">
              <div className="orbit-hub">
                <div className="hub-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="orbit-ring ring-1">
                  <div className="orbit-node node-1">JD</div>
                  <div className="orbit-node node-2">AS</div>
                </div>
                <div className="orbit-ring ring-2">
                  <div className="orbit-node node-3">MK</div>
                  <div className="orbit-node node-4">TL</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="anim-3d anim-payments" key="payments">
              <div className="chart-base">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
              </div>
              <div className="floating-coin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <div className="coin-glow"></div>
              </div>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="entry-text">
          <h1 className="entry-title">{STEPS[currentStep].title}</h1>
          <p className="entry-description">{STEPS[currentStep].description}</p>
          
          {/* Progress Dots */}
          <div className="progress-dots">
            {STEPS.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>

          <button className="btn btn-primary btn-lg entry-cta" onClick={goToRegister}>
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}