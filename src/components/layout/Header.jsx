import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`} id="header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <img src="/static/media/app-logo.png" alt="Business Essentials Prime Logo" />
          <span>Business Essentials Prime</span>
        </NavLink>
        
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Home</NavLink></li>
            <li><NavLink to="/features" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Features</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>About</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Contact</NavLink></li>
            <li><NavLink to="/login" className="btn btn-secondary" onClick={closeMenu}>Log In</NavLink></li>
            <li><NavLink to="/entry" className="btn btn-primary" onClick={closeMenu}>Get Started</NavLink></li>
          </ul>
        </nav>

        <button className="mobile-toggle" aria-label="Toggle navigation" aria-expanded={isMenuOpen} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
}