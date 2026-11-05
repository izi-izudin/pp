import React from 'react';
import { 
  Globe, 
  LayoutDashboard, 
  Terminal, 
  FolderGit2, 
  TicketCheck, 
  FlaskConical, 
  BookOpen, 
  Palette, 
  HelpCircle,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';
import { NAV_ROUTES } from '../../config/app.config.js';
import type { NavigationTab } from '../../types.js';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openContactModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  openContactModal
}) => {
  const { theme, playCyberSound } = useTheme();

  const getRouteIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-4 h-4" />;
      case 'Terminal': return <Terminal className="w-4 h-4" />;
      case 'FolderGit2': return <FolderGit2 className="w-4 h-4" />;
      case 'TicketCheck': return <TicketCheck className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'FlaskConical': return <FlaskConical className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'HelpCircle': return <HelpCircle className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const categories = [
    { id: 'core', label: 'CORE SUITE' },
    { id: 'engineering', label: 'ENGINEERING & DEVOPS' },
    { id: 'knowledge', label: 'KNOWLEDGE & LAB' },
    { id: 'system', label: 'SYSTEM & THEMES' },
  ];

  const handleNavClick = (tabId: string) => {
    playCyberSound('click');
    setActiveTab(tabId as NavigationTab);
    // On small screens, close sidebar when link is clicked
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 bg-[#060818]/95 border-r border-[#1a234e] flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {categories.map((cat) => {
            const routesInCat = NAV_ROUTES.filter(r => r.category === cat.id);
            if (routesInCat.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-1">
                {isOpen ? (
                  <div className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    {cat.label}
                  </div>
                ) : (
                  <div className="h-[1px] bg-[#16204c] my-2 mx-1"></div>
                )}

                <div className="space-y-1">
                  {routesInCat.map((route) => {
                    const isActive = activeTab === route.id;
                    return (
                      <button
                        key={route.id}
                        onClick={() => handleNavClick(route.id)}
                        title={route.label}
                        className={`w-full flex items-center rounded-xl font-mono text-xs transition cursor-pointer select-none group relative ${
                          isOpen ? 'px-3 py-2.5 justify-between' : 'p-3 justify-center'
                        } ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-950/90 to-purple-950/70 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-[#0e1438] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`}>
                            {getRouteIcon(route.icon)}
                          </span>
                          {isOpen && (
                            <span className="truncate">{route.label}</span>
                          )}
                        </div>

                        {isOpen && route.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            {route.badge}
                          </span>
                        )}

                        {/* Collapsed active dot indicator */}
                        {!isOpen && isActive && (
                          <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Profile Card & Freelance Status at bottom */}
        <div className="p-3 border-t border-[#182352] bg-[#050716]/90">
          {isOpen ? (
            <div className="space-y-2">
              <div 
                onClick={openContactModal}
                className="p-2.5 rounded-xl bg-[#090d29] border border-[#1d2757] hover:border-cyan-500/40 flex items-center gap-3 transition cursor-pointer group"
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-900 border border-cyan-400/40 shrink-0">
                  <img
                    src="/public/assets/aistudio/file_00000000438c82118edec4a77fe770e5_ff863572.png"
                    alt="Izi Izudin"
                    className="w-full h-full object-cover object-top"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#050716]"></span>
                </div>

                <div className="truncate min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                    Izi Izudin
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Freelance Ready</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 text-center">
                Tahap 1 Architecture &bull; v2.0
              </div>
            </div>
          ) : (
            <div 
              onClick={openContactModal}
              title="Izi Izudin - Creative Coder"
              className="w-10 h-10 mx-auto rounded-xl overflow-hidden border border-cyan-500/40 relative cursor-pointer group"
            >
              <img
                src="/public/assets/aistudio/file_00000000438c82118edec4a77fe770e5_ff863572.png"
                alt="Izi Izudin"
                className="w-full h-full object-cover object-top group-hover:scale-110 transition"
              />
              <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
