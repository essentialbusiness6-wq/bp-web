import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';

// Reusable About Card Component
function AboutCard({ icon, title, children, delay = 0 }) {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div 
      ref={ref} 
      className={`about-card feature-card ${isVisible ? 'aos-animate' : ''}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="feature-icon" style={{ marginBottom: '16px' }}>
        {icon}
      </div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function AboutHero() {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="badge">Our Story</span>
        <h1>Built by Professionals, <br />for Professionals</h1>
        <p className="story-intro" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dark)', marginBottom: '24px' }}>
          It started with a simple question: <span className="gradient-text">Why does knowing if you've been paid still feel like guesswork?</span>
        </p>
        <p style={{ maxWidth: '800px', margin: '0 auto 16px' }}>
          As freelancers and small business owners ourselves, we noticed a frustrating pattern. Invoicing, payment tracking, and client history were treated as three separate problems, juggled across disjointed apps and messy spreadsheets.
        </p>
        <p style={{ maxWidth: '800px', margin: '0 auto' }}>
          We realized these challenges didn't have to be separate. So, we built <strong>Business Essentials Prime</strong> to bring them together in one secure, intuitive platform.
        </p>
      </div>
    </section>
  );
}

function AboutGrid() {
  return (
    <section className="about-grid">
      <div className="container">
        <div className="about-content">
          <AboutCard 
            delay={0}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            }
            title="Our Mission"
          >
            <p>To empower freelancers and small businesses with simple, reliable invoicing tools that improve cash flow and support sustainable growth.</p>
          </AboutCard>

          <AboutCard 
            delay={100}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2v1" />
                <path d="M12 7a5 5 0 0 1 5 5c0 2.5-2 4.5-4 6h-2c-2-1.5-4-3.5-4-6a5 5 0 0 1 5-5z" />
              </svg>
            }
            title="How We Started"
          >
            <p>In 2025, our founding team spent more time chasing late invoices than building products. We developed an internal tool that solved this, and it organically grew into Business Essentials Prime.</p>
          </AboutCard>

          <AboutCard 
            delay={200}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            title="Our Commitment"
          >
            <p>We are deeply committed to transparent pricing, robust data privacy, and building software that respects your time. No hidden fees, no lock-in contracts.</p>
          </AboutCard>

          <AboutCard 
            delay={300}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            }
            title="Our Core Values"
          >
            <ul className="values-list">
              <li><strong>Simplicity First:</strong> No bloat, no unnecessary features. Just powerful tools that work.</li>
              <li><strong>Security by Design:</strong> Bank-grade encryption and reliable backups to protect your data.</li>
              <li><strong>Customer Obsessed:</strong> Responsive support and user-driven roadmap voting.</li>
            </ul>
          </AboutCard>
        </div>
        
        <div className="about-cta" style={{ textAlign: 'center', padding: '48px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--dark)' }}>Want to join our team or partner with us?</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>We are always looking for passionate individuals who share our vision.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">Get in Touch</Link>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutGrid />
    </main>
  );
}