
import { useState, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '../../services/api/client';

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await apiClient('/api/v1/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'general', message: '' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again or email us directly.');
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="badge">Support & Sales</span>
          <h1>Let's Talk</h1>
          <p>Have questions, need a demo, or want to discuss enterprise options? We're here to help you streamline your business.</p>
        </div>
      </section>

      <section className="contact-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Form */}
            <div className="contact-form-card">
              <h3>Send us a message</h3>
              
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '32px', height: '32px' }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '8px' }}>Message Sent!</h4>
                  <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>Thank you for reaching out. We'll get back to you within 2 hours.</p>
                  <button className="btn btn-secondary" onClick={() => setStatus('idle')}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input 
                        type="text" id="name" name="name" required placeholder="Jane Doe"
                        value={formData.name} onChange={handleChange} disabled={status === 'loading'}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" id="email" name="email" required placeholder="jane@company.com"
                        value={formData.email} onChange={handleChange} disabled={status === 'loading'}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select 
                      id="subject" name="subject" required 
                      value={formData.subject} onChange={handleChange} disabled={status === 'loading'}
                      style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" name="message" rows={5} required placeholder="How can we help you?"
                      value={formData.message} onChange={handleChange} disabled={status === 'loading'}
                      style={{ resize: 'vertical' }}
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {errorMessage}
                    </div>
                  )}
                  
                  <button 
                    type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }}></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="contact-info-card">
              <h3>Contact Information</h3>
              
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <strong>Email Support</strong>
                  <p><a href="mailto:support@businessessentia.net">support@businessessentia.net</a></p>
                  <small>Response within 2 hours (Mon-Fri)</small>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <strong>Phone</strong>
                  <p><a href="tel:+2348026048215">+234 802-604-8215</a></p>
                  <small>9:00 AM - 6:00 PM WAT</small>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <strong>Headquarters</strong>
                  <p>Ibadan, Oyo State, Nigeria</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}