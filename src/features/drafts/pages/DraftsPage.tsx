import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import DraftCard from '../components/DraftCard';
import DraftPreviewModal from '../components/DraftsPreviewModal';
import InvoiceEditorModal, { InvoiceFormData } from '../../invoices/components/InvoiceEditorModal';
import { 
  getDrafts, 
  deleteDraft, 
  convertDraftToInvoice, 
  createDraft, 
  updateDraft 
} from '../services/draftsService';
import { Draft } from '../../../types';

type SortOption = 'all' | 'recent' | 'client' | 'date';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'All Drafts', value: 'all' },
  { label: 'Recent', value: 'recent' },
  { label: 'By Client', value: 'client' },
  { label: 'By Date', value: 'date' },
];

export default function DraftsPage() {
  const navigate = useNavigate();
  
  // List State
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<SortOption>('all');
  
  // Preview Modal State
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  const fetchDrafts = async (sort: SortOption) => {
    setLoading(true);
    setError(null);
    try {
      const params = sort === 'all' ? {} : { sort };
      const data = await getDrafts(params);
      setDrafts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load drafts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts(activeSort);
  }, [activeSort]);

  // --- Draft Actions ---

  const handleDelete = async (id: string) => {
    try {
      await deleteDraft(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      if (selectedDraft?.id === id) {
        setIsPreviewOpen(false);
        setSelectedDraft(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete draft.');
    }
  };

  const handleConvert = async (id: string) => {
    try {
      const response = await convertDraftToInvoice(id);
      alert('Draft successfully converted to invoice!');
      setIsPreviewOpen(false);
      navigate(`/dashboard/invoices/${response.invoice_id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to convert draft.');
    }
  };

  // --- Editor Modal Handlers ---

  const openCreateDraftModal = () => {
    setEditingDraft(null);
    setIsEditorOpen(true);
  };

  const openEditDraftModal = (draft: Draft) => {
    setEditingDraft(draft);
    setIsPreviewOpen(false); // Close preview if open
    setIsEditorOpen(true);
  };

  const handleSaveDraft = async (data: InvoiceFormData, isDraft: boolean) => {
    // For drafts page, we always save as draft unless explicitly converting
    const payload = { ...data, status: 'draft' as const };
    
    if (editingDraft) {
      const updated = await updateDraft(editingDraft.id, payload);
      setDrafts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } else {
      const created = await createDraft(payload);
      setDrafts((prev) => [created, ...prev]);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Your Drafts</h1>
        <button className="btn primary" onClick={openCreateDraftModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Draft
        </button>
      </div>

      <div className="filter-tabs">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`filter-tab ${activeSort === option.value ? 'active' : ''}`}
            onClick={() => setActiveSort(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="invoices-grid">
          {[1, 2, 3].map((i) => (
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
          <button className="btn secondary" onClick={() => fetchDrafts(activeSort)}>Try Again</button>
        </div>
      ) : drafts.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
          <h3>No drafts found</h3>
          <p>Start creating an invoice and save it as a draft to see it here.</p>
          <button className="btn primary" style={{ marginTop: '16px' }} onClick={openCreateDraftModal}>
            Create Your First Draft
          </button>
        </div>
      ) : (
        <div className="invoices-grid">
          {drafts.map((draft) => (
            <DraftCard 
              key={draft.id} 
              draft={draft} 
              onDelete={handleDelete} 
              onView={(d) => { setSelectedDraft(d); setIsPreviewOpen(true); }} 
            />
          ))}
        </div>
      )}

      {/* 1. Preview Modal */}
      <DraftPreviewModal 
        draft={selectedDraft}
        isOpen={isPreviewOpen}
        onClose={() => { setIsPreviewOpen(false); setSelectedDraft(null); }}
        onEdit={(id) => {
          const draftToEdit = drafts.find(d => d.id === id);
          if (draftToEdit) openEditDraftModal(draftToEdit);
        }}
        onDelete={handleDelete}
        onConvert={handleConvert}
      />

      {/* 2. Editor Modal (Reused for Create and Edit Drafts) */}
      <InvoiceEditorModal 
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setEditingDraft(null); }}
        onSave={handleSaveDraft}
        initialData={editingDraft ? {
          ...editingDraft,
          items: editingDraft.items.map((item, index) => ({
            ...item,
            id: `draft-${editingDraft.id}-${index}`,
          })),
        } : undefined}
        mode={editingDraft ? 'edit_draft' : 'create'}
      />
    </DashboardLayout>
  );
}