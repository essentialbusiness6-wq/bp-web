import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';

// Typed static data for roles (Can be replaced with API call later)
const OPEN_ROLES = [
  {
    id: '1',
    title: 'Senior Backend Engineer (Python/FastAPI)',
    location: '🌍 Remote',
    type: 'Full-time',
    department: 'Engineering',
    applyUrl: '/contact?role=Senior+Backend+Engineer',
  },
  {
    id: '2',
    title: 'Product Designer (UI/UX)',
    location: '📍 Hybrid (Ibadan, NG)',
    type: 'Full-time',
    department: 'Design',
    applyUrl: '/contact?role=Product+Designer',
  },
  {
    id: '3',
    title: 'Customer Success Manager',
    location: '🌍 Remote',
    type: 'Full-time',
    department: 'Operations',
    applyUrl: '/contact?role=Customer+Success+Manager',
  },
];

function FeatureCard({ icon, title, description, delay = 0 }) {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div 
      ref={ref} 
      className={`feature-card ${isVisible ? 'aos-animate' : ''}`} 
      style={{ textAlign: 'center', transitionDelay: `${delay}ms` }}
    >
      <div className="feature-icon" style={{ margin: '0 auto 20px' }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function CareersPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="badge">Join Our Team</span>
          <h1>Build the future of <span className="gradient-text">business management</span></h1>
          <p>We're a remote-first team on a mission to simplify invoicing and cash flow for millions of small businesses worldwide.</p>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Work With Us?</h2>
            <p>We believe in empowering our team just as much as we empower our customers.</p>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <FeatureCard 
              delay={0}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              title="Remote-First Culture"
              description="Work from anywhere. We care about your output and well-being, not where you sit."
            />
            <FeatureCard 
              delay={100}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
              title="Continuous Growth"
              description="Annual learning stipends, conference tickets, and dedicated time for skill development."
            />
            <FeatureCard 
              delay={200}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
              title="Health & Wellness"
              description="Comprehensive health coverage, mental health days, and flexible working hours."
            />
            <FeatureCard 
              delay={300}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>}
              title="Real Impact"
              description="See your work directly help thousands of businesses get paid faster and grow sustainably."
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <h2>Open Roles</h2>
            <p>Find your next challenge. Don't see a fit? Send your resume to <a href="mailto:careers@businessessentia.net" style={{ color: 'var(--primary)' }}>careers@businessessentia.net</a></p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {OPEN_ROLES.map((role, index) => (
              <div 
                key={role.id}
                className="about-card" 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', transitionDelay: `${index * 100}ms` }}
              >
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{role.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', color: 'var(--gray)' }}>
                    <span>{role.location}</span>
                    <span>•</span>
                    <span>{role.type}</span>
                    <span>•</span>
                    <span>{role.department}</span>
                  </div>
                </div>
                <Link to={role.applyUrl} className="btn btn-primary">Apply Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to make an impact?</h2>
            <p>Join a team that values your expertise, supports your growth, and is building something meaningful.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}