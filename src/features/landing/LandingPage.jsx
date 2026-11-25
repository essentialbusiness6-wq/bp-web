import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

function HeroSection() {
  return (
    <section className="hero" id="get-started">
      <div className="container">
        <div className="hero-content">
          <span className="badge">Professional invoicing & client management</span>
          <h1>Stop wondering <br />who <span className="gradient-text">paid you</span></h1>
          <p>Business Essentials Prime is an invoicing and client management software built for freelancers and small business owners. Send professional invoices, get paid on time, and keep every client's history organized.</p>
          <div className="hero-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="/entry" className="btn btn-primary btn-lg">
              Start Free Trial 
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="/features" className="btn btn-secondary btn-lg">See How It Works</a>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--medium-gray)', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '20px' }}>
            <span>No credit card required</span><span>•</span><span>30 free invoices</span><span>•</span><span>Cancel anytime</span>
          </div>
        </div>
        
        {/* Enhanced Animated Mockup */}
        <div className="hero-visual">
          <div className="dashboard-mockup animated-mockup">
            <div className="mockup-header">
              <div className="mockup-dots"><span></span><span></span><span></span></div>
              <span>Business Essentials Prime Dashboard</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-stat-row">
                <span className="mockup-stat-label">Total Revenue</span>
                <span className="mockup-stat-value">₦ 1,250,000</span>
              </div>
              <div className="mockup-stat"><span className="mockup-bar bar-1"></span></div>
              <div className="mockup-stat"><span className="mockup-bar bar-2"></span></div>
              <div className="mockup-stat"><span className="mockup-bar bar-3"></span></div>
              
              {/* Animated Toast Notification */}
              <div className="mockup-toast">
                <div className="toast-icon">✓</div>
                <div className="toast-text">
                  <strong>Invoice #INV-042 Paid</strong>
                  <span>₦ 150,000 received from Client A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div ref={ref} className={`feature-card ${isVisible ? 'aos-animate' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="features-grid-section" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Built around what every business needs</h2>
          <p>Powerful tools designed to simplify billing, reduce admin work, and keep your cash flow healthy.</p>
        </div>
        <div className="features-grid">
          <FeatureCard 
            delay={0}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>}
            title="Smart Invoicing"
            description="Create professional invoices in seconds with auto-calculations, tax rules, and multi-currency support built-in."
          />
          <FeatureCard 
            delay={100}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
            title="Client Management"
            description="Every client's contact info, project history, and invoice records live in one place, so you always know where things stand."
          />
          <FeatureCard 
            delay={200}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>}
            title="Automated Reminders"
            description="Set it once. Polite reminders go out on schedule automatically, so chasing payments is never on your to-do list again."
          />
          <FeatureCard 
            delay={300}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>}
            title="Insightful Reports"
            description="A live dashboard of revenue, outstanding payments, and growth trends, so your business state is always one glance away."
          />
        </div>
      </div>
    </section>
  );
}

// NEW: Workflow Section illustrating the platform's core value
function WorkflowSection() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  
  return (
    <section className="workflow-section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>From invoice to income, effortlessly.</h2>
          <p>Three simple steps to get your business paid faster.</p>
        </div>
        <div className={`workflow-steps ${isVisible ? 'animate-step-1' : ''}`}>
          <div className="workflow-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            <h3>1. Create</h3>
            <p>Build a professional invoice in seconds using smart, pre-filled templates.</p>
          </div>
          
          <div className="workflow-connector">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          
          <div className="workflow-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </div>
            <h3>2. Share</h3>
            <p>Send a secure, branded payment link directly to your client's email or phone.</p>
          </div>
          
          <div className="workflow-connector">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          
          <div className="workflow-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3>3. Get Paid</h3>
            <p>Clients pay securely via Paystack. Money lands directly in your account.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card">
          <h2>Run your business without the guesswork.</h2>
          <p>Send the invoice. Watch the payment land. Know exactly who you're working with and where things stand.</p>
          <div className="cta-actions">
            <a href="/entry" className="btn btn-primary btn-lg">Get Started Free</a>
            <a href="/contact" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Talk to Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  );
}