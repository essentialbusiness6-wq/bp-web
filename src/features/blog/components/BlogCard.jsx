import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';

// Helper to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });
};

// Helper to get category color
const getCategoryColor = (category) => {
  const colors = {
    business: 'var(--primary)',
    productivity: 'var(--success)',
    finance: 'var(--warning)',
    marketing: '#ec4899',
    technology: 'var(--accent)',
  };
  return colors[category?.toLowerCase()] || 'var(--gray)';
};

export default function BlogCard({ post, delay = 0 }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <article 
      ref={ref} 
      className={`blog-card ${isVisible ? 'aos-animate' : ''}`} 
      style={{ transitionDelay: `${delay}ms`, display: 'flex', flexDirection: 'column' }}
    >
      <div className="blog-image" style={{ height: '200px', borderRadius: 'var(--radius) var(--radius) 0 0', position: 'relative', overflow: 'hidden' }}>
        {post.image_url ? (
          <img 
            src={post.image_url} 
            alt={post.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--light-gray)' }} />
        )}
      </div>
      
      <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderTop: 'none', borderRadius: '0 0 var(--radius) var(--radius)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--gray)' }}>
          <span style={{ color: getCategoryColor(post.category), fontWeight: 600, textTransform: 'capitalize' }}>
            {post.category}
          </span>
          <span>•</span>
          <span>{formatDate(post.published_date)}</span>
          <span>•</span>
          <span>{post.read_time_minutes} min read</span>
        </div>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--dark)', lineHeight: 1.4 }}>
          {post.title}
        </h3>
        
        <p style={{ color: 'var(--gray)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
          {post.excerpt}
        </p>
        
        <Link to={`/blog/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}>
          Read Article 
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </article>
  );
}