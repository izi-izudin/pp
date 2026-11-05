import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Code, 
  Layers, 
  TicketPlus, 
  BookMarked, 
  Download, 
  Search, 
  Settings2,
  FileText,
  Cpu,
  ChevronDown,
  Terminal,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import type { Conversation, ChatMessage, Project, LibraryItem } from '../types.js';

interface ChatbotViewProps {
  onNavigateToTickets?: () => void;
  onNavigateToProjects?: () => void;
  onNavigateToLibrary?: () => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  onNavigateToTickets,
  onNavigateToProjects,
  onNavigateToLibrary
}) => {
  // Personas
  const personas = [
    { key: 'programming', title: 'Programming Assistant', cat: 'Code & Web', icon: '💻' },
    { key: 'network', title: 'Network Engineer Assistant', cat: 'NetOps & DNS', icon: '🌐' },
    { key: 'database', title: 'Database Assistant', cat: 'SQL & Cache', icon: '🗄️' },
    { key: 'cybersecurity', title: 'Cybersecurity Assistant', cat: 'SecOps & OWASP', icon: '🛡️' },
    { key: 'linux', title: 'Linux Assistant', cat: 'SysAdmin & Kernel', icon: '🐧' },
    { key: 'windows', title: 'Windows Troubleshooting', cat: 'OS & Event Logs', icon: '🪟' },
    { key: 'itsupport', title: 'IT Support Assistant', cat: 'Helpdesk & SLA', icon: '🎧' },
    { key: 'datascience', title: 'Data Science Assistant', cat: 'Python & Models', icon: '📊' },
    { key: 'uiux', title: 'UI/UX Assistant', cat: 'Cyber & Design', icon: '🎨' },
    { key: 'prompteng', title: 'AI Prompt Engineer', cat: 'LLM Prompting', icon: '✨' },
  ];

  // Prompt templates
  const promptTemplates = [
    { title: 'Debug Runtime Error', prompt: 'Saya mengalami error berikut saat menjalankan backend service:\n```\nError: [paste error here]\n```\nTolong analisa root cause dan berikan step perbaikan.' },
    { title: 'Explain & Refactor Code', prompt: 'Tolong jelaskan cara kerja potongan kode berikut dan berikan versi refactor yang lebih bersih & efisien:\n```typescript\n\n```' },
    { title: 'Optimize PostgreSQL Query', prompt: 'Optimalkan query SQL berikut untuk database PostgreSQL dengan jutaan records dan jelaskan rekomendasi index-nya:\n```sql\n\n```' },
    { title: 'Linux Firewall & UFW Hardening', prompt: 'Berikan panduan konfigurasi firewall UFW dan iptables untuk mengamankan server VPS produksi Linux Ubuntu.' },
    { title: 'Design Meta WhatsApp Webhook', prompt: 'Jelaskan implementasi aman Meta WhatsApp Cloud API Webhook menggunakan signature HMAC-SHA256 di Express.js.' },
  ];

  // State
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    return [
      {
        id: 'conv-1',
        title: 'Arsitektur Webhook & IZI Security',
        personaKey: 'programming',
        updatedAt: new Date().toISOString(),
        provider: 'Google Gemini API',
        model: 'gemini-3.8-flash',
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            content: 'Halo! Saya **IZI AI – Intelligent Technology Assistant** untuk **Programming & Full-Stack Engineering**.\n\nBagaimana saya dapat membantu pengembangan sistem hari ini? Anda dapat memilih context project atau IT library di panel atas, atau mencoba prompt template.',
            timestamp: '10:00 AM'
          }
        ]
      }
    ];
  });

  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPersonaKey, setSelectedPersonaKey] = useState('programming');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState('');
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [toolsActiveTab, setToolsActiveTab] = useState<'templates' | 'codeformat' | 'jsonformat' | 'preview'>('templates');

  // Formatters state
  const [codeToFormat, setCodeToFormat] = useState('function test(){const a=1;return a+2;}');
  const [jsonToFormat, setJsonToFormat] = useState('{"name":"izi","role":"coder"}');

  // Project & Library data for context
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [libraryList, setLibraryList] = useState<LibraryItem[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => d.success && setProjectList(d.projects || []));
    fetch('/api/integrations/library').then(r => r.json()).then(d => d.success && setLibraryList(d.articles || []));
  }, []);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, loading]);

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...(activeConv?.messages || []), userMsg];

    // Update conversation state with user message
    const updatedConvs = conversations.map(c => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
          title: c.messages.length <= 1 ? text.slice(0, 30) : c.title
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaKey: selectedPersonaKey,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          projectContextId: selectedProjectId || undefined,
          libraryContextId: selectedLibraryId || undefined
        })
      });

      const data = await res.json();
      const replyContent = data.reply || data.error || 'No response generated.';

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider || 'Google Gemini API',
        model: data.model || 'gemini-3.8-flash',
        personaKey: selectedPersonaKey
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            messages: [...updatedMessages, assistantMsg],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      }));
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Failed to reach AI service: ${err instanceof Error ? err.message : String(err)}. Please check your internet or configure GEMINI_API_KEY.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversations(prev => prev.map(c => {
        if (c.id === activeConv.id) {
          return { ...c, messages: [...updatedMessages, errorMsg] };
        }
        return c;
      }));
    } finally {
      setLoading(false);
    }
  };

  // New Chat
  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const persona = personas.find(p => p.key === selectedPersonaKey) || personas[0];
    const newConv: Conversation = {
      id: newId,
      title: `New ${persona.title}`,
      personaKey: selectedPersonaKey,
      updatedAt: new Date().toISOString(),
      provider: 'Google Gemini API',
      model: 'gemini-3.8-flash',
      messages: [
        {
          id: `m-init-${Date.now()}`,
          role: 'assistant',
          content: `Halo! Saya **IZI AI – ${persona.title}**.\nSiap menganalisa kode, konfigurasi, atau pertanyaan teknis Anda.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  // Delete Chat
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      alert('Cannot delete the last conversation.');
      return;
    }
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeConvId === id) {
      setActiveConvId(filtered[0].id);
    }
  };

  // Rename Chat
  const handleRenameChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = conversations.find(c => c.id === id);
    const newTitle = prompt('Rename conversation to:', current?.title);
    if (newTitle && newTitle.trim()) {
      setConversations(conversations.map(c => c.id === id ? { ...c, title: newTitle.trim() } : c));
    }
  };

  // Copy Message
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Regenerate Response
  const handleRegenerate = () => {
    if (!activeConv || activeConv.messages.length < 2) return;
    const lastUser = [...activeConv.messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      handleSendMessage(lastUser.content);
    }
  };

  // Convert answer to Ticket
  const handleConvertToTicket = async (text: string) => {
    try {
      const title = text.slice(0, 60).replace(/[#*`]/g, '').trim() || 'Issue escalated from IZI AI Chat';
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[AI Escalation] ${title}`,
          category: 'Bug',
          priority: 'High',
          status: 'Open',
          description: text.slice(0, 1500),
          requester: 'IZI AI Assistant',
          assignedTo: 'Izi Izudin',
          source: 'AI Chat'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Ticket #${data.ticket.id} created successfully! Notification dispatched to WhatsApp.`);
        onNavigateToTickets?.();
      }
    } catch {
      alert('Failed to convert answer to ticket.');
    }
  };

  // Convert answer to Project Task
  const handleConvertToTask = async (text: string) => {
    if (!selectedProjectId && projectList.length > 0) {
      setSelectedProjectId(projectList[0].id);
    }
    const targetProjId = selectedProjectId || projectList[0]?.id;
    if (!targetProjId) {
      alert('Please select or create a project first.');
      return;
    }

    try {
      const taskTitle = text.slice(0, 80).replace(/[#*`\n]/g, ' ').trim() || 'New task from AI solution';
      const res = await fetch(`/api/projects/${targetProjId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle, assignee: 'Izi Izudin' })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Task added to project successfully!`);
        onNavigateToProjects?.();
      }
    } catch {
      alert('Failed to add task to project.');
    }
  };

  // Save answer to IT Library
  const handleSaveToLibrary = async (text: string) => {
    const title = prompt('Enter Library Article Title:', 'AI Solution: ' + text.slice(0, 40).replace(/[#*`]/g, ''));
    if (!title) return;

    try {
      const res = await fetch('/api/integrations/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category: 'DevOps',
          tags: ['AI-Generated', selectedPersonaKey],
          content: text,
          author: 'IZI AI Assistant'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Answer saved to IT Library successfully!');
        onNavigateToLibrary?.();
      }
    } catch {
      alert('Failed to save to library.');
    }
  };

  // Export Chat
  const handleExportChat = (format: 'txt' | 'md') => {
    if (!activeConv) return;
    let content = `# Conversation: ${activeConv.title}\nDate: ${activeConv.updatedAt}\nPersona: ${activeConv.personaKey}\n\n`;
    activeConv.messages.forEach(m => {
      content += `### ${m.role === 'user' ? 'User' : 'IZI AI'} (${m.timestamp}):\n${m.content}\n\n`;
    });

    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConv.title.replace(/\s+/g, '_')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            MODULE 2 // IZI AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            IZI AI – INTELLIGENT TECHNOLOGY ASSISTANT
          </h1>
          <p className="text-slate-400 text-xs">
            Multi-persona workspace with context grounding, prompt engineering templates, and workspace tools.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowToolsDrawer(!showToolsDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
              showToolsDrawer
                ? 'bg-purple-950 text-purple-300 border-purple-500/50'
                : 'bg-[#090d29] text-slate-300 border-[#1d2757] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Chatbot Tools &amp; Formatters</span>
          </button>

          <button
            onClick={() => handleExportChat('md')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090d29] border border-[#1d2757] text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export MD</span>
          </button>
        </div>
      </div>

      {/* Main AI Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* Left Column: Chat History & Personas (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-mono text-xs font-bold shadow-lg shadow-purple-500/20 hover:opacity-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Persona Selector Pill */}
          <div className="p-3.5 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-2">
            <label className="text-[11px] font-mono font-bold text-cyan-400 block">
              Active Persona:
            </label>
            <select
              value={selectedPersonaKey}
              onChange={(e) => {
                setSelectedPersonaKey(e.target.value);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1438] border border-[#232f6b] text-white font-mono text-xs"
            >
              {personas.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.icon} {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Conversations History List */}
          <div className="p-4 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">HISTORY</span>
              <span className="text-[10px] font-mono text-slate-500">{conversations.length} sessions</span>
            </div>

            {/* Search History */}
            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-[#0b102e] border border-[#1b2554] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
              {filteredConversations.map((c) => {
                const isActive = c.id === activeConvId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-purple-950/60 border-purple-500/50 text-white'
                        : 'bg-[#0b102e] border-[#16204d] text-slate-400 hover:text-white hover:bg-[#10173e]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-mono truncate">{c.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {c.messages.length} messages
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => handleRenameChat(c.id, e)}
                        className="p-1 text-slate-400 hover:text-cyan-400"
                        title="Rename"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(c.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center/Right Column: Main Chat Interface (9 Cols) */}
        <div className="lg:col-span-9 flex flex-col space-y-4">
          {/* Top Context Injection Bar */}
          <div className="p-3.5 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Project Context:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="px-2 py-1 rounded bg-[#0b102e] border border-[#1f2b60] text-cyan-300 text-xs"
                >
                  <option value="">None (General Context)</option>
                  {projectList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-400">IT Library:</span>
                <select
                  value={selectedLibraryId}
                  onChange={(e) => setSelectedLibraryId(e.target.value)}
                  className="px-2 py-1 rounded bg-[#0b102e] border border-[#1f2b60] text-purple-300 text-xs"
                >
                  <option value="">None</option>
                  {libraryList.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Provider: <strong className="text-slate-200">Google Gemini API</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Model: gemini-3.8-flash</span>
            </div>
          </div>

          {/* Tools & Formatters Drawer (Collapsible) */}
          {showToolsDrawer && (
            <div className="p-4 rounded-2xl bg-[#090e2d] border border-purple-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#182352] pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-display font-bold text-xs text-white">CHATBOT TOOLS WORKSPACE</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono">
                  {(['templates', 'codeformat', 'jsonformat', 'preview'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setToolsActiveTab(tab)}
                      className={`px-2.5 py-1 rounded capitalize transition ${
                        toolsActiveTab === tab ? 'bg-purple-900 text-purple-200' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {toolsActiveTab === 'templates' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {promptTemplates.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(t.prompt)}
                      className="p-2.5 rounded-xl bg-[#0e143a] border border-[#1f2c68] hover:border-purple-500/50 text-left transition group cursor-pointer"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 mb-1">
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono line-clamp-2">
                        {t.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {toolsActiveTab === 'codeformat' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400">TypeScript / Code Formatter</div>
                  <textarea
                    rows={4}
                    value={codeToFormat}
                    onChange={(e) => setCodeToFormat(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#050819] border border-[#212f68] font-mono text-xs text-cyan-300"
                  />
                  <button
                    onClick={() => {
                      setInputMessage(`Tolong format dan berikan komentar best-practice untuk kode berikut:\n\`\`\`typescript\n${codeToFormat}\n\`\`\``);
                      setShowToolsDrawer(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-200 font-mono text-xs cursor-pointer"
                  >
                    Send to IZI AI for Deep Clean &amp; Formatting
                  </button>
                </div>
              )}

              {toolsActiveTab === 'jsonformat' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400">JSON Beautifier &amp; Validator</div>
                  <textarea
                    rows={4}
                    value={jsonToFormat}
                    onChange={(e) => setJsonToFormat(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#050819] border border-[#212f68] font-mono text-xs text-emerald-300"
                  />
                  <button
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(jsonToFormat);
                        setJsonToFormat(JSON.stringify(parsed, null, 2));
                      } catch {
                        alert('Invalid JSON structure');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono text-xs cursor-pointer"
                  >
                    Format JSON Now
                  </button>
                </div>
              )}

              {toolsActiveTab === 'preview' && (
                <div className="p-3 rounded-xl bg-[#050819] border border-[#1f2c68] text-xs font-mono text-slate-300">
                  <div className="font-bold text-white mb-2">Markdown Preview Utility:</div>
                  <p>Markdown formatting supports tables, bold, italics, code fences, and links.</p>
                </div>
              )}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 rounded-2xl bg-[#080c24] border border-[#1b2552] p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[440px] max-h-[520px]">
            {activeConv.messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {isAssistant ? 'IZI AI Assistant' : 'You'}
                    </span>
                    <span>{msg.timestamp}</span>
                    {msg.provider && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                        {msg.model}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl max-w-3xl text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-[#0b102e] border border-[#182352] text-slate-200'
                        : 'bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 text-white'
                    }`}
                  >
                    {/* Render message content with markdown code blocks */}
                    <div className="space-y-2 whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Action Bar for Assistant Responses */}
                    {isAssistant && (
                      <div className="mt-3 pt-2.5 border-t border-[#16204c] flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-[#070b22] hover:text-white hover:bg-[#121840] transition cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleConvertToTicket(msg.content)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-[#070b22] hover:text-pink-300 hover:bg-[#121840] transition cursor-pointer"
                        >
                          <TicketPlus className="w-3 h-3 text-pink-400" />
                          <span>Convert to Ticket</span>
                        </button>

                        <button
                          onClick={() => handleConvertToTask(msg.content)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-[#070b22] hover:text-cyan-300 hover:bg-[#121840] transition cursor-pointer"
                        >
                          <Layers className="w-3 h-3 text-cyan-400" />
                          <span>Add to Project Task</span>
                        </button>

                        <button
                          onClick={() => handleSaveToLibrary(msg.content)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-[#070b22] hover:text-purple-300 hover:bg-[#121840] transition cursor-pointer"
                        >
                          <BookMarked className="w-3 h-3 text-purple-400" />
                          <span>Save to Library</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0b102e] border border-[#182352] text-xs font-mono text-purple-300 max-w-sm">
                <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></div>
                <span>IZI AI is analyzing context and formulating solution...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Bar */}
          <div className="p-3 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-2">
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Ask ${personas.find(p => p.key === selectedPersonaKey)?.title} anything... (Shift+Enter for new line)`}
                className="flex-1 p-2.5 rounded-xl bg-[#0c1236] border border-[#212d64] text-white font-mono text-xs focus:outline-none focus:border-purple-500 resize-none"
              />

              <div className="flex items-center gap-1.5 pb-1">
                <button
                  onClick={handleRegenerate}
                  title="Regenerate last answer"
                  className="p-2.5 rounded-xl bg-[#0f163e] hover:bg-[#162157] text-slate-400 hover:text-cyan-400 border border-[#202d64] transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20 hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
              <span>Enter to send, Shift+Enter for new line</span>
              <button
                onClick={() => {
                  if (confirm('Clear chat history for this session?')) {
                    setConversations(conversations.map(c => c.id === activeConv.id ? { ...c, messages: [] } : c));
                  }
                }}
                className="text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
