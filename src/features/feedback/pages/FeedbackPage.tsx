import { useState, useEffect, ChangeEvent, DragEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { submitFeedback, getMyFeedback } from '../services/feedbackService';
import { Feedback, FeedbackType } from '../../../types';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [myFeedback, setMyFeedback] = useState<Feedback[]>([]);
  
  // Form State
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('suggestion');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [notifyMe, setNotifyMe] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      const data = await getMyFeedback();
      setMyFeedback(data);
    } catch (error) {
      console.error('Failed to fetch feedback history', error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
      setFile(selectedFile);
    } else {
      alert('File size must be less than 5MB.');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.size <= 5 * 1024 * 1024) {
      setFile(droppedFile);
    } else {
      alert('File size must be less than 5MB.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('type', feedbackType);
    formData.append('rating', rating.toString());
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('notify_me', notifyMe.toString());
    if (file) {
      formData.append('attachment', file);
    }

    try {
      await submitFeedback(formData);
      alert('Feedback submitted successfully! Thank you for helping us improve.');
      // Reset form
      setFeedbackType('suggestion');
      setRating(0);
      setSubject('');
      setMessage('');
      setFile(null);
      fetchMyFeedback();
    } catch (error: any) {
      alert(error.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'var(--success)';
      case 'reviewed': return 'var(--primary)';
      default: return 'var(--warning)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return '💡';
      case 'bug': return '🐛';
      case 'compliment': return '🌟';
      default: return '📝';
    }
  };

  return (
    <DashboardLayout title="Feedback & Suggestions">
      <div className="feedback-page-container">
        
        <div className="page-header">
          <div>
            <h1>We Value Your Feedback</h1>
            <p>Help us improve Business Essentials Prime by sharing your thoughts, ideas, or reporting issues.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Feedback Type */}
          <div className="form-section">
            <label className="section-label">Type of Feedback</label>
            <div className="radio-group">
              {(['suggestion', 'bug', 'compliment'] as FeedbackType[]).map((type) => (
                <label key={type} className={`radio-option ${feedbackType === type ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="feedback_type" 
                    value={type} 
                    checked={feedbackType === type}
                    onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  />
                  <span className="radio-custom">{getTypeIcon(type)}</span>
                  <span className="radio-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="form-section">
            <label className="section-label">How was your experience?</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
              <span className="rating-text">
                {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
              </span>
            </div>
          </div>

          {/* Subject & Message */}
          <div className="form-section">
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Brief summary of your feedback" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Details</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                rows={6} 
                placeholder="Please describe your feedback in detail. What happened? What did you expect?" 
                required 
              />
            </div>
          </div>

          {/* Attachment */}
          <div className="form-section">
            <label className="section-label">Attachments (Optional)</label>
            <div 
              className={`file-upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="upload-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p>Drag & drop files here or <span className="browse-link" onClick={() => document.getElementById('fileInput')?.click()}>browse files</span></p>
                  <small>Images, PDFs, Documents (Max 5MB)</small>
                </div>
              ) : (
                <div className="file-preview">
                  <div className="file-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <div>
                      <span className="file-name">{file.name}</span>
                      <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                    </div>
                  </div>
                  <button type="button" className="remove-file-btn" onClick={() => setFile(null)}>✕</button>
                </div>
              )}
              <input type="file" id="fileInput" onChange={handleFileChange} hidden accept="image/*,.pdf,.doc,.docx" />
            </div>
          </div>

          {/* Notify Toggle */}
          <div className="form-section toggle-option">
            <span>Send me an email response</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifyMe} 
                onChange={(e) => setNotifyMe(e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>

        {/* Recent Feedback */}
        {myFeedback.length > 0 && (
          <div className="recent-feedback-section">
            <h3>Your Recent Feedback</h3>
            <div className="feedback-list">
              {myFeedback.map((fb) => (
                <div key={fb.id} className="feedback-item">
                  <div className="feedback-item-header">
                    <div className="feedback-type">
                      <span className="type-icon">{getTypeIcon(fb.type)}</span>
                      <span className="type-label">{fb.type.charAt(0).toUpperCase() + fb.type.slice(1)}</span>
                    </div>
                    <span 
                      className="status-badge" 
                      style={{ background: `${getStatusColor(fb.status)}20`, color: getStatusColor(fb.status) }}
                    >
                      {fb.status.charAt(0).toUpperCase() + fb.status.slice(1)}
                    </span>
                  </div>
                  <h4>{fb.subject}</h4>
                  <p className="feedback-message">{fb.message}</p>
                  <div className="feedback-meta">
                    <span className="rating-stars">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                    <span className="feedback-date">
                      {new Date(fb.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    {fb.has_attachment && <span className="attachment-indicator">📎 Attached</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}