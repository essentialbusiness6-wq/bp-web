export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/static/media/app-logo.png" alt="Business Essentials Prime Logo" />
            <p>Modern invoicing & business management for teams that value time, accuracy, and professional presentation.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <ul><li><a href="/features">Features</a></li><li><a href="/pricing">Pricing</a></li><li><a href="/integrations">Integrations</a></li></ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="/careers">Careers</a></li></ul>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <ul><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms-of-service">Terms of Service</a></li></ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Business Essentials Prime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}