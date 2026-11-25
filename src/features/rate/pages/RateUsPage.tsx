import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { submitRating } from '../services/rateService';

export default function RateUsPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setFeedback(text);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a star rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRating({ rating, feedback });
      setIsSubmitted(true);
    } catch (error: any) {
      alert(error.message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Rate Us">
      <div className="rate-us-container">
        
        {!isSubmitted ? (
          <>
            {/* Header Section */}
            <div className="rate-header">
              <div className="app-icon-container">
                <div className="app-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div className="app-icon-glow"></div>
              </div>
              <h1>Rate Business Essentials Prime</h1>
              <p className="subtitle">Help us improve by sharing your experience</p>
            </div>

            {/* Current Rating Display */}
            <div className="current-rating">
              <div className="rating-badge">
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                </svg>
                <span>Excellent</span>
              </div>
              <h2 className="rating-value">4.8</h2>
              <div className="stars-container rating-stars">
                {[1, 2, 3, 4].map(i => <span key={i} className="star filled">★</span>)}
                <span className="star half">★</span>
              </div>
              <p className="rating-count">Based on <strong>1,247</strong> ratings</p>
            </div>

            {/* Interactive Rating */}
            <div className="feedback-section">
              <h2 className="section-title">Your Rating</h2>
              <div className="rating-instruction">Tap to rate your experience</div>
              <div 
                className="stars-container interactive" 
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="rating-label" id="ratingLabel">
                {rating > 0 ? ratingLabels[rating] : 'How would you rate us?'}
              </div>
            </div>

            {/* Feedback Textarea */}
            <div className="feedback-section">
              <h2 className="section-title">Your Feedback</h2>
              <textarea 
                id="feedbackText" 
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Tell us what you think about Business Essentials Prime... What do you love? What could be improved?"
                rows={5}
              />
              <div className="character-count">
                <span id="charCount">{feedback.length}</span>/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16 16 12 20 8 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="20" x2="12" y2="8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Submit Rating
                </>
              )}
            </button>

            {/* Rewards Section */}
            <div className="rewards-section">
              <h3 className="rewards-title">
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Rate & Get Rewarded
              </h3>
              <p className="rewards-subtitle">Share your feedback and earn exclusive rewards:</p>
              <ul className="rewards-list">
                <li>
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>1-month Pro subscription free trial</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Exclusive badge on your profile</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Early access to new features</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Priority customer support</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          /* Thank You Section */
          <div className="thank-you-section">
            <div className="thank-you-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Thank You!</h2>
            <p className="thank-you-message">
              Your feedback helps us make Business Essentials Prime better for everyone. 
              As a token of our appreciation, we've added <strong>1 month of Pro features</strong> to your account!
            </p>
            <div className="reward-badge">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              <span>Pro Features Unlocked!</span>
            </div>
            <button className="btn primary done-btn" onClick={() => navigate('/dashboard')}>
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Dashboard
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}