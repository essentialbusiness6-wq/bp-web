import { useState, useEffect } from 'react';
import { getBlogPosts } from './services/blogService';
import BlogCard from './components/BlogCard';
import NewsletterSection from './components/NewsletterSection';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { BlogPost } from '../../types'; // <-- Import the type

const CATEGORIES = ['all', 'business', 'technology', 'finance', 'marketing', 'productivity'];

function BlogCardSkeleton() {
  return (
    <div className="blog-card" style={{ display: 'flex', flexDirection: 'column', opacity: 0.6 }}>
      <div style={{ height: '200px', background: 'var(--light-gray)', borderRadius: 'var(--radius) var(--radius) 0 0', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderTop: 'none', borderRadius: '0 0 var(--radius) var(--radius)', flex: 1 }}>
        <div style={{ height: '16px', width: '60%', background: 'var(--light-gray)', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '24px', width: '90%', background: 'var(--light-gray)', borderRadius: '4px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '16px', width: '100%', background: 'var(--light-gray)', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '16px', width: '70%', background: 'var(--light-gray)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function BlogPage() {
  // FIX 1: Explicitly type the array as BlogPost[] to prevent "never[]" inference
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // FIX 2: Explicitly type as string | null to allow setting a string error message
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null); // Now valid: null is allowed
      
      try {
        const response = await getBlogPosts({ 
          category: activeCategory, 
          search: debouncedSearch 
        });
        
        // Type assertion or safe fallback based on your apiClient return shape
        setPosts(response.posts || []); 
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        // Now valid: string is allowed by string | null
        setError('Failed to load articles. Please try again later.'); 
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, debouncedSearch]);

  return (
    <main>
      {/* ... (Hero and Filter sections remain exactly the same) ... */}
      
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {[1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>⚠️ {error}</p>
              <button className="btn btn-secondary" onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: 'var(--medium-gray)' }}>
                <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
              </svg>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--dark)', marginBottom: '8px' }}>No articles found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {posts.map((post, index) => (
                // FIX 3: 'post' is now correctly inferred as BlogPost, so post.id is valid
                <BlogCard key={post.id} post={post} delay={index * 100} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}