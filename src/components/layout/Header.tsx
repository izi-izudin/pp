import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  Palette, 
  Send, 
  Activity, 
  ChevronRight,
  Sparkles,
  Search,
  Bell
} from 'lucide-react';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext.js';
import { CyberBadge } from '../common/CyberBadge.js';
import type { NavigationTab } from '../../types.js';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openContactModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  openContactModal
}) => {
  const { theme, soundEnabled, setSoundEnabled, playCyberSound, setThemeId } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getTabLabel = (tab: NavigationTab) => {
    switch (tab) {
      case 'portfolio': return 'Portfolio & Showcase';
      case 'dashboard': return 'Quantum System Dashboard';
      case 'api-center': return 'API Center & Playground';
      case 'projects': return 'Projects & Deliverables';
      case 'tickets': return 'IT Support & Incidents';
      case 'monitoring': return 'Server Status & Infrastructure Telemetry';
      case 'prompt-lab': return 'Prompt Lab & Engineering';
      case 'library': return 'Library IT & Cheatsheets';
      case 'settings': return 'Cyberpunk Theme Customizer';
      case 'docs': return 'Setup & Architecture Manual';
      default: return tab;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060818]/90 backdrop-blur-md border-b border-[#1b2247] select-none">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Toggle & Brand / Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle for Desktop & Mobile */}
            <button
              onClick={() => {
                playCyberSound('click');
                setSidebarOpen(!sidebarOpen);
              }}
              title="Toggle sidebar"
              className="p-2 rounded-xl bg-[#0d1235] hover:bg-[#151c4a] border border-[#202b64] text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Logo Emblem */}
            <div 
              onClick={() => {
                playCyberSound('click');
                setActiveTab('portfolio');
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
                <div className="w-full h-full bg-[#070a20] rounded-[7px] flex items-center justify-center font-display font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                  K+
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-display font-black text-sm tracking-wider text-white">
                    IZI <span className="text-cyan-400">IZUDIN</span>
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    2.0
                  </span>
                </div>
              </div>
            </div>

            {/* Breadcrumb current route */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-400 pl-3 border-l border-[#1a234f]">
              <span>WORKSPACE</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-300 font-semibold">{getTabLabel(activeTab)}</span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live System Telemetry Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#090d29] border border-[#1d2757] text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">SYSTEM:</span>
              <span className="text-emerald-300 font-bold">ONLINE</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-cyan-400">14MS</span>
            </div>

            {/* Sound Effects Toggle Button */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playCyberSound('toggle');
              }}
              title={soundEnabled ? 'Disable Cyber Audio SFX' : 'Enable Cyber Audio SFX'}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-[#0d1235] border-[#202b64] text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Theme Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  playCyberSound('click');
                  setShowThemeMenu(!showThemeMenu);
                }}
                title="Change Cyberpunk Theme"
                className="p-2 rounded-xl bg-[#0d1235] hover:bg-[#151c4a] border border-[#202b64] text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-mono capitalize">
                  {theme.id.split('-')[1]}
                </span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#070b24] border border-cyan-500/40 shadow-2xl p-2 z-50 space-y-1 font-mono text-xs animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-[#182352]">
                    CYBERPUNK THEMES
                  </div>
                  {Object.values(THEME_PRESETS).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setThemeId(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition cursor-pointer ${
                        theme.id === t.id
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-300 hover:bg-[#101740]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: t.primaryColor }}
                        ></span>
                        <span className="text-xs">{t.name.split(' ')[0]}</span>
                      </div>
                      {theme.id === t.id && <Sparkles className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  playCyberSound('click');
                  setShowNotifications(!showNotifications);
                }}
                title="System alerts"
                className="p-2 rounded-xl bg-[#0d1235] hover:bg-[#151c4a] border border-[#202b64] text-slate-300 hover:text-white transition cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#070b24] border border-cyan-500/40 shadow-2xl p-3 z-50 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#182352] pb-2 text-[11px] text-slate-400 font-bold">
                    <span>SYSTEM NOTIFICATIONS</span>
                    <span className="text-cyan-400">2 New</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0b102e] border border-[#16204c] text-[11px] text-slate-300 space-y-1">
                    <div className="text-emerald-400 font-bold">✓ Tahap 1 Architecture Online</div>
                    <div className="text-slate-400 text-[10px]">Cyberpunk design system, sidebar &amp; themes initialized.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0b102e] border border-[#16204c] text-[11px] text-slate-300 space-y-1">
                    <div className="text-cyan-400 font-bold">⚡ Gateway Proxy Active</div>
                    <div className="text-slate-400 text-[10px]">SSRF loopback protection validated on port 3000.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action CTA: Let's Connect */}
            <button
              onClick={() => {
                playCyberSound('click');
                openContactModal();
              }}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:opacity-95 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 cursor-pointer transition transform active:scale-95 whitespace-nowrap"
            >
              <span>CONNECT</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
