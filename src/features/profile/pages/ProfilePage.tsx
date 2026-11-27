import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { 
  getProfile, updateProfile, getBankDetails, updateBankDetails, resolveBankAccount, getBanks, deleteAccount 
} from '../services/profileService';
import { ProfileData, BankData, Bank } from '../../../types';
import { uploadFile } from '../../../services/fileService';

type Tab = 'profile' | 'bank';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  
  // Profile State
  const [profile, setProfile] = useState<ProfileData>({
    fullname: '', profilename: '', username: '', phone: '', address: '',
    country: 'NG', alternateemail: '', website: '', bio: '', profile_pic: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // Bank State
  const [bankData, setBankData] = useState<BankData | null>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [bankForm, setBankForm] = useState({ bank_code: '', account_number: '', account_name: '' });
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [bankSaving, setBankSaving] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch banks when bank tab is opened
  useEffect(() => {
    if (activeTab === 'bank' && banks.length === 0) {
      fetchBanks();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [profileRes, bankRes] = await Promise.all([getProfile(), getBankDetails()]);
      
      // ✅ Map backend keys to frontend state keys so inputs pre-fill correctly
      setProfile({
        fullname: profileRes.full_name || '',
        profilename: profileRes.display_name || '',
        username: profileRes.email?.split('@')[0] || '', 
        phone: profileRes.phone || '',
        address: profileRes.address || '',
        country: profileRes.country || 'NG',
        alternateemail: profileRes.alternate_email || '',
        website: profileRes.website || '',
        bio: profileRes.bio || '',
        profile_pic: profileRes.profile_image || ''
      });
      
      // ✅ Fix bank data check: handle both null and empty objects
      const hasBank = bankRes && bankRes.account_number;
      setBankData(hasBank ? bankRes : null);
      
      if (hasBank) {
        setBankForm({ 
          bank_code: bankRes.bank_code || bankRes.bank_name, 
          account_number: bankRes.account_number, 
          account_name: bankRes.account_name 
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchBanks = async () => {
    setBanksLoading(true);
    try {
      const data = await getBanks();
      setBanks(data);
    } catch (error) {
      console.error('Failed to fetch banks', error);
    } finally {
      setBanksLoading(false);
    }
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    try {
      // 1. Upload to backend/Cloudinary
      const uploadResponse = await uploadFile(file, 'profiles');
      
      // 2. Update the profile state with the new Cloudinary URL
      setProfile(prev => ({ 
        ...prev, 
        profile_pic: uploadResponse.url 
      }));
            
    } catch (error: any) {
      console.error('Failed to upload image', error);
      alert(error.message || 'Failed to upload image. Please ensure it is under 5MB and is a JPG/PNG.');
      
      // Revert the file input if it failed
      e.target.value = ''; 
    } finally {
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleVerifyBank = async () => {
    if (bankForm.account_number.length !== 10 || !bankForm.bank_code) return;
    setVerifyingBank(true);
    try {
      const res = await resolveBankAccount(bankForm.bank_code, bankForm.account_number);
      setBankForm(prev => ({ ...prev, account_name: res.account_name }));
    } catch (error: any) {
      alert(error.message || 'Could not verify account. Please check the bank and account number.');
      setBankForm(prev => ({ ...prev, account_name: '' }));
    } finally {
      setVerifyingBank(false);
    }
  };

  const handleBankSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bankForm.account_name) {
      alert('Please verify the account number first.');
      return;
    }
    setBankSaving(true);
    try {
      // Backend will create the Paystack subaccount and return the saved data with subaccount_id
      const updated = await updateBankDetails({ 
        bank_code: bankForm.bank_code, 
        account_number: bankForm.account_number, 
        account_name: bankForm.account_name 
      });
      setBankData(updated);
      setIsEditingBank(false);
      setIsAddingBank(false);
      alert('Bank details saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save bank details.');
    } finally {
      setBankSaving(false);
    }
  };

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm.');
      return;
    }
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteAccount(deletePassword);
      await logout();
      navigate('/login');
    } catch (error: any) {
      setDeleteError(error.message || 'Incorrect password or failed to delete account.');
      setDeleteLoading(false);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (profileLoading) {
    return (
      <DashboardLayout>
        <div className="settings-loading">
          <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '24px' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '400px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile & Account">
      <div className="profile-page-container">
        
        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span>Bank Details</span>
          </button>
        </div>

        {/* ================= PROFILE TAB ================= */}
        {activeTab === 'profile' && (
          <div className="tab-content active">
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="profile-pic-section">
                <div className="profile-pic-container">
                  <div className="profile-pic-wrapper">
                    {profile.profile_pic ? (
                      <img src={profile.profile_pic} alt="Profile" className="profile-pic" />
                    ) : (
                      <div className="profile-pic-placeholder">{getInitials(profile.fullname || 'User')}</div>
                    )}
                    <div className="pic-overlay">
                      <label htmlFor="newProfilePic" className="pic-action" title="Change picture">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      </label>
                      <button type="button" className="pic-action danger" onClick={() => setProfile(prev => ({ ...prev, profile_pic: '' }))} title="Remove picture">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="pic-hint">Click to change or remove your profile picture</p>
                  <input type="file" id="newProfilePic" accept="image/*" hidden onChange={handleImageChange} />
                </div>
              </div>

              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullname" value={profile.fullname} onChange={handleProfileChange} placeholder="Enter your full name" required />
                  </div>
                  <div className="form-group">
                    <label>Display Name</label>
                    <input type="text" name="profilename" value={profile.profilename} onChange={handleProfileChange} placeholder="How you appear to others" />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={profile.username} onChange={handleProfileChange} placeholder="Unique username" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="+1 (262) 873-006" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={profile.address} onChange={handleProfileChange} placeholder="Your business address" />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select name="country" value={profile.country} onChange={handleProfileChange}>
                      <option value="NG">Nigeria</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Alternate Email</label>
                    <input type="email" name="alternateemail" value={profile.alternateemail} onChange={handleProfileChange} placeholder="Secondary contact email" />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input type="url" name="website" value={profile.website} onChange={handleProfileChange} placeholder="https://yourwebsite.com" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>About You</h3>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea name="bio" rows={4} value={profile.bio} onChange={handleProfileChange} placeholder="Tell us about yourself, your business, or what you do..." maxLength={500} />
                  <p className="field-hint">Max 500 characters. This appears on your public profile.</p>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => fetchData()}>Cancel</button>
                <button type="submit" className="btn primary" disabled={profileSaving}>
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= BANK DETAILS TAB ================= */}
        {activeTab === 'bank' && (
          <div className="tab-content">
            <div className="info-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div className="info-banner-content">
                <strong>Secure Payment Setup</strong>
                <p>Your bank details are encrypted. We use Paystack to verify your account and create a secure subaccount for seamless payouts.</p>
              </div>
            </div>

            {/* 1. No Bank Data & Not Adding */}
            {(!bankData || !bankData.account_number) && !isAddingBank ? (
              <div className="bank-status-card empty">
                <div className="bank-status-header">
                  <div className="bank-status-icon empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div className="bank-status-info">
                    <h4>No Bank Account Linked</h4>
                    <p>Add your bank details to start receiving payments securely.</p>
                  </div>
                </div>
                <button type="button" className="btn primary" onClick={() => setIsAddingBank(true)} style={{ width: '100%', marginTop: '16px' }}>
                  Add Bank Details
                </button>
              </div>
            ) : bankData && bankData.account_number && !isEditingBank ? (
              // ... existing "Existing Bank Data Display" code ...
              /* 2. Existing Bank Data Display */
              <div className="bank-status-card">
                <div className="bank-status-header">
                  <div className="bank-status-icon verified">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div className="bank-status-info">
                    <h4>Bank Account Linked</h4>
                    <p>Your account is verified and ready to receive payments</p>
                  </div>
                  <button type="button" className="btn secondary" onClick={() => setIsEditingBank(true)}>
                    Edit Details
                  </button>
                </div>
                <div className="bank-details-display">
                  <div className="bank-detail-item">
                    <span className="bank-detail-label">Bank Name</span>
                    <span className="bank-detail-value">{banks.find(b => b.code === bankData.bank_code)?.name || bankData.bank_name}</span>
                  </div>
                  <div className="bank-detail-item">
                    <span className="bank-detail-label">Account Number</span>
                    <span className="bank-detail-value mono">{bankData.account_number}</span>
                  </div>
                  <div className="bank-detail-item">
                    <span className="bank-detail-label">Account Name</span>
                    <span className="bank-detail-value">{bankData.account_name}</span>
                  </div>
                  {bankData.subaccount_id && (
                    <div className="bank-detail-item">
                      <span className="bank-detail-label">Subaccount ID</span>
                      <span className="bank-detail-value mono" style={{ fontSize: '0.8rem' }}>{bankData.subaccount_id}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 3. Form (for adding or editing) */
              <form onSubmit={handleBankSubmit} className="bank-form">
                <div className="form-section">
                  <h3>Bank Information</h3>
                  <div className="form-group">
                    <label>Bank Name <span className="required">*</span></label>
                    <select 
                      value={bankForm.bank_code} 
                      onChange={(e) => setBankForm(prev => ({ ...prev, bank_code: e.target.value, account_name: '' }))}
                      required
                      disabled={banksLoading}
                    >
                      <option value="" disabled>
                        {banksLoading ? 'Loading banks...' : 'Select your bank'}
                      </option>
                      {banks.map(bank => (
                        <option key={bank.code} value={bank.code}>{bank.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Account Number <span className="required">*</span></label>
                    <div className="input-wrapper account-input-wrapper">
                      <input 
                        type="text" 
                        value={bankForm.account_number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setBankForm(prev => ({ ...prev, account_number: val, account_name: '' }));
                        }}
                        placeholder="Enter 10-digit account number"
                        maxLength={10}
                        inputMode="numeric"
                        required
                      />
                      <button 
                        type="button" 
                        className="btn secondary verify-btn" 
                        disabled={bankForm.account_number.length !== 10 || verifyingBank || !bankForm.bank_code}
                        onClick={handleVerifyBank}
                      >
                        {verifyingBank ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  {bankForm.account_name && (
                    <div className="account-name-display">
                      <div className="account-name-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>Verified Account Name</span>
                      </div>
                      <div className="account-name-value">{bankForm.account_name}</div>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" className="btn secondary" onClick={() => { 
                    setIsEditingBank(false); 
                    setIsAddingBank(false); 
                    if (bankData) {
                      setBankForm({ bank_code: bankData.bank_code, account_number: bankData.account_number, account_name: bankData.account_name });
                    } else {
                      setBankForm({ bank_code: '', account_number: '', account_name: '' });
                    }
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary" disabled={bankSaving || !bankForm.account_name}>
                    {bankSaving ? 'Saving...' : (bankData ? 'Update Bank Details' : 'Save Bank Details')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================= DANGER ZONE ================= */}
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button className="btn danger" onClick={() => setIsDeleteModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-overlay active" onClick={() => setIsDeleteModalOpen(false)}>
            <div className="modal-card delete-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
              <div className="modal-icon danger">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12" fill="none" stroke="white" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" fill="none" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h2>Delete Account?</h2>
              <p className="modal-subtitle">Are you sure you want to delete your account? All your data, invoices, and client information will be permanently removed.</p>
              
              <form onSubmit={handleDeleteAccount}>
                <div className="form-group">
                  <label>Enter your password to confirm</label>
                  <input 
                    type="password" 
                    value={deletePassword} 
                    onChange={(e) => setDeletePassword(e.target.value)} 
                    placeholder="Your account password"
                    autoFocus
                  />
                </div>
                {deleteError && <div className="form-error-alert">{deleteError}</div>}
                
                <div className="modal-buttons">
                  <button type="button" className="btn secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn danger" disabled={deleteLoading}>
                    {deleteLoading ? 'Deleting...' : 'Yes, Delete Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
