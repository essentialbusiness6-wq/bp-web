import { ReactNode, RefObject } from 'react';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';

interface Benefit {
  text: string;
}

interface FeatureShowcaseProps {
  badge: string;
  title: string;
  description: string;
  benefits: Benefit[];
  ctaText: string;
  ctaLink: string;
  illustration: ReactNode;
  reverse?: boolean;
}

export default function FeatureShowcase({
  badge,
  title,
  description,
  benefits,
  ctaText,
  ctaLink,
  illustration,
  reverse = false,
}: FeatureShowcaseProps) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 }) as [
    RefObject<HTMLDivElement>,
    boolean,
  ];

  return (
    <div 
      ref={ref} 
      className={`showcase-item ${reverse ? 'reverse' : ''} ${isVisible ? 'aos-animate' : ''}`}
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : (reverse ? 'translateX(50px)' : 'translateX(-50px)'),
        transition: 'opacity 0.8s ease, transform 0.8s ease'
      }}
    >
      <div className="showcase-content">
        <span className="badge">{badge}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <ul className="benefit-list">
          {benefits.map((benefit, index) => (
            <li key={index}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {benefit.text}
            </li>
          ))}
        </ul>
        <Link to={ctaLink} className="btn btn-primary">{ctaText}</Link>
      </div>
      <div className="showcase-image">
        {illustration}
      </div>
    </div>
  );
}