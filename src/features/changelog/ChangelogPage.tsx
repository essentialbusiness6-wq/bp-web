import { useState, useEffect, type RefObject } from 'react';
import { getChangelogEntries } from './services/changelogService';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { ChangelogEntry, ChangelogCategory } from '../../types';
import { Link } from 'react-router-dom';

const FILTERS: { label: string; value: ChangelogCategory | 'all' }[] = [
  { label: 'All Updates', value: 'all' },
  { label: 'New Features', value: 'new' },
  { label: 'Improvements', value: 'improvement' },
  { label: 'Bug Fixes', value: 'fix' },
];

function ChangelogSkeleton() {
  return (
    <div className="changelog-entry" style={{ opacity: 0.6 }}>
      <div style={{ height: '16px', width: '120px', background: 'var(--light-gray)', borderRadius: '4px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
      <div className="changelog-content" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ height: '20px', width: '100px', background: 'var(--light-gray)', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '24px', width: '80%', background: 'var(--light-gray)', borderRadius: '4px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '16px', width: '100%', background: 'var(--light-gray)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function ChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ChangelogCategory | 'all'>('all');

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getChangelogEntries(activeFilter);
        setEntries(response.entries || []);
      } catch (err) {
        console.error('Failed to fetch changelog:', err);
        setError('Failed to load updates. Please try again later.');
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [activeFilter]);

  const getTagClass = (category: ChangelogCategory) => {
    switch (category) {
      case 'new': return 'new';
      case 'improvement': return 'improvement';
      case 'fix': return 'fix';
      default: return '';
    }
  };

  const getTagLabel = (category: ChangelogCategory) => {
    switch (category) {
      case 'new': return 'New Feature';
      case 'improvement': return 'Improvement';
      case 'fix': return 'Bug Fix';
      default: return category;
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="badge">What's New</span>
          <h1>Product <span className="gradient-text">Changelog</span></h1>
          <p>Stay up to date with the latest features, improvements, and fixes we ship to Business Essentials Prime.</p>
        </div>
      </section>

      <section className="changelog-section" style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="changelog-timeline">
            {isLoading ? (
              <>
                <ChangelogSkeleton />
                <ChangelogSkeleton />
                <ChangelogSkeleton />
              </>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray)' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>⚠️ {error}</p>
                <button className="btn btn-secondary" onClick={() => window.location.reload()}>Try Again</button>
              </div>
            ) : entries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray)' }}>
                <p>No updates found for this category.</p>
              </div>
            ) : (
              entries.map((entry, index) => {
                const [ref, isVisible] = useIntersectionObserver() as [RefObject<HTMLDivElement>, boolean];
                return (
                  <div 
                    key={entry.id}
                    ref={ref}
                    className={`changelog-entry ${isVisible ? 'aos-animate' : ''}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="changelog-date">
                      {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="changelog-content">
                      <span className={`changelog-tag ${getTagClass(entry.category)}`}>
                        {getTagLabel(entry.category)}
                      </span>
                      <h3>{entry.title}</h3>
                      <p>{entry.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link to="/entry" className="btn btn-primary btn-lg">Try the Latest Features</Link>
          </div>
        </div>
      </section>
    </main>
  );
}