import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Tag, 
  Copy, 
  Check, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Terminal, 
  BookMarked
} from 'lucide-react';
import type { LibraryItem } from '../types.js';
import { useTheme } from '../context/ThemeContext.js';
import { CyberCard } from './common/CyberCard.js';
import { CyberBadge, type BadgeStatus } from './common/CyberBadge.js';
import { CyberButton } from './common/CyberButton.js';

export const LibraryView: React.FC = () => {
  const { playCyberSound } = useTheme();
  const [articles, setArticles] = useState<LibraryItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<LibraryItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<LibraryItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'Linux' as LibraryItem['category'],
    tags: 'Linux, Security, CLI',
    content: '',
    author: 'Izi Izudin'
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations/library');
      const data = await res.json();
      if (data.success && data.articles) {
        setArticles(data.articles);
        if (data.articles.length > 0) {
          setSelectedArticle(prev => {
            if (!prev) return data.articles[0];
            const updated = data.articles.find((a: LibraryItem) => a.id === prev.id);
            return updated || data.articles[0];
          });
        }
      }
    } catch (e) {
      console.warn('Failed to fetch library articles:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenCreate = () => {
    playCyberSound('click');
    setFormData({
      title: '',
      category: 'Linux',
      tags: 'Linux, Production, Hardening',
      content: '',
      author: 'Izi Izudin'
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (article: LibraryItem) => {
    playCyberSound('click');
    setFormData({
      title: article.title,
      category: article.category,
      tags: article.tags.join(', '),
      content: article.content,
      author: article.author
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (article: LibraryItem) => {
    playCyberSound('alert');
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      const res = await fetch('/api/integrations/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
          content: formData.content,
          author: formData.author || 'Izi Izudin'
        })
      });
      const data = await res.json();
      if (data.success) {
        playCyberSound('beep');
        setShowCreateModal(false);
        fetchArticles();
      }
    } catch {
      alert('Failed to save article');
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !formData.title.trim() || !formData.content.trim()) return;

    try {
      const res = await fetch(`/api/integrations/library/${selectedArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
          content: formData.content,
          author: formData.author
        })
      });
      const data = await res.json();
      if (data.success) {
        playCyberSound('beep');
        setShowEditModal(false);
        fetchArticles();
      }
    } catch {
      alert('Failed to update article');
    }
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;

    try {
      const res = await fetch(`/api/integrations/library/${articleToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        playCyberSound('beep');
        setShowDeleteModal(false);
        setArticleToDelete(null);
        if (selectedArticle?.id === articleToDelete.id) {
          setSelectedArticle(null);
        }
        fetchArticles();
      }
    } catch {
      alert('Failed to delete article');
    }
  };

  const handleCopyContent = () => {
    if (!selectedArticle) return;
    playCyberSound('click');
    navigator.clipboard.writeText(selectedArticle.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['All', 'Linux', 'Network', 'Database', 'Security', 'DevOps', 'Frontend'];

  const filteredArticles = articles.filter(a => {
    if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryStatus = (cat: string): BadgeStatus => {
    switch (cat) {
      case 'Security': return 'critical';
      case 'Linux': return 'idle';
      case 'Database': return 'busy';
      case 'Network': return 'online';
      case 'DevOps': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            KNOWLEDGE BASE // IT RUNBOOKS &amp; ARCHITECTURE MANUALS
            <CyberBadge status="info" pulse size="xs">PERSISTED</CyberBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
            LIBRARY IT &amp; ENGINEERING REPOSITORY
          </h1>
          <p className="text-slate-400 text-xs max-w-2xl">
            Hardening checklists, production runbooks, reverse proxy configurations, and persistent IT cheatsheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right font-mono">
            <span className="text-slate-400 text-[11px]">TOTAL ARTICLES</span>
            <span className="text-cyan-400 text-sm font-bold">{articles.length} RUNBOOKS</span>
          </div>
          <CyberButton
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            New Article
          </CyberButton>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Column: Search, Categories & Article List (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 flex flex-col">
          {/* Search & Category Filter Box */}
          <CyberCard glow={true} className="p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search runbooks, tags, configs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b24] border border-[#1f2b60] text-white font-mono text-xs focus:outline-none focus:border-purple-500 transition placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    playCyberSound('click');
                    setCategoryFilter(c);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                    categoryFilter === c
                      ? 'bg-purple-950 text-purple-300 border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] font-bold'
                      : 'text-slate-400 bg-[#090e2b] border border-[#1b2552] hover:text-white hover:border-[#2a3875]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </CyberCard>

          {/* Article List */}
          <div className="flex-1 space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Scanning repository nodes...
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#080c24] border border-[#1b2552] text-slate-500 font-mono text-xs">
                No matching articles found in {categoryFilter}.
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => {
                      playCyberSound('click');
                      setSelectedArticle(art);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white'
                        : 'bg-[#080c24] border-[#1b2552] text-slate-400 hover:text-white hover:bg-[#0c1236] hover:border-[#28387a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <CyberBadge status={getCategoryStatus(art.category)} size="xs">
                        {art.category}
                      </CyberBadge>
                      <span className="text-[10px] font-mono text-slate-500">
                        {art.updatedAt || 'Recent'}
                      </span>
                    </div>

                    <h3 className={`text-xs font-bold line-clamp-2 mb-1.5 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {art.title}
                    </h3>

                    <div className="flex items-center justify-between pt-1 border-t border-[#141d47]">
                      <div className="flex flex-wrap gap-1 max-w-[80%]">
                        {art.tags.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[9px] font-mono text-slate-400">
                            #{t}
                          </span>
                        ))}
                        {art.tags.length > 2 && (
                          <span className="text-[9px] font-mono text-slate-500">+{art.tags.length - 2}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(art);
                          }}
                          className="p-1 rounded hover:bg-purple-900/50 text-slate-400 hover:text-purple-300 transition"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDelete(art);
                          }}
                          className="p-1 rounded hover:bg-red-900/50 text-slate-400 hover:text-red-300 transition"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Article Reader Pane (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <CyberCard glow={true} className="flex-1 p-6 flex flex-col justify-between space-y-4 min-h-[580px]">
            {selectedArticle ? (
              <div className="space-y-4">
                {/* Article Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#182352] pb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <CyberBadge status={getCategoryStatus(selectedArticle.category)} size="sm">
                        {selectedArticle.category}
                      </CyberBadge>
                      <span className="text-[11px] font-mono text-slate-400">
                        DOC ID: <span className="text-cyan-400">{selectedArticle.id}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">&bull;</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Author: <span className="text-white font-medium">{selectedArticle.author}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">&bull;</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {selectedArticle.updatedAt}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide">
                      {selectedArticle.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={handleCopyContent}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1438] border border-[#202c66] hover:border-cyan-500 text-xs font-mono text-slate-300 hover:text-white transition cursor-pointer shadow"
                      title="Copy Runbook Content"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(selectedArticle)}
                      className="p-1.5 rounded-lg bg-[#0e1438] border border-[#202c66] hover:border-purple-500 text-slate-300 hover:text-purple-300 transition cursor-pointer"
                      title="Edit Runbook"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(selectedArticle)}
                      className="p-1.5 rounded-lg bg-[#0e1438] border border-[#202c66] hover:border-red-500 text-slate-300 hover:text-red-400 transition cursor-pointer"
                      title="Delete Runbook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags Bar */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mr-1">
                    <Tag className="w-3 h-3 text-cyan-400" /> KEYWORDS:
                  </span>
                  {selectedArticle.tags.map((tag, i) => (
                    <span
                      key={i}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-0.5 rounded-md bg-[#0a1030] border border-[#1b2658] text-[10px] font-mono text-cyan-300 hover:border-cyan-400 cursor-pointer transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Terminal / Code / Content Box */}
                <div className="relative rounded-xl bg-[#040614] border border-[#182352] overflow-hidden shadow-inner">
                  {/* Terminal Header Bar */}
                  <div className="px-4 py-2 bg-[#090d29] border-b border-[#141c44] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-purple-400" />
                      <span>RUNBOOK ARCHITECTURE &amp; CONFIG SCRIPT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{selectedArticle.content.split('\n').length} lines</span>
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/60"></span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500/60"></span>
                        <span className="w-2 h-2 rounded-full bg-green-500/60"></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto selection:bg-purple-600 selection:text-white">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs space-y-3 py-20">
                <BookOpen className="w-12 h-12 text-slate-700" />
                <p>Select an article from the repository to view technical specifications.</p>
                <CyberButton variant="ghost" size="sm" onClick={handleOpenCreate}>
                  Create First Runbook
                </CyberButton>
              </div>
            )}

            {/* Footer with Inter-module Status */}
            <div className="pt-4 border-t border-[#141b40] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>IZI Tech Knowledge Base &bull; Online Repository</span>
              </div>
              <span className="text-purple-400 text-[11px]">
                Grounding context for IZI AI Assistant &amp; Tickets
              </span>
            </div>
          </CyberCard>
        </div>
      </div>

      {/* CREATE ARTICLE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-[#090d2b] border border-cyan-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2552] pb-3">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                CREATE NEW IT RUNBOOK ARTICLE
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Nginx Reverse Proxy with Zero Downtime Reload"
                  className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Linux">Linux</option>
                    <option value="Network">Network</option>
                    <option value="Database">Database</option>
                    <option value="Security">Security</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Frontend">Frontend</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Linux, Nginx, SSL, Proxy"
                  className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Documentation Content / Script</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write step-by-step documentation, command line commands, or config templates..."
                  className="w-full p-3 rounded-lg bg-[#040614] border border-[#232f66] text-slate-200 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1b2552]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#141b44] text-slate-300 font-mono text-xs hover:bg-[#1b245c] cursor-pointer"
                >
                  Cancel
                </button>
                <CyberButton variant="primary" type="submit">
                  Publish to Library
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ARTICLE MODAL */}
      {showEditModal && selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-[#090d2b] border border-purple-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2552] pb-3">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" />
                EDIT IT RUNBOOK ARTICLE ({selectedArticle.id})
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateArticle} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Linux">Linux</option>
                    <option value="Network">Network</option>
                    <option value="Database">Database</option>
                    <option value="Security">Security</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Frontend">Frontend</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e143d] border border-[#232f66] text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Documentation Content / Script</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#040614] border border-[#232f66] text-slate-200 focus:outline-none focus:border-purple-400 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1b2552]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#141b44] text-slate-300 font-mono text-xs hover:bg-[#1b245c] cursor-pointer"
                >
                  Cancel
                </button>
                <CyberButton variant="accent" type="submit">
                  Save Changes
                </CyberButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && articleToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0d0924] border border-red-500/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-display font-bold text-white">
                DELETE IT RUNBOOK ARTICLE?
              </h3>
            </div>

            <p className="text-xs font-mono text-slate-300">
              Are you sure you want to permanently delete runbook <span className="text-red-400 font-bold">"{articleToDelete.title}"</span> ({articleToDelete.id})? This action cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-[#141b44] text-slate-300 font-mono text-xs hover:bg-[#1b245c] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteArticle}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-700 cursor-pointer shadow-lg shadow-red-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
