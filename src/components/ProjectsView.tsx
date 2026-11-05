import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  Layers, 
  Tag, 
  Clock, 
  Sparkles, 
  RefreshCw,
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { CyberCard } from './common/CyberCard.js';
import { CyberBadge } from './common/CyberBadge.js';
import { CyberButton } from './common/CyberButton.js';
import { CyberInput } from './common/CyberInput.js';
import { CyberModal } from './common/CyberModal.js';
import type { Project } from '../types.js';

export const ProjectsView: React.FC = () => {
  const { playCyberSound } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Web Application');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'In Progress' | 'Completed' | 'Planning'>('In Progress');
  const [formProgress, setFormProgress] = useState(25);
  const [formTechStack, setFormTechStack] = useState('React, TypeScript, Tailwind CSS');

  // Inline task inputs per project
  const [newTaskTitle, setNewTaskTitle] = useState<{ [projId: string]: string }>({});

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.warn('Failed to fetch projects:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // CREATE Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    playCyberSound('beep');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory,
          description: formDescription,
          progress: formProgress,
          status: formStatus,
          tasks: [],
          techStack: formTechStack.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        resetForm();
        fetchProjects();
      }
    } catch {
      alert('Failed to create project');
    }
  };

  // UPDATE Project
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !formName.trim()) return;
    playCyberSound('click');

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory,
          description: formDescription,
          progress: formProgress,
          status: formStatus,
          techStack: formTechStack.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        resetForm();
        fetchProjects();
      }
    } catch {
      alert('Failed to update project');
    }
  };

  // DELETE Project
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    playCyberSound('alert');

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setShowDeleteModal(false);
        setSelectedProject(null);
        fetchProjects();
      }
    } catch {
      alert('Failed to delete project');
    }
  };

  // Open Edit Modal with prefilled values
  const openEditModal = (proj: Project) => {
    playCyberSound('click');
    setSelectedProject(proj);
    setFormName(proj.name);
    setFormCategory(proj.category);
    setFormDescription(proj.description);
    setFormStatus(proj.status);
    setFormProgress(proj.progress);
    setFormTechStack(proj.techStack.join(', '));
    setShowEditModal(true);
  };

  // Open Delete Modal
  const openDeleteModal = (proj: Project) => {
    playCyberSound('click');
    setSelectedProject(proj);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('Web Application');
    setFormDescription('');
    setFormStatus('In Progress');
    setFormProgress(25);
    setFormTechStack('React, TypeScript, Tailwind CSS');
    setSelectedProject(null);
  };

  // ADD Task to Project
  const handleAddTask = async (projId: string) => {
    const title = newTaskTitle[projId];
    if (!title?.trim()) return;
    playCyberSound('click');

    try {
      const res = await fetch(`/api/projects/${projId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), assignee: 'Izi Izudin' })
      });
      const data = await res.json();
      if (data.success) {
        setNewTaskTitle({ ...newTaskTitle, [projId]: '' });
        fetchProjects();
      }
    } catch {
      alert('Failed to add task');
    }
  };

  // TOGGLE Task Completed
  const handleToggleTask = async (projId: string, taskId: string) => {
    playCyberSound('beep');
    try {
      const res = await fetch(`/api/projects/${projId}/tasks/${taskId}/toggle`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      }
    } catch {
      alert('Failed to toggle task');
    }
  };

  // DELETE Task
  const handleDeleteTask = async (projId: string, taskId: string) => {
    playCyberSound('click');
    try {
      const res = await fetch(`/api/projects/${projId}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      }
    } catch {
      alert('Failed to delete task');
    }
  };

  const categories = ['All', 'Web Experience', 'Interactive Web', 'Digital Experience', 'Web Application'];
  const statuses = ['All', 'In Progress', 'Completed', 'Planning'];

  const filteredProjects = projects.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTech = p.techStack.some(t => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchTech;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            TAHAP 2 // PROJECT MANAGEMENT (CRUD)
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            PROJECT WORKBENCH &amp; DELIVERABLES
          </h1>
          <p className="text-slate-400 text-xs">
            Manage full-stack applications, interactive experiences, real-time task velocity, and tech stacks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CyberBadge status="online" size="md">
            {projects.length} Total Projects
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
            Create Project
          </CyberButton>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <CyberCard noPadding>
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects by name, description, tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <CyberButton
            variant="ghost"
            size="xs"
            onClick={fetchProjects}
            loading={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />}
          >
            Refresh
          </CyberButton>
        </div>
      </CyberCard>

      {/* Projects Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => (
          <CyberCard
            key={proj.id}
            title={proj.name}
            subtitle={proj.category}
            badge={
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                proj.status === 'Completed'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : proj.status === 'In Progress'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-purple-950 text-purple-300 border border-purple-800'
              }`}>
                {proj.status}
              </span>
            }
            headerAction={
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(proj)}
                  title="Edit Project"
                  className="p-1.5 rounded-lg bg-[#0e1438] hover:bg-[#162054] text-slate-400 hover:text-cyan-400 border border-[#202c66] transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openDeleteModal(proj)}
                  title="Delete Project"
                  className="p-1.5 rounded-lg bg-[#0e1438] hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-[#202c66] transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {proj.description}
              </p>

              {/* Progress Bar Gauge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Milestone Progress</span>
                  <span className="text-cyan-400 font-bold">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#11173d] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-1.5">
                {proj.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[#0e1438] border border-[#1d2757] text-[10px] font-mono text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Tasks Sub-Manager */}
              <div className="space-y-2 pt-2 border-t border-[#151c44]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-400">
                    Tasks ({proj.tasks.filter(t => t.completed).length}/{proj.tasks.length})
                  </span>
                  <span className="text-[11px] text-slate-500">Click check to toggle status</span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {proj.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2 rounded-lg bg-[#0b102e] border border-[#172048] flex items-center justify-between text-xs font-mono group"
                    >
                      <div 
                        onClick={() => handleToggleTask(proj.id, task.id)}
                        className="flex items-center gap-2.5 truncate flex-1 cursor-pointer"
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center transition ${
                          task.completed
                            ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'border border-slate-600 hover:border-cyan-400'
                        }`}>
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span className={`truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 shrink-0">{task.assignee}</span>
                        <button
                          onClick={() => handleDeleteTask(proj.id, task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete task"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline task input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="New sprint task title..."
                    value={newTaskTitle[proj.id] || ''}
                    onChange={(e) => setNewTaskTitle({ ...newTaskTitle, [proj.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask(proj.id)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0c1236] border border-[#1f2b60] text-white font-mono text-xs focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                  />
                  <CyberButton
                    variant="outline"
                    size="xs"
                    onClick={() => handleAddTask(proj.id)}
                  >
                    Add Task
                  </CyberButton>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="pt-3 border-t border-[#141b40] flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Updated: {proj.updatedAt}</span>
                <span className="text-cyan-400">Owner: Izi Izudin</span>
              </div>
            </div>
          </CyberCard>
        ))}

        {filteredProjects.length === 0 && (
          <div className="lg:col-span-2 text-center py-16 text-slate-500 font-mono text-xs border border-dashed border-[#182352] rounded-2xl">
            No projects found matching the current search query or filter.
          </div>
        )}
      </div>

      {/* CREATE PROJECT MODAL */}
      <CyberModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="CREATE NEW PROJECT"
        subtitle="Initialize deliverable, tech stack tags, and initial sprint status"
        footer={
          <>
            <CyberButton variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="primary" size="sm" onClick={handleCreateProject}>
              Create Deliverable
            </CyberButton>
          </>
        }
      >
        <form onSubmit={handleCreateProject} className="space-y-4 font-mono text-xs">
          <CyberInput
            label="Project Name *"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Cyber City Meta Portal"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Web Experience">Web Experience</option>
                <option value="Interactive Web">Interactive Web</option>
                <option value="Digital Experience">Digital Experience</option>
                <option value="Web Application">Web Application</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Initial Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-semibold">Initial Progress: {formProgress}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formProgress}
              onChange={(e) => setFormProgress(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Description</label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Overview of visual aesthetics, architecture, and goals..."
              className="w-full p-3 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <CyberInput
            label="Tech Stack (comma-separated)"
            value={formTechStack}
            onChange={(e) => setFormTechStack(e.target.value)}
            placeholder="Three.js, React 19, TypeScript, Tailwind CSS"
          />
        </form>
      </CyberModal>

      {/* EDIT PROJECT MODAL */}
      <CyberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="EDIT PROJECT DELIVERABLE"
        subtitle={`Updating ID: ${selectedProject?.id}`}
        footer={
          <>
            <CyberButton variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="primary" size="sm" onClick={handleUpdateProject}>
              Save Modifications
            </CyberButton>
          </>
        }
      >
        <form onSubmit={handleUpdateProject} className="space-y-4 font-mono text-xs">
          <CyberInput
            label="Project Name *"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Web Experience">Web Experience</option>
                <option value="Interactive Web">Interactive Web</option>
                <option value="Digital Experience">Digital Experience</option>
                <option value="Web Application">Web Application</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-semibold">Progress: {formProgress}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formProgress}
              onChange={(e) => setFormProgress(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Description</label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#090e2a] border border-[#1e2a5c] text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <CyberInput
            label="Tech Stack (comma-separated)"
            value={formTechStack}
            onChange={(e) => setFormTechStack(e.target.value)}
          />
        </form>
      </CyberModal>

      {/* DELETE CONFIRMATION MODAL */}
      <CyberModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="CONFIRM PROJECT DELETION"
        maxWidth="md"
        footer={
          <>
            <CyberButton variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="danger" size="sm" onClick={handleDeleteProject}>
              Delete Project
            </CyberButton>
          </>
        }
      >
        <div className="space-y-3 font-mono text-xs">
          <p className="text-rose-300">
            Are you sure you want to delete deliverable <strong className="text-white">"{selectedProject?.name}"</strong>?
          </p>
          <p className="text-slate-400">
            This action will permanently purge the project and its {selectedProject?.tasks.length} associated sprint tasks from the workspace database.
          </p>
        </div>
      </CyberModal>
    </div>
  );
};
