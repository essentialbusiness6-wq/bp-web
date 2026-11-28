import { useState, useEffect, ChangeEvent } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ClientModal from '../components/ClientModal';
import ClientPreviewModal from '../components/ClientPreviewModal';
import { getClients, createClient, updateClient, deleteClient } from '../services/clientService';
import { Client, CreateClientData } from '../../../types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients(query || undefined);
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchClients(searchQuery), 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSaveClient = async (data: CreateClientData) => {
    if (selectedClient) {
      const updated = await updateClient(selectedClient.id, data);
      setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    } else {
      const created = await createClient(data);
      setClients(prev => [created, ...prev]);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient.id);
      setClients(prev => prev.filter(c => c.id !== selectedClient.id));
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete client.');
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Your Clients</h1>
          <p className="muted-text">Manage your customers and track their invoices</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn primary" onClick={() => { setSelectedClient(null); setIsAddModalOpen(true); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Client
          </button>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-table">
          {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-row"></div>)}
        </div>
      ) : error ? (
        <div className="empty-state">
          <p className="error-text">⚠️ {error}</p>
          <button className="btn secondary" onClick={() => fetchClients(searchQuery)}>Try Again</button>
        </div>
      ) : clients.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3>No clients yet</h3>
          <p>Add your first client to start creating invoices</p>
          <button className="btn primary" onClick={() => setIsAddModalOpen(true)}>Add Client</button>
        </div>
      ) : (
        <div className="clients-list">
          {/* Desktop Table Header */}
          <div className="clients-table-header">
            <span>Client</span>
            <span>Email</span>
            <span>Invoices</span>
            <span>Outstanding</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          
          {/* Client Items */}
          {clients.map(client => (
            <div key={client.id} className="client-item" onClick={() => { setSelectedClient(client); setIsPreviewModalOpen(true); }}>
              <div className="client-info">
                <div className="client-avatar">
                  {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="client-name">{client.name}</div>
                  {client.company && <div className="client-company">{client.company}</div>}
                </div>
              </div>
              <div className="client-email">{client.email}</div>
              <div className="client-invoices">{client.total_invoices}</div>
              <div className={`client-outstanding ${client.outstanding_balance > 0 ? 'text-danger' : 'text-success'}`}>
                {formatCurrency(client.outstanding_amount, client.currency)}
              </div>
              <div className="client-status">
                <span className={`status-badge ${client.status}`}>{client.status}</span>
              </div>
              <div className="client-actions" onClick={(e) => e.stopPropagation()}>
                <button className="icon-btn-sm" onClick={() => { setSelectedClient(client); setIsEditModalOpen(true); }} title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button className="icon-btn-sm danger" onClick={() => { setSelectedClient(client); setIsDeleteModalOpen(true); }} title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ClientModal 
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setSelectedClient(null); }}
        onSave={handleSaveClient}
        initialData={selectedClient}
        mode={isEditModalOpen ? 'edit' : 'add'}
      />

      <ClientPreviewModal 
        client={selectedClient}
        isOpen={isPreviewModalOpen}
        onClose={() => { setIsPreviewModalOpen(false); setSelectedClient(null); }}
        onEdit={() => { setIsPreviewModalOpen(false); setIsEditModalOpen(true); }}
        onDelete={() => { setIsPreviewModalOpen(false); setIsDeleteModalOpen(true); }}
      />

      {isDeleteModalOpen && selectedClient && (
        <div className="modal-overlay active" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-card delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon error">
              <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15" fill="none" stroke="white" strokeWidth="2"/><line x1="9" y1="9" x2="15" y2="15" fill="none" stroke="white" strokeWidth="2"/></svg>
            </div>
            <h2>Delete Client?</h2>
            <p>Are you sure you want to delete <strong>{selectedClient.name}</strong>? This action cannot be undone and may affect associated invoices.</p>
            <div className="modal-buttons">
              <button className="btn secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="btn danger" onClick={handleDeleteClient}>Delete Client</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
