import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Description of Service' },
  { id: 'accounts', title: '3. User Accounts & Responsibilities' },
  { id: 'acceptable-use', title: '4. Acceptable Use Policy' },
  { id: 'payments', title: '5. Subscription & Payment Terms' },
  { id: 'intellectual-property', title: '6. Intellectual Property' },
  { id: 'third-party', title: '7. Third-Party Services & Integrations' },
  { id: 'liability', title: '8. Limitation of Liability' },
  { id: 'indemnification', title: '9. Indemnification' },
  { id: 'termination', title: '10. Termination' },
  { id: 'governing-law', title: '11. Governing Law & Dispute Resolution' },
  { id: 'contact', title: '12. Contact Information' },
];

export default function TermsOfServicePage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main style={{ padding: '120px 0 80px', background: 'var(--light)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge">Legal</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Terms of Service
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Last Updated: November 2024
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '48px', alignItems: 'start' }}>
          
          {/* Table of Contents (Sticky on Desktop) */}
          <aside style={{ position: 'sticky', top: '100px', display: 'none' }} className="toc-desktop">
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--medium-gray)', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Contents
            </h3>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a 
                      href={`#${section.id}`} 
                      style={{ 
                        color: 'var(--gray)', 
                        fontSize: '0.9rem', 
                        textDecoration: 'none', 
                        transition: 'var(--transition-fast)',
                        display: 'block',
                        padding: '4px 0'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray)')}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <article className="legal-content">
            <section id="acceptance">
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to Business Essentials Prime ("we", "our", or "us"). These Terms of Service ("Terms") govern your access to and use of the Business Essentials Prime website, software, and related services (collectively, the "Service"). 
              </p>
              <p>
                By creating an account or using the Service, you agree to be bound by these Terms. If you are using the Service on behalf of a company or organization, you represent and warrant that you have the authority to bind that entity to these Terms. If you do not agree to these Terms, you must not access or use the Service.
              </p>
            </section>

            <section id="description">
              <h2>2. Description of Service</h2>
              <p>
                Business Essentials Prime is a cloud-based business management and invoicing platform designed to help freelancers, entrepreneurs, and organizations create invoices, manage clients, track payments, and automate financial workflows. 
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </section>

            <section id="accounts">
              <h2>3. User Accounts & Responsibilities</h2>
              <p>To access certain features of the Service, you must register for an account. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information during the registration process.</li>
                <li>Maintain and promptly update your account information to keep it accurate and complete.</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                <li>Notify us immediately at <a href="mailto:support@businessessentia.net">support@businessessentia.net</a> if you discover or suspect any security breaches related to your account.</li>
              </ul>
              <p>
                You are solely responsible for all activities that occur under your account, regardless of whether the activities are authorized by you or undertaken by you, your employees, or a third party.
              </p>
            </section>

            <section id="acceptable-use">
              <h2>4. Acceptable Use Policy</h2>
              <p>You agree not to use the Service to:</p>
              <ul>
                <li>Violate any applicable local, state, national, or international law or regulation.</li>
                <li>Transmit any material that is unlawful, defamatory, obscene, or otherwise objectionable.</li>
                <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                <li>Interfere with or disrupt the Service, servers, or networks connected to the Service.</li>
                <li>Attempt to gain unauthorized access to any portion of the Service, other accounts, or computer systems or networks connected to the Service.</li>
                <li>Use the Service to send unsolicited commercial messages (spam) or harvest user data.</li>
              </ul>
            </section>

            <section id="payments">
              <h2>5. Subscription & Payment Terms</h2>
              <p>
                Certain features of the Service require a paid subscription. By subscribing, you agree to the following:
              </p>
              <ul>
                <li><strong>Billing:</strong> You will be charged on a recurring basis (monthly or annually) depending on the subscription plan you select.</li>
                <li><strong>Payment Processing:</strong> All payments are processed securely through our third-party payment gateway, Paystack. We do not store your full credit card or bank account details on our servers.</li>
                <li><strong>Auto-Renewal:</strong> Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing cycle.</li>
                <li><strong>Refunds:</strong> Fees are non-refundable except as required by law or as explicitly stated in our <Link to="/privacy-policy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link> or specific refund guarantees.</li>
                <li><strong>Price Changes:</strong> We reserve the right to change subscription fees at any time. We will provide at least 30 days' notice before any price changes take effect.</li>
              </ul>
            </section>

            <section id="intellectual-property">
              <h2>6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, functionality, design, and code are and will remain the exclusive property of Business Essentials Prime and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p>
                You retain all rights to the data, invoices, and client information you upload to the Service. By using the Service, you grant us a limited, non-exclusive, worldwide license to host, store, and process your data solely for the purpose of providing the Service to you.
              </p>
            </section>

            <section id="third-party">
              <h2>7. Third-Party Services & Integrations</h2>
              <p>
                The Service may contain links to third-party websites or services (e.g., Paystack for payment processing) that are not owned or controlled by Business Essentials Prime. 
              </p>
              <p>
                We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused by your use of any such third-party services.
              </p>
            </section>

            <section id="liability">
              <h2>8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, Business Essentials Prime, its directors, employees, partners, agents, suppliers, or affiliates, shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul>
                <li>Your access to or use of or inability to access or use the Service;</li>
                <li>Any conduct or content of any third party on the Service;</li>
                <li>Any content obtained from the Service; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ul>
            </section>

            <section id="indemnification">
              <h2>9. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Business Essentials Prime and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of your use and access of the Service, or a breach of these Terms.
              </p>
            </section>

            <section id="termination">
              <h2>10. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            <section id="governing-law">
              <h2>11. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. 
              </p>
              <p>
                Any dispute arising out of or relating to these Terms or the Service shall first be attempted to be resolved amicably through good-faith negotiations. If a resolution cannot be reached within 30 days, the dispute shall be submitted to binding arbitration in Ibadan, Oyo State, Nigeria, in accordance with the Arbitration and Conciliation Act of Nigeria.
              </p>
            </section>

            <section id="contact">
              <h2>12. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><strong>By email:</strong> <a href="mailto:support@businessessentia.net" style={{ color: 'var(--primary)' }}>support@businessessentia.net</a></li>
                <li><strong>By phone:</strong> +234 802-604-8215</li>
                <li><strong>By mail:</strong> Ibadan, Oyo State, Nigeria</li>
              </ul>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}