import { useState, useEffect, useRef, FormEvent } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { submitTicket, getMyTickets, Ticket } from '../services/supportService';

const faqs = [
  { id: '1', question: 'How do I reset my password?', answer: 'Go to Settings > Security > Change Password. If you\'re locked out, use the "Forgot Password" link on the login screen to receive a secure reset link via email.', keywords: 'reset password forgot login' },
  { id: '2', question: 'How do I add a new client?', answer: 'Navigate to the Clients tab and click the "+" button. Fill in the client\'s name, email, phone, and address. Save to instantly link them to future invoices.', keywords: 'add client customer new' },
  { id: '3', question: 'How do I mark an invoice as paid?', answer: 'Open the invoice, click "Record Payment", enter the amount and date. The status will automatically update, and you\'ll receive a confirmation receipt.', keywords: 'payment received track mark paid' },
  { id: '4', question: 'Can I export invoices to PDF?', answer: 'Yes! Open any invoice and click the "Download PDF" button. You can also batch export multiple invoices from the Invoices dashboard using the "Export All" feature.', keywords: 'export invoice pdf download print' },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({ category: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string; sender: 'agent' | 'user'; time: string }[]>([
    { id: '1', text: 'Welcome! How can we assist you today?', sender: 'agent' as const, time: 'Just now' }
  ]);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  const fetchTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    }
  };

  const handleFaqToggle = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.keywords.includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newTicket = await submitTicket(ticketForm);
      setTickets(prev => [newTicket, ...prev]);
      setTicketForm({ category: '', subject: '', message: '' });
      alert('Ticket submitted successfully! We will get back to you shortly.');
    } catch (error: any) {
      alert(error.message || 'Failed to submit ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = { 
      id: Date.now().toString(), 
      text: chatInput, 
      sender: 'user' as const, 
      time: 'Just now' 
    };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simulate agent reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: 'Thank you for reaching out! A support agent will review your message and respond shortly.', 
        sender: 'agent' as const, 
        time: 'Just now' 
      }]);
    }, 1500);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'bug': return '🐛';
      case 'feature': return '✨';
      case 'billing': return '💳';
      case 'account': return '👤';
      default: return '📝';
    }
  };

  return (
    <DashboardLayout title="Support Center">
      <div className="support-page-container">
        
        <div className="page-header">
          <h1>How can we help you?</h1>
          <p>Find answers, learn tips, or reach out to our team directly.</p>
        </div>

        {/* Search */}
        <div className="search-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search FAQs, tips, or topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {filteredFaqs.map(faq => (
              <div key={faq.id} className={`faq-item ${expandedFaq === faq.id ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => handleFaqToggle(faq.id)}>
                  <span>{faq.question}</span>
                  <svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="no-results">No FAQs found matching your search.</p>
            )}
          </div>
        </section>

        {/* Pro Tips */}
        <section className="tips-section">
          <h2>💡 Pro Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">📅</div>
              <h3>Use Due Dates</h3>
              <p>Set clear payment terms. Automatic reminders are sent 3 days before and on the due date.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🏷️</div>
              <h3>Invoice Prefixes</h3>
              <p>Customize your numbering (e.g., INV-2024-001) to stay organized and professional.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <h3>Track Revenue</h3>
              <p>Use the Payments dashboard to monitor cash flow, overdue invoices, and monthly trends.</p>
            </div>
          </div>
        </section>

        {/* Invoice Guide */}
        <section className="guide-section">
          <h2>📘 How to Create an Invoice</h2>
          <div className="guide-steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>Go to Invoices</h4>
                <p>Tap the "Invoices" tab and click the "Create New" button at the top right.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Select Client & Details</h4>
                <p>Choose an existing client or add a new one. Fill in items, quantities, and prices.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h4>Review & Send</h4>
                <p>Preview the invoice, add notes, then click "Send Email" or "Download PDF".</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket Form */}
        <section className="ticket-section">
          <h2>🎫 Submit a Ticket</h2>
          <form onSubmit={handleTicketSubmit} className="ticket-form">
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={ticketForm.category} 
                  onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="bug">🐛 Bug Report</option>
                  <option value="feature">✨ Feature Request</option>
                  <option value="billing">💳 Billing Issue</option>
                  <option value="account">👤 Account Problem</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  placeholder="Brief description of the issue" 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                value={ticketForm.message}
                onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                rows={5} 
                placeholder="Please describe your issue in detail. Include steps to reproduce if applicable..." 
                required 
              />
            </div>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Submit Ticket
                </>
              )}
            </button>
          </form>

          {/* My Tickets List */}
          {tickets.length > 0 && (
            <div className="tickets-list">
              <h3>Your Recent Tickets</h3>
              {tickets.map(ticket => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-header">
                    <span className="ticket-category">{getCategoryIcon(ticket.category)} {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</span>
                    <span className={`ticket-status status-${ticket.status}`}>{ticket.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <h4>{ticket.subject}</h4>
                  <p className="ticket-date">Submitted: {new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2>📞 Contact Support</h2>
          <div className="contacts-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email Us</h3>
              <p>support@businessessentia.net</p>
              <small>Response within 24 hours</small>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📱</div>
              <h3>Call Us</h3>
              <p>+1 (800) 555-0199</p>
              <small>Mon-Fri, 9AM - 6PM EST</small>
            </div>
            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Available 24/7</p>
              <small>Tap the chat bubble below</small>
            </div>
          </div>
        </section>

      </div>

      {/* Live Chat Widget */}
      <div className="chat-widget">
        <button className="chat-toggle" onClick={() => setIsChatOpen(!isChatOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {chatMessages.length > 1 && <span className="chat-badge">!</span>}
        </button>
        
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-agent">
                <div className="agent-avatar">BE</div>
                <div>
                  <h4>Support Agent</h4>
                  <p className="online-status">● Online</p>
                </div>
              </div>
              <button className="close-chat" onClick={() => setIsChatOpen(false)}>&times;</button>
            </div>
            
            <div className="chat-body" ref={chatBodyRef}>
              {chatMessages.map(msg => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <p>{msg.text}</p>
                  <span className="time">{msg.time}</span>
                </div>
              ))}
            </div>
            
            <div className="chat-input-area">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..." 
              />
              <button onClick={handleSendMessage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}