import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getNotifications, markAllAsRead, clearAllNotifications, exportNotifications } from '../services/notificationService';
import { Notification, NotificationFilters } from '../../../types';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<NotificationFilters>({
    type: 'all',
    status: 'all',
    month: 'all',
    year: 'all',
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [filters]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications(filters);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const totalCount = notifications.length;

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })));
    } catch (error) {
      alert('Failed to mark all as read.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;
    try {
      await clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      alert('Failed to clear notifications.');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportNotifications();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notifications-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export notifications.');
    }
  };

  const getNotificationIcon = (type: string) => {
    const baseClass = "notification-icon";
    switch (type) {
      case 'payment':
        return (
          <div className={`${baseClass} payment`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
        );
      case 'invoice':
        return (
          <div className={`${baseClass} invoice`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
        );
      case 'client':
        return (
          <div className={`${baseClass} client`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${baseClass} system`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="notifications-page-container">
        
        {/* Header Stats & Actions */}
        <div className="notifications-header">
          <div className="stats-bar">
            <span className="stat-item">
              <span className="stat-number unread">{unreadCount}</span>
              <span className="stat-label">Unread</span>
            </span>
            <span className="stat-divider"></span>
            <span className="stat-item">
              <span className="stat-number">{totalCount}</span>
              <span className="stat-label">Total</span>
            </span>
          </div>
          
          <div className="notification-actions">
            <button className="btn secondary mark-all-btn" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              <span>Mark All Read</span>
            </button>
            <button className="btn danger-outline clear-btn" onClick={handleClearAll} disabled={totalCount === 0}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>Clear All</span>
            </button>
            
            {/* Options Dropdown Trigger */}
            <div className="options-wrapper" ref={optionsRef}>
              <button className="icon-btn" onClick={() => setIsOptionsOpen(!isOptionsOpen)} aria-label="Options">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="18" r="2"/>
                </svg>
              </button>
              
              {isOptionsOpen && (
                <div className="options-dropdown">
                  <button className="dropdown-item" onClick={() => { handleExport(); setIsOptionsOpen(false); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Export Notifications
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate('/dashboard/settings'); setIsOptionsOpen(false); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    Notification Settings
                  </button>
                  <button className="dropdown-item danger" onClick={() => { handleClearAll(); setIsOptionsOpen(false); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete All Notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <label>Type</label>
            <select value={filters.type} onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}>
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="invoice">Invoices</option>
              <option value="client">Clients</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}>
              <option value="all">All Status</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date</label>
            <div className="date-selectors">
              <select value={filters.month} onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}>
                <option value="all">All Months</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select value={filters.year} onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}>
                <option value="all">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="notifications-loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="notification-item skeleton-item">
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '60%', height: '16px', marginBottom: '8px' }}></div>
                  <div className="skeleton" style={{ width: '90%', height: '14px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
              <path d="M18 8a6 6 0 0 0-12 0v7a4 4 0 0 0 8 0v-1"/><path d="M14 16a2 2 0 0 1-4 0"/><path d="M2 15a10 10 0 0 0 20 0"/>
            </svg>
            <h3>No notifications yet</h3>
            <p>When you receive notifications, they'll appear here</p>
            <button className="btn primary" onClick={() => navigate('/dashboard/invoices/new')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create First Invoice
            </button>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`}
                onClick={() => {
                  if (notification.link) navigate(notification.link);
                  // Optionally call API to mark single notification as read here
                }}
              >
                {getNotificationIcon(notification.type)}
                <div className="notification-content">
                  <div className="notification-header">
                    <h4>{notification.title}</h4>
                    <span className="notification-time">{formatDate(notification.created_at)}</span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                </div>
                {notification.status === 'unread' && <div className="unread-dot"></div>}
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}