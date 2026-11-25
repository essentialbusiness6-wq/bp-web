import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import SettingsSection from '../components/SettingsSection';
import CloseAccountModal from '../components/CloseAccountModal';
import { getSettings, updateSettings, changePassword, exportData } from '../services/settingsService';
import { useTheme } from '../../../hooks/useTheme';
import { UserSettings } from '../../../types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [activeSection, setActiveSection] = useState('invoice');
  
  // Close Account Modal
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  
  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordStatus, setPasswordStatus] = useState<SaveStatus>('idle');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    setSaveStatus('saving');

    try {
      await updateSettings({ [key]: value });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setSettings(settings); // Revert
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setPasswordStatus('saving');
    setPasswordError('');

    try {
      await changePassword(passwordData);
      setPasswordStatus('saved');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setPasswordStatus('idle'), 3000);
    } catch (err: any) {
      setPasswordStatus('error');
      setPasswordError(err.message || 'Failed to change password');
      setTimeout(() => setPasswordStatus('idle'), 3000);
    }
  };

  const handleExportData = async () => {
    try {
      const blob = await exportData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bep-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const sections = [
    { id: 'invoice', label: 'Invoice', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
    { id: 'localization', label: 'Localization', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
    { id: 'notifications', label: 'Notifications', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' },
    { id: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'account', label: 'Account', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="settings-loading">
          <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '24px' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '400px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="empty-state">
          <p>Failed to load settings. Please try again.</p>
          <button className="btn primary" onClick={fetchSettings}>Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="settings-page">
        
        {/* Page Header */}
        <div className="settings-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your invoice, system, and security preferences</p>
          </div>
          {saveStatus === 'saving' && <span className="save-indicator saving">Saving...</span>}
          {saveStatus === 'saved' && (
            <span className="save-indicator saved">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Saved
            </span>
          )}
          {saveStatus === 'error' && <span className="save-indicator error">Failed to save</span>}
        </div>

        <div className="settings-layout">
          
          {/* Sidebar Navigation */}
          <nav className="settings-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={section.icon} />
                </svg>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>

          {/* Settings Content */}
          <div className="settings-content">

            {/* ============ INVOICE SETTINGS ============ */}
            <SettingsSection
              id="invoice"
              title="Invoice Settings"
              subtitle="Configure your invoice numbering, tax, and defaults"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              }
              badge="Core"
            >
              <div className="settings-grid">
                <div className="settings-field">
                  <label>Invoice Prefix</label>
                  <input
                    type="text"
                    value={settings.invoice_prefix}
                    onChange={(e) => handleSettingChange('invoice_prefix', e.target.value)}
                    placeholder="e.g., INV, BILL"
                  />
                  <span className="field-hint">Prefix for all invoice numbers</span>
                </div>

                <div className="settings-field">
                  <label>Next Invoice Number</label>
                  <input
                    type="number"
                    value={settings.next_invoice_number}
                    onChange={(e) => handleSettingChange('next_invoice_number', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <span className="field-hint">Starting number for next invoice</span>
                </div>

                <div className="settings-field">
                  <label>Default Due Date (days)</label>
                  <input
                    type="number"
                    value={settings.default_due_date}
                    onChange={(e) => handleSettingChange('default_due_date', parseInt(e.target.value) || 30)}
                    min="1"
                    max="365"
                  />
                  <span className="field-hint">Days until invoice is due</span>
                </div>

                <div className="settings-field">
                  <label>Default Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.default_tax_rate}
                    onChange={(e) => handleSettingChange('default_tax_rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span className="field-hint">Tax percentage applied to invoices</span>
                </div>
              </div>

              <div className="settings-toggles">
                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Show Tax on Invoice</span>
                    <span className="toggle-description">Display tax breakdown on invoice PDF</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.show_tax}
                      onChange={(e) => handleSettingChange('show_tax', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </label>

                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Enable Discounts</span>
                    <span className="toggle-description">Allow adding discounts to invoices</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.show_discount}
                      onChange={(e) => handleSettingChange('show_discount', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </label>
              </div>

              <div className="settings-field full-width">
                <label>Invoice Footer Note</label>
                <textarea
                  value={settings.footer_note}
                  onChange={(e) => handleSettingChange('footer_note', e.target.value)}
                  placeholder="Thank you for your business! Payment is due within 30 days."
                  rows={3}
                />
                <span className="field-hint">Text displayed at the bottom of all invoices</span>
              </div>
            </SettingsSection>

            {/* ============ LOCALIZATION ============ */}
            <SettingsSection
              id="localization"
              title="Localization"
              subtitle="Set your preferred currency, timezone, and date format"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              }
              badge="Regional"
            >
              <div className="settings-grid">
                <div className="settings-field">
                  <label>Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => {
                      const currencyMap: Record<string, string> = {
                        'NGN': '₦', 'USD': '$', 'EUR': '€', 'GBP': '£'
                      };
                      handleSettingChange('currency', e.target.value);
                      handleSettingChange('currency_symbol', currencyMap[e.target.value] || '$');
                    }}
                  >
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label>Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currency_symbol}
                    onChange={(e) => handleSettingChange('currency_symbol', e.target.value)}
                    maxLength={3}
                  />
                  <span className="field-hint">Symbol displayed with amounts</span>
                </div>

                <div className="settings-field">
                  <label>Theme</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                    <option value="system">System (Auto)</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label>Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label>Date Format</label>
                  <select
                    value={settings.date_format}
                    onChange={(e) => handleSettingChange('date_format', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (25/12/2024)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/25/2024)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-25)</option>
                  </select>
                </div>
              </div>
            </SettingsSection>

            {/* ============ NOTIFICATIONS ============ */}
            <SettingsSection
              id="notifications"
              title="Notifications"
              subtitle="Control how and when you receive alerts"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              }
              badge="Alerts"
            >
              <div className="settings-toggles">
                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Email Notifications</span>
                    <span className="toggle-description">Receive invoice updates via email</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.email_notifications}
                      onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </label>

                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Due Date Reminders</span>
                    <span className="toggle-description">Get notified before invoices are due</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.due_date_reminder}
                      onChange={(e) => handleSettingChange('due_date_reminder', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </label>
              </div>

              {settings.due_date_reminder && (
                <div className="settings-field" style={{ marginTop: '16px' }}>
                  <label>Reminder Days Before Due Date</label>
                  <input
                    type="number"
                    value={settings.reminder_days_before}
                    onChange={(e) => handleSettingChange('reminder_days_before', parseInt(e.target.value) || 3)}
                    min="1"
                    max="30"
                  />
                  <span className="field-hint">How many days before due date to send reminder</span>
                </div>
              )}
            </SettingsSection>

            {/* ============ SECURITY ============ */}
            <SettingsSection
              id="security"
              title="Security"
              subtitle="Protect your account with advanced security options"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              }
              badge="Important"
              badgeColor="warning"
            >
              <div className="settings-toggles">
                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Auto Logout on Inactivity</span>
                    <span className="toggle-description">Automatically sign out after period of inactivity</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.auto_logout_on_inactivity}
                      onChange={(e) => handleSettingChange('auto_logout_on_inactivity', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </label>

                {settings.auto_logout_on_inactivity && (
                  <div className="settings-field" style={{ padding: '0 0 0 48px' }}>
                    <label>Auto Logout Time (minutes)</label>
                    <input
                      type="number"
                      value={settings.auto_logout_minutes}
                      onChange={(e) => handleSettingChange('auto_logout_minutes', parseInt(e.target.value) || 30)}
                      min="5"
                      max="1440"
                    />
                  </div>
                )}

                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Require PIN to Delete</span>
                    <span className="toggle-description">Ask for confirmation PIN before deleting records</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.require_pin_for_delete}
                      onChange={(e) => handleSettingChange('require_pin_for_delete', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </label>
              </div>

              {/* Change Password */}
              <div className="settings-subsection">
                <h4>Change Password</h4>
                <form onSubmit={handlePasswordChange} className="password-change-form">
                  <div className="settings-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="settings-grid">
                    <div className="settings-field">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div className="settings-field">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        placeholder="Re-enter new password"
                      />
                    </div>
                  </div>
                  {passwordError && <div className="form-error-alert">{passwordError}</div>}
                  {passwordStatus === 'saved' && (
                    <div className="form-success-alert">Password changed successfully!</div>
                  )}
                  <button type="submit" className="btn primary" disabled={passwordStatus === 'saving'}>
                    {passwordStatus === 'saving' ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </SettingsSection>

            {/* ============ ACCOUNT ============ */}
            <SettingsSection
              id="account"
              title="Account"
              subtitle="Manage your account data and preferences"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
              badge="Danger Zone"
              badgeColor="danger"
            >
              <div className="account-actions">
                <div className="account-action-card">
                  <div className="account-action-icon" style={{ background: 'rgba(67, 97, 238, 0.1)', color: 'var(--primary)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                  <div className="account-action-info">
                    <h4>Export All Data</h4>
                    <p>Download a copy of all your invoices, clients, and settings</p>
                  </div>
                  <button className="btn secondary" onClick={handleExportData}>
                    Export
                  </button>
                </div>

                <div className="account-action-card danger">
                  <div className="account-action-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <div className="account-action-info">
                    <h4>Close Account</h4>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <button className="btn danger" onClick={() => setIsCloseModalOpen(true)}>
                    Close Account
                  </button>
                </div>
              </div>

              {/* Support Links */}
              <div className="support-links">
                <a href="/support" className="support-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span>Contact Support</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
                <a href="/feedback" className="support-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span>Feedback & Suggestions</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
                <a href="/about" className="support-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span>About Business Essentials Prime</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
              </div>
            </SettingsSection>

          </div>
        </div>
      </div>

      <CloseAccountModal 
        isOpen={isCloseModalOpen} 
        onClose={() => setIsCloseModalOpen(false)} 
      />
    </DashboardLayout>
  );
}