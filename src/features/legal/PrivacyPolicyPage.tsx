import { useEffect } from 'react';

const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'collection', title: '2. Information We Collect' },
  { id: 'usage', title: '3. How We Use Your Information' },
  { id: 'sharing', title: '4. How We Share Your Information' },
  { id: 'security', title: '5. Data Security' },
  { id: 'retention', title: '6. Data Retention' },
  { id: 'rights', title: '7. Your Data Protection Rights' },
  { id: 'cookies', title: '8. Cookies and Tracking' },
  { id: 'children', title: '9. Children\'s Privacy' },
  { id: 'changes', title: '10. Changes to This Policy' },
  { id: 'contact', title: '11. Contact Us' },
];

export default function PrivacyPolicyPage() {
  // Smooth scroll behavior for anchor links
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
            Privacy Policy
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
            <section id="introduction">
              <h2>1. Introduction</h2>
              <p>
                Welcome to Business Essentials Prime ("we", "our", or "us"). We are committed to protecting your privacy and ensuring the security of your personal and business data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoicing and business management software, website, and related services (collectively, the "Service").
              </p>
              <p>
                By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section id="collection">
              <h2>2. Information We Collect</h2>
              <p>We collect several types of information to provide and improve our Service:</p>
              
              <h3>a. Information You Provide Directly</h3>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register.</li>
                <li><strong>Business Information:</strong> Company name, address, tax identification number, and business logo for invoice customization.</li>
                <li><strong>Client Data:</strong> Names, email addresses, and contact details of the clients you add to the platform to generate invoices.</li>
                <li><strong>Payment Information:</strong> While we facilitate payments, we do not store your full credit card or bank details. Payment processing is handled securely by our third-party provider, Paystack.</li>
              </ul>

              <h3>b. Information Collected Automatically</h3>
              <ul>
                <li><strong>Usage Data:</strong> IP address, browser type, operating system, pages visited, time spent on pages, and other diagnostic data.</li>
                <li><strong>Cookies:</strong> We use essential and analytics cookies to improve your experience. (See Section 8).</li>
              </ul>
            </section>

            <section id="usage">
              <h2>3. How We Use Your Information</h2>
              <p>We use the collected data for various purposes, including:</p>
              <ul>
                <li>To provide, maintain, and improve the invoicing and client management features of the Service.</li>
                <li>To process transactions and send you related information, including purchase confirmations and invoices.</li>
                <li>To send administrative information, such as updates, security alerts, and support messages.</li>
                <li>To respond to your comments, questions, and customer service requests.</li>
                <li>To monitor and analyze usage patterns to improve the Service's performance and user experience.</li>
                <li>To detect, prevent, and address technical issues, fraud, or security breaches.</li>
              </ul>
            </section>

            <section id="sharing">
              <h2>4. How We Share Your Information</h2>
              <p>We do not sell, trade, or rent your personal identification information to others. We may share information only in the following situations:</p>
              <ul>
                <li><strong>Service Providers:</strong> We employ third-party companies to facilitate our Service (e.g., Paystack for payment processing, cloud hosting providers, email delivery services). These parties have access to your data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition of all or a portion of our business by another company, user information may be transferred.</li>
              </ul>
            </section>

            <section id="security">
              <h2>5. Data Security</h2>
              <p>
                The security of your data is important to us. We implement industry-standard administrative, technical, and physical security measures to protect your personal information. This includes:
              </p>
              <ul>
                <li><strong>Encryption:</strong> Data transmitted between your browser and our servers is encrypted using TLS/SSL.</li>
                <li><strong>Access Controls:</strong> Strict role-based access controls ensure only authorized personnel can access sensitive data.</li>
                <li><strong>Regular Audits:</strong> We conduct regular security assessments and maintain reliable backup systems to prevent data loss.</li>
              </ul>
              <p>
                However, please remember that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section id="retention">
              <h2>6. Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable tax and financial laws), resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p>
                If you delete your account, we will securely anonymize or delete your personal data within a reasonable timeframe, subject to legal retention requirements.
              </p>
            </section>

            <section id="rights">
              <h2>7. Your Data Protection Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal data, including rights under the Nigeria Data Protection Regulation (NDPR) and the General Data Protection Regulation (GDPR). These rights include:
              </p>
              <ul>
                <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at <a href="mailto:support@businessessentia.net" style={{ color: 'var(--primary)' }}>support@businessessentia.net</a>. We will respond to your request within 30 days.
              </p>
            </section>

            <section id="cookies">
              <h2>8. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. 
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section id="children">
              <h2>9. Children's Privacy</h2>
              <p>
                Our Service is not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us immediately so we can take necessary actions to remove that information.
              </p>
            </section>

            <section id="changes">
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section id="contact">
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
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