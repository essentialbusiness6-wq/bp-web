import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import InvoiceCard from '../components/InvoiceCard';
import { getInvoices, deleteInvoice, createInvoice, updateInvoice } from '../services/invoiceService';
import { getSettings } from '../../../services/settingsService';
import { Invoice, UserSettings } from '../../../types'; 
import InvoiceEditorModal, { InvoiceFormData } from '../components/InvoiceEditorModal';

type FilterStatus = 'all' | 'paid' | 'pending' | 'unpaid' | 'overdue';

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Overdue', value: 'overdue' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null); // 3. Add settings state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // 4. Fetch both invoices and settings on mount or filter change
  useEffect(() => {
    fetchInvoices(activeFilter);
    if (!userSettings) {
      fetchUserSettings();
    }
  }, [activeFilter]);

  const fetchInvoices = async (status: FilterStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvoices({ status });
      
      // SAFETY CHECK: Handle array or paginated object { items: [...] }
      const invoiceList = Array.isArray(response) 
        ? response 
        : response.items || response.invoices || response.data || [];
        
      setInvoices(invoiceList);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSettings = async () => {
    try {
      const settings = await getSettings();
      setUserSettings(settings);
    } catch (err) {
      console.error('Failed to load settings for invoice defaults', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete invoice.');
    }
  };

  const openCreateModal = () => {
    setEditingInvoice(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsEditorOpen(true);
  };

  const handleSaveInvoice = async (data: InvoiceFormData, isDraft: boolean) => {
    if (editingInvoice) {
      await updateInvoice(editingInvoice.id, data);
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? { ...inv, ...data } : inv));
    } else {
      // 6. WIRE UP SETTINGS: Use the user's saved preferences for new invoices
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + (userSettings?.default_due_date || 30));

      const newInvoice = await createInvoice({
        ...data,
        invoice_date: new Date().toISOString().slice(0, 10),
        due_date: defaultDueDate.toISOString().slice(0, 10),
        currency: userSettings?.currency || 'NGN', // Uses settings instead of hardcoded 'USD'
        tax_rate: data.tax_rate ?? (userSettings?.default_tax_rate || 0),
        amount_paid: 0,
        status: isDraft ? 'draft' : 'pending'
      });
      setInvoices(prev => [newInvoice, ...prev]);
    }
    setIsEditorOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Your Invoices</h1>
        <button className="btn primary" onClick={openCreateModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Invoice
        </button>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`filter-tab ${activeFilter === filter.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="invoices-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="invoice-card skeleton-card">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="empty-state">
          <p className="error-text">⚠️ {error}</p>
          <button className="btn secondary" onClick={() => fetchInvoices(activeFilter)}>Try Again</button>
        </div>
      ) : !Array.isArray(invoices) || invoices.length === 0 ? ( // 7. Safe array check
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h3>No invoices found</h3>
          <p>
            {activeFilter === 'all' 
              ? "You haven't created any invoices yet." 
              : `No ${activeFilter} invoices at the moment.`}
          </p>
          <button className="btn primary" style={{ marginTop: '16px' }} onClick={openCreateModal}>
            Create Your First Invoice
          </button>
        </div>
      ) : (
        <div className="invoices-grid">
          {invoices.map((invoice) => (
            <InvoiceCard 
              key={invoice.id} 
              invoice={invoice} 
              onDelete={handleDelete} 
              onEdit={openEditModal} // Make sure InvoiceCard passes this!
            />
          ))}
        </div>
      )}
      
      <InvoiceEditorModal 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSave={handleSaveInvoice}
        // 8. Pre-fill the modal with user settings when creating a new invoice
        initialData={editingInvoice || (userSettings ? {
          currency: userSettings.currency,
          tax_rate: userSettings.default_tax_rate,
          footer_note: userSettings.footer_note || '',
        } : undefined)}
        mode={editingInvoice ? 'edit_invoice' : 'create'}
      />
    </DashboardLayout>
  );
}
