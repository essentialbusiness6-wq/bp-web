import { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Show preloader for 1.5 seconds, then fade out
    const timer = setTimeout(() => {
      setVisible(false);
      // Wait for CSS fade-out transition to complete before unmounting
      setTimeout(onComplete, 500); 
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className={`preloader ${visible ? 'visible' : 'hidden'}`}>
      <div className="preloader-content">
        <img src="/static/media/app-logo.png" alt="BEP Logo" className="preloader-logo" />
        <h1 className="preloader-title">Business Essentials Prime</h1>
        <div className="preloader-spinner"></div>
      </div>
    </div>
  );
}