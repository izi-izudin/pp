import React from 'react';
import { 
  Globe, 
  LayoutDashboard, 
  Terminal, 
  FolderGit2, 
  TicketCheck, 
  Palette 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';
import type { NavigationTab } from '../../types.js';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { playCyberSound } = useTheme();

  const navItems = [
    { id: 'portfolio', label: 'Portfolio', icon: <Globe className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'api-center', label: 'API', icon: <Terminal className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'tickets', label: 'Tickets', icon: <TicketCheck className="w-4 h-4" /> },
    { id: 'settings', label: 'Theme', icon: <Palette className="w-4 h-4" /> },
  ];

  const handleTabClick = (tabId: string) => {
    playCyberSound('click');
    setActiveTab(tabId as NavigationTab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#070a20]/95 backdrop-blur-xl border-t border-[#1b2554] select-none safe-area-bottom">
      <div className="grid grid-cols-6 h-15 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center justify-center relative cursor-pointer group py-1"
            >
              {/* Active top neon indicator bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
              )}

              <span
                className={`transition-all duration-200 transform ${
                  isActive
                    ? 'text-cyan-400 -translate-y-0.5 scale-110 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                    : 'text-slate-400 group-hover:text-white'
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`text-[10px] font-mono mt-1 transition ${
                  isActive ? 'text-white font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
