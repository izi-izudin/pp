import React, { useState, useEffect } from 'react';
import { 
  TicketCheck, 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  RefreshCw,
  Send,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { CyberCard } from './common/CyberCard.js';
import { CyberBadge } from './common/CyberBadge.js';
import { CyberButton } from './common/CyberButton.js';
import { CyberInput } from './common/CyberInput.js';
import { CyberModal } from './common/CyberModal.js';
import type { Ticket, Project } from '../types.js';

export const TicketsView: React.FC = () => {
  const { playCyberSound } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Ticket['category']>('Bug');
  const [formPriority, setFormPriority] = useState<Ticket['priority']>('High');
  const [formStatus, setFormStatus] = useState<Ticket['status']>('Open');
  const [formDescription, setFormDescription] = useState('');
  const [formRequester, setFormRequester] = useState('DevOps Team');
  const [formAssignedTo, setFormAssignedTo] = useState('Izi Izudin');
  const [formSource, setFormSource] = useState<Ticket['source']>('Web UI');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const [tickRes, projRes] = await Promise.all([
        fetch('/api/tickets').then(r => r.json()),
        fetch('/api/projects').then(r => r.json())
      ]);
      if (tickRes.success && tickRes.tickets) {
        setTickets(tickRes.tickets);
      }
      if (projRes.success && projRes.projects) {
        setProjects(projRes.projects);
      }
    } catch (e) {
      console.warn('Failed to fetch tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // CREATE Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    playCyberSound('beep');

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          priority: formPriority,
          status: formStatus,
          description: formDescription,
          requester: formRequester,
          assignedTo: formAssignedTo,
          source: formSource
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        resetForm();
        fetchTickets();
      }
    } catch {
      alert('Failed to create ticket');
    }
  };

  // UPDATE Ticket
  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !formTitle.trim()) return;
    playCyberSound('click');

    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          priority: formPriority,
          status: formStatus,
          description: formDescription,
          requester: formRequester,
          assignedTo: formAssignedTo,
          source: formSource
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        resetForm();
        fetchTickets();
      }
    } catch {
      alert('Failed to update ticket');
    }
  };

  // DELETE Ticket
  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;
    playCyberSound('alert');

    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setShowDeleteModal(false);
        setSelectedTicket(null);
        fetchTickets();
      }
    } catch {
      alert('Failed to delete ticket');
    }
  };

  // Quick Status Transition (e.g., Open -> In Progress -> Resolved)
  const handleQuickStatusChange = async (ticketId: string, newStatus: Ticket['status']) => {
    playCyberSound('beep');
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchTickets();
      }
    } catch {
      alert('Failed to update ticket status');
    }
  };

  const openEditModal = (t: Ticket) => {
    playCyberSound('click');
    setSelectedTicket(t);
    setFormTitle(t.title);
    setFormCategory(t.category);
    setFormPriority(t.priority);
    setFormStatus(t.status);
    setFormDescription(t.description);
    setFormRequester(t.requester);
    setFormAssignedTo(t.assignedTo);
    setFormSource(t.source);
    setShowEditModal(true);
  };

  const openDeleteModal = (t: Ticket) => {
    playCyberSound('click');
    setSelectedTicket(t);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('Bug');
    setFormPriority('High');
    setFormStatus('Open');
    setFormDescription('');
    setFormRequester('DevOps Team');
    setFormAssignedTo('Izi Izudin');
    setFormSource('Web UI');
    setSelectedTicket(null);
  };

  const categories = ['All', 'Bug', 'Infrastructure', 'Database', 'Network', 'Security', 'Feature'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.requester.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-pink-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
            TAHAP 2 // IT SERVICE DESK &amp; INCIDENT MANAGEMENT (CRUD)
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            IT SUPPORT TICKETS &amp; SLA AUDIT
          </h1>
          <p className="text-slate-400 text-xs">
            Manage infrastructure issues, bug escalations, resolution notes, and SLA response rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CyberBadge status="critical" size="md">
            {tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length} Critical Alerts
          </CyberBadge>

          <CyberButton
            variant="primary"
            size="sm"
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            New Incident Ticket
          </CyberButton>
        </div>
      </div>

      {/* Filter Toolbar */}
      <CyberCard noPadding>
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by ID, title, requester..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white focus:outline-none focus:border-pink-500 placeholder:text-slate-600"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-slate-300 focus:outline-none focus:border-pink-500"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-slate-300 focus:outline-none focus:border-pink-500"
              >
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Category */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Cat:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-slate-300 focus:outline-none focus:border-pink-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <CyberButton
            variant="ghost"
            size="xs"
            onClick={fetchTickets}
            loading={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-400' : ''}`} />}
          >
            Refresh
          </CyberButton>
        </div>
      </CyberCard>

      {/* Ticket Cards List */}
      <div className="space-y-3">
        {filteredTickets.map((t) => (
          <CyberCard key={t.id} noPadding>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
              {/* Left Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-xs text-cyan-400">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    t.priority === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : t.priority === 'High'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {t.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                    {t.category}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    Created: {t.createdAt} &bull; Source: {t.source}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                  {t.title}
                </h3>

                <p className="text-xs text-slate-300 font-sans line-clamp-2 max-w-3xl">
                  {t.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-[#141b40]">
                  <span>Requester: <strong className="text-slate-200">{t.requester}</strong></span>
                  <span>Assigned: <strong className="text-slate-200">{t.assignedTo}</strong></span>
                  {t.resolvedAt && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Resolved on: {t.resolvedAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex sm:flex-col items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#141b40]">
                {/* Status selector dropdown */}
                <select
                  value={t.status}
                  onChange={(e) => handleQuickStatusChange(t.id, e.target.value as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : t.status === 'In Progress'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : t.status === 'Closed'
                      ? 'bg-slate-900 text-slate-400 border-slate-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(t)}
                    title="Edit Ticket"
                    className="p-1.5 rounded-lg bg-[#0e1438] hover:bg-[#162054] text-slate-400 hover:text-cyan-400 border border-[#202c66] transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(t)}
                    title="Delete Ticket"
                    className="p-1.5 rounded-lg bg-[#0e1438] hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-[#202c66] transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </CyberCard>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-mono text-xs border border-dashed border-[#182352] rounded-2xl">
            No incident tickets match the selected filters.
          </div>
        )}
      </div>

      {/* CREATE TICKET MODAL */}
      <CyberModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="CREATE IT INCIDENT TICKET"
        subtitle="Report infrastructure bugs, database incidents, or feature requests"
        footer={
          <>
            <CyberButton variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="primary" size="sm" onClick={handleCreateTicket}>
              Create Ticket &amp; Trigger SLA
            </CyberButton>
          </>
        }
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 font-mono text-xs">
          <CyberInput
            label="Incident Title *"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="e.g. PgBouncer pool connection exhaustion during backup"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-pink-400"
              >
                <option value="Bug">Bug</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Database">Database</option>
                <option value="Network">Network</option>
                <option value="Security">Security</option>
                <option value="Feature">Feature</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-pink-400"
              >
                <option value="Critical">Critical (Immediate Alert)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CyberInput
              label="Requester"
              value={formRequester}
              onChange={(e) => setFormRequester(e.target.value)}
              placeholder="e.g. DevOps On-Call"
            />

            <CyberInput
              label="Assignee"
              value={formAssignedTo}
              onChange={(e) => setFormAssignedTo(e.target.value)}
              placeholder="e.g. Izi Izudin"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Description &amp; Diagnostics</label>
            <textarea
              rows={4}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Reproduction steps, error log traces, impact..."
              className="w-full p-3 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-pink-400"
            />
          </div>
        </form>
      </CyberModal>

      {/* EDIT TICKET MODAL */}
      <CyberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="EDIT INCIDENT TICKET"
        subtitle={`Updating Ticket ID: ${selectedTicket?.id}`}
        footer={
          <>
            <CyberButton variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="primary" size="sm" onClick={handleUpdateTicket}>
              Update Ticket
            </CyberButton>
          </>
        }
      >
        <form onSubmit={handleUpdateTicket} className="space-y-4 font-mono text-xs">
          <CyberInput
            label="Incident Title *"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-pink-400"
              >
                <option value="Bug">Bug</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Database">Database</option>
                <option value="Network">Network</option>
                <option value="Security">Security</option>
                <option value="Feature">Feature</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-pink-400"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-pink-400"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CyberInput
              label="Requester"
              value={formRequester}
              onChange={(e) => setFormRequester(e.target.value)}
            />

            <CyberInput
              label="Assignee"
              value={formAssignedTo}
              onChange={(e) => setFormAssignedTo(e.target.value)}
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Description</label>
            <textarea
              rows={4}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-pink-400"
            />
          </div>
        </form>
      </CyberModal>

      {/* DELETE CONFIRMATION MODAL */}
      <CyberModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="CONFIRM TICKET PURGE"
        maxWidth="md"
        footer={
          <>
            <CyberButton variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="danger" size="sm" onClick={handleDeleteTicket}>
              Purge Ticket
            </CyberButton>
          </>
        }
      >
        <div className="space-y-3 font-mono text-xs">
          <p className="text-rose-300">
            Are you sure you want to delete ticket <strong className="text-white">"{selectedTicket?.id} — {selectedTicket?.title}"</strong>?
          </p>
          <p className="text-slate-400">
            This incident and all related timeline resolution notes will be deleted from the database.
          </p>
        </div>
      </CyberModal>
    </div>
  );
};
