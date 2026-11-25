import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';
import type { Ref } from 'react';
import { Integration } from '../../types';

const INTEGRATIONS: Integration[] = [
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Our primary payment partner. Accept cards, bank transfers, and USSD directly from your invoices with automated split payments.',
    color: '#00C3F7',
    status: 'active',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.108 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
      </svg>
    ),
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect BEP to 3,000+ apps. Automatically create clients in your CRM or post paid invoice notifications to Slack.',
    color: '#FF4A00',
    status: 'active',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 6.937l-2.144 10.076c-.162.708-.57.884-1.155.552l-3.198-2.354-1.544 1.486c-.17.17-.313.313-.638.313l.227-3.21 5.849-5.286c.254-.227-.055-.353-.392-.127L7.68 13.742l-3.135-.98c-.683-.214-.697-.683.142-1.01l12.26-4.728c.568-.214 1.063.128.878 1.01z" />
      </svg>
    ),
  },
  {
    id: 'accounting',
    name: 'Accounting Export',
    description: 'Seamlessly export your financial data to QuickBooks, Xero, or standard CSV formats for your accountant.',
    color: '#2CA01C',
    status: 'coming_soon',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

function IntegrationCard({ integration, delay = 0 }: { integration: Integration; delay?: number }) {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      className={`integration-card ${isVisible ? 'aos-animate' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="integration-icon" style={{ color: integration.color }}>
        {integration.icon}
      </div>
      <h3>{integration.name}</h3>
      <p>{integration.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: integration.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: integration.status === 'active' ? 'var(--success)' : 'var(--warning)',
            textTransform: 'uppercase',
          }}
        >
          {integration.status === 'active' ? 'Available Now' : 'Coming Soon'}
        </span>
        {integration.status === 'active' && (
          <Link to="/entry" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
            Connect
          </Link>
        )}
      </div>
    </div>
  );
}

function Integration3DVisual() {
  return (
    <div className="integration-3d-visual">
      <div className="visual-stack">
        <div className="stack-card back"></div>
        <div className="stack-card middle"></div>
        <div className="stack-card main">
          <div className="card-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          <div className="card-body">
            <div className="skeleton-line w-60"></div>
            <div className="skeleton-line w-80"></div>
            <div className="skeleton-line w-40"></div>
            <div className="payment-badge">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.108 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
              </svg>
              <span>Paystack Verified</span>
            </div>
          </div>
        </div>
      </div>
      <div className="orbit-particles">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <main>
      <section className="features-hero">
        <div className="container">
          <div className="hero-content" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <span className="badge">Powerful Integrations</span>
            <h1>Connect with the tools <span className="gradient-text">you already use</span></h1>
            <p>Seamlessly integrate Business Essentials Prime with your favorite payment gateways, accounting software, and productivity tools.</p>
          </div>
          <div style={{ marginTop: '60px' }}>
            <Integration3DVisual />
          </div>
        </div>
      </section>

      <section className="integrations-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Integrations</h2>
            <p>Built to work flawlessly with the platforms that power your business.</p>
          </div>
          <div className="integrations-grid">
            {INTEGRATIONS.map((integration, index) => (
              <IntegrationCard key={integration.id} integration={integration} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Need a custom integration?</h2>
            <p>We're constantly adding new integrations based on user feedback. Let us know what tools you'd like to see next.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Request Integration</Link>
              <Link to="/entry" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}