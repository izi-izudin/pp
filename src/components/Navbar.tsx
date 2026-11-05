import React, { useState } from 'react';
import { 
  Globe, 
  LayoutDashboard, 
  Terminal, 
  Bot, 
  MessageSquare, 
  FolderGit2, 
  TicketCheck, 
  FlaskConical, 
  BookOpen, 
  Cpu, 
  HelpCircle,
  Menu,
  X,
  Send
} from 'lucide-react';
import type { NavigationTab } from '../types.js';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  openContactModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openContactModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'portfolio', label: 'Portfolio', icon: <Globe className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'api-center', label: 'API Center', icon: <Terminal className="w-4 h-4" />, badge: 'Proxy' },
    { id: 'ai-chat', label: 'IZI AI', icon: <Bot className="w-4 h-4" />, badge: '10 Personas' },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" />, badge: 'Meta Cloud' },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'tickets', label: 'Tickets', icon: <TicketCheck className="w-4 h-4" /> },
    { id: 'prompt-lab', label: 'Prompt Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'library', label: 'Library IT', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Cpu className="w-4 h-4" /> },
    { id: 'docs', label: 'Setup Guide', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060818]/90 backdrop-blur-md border-b border-[#1b2247]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('portfolio')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00f0ff] via-[#7928ca] to-[#ff007f] p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
                <div className="w-full h-full bg-[#070a1e] rounded-md flex items-center justify-center font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 text-base">
                  K+
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black tracking-wider text-white text-base">
                    IZI <span className="text-cyan-400">IZUDIN</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                    TECH
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AVAILABLE FOR FREELANCE</span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/80 to-purple-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-[#121735]/70 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={openContactModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:opacity-95 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 cursor-pointer transition transform active:scale-95"
            >
              <span>LET'S CONNECT</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#111736] text-slate-300 hover:text-white border border-[#212b58]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a0d26] border-b border-[#1d2552] px-4 pt-2 pb-4 space-y-1">
          <div className="grid grid-cols-2 gap-1.5 py-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-[#151c45]'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => {
              openContactModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold text-xs mt-2"
          >
            <span>LET'S CONNECT</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
