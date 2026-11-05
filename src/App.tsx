/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { NavigationTab } from './types.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { Header } from './components/layout/Header.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { BottomNavigation } from './components/layout/BottomNavigation.js';

// Views
import { PortfolioView } from './components/PortfolioView.js';
import { DashboardView } from './components/DashboardView.js';
import { ApiCenterView } from './components/ApiCenterView.js';
import { ProjectsView } from './components/ProjectsView.js';
import { TicketsView } from './components/TicketsView.js';
import { PromptLabView } from './components/PromptLabView.js';
import { LibraryView } from './components/LibraryView.js';
import { MonitoringView } from './components/MonitoringView.js';
import { SettingsView } from './components/SettingsView.js';
import { IntegrationsView } from './components/IntegrationsView.js';

// Modals
import { SetupGuideModal } from './components/SetupGuideModal.js';
import { ContactModal } from './components/ContactModal.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('portfolio');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);

  const handleOpenChatWithPrompt = (_promptText: string) => {
    setActiveTab('prompt-lab');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        {/* Top Cyber Glow Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(0,240,255,0.6)]"></div>

        {/* Global Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'docs') {
              setIsSetupGuideOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          openContactModal={() => setIsContactOpen(true)}
        />

        {/* App Shell Body with Sidebar and Main Content */}
        <div className="flex-1 flex relative">
          {/* Sidebar for Desktop & Tablet */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === 'docs') {
                setIsSetupGuideOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            openContactModal={() => setIsContactOpen(true)}
          />

          {/* Main Routing Canvas with Dynamic Sidebar Padding */}
          <main
            className={`flex-1 min-w-0 transition-all duration-300 pb-24 lg:pb-12 ${
              sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
            }`}
          >
            {activeTab === 'portfolio' && (
              <PortfolioView
                onNavigate={(tab) => {
                  if (tab === 'docs') setIsSetupGuideOpen(true);
                  else setActiveTab(tab);
                }}
                openContactModal={() => setIsContactOpen(true)}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={(tab) => {
                  if (tab === 'docs') setIsSetupGuideOpen(true);
                  else setActiveTab(tab);
                }}
                openContactModal={() => setIsContactOpen(true)}
              />
            )}

            {activeTab === 'api-center' && <ApiCenterView />}

            {activeTab === 'projects' && <ProjectsView />}

            {activeTab === 'tickets' && <TicketsView />}

            {activeTab === 'prompt-lab' && (
              <PromptLabView onOpenChatWithPrompt={handleOpenChatWithPrompt} />
            )}

            {activeTab === 'library' && <LibraryView />}

            {activeTab === 'monitoring' && <MonitoringView />}

            {activeTab === 'settings' && <SettingsView />}

            {activeTab === 'integrations' && <IntegrationsView />}

            {activeTab === 'docs' && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center space-y-4">
                <h1 className="text-2xl font-display font-bold text-white">SYSTEM SETUP MANUAL</h1>
                <p className="text-xs text-slate-400">Tahap 1 Architecture &bull; Click below to view the full interactive setup manual.</p>
                <button
                  onClick={() => setIsSetupGuideOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold cursor-pointer hover:bg-cyan-900"
                >
                  Open Full Setup Guide Dialog
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Mobile & Android Bottom Navigation Bar */}
        <BottomNavigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'docs') {
              setIsSetupGuideOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
        />

        {/* Contact & Inquiry Modal */}
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />

        {/* Setup Guide Modal */}
        <SetupGuideModal
          isOpen={isSetupGuideOpen}
          onClose={() => setIsSetupGuideOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
