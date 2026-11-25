import StatCounter from './components/StatCounter';
import FeatureShowcase from './components/FeatureShowcase';

export default function FeaturesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge">Powerful Features</span>
            <h1>Everything You Need to <span className="gradient-text">Run Your Business</span></h1>
            <p>From invoicing to analytics, Business Essentials Prime provides all the tools you need to streamline operations, get paid faster, and grow your business.</p>
            <div className="hero-actions">
              <a href="/entry" className="btn btn-primary btn-lg">Start Free Trial</a>
              <a href="#showcase" className="btn btn-secondary btn-lg">Watch Demo</a>
            </div>
          </div>
          
          <div className="hero-stats">
            <StatCounter target={10} suffix="+" label="Active Users" />
            <StatCounter target={50} suffix="+" label="Countries" />
            <StatCounter target={99} suffix=".9%" label="Uptime" />
            <StatCounter target={5} suffix=".0" label="Star Rating" />
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="feature-showcase" id="showcase">
        <div className="container">
          
          {/* Feature 1: Invoicing (3D Card Illustration) */}
          <FeatureShowcase
            badge="Invoice Creation"
            title="Create Professional Invoices in Seconds"
            description="Our intuitive invoice builder lets you create stunning, professional invoices with just a few clicks. Choose from customizable templates and let our smart calculations handle the rest."
            benefits={[
              { text: "Drag-and-drop interface" },
              { text: "Auto-calculate taxes and totals" },
              { text: "Export to PDF or send via email" }
            ]}
            ctaText="Try It Free"
            ctaLink="/entry"
            illustration={
              <div className="card-3d-wrapper">
                <div className="card-3d">
                  <div className="pulse-badge">✓ Paid</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--light-gray)', borderRadius: '8px' }}></div>
                    <div style={{ width: '80px', height: '12px', background: 'var(--light-gray)', borderRadius: '6px', marginTop: '14px' }}></div>
                  </div>
                  <div className="mock-line" style={{ width: '60%' }}></div>
                  <div className="mock-line" style={{ width: '80%' }}></div>
                  <div className="mock-line" style={{ width: '40%', marginTop: 'auto', background: 'var(--primary)', opacity: 0.2 }}></div>
                </div>
                {/* Decorative background elements */}
                <div style={{ position: 'absolute', top: '20px', left: '-20px', width: '100%', height: '100%', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', zIndex: -1, opacity: 0.5 }}></div>
              </div>
            }
          />

          {/* Feature 2: Client Management (Orbiting Nodes Illustration) */}
          <FeatureShowcase
            badge="Client Management"
            title="Keep All Your Clients Organized"
            description="Never lose track of a client again. Our comprehensive client management system keeps all contact details, project history, and communication logs in one centralized location."
            benefits={[
              { text: "Complete client profiles" },
              { text: "Project and invoice linking" },
              { text: "Communication timeline" }
            ]}
            ctaText="Get Started"
            ctaLink="/entry"
            reverse
            illustration={
              <div className="orbit-container">
                <div className="orbit-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '32px', height: '32px' }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="orbit-ring orbit-ring-1">
                  <div className="orbit-node" style={{ top: '-20px', left: '50%', transform: 'translateX(-50%)' }}>JD</div>
                  <div className="orbit-node" style={{ bottom: '-20px', left: '50%', transform: 'translateX(-50%)' }}>AS</div>
                </div>
                <div className="orbit-ring orbit-ring-2">
                  <div className="orbit-node" style={{ top: '50%', right: '-20px', transform: 'translateY(-50%)' }}>MK</div>
                  <div className="orbit-node" style={{ top: '50%', left: '-20px', transform: 'translateY(-50%)' }}>TL</div>
                </div>
              </div>
            }
          />

        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Streamline Your Business?</h2>
            <p>Join thousands of businesses already using Business Essentials Prime to manage their invoicing and get paid faster.</p>
            <div className="cta-actions">
              <a href="/entry" className="btn btn-primary btn-lg">Start Free Trial</a>
              <a href="/contact" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Contact Sales</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}