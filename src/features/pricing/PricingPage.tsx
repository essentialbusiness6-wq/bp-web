import { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Types ---
interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  icon: React.ReactNode;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
}

interface FaqItem {
  question: string;
  answer: string;
}

// --- Icons ---
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --- Data ---
const PLANS: Plan[] = [
  {
    id: 'trial',
    name: 'Trial',
    description: 'Perfect for getting started',
    monthlyPrice: '₦0',
    yearlyPrice: '₦0',
    isPopular: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    features: [
      { text: 'Up to 30 invoices', included: true },
      { text: 'Basic client management', included: true },
      { text: 'Email support', included: true },
      { text: 'Payment tracking', included: false },
      { text: 'Automatic reminders', included: false },
      { text: 'Advanced analytics', included: false },
    ],
    ctaText: 'Start Free Trial',
    ctaLink: '/entry',
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For growing businesses',
    monthlyPrice: '₦1,000',
    yearlyPrice: '₦9,600',
    isPopular: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    features: [
      { text: 'Unlimited invoices', included: true },
      { text: 'Client & payment tracking', included: true },
      { text: 'Email reminders', included: true },
      { text: 'Invoice branding', included: true },
      { text: 'Priority support', included: true },
      { text: 'Team accounts', included: false },
    ],
    ctaText: 'Get Started',
    ctaLink: '/entry?plan=basic',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For scaling businesses',
    monthlyPrice: '₦10,000',
    yearlyPrice: '₦96,000',
    isPopular: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Online payment acceptance', included: true },
      { text: 'Automatic payment reminders', included: true },
      { text: 'Team & organization accounts', included: true },
      { text: 'Advanced analytics & reports', included: true },
      { text: 'API access & integrations', included: true },
      { text: 'Dedicated priority support', included: true },
    ],
    ctaText: 'Get Started',
    ctaLink: '/entry?plan=pro',
  },
];

const FAQS: FaqItem[] = [
  { question: 'Can I change plans later?', answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the credit will be applied to your next billing cycle.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and bank transfers through our secure payment processor Paystack. All payments are encrypted and PCI compliant.' },
  { question: 'Is there a free trial?', answer: 'Yes! Our Trial plan is completely free and lets you create up to 30 invoices. No credit card required. When you\'re ready for more features, you can upgrade to Basic or Pro.' },
  { question: 'What happens if I cancel?', answer: 'You can cancel anytime. Your account will remain active until the end of your current billing period. After that, you\'ll be moved to the free Trial plan and can still access your data.' },
  { question: 'Do you offer refunds?', answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied within the first 30 days, contact our support team for a full refund.' },
  { question: 'Do yearly plans save money?', answer: 'Yes! Yearly plans save you 20% compared to monthly billing. For example, Basic is ₦1,000/month (₦9,600/year) instead of ₦12,000 if billed monthly.' },
];

// --- Sub-Components ---
function PricingCard({ plan, isYearly }: { plan: Plan; isYearly: boolean }) {
  return (
    <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`} data-plan={plan.id}>
      {plan.isPopular && <span className="popular-badge">Most Popular</span>}
      <div className="plan-header">
        <div className="plan-icon">{plan.icon}</div>
        <h3>{plan.name}</h3>
        <p className="plan-description">{plan.description}</p>
      </div>
      <div className="plan-price">
        <span className="price-amount">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
        <span className="price-period">{plan.monthlyPrice === '₦0' ? 'forever' : isYearly ? 'per year' : 'per month'}</span>
      </div>
      <ul className="plan-features">
        {plan.features.map((feature, idx) => (
          <li key={idx} className={feature.included ? '' : 'disabled'}>
            {feature.included ? <CheckIcon /> : <CrossIcon />}
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      <Link to={plan.ctaLink} className={`btn btn-block ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}>
        {plan.ctaText}
      </Link>
    </div>
  );
}

function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-grid">
      {faqs.map((faq, index) => (
        <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
          <button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)} aria-expanded={openIndex === index}>
            <span>{faq.question}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main Page Component ---
export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <main>
      <section className="pricing-hero">
        <div className="container">
          <div className="hero-content" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <span className="badge">Simple, Transparent Pricing</span>
            <h1>Choose the plan that <span className="gradient-text">fits your business</span></h1>
            <p>Start free, upgrade when you're ready. No hidden fees, no surprises. Cancel anytime.</p>
            
            <div className="billing-toggle">
              <span className={`toggle-label ${!isYearly ? 'active' : ''}`} onClick={() => setIsYearly(false)}>Monthly</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={isYearly} onChange={(e) => setIsYearly(e.target.checked)} aria-label="Toggle yearly billing" />
                <span className="slider"></span>
              </label>
              <span className={`toggle-label ${isYearly ? 'active' : ''}`} onClick={() => setIsYearly(true)}>
                Yearly <span className="save-badge">Save 20%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="container">
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
            ))}
          </div>

          <div className="trust-section">
            <div className="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>Secure Payments</span>
            </div>
            <div className="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span>Cancel Anytime</span>
            </div>
            <div className="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <span>30-Day Money Back</span>
            </div>
            <div className="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span>No Hidden Fees</span>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison-section">
        <div className="container">
          <div className="section-header">
            <h2>Compare all features</h2>
            <p>See exactly what you get with each plan</p>
          </div>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Trial</th>
                  <th>Basic</th>
                  <th>Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={4} className="category-header">Invoicing</td></tr>
                <tr><td>Number of invoices</td><td>30</td><td>Unlimited</td><td>Unlimited</td></tr>
                <tr><td>Custom branding</td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Logo on invoices</td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Multi-currency support</td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td colSpan={4} className="category-header">Client Management</td></tr>
                <tr><td>Client profiles</td><td className="limited">Basic</td><td className="yes">Full</td><td className="yes">Full</td></tr>
                <tr><td>Payment tracking</td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Automatic reminders</td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td colSpan={4} className="category-header">Payments</td></tr>
                <tr><td>Online payment acceptance</td><td className="no"><CrossIcon /></td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Payment links</td><td className="no"><CrossIcon /></td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td colSpan={4} className="category-header">Analytics & Reports</td></tr>
                <tr><td>Basic reports</td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Advanced analytics</td><td className="no"><CrossIcon /></td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Export reports (PDF/CSV)</td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td colSpan={4} className="category-header">Team & Collaboration</td></tr>
                <tr><td>Team members</td><td>1</td><td>1</td><td>Unlimited</td></tr>
                <tr><td>Organization accounts</td><td className="no"><CrossIcon /></td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td colSpan={4} className="category-header">Support & Integrations</td></tr>
                <tr><td>Email support</td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Priority support</td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>API access</td><td className="no"><CrossIcon /></td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td></tr>
                <tr><td>Third-party integrations</td><td className="no"><CrossIcon /></td><td className="no"><CrossIcon /></td><td className="yes"><CheckIcon /></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently asked questions</h2>
            <p>Everything you need to know about our pricing</p>
          </div>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to streamline your business?</h2>
            <p>Join thousands of businesses already using Business Essentials Prime to manage their invoicing and get paid faster.</p>
            <div className="cta-actions">
              <Link to="/entry" className="btn btn-primary btn-lg">Start Free Trial</Link>
              <Link to="/contact" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Talk to Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}