import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // TODO: Replace with actual API call to /api/v1/newsletter/subscribe
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section className="newsletter-section" style={{ padding: '80px 0', background: 'var(--light)' }}>
      <div className="container">
        <div className="cta-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--dark)' }}>
          <h2 style={{ color: 'var(--dark)' }}>Stay Updated</h2>
          <p style={{ color: 'var(--gray)' }}>Subscribe to our newsletter and get the latest business insights delivered to your inbox weekly.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '400px', margin: '24px auto 0', flexWrap: 'wrap' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={status === 'loading' || status === 'success'}
              style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', background: 'var(--light)', color: 'var(--dark)', minWidth: '200px' }} 
            />
            <button type="submit" className="btn btn-primary" disabled={status === 'loading' || status === 'success'}>
              {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          
          {status === 'success' && (
            <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '12px', fontWeight: 600 }}>
              ✅ Successfully subscribed! Check your inbox.
            </p>
          )}
          <p style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', marginTop: '12px' }}>No spam, unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}