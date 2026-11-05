export interface AppConfig {
  name: string;
  shortName: string;
  version: string;
  author: string;
  location: string;
  email: string;
  statusText: string;
  featureFlags: {
    enableThemeCustomizer: boolean;
    enableSoundEffects: boolean;
    enableScanlines: boolean;
    enableAIPhase2: boolean;
    enableWhatsAppPhase2: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  name: 'IZI Tech Project 2.0',
  shortName: 'IZI TECH',
  version: '2.0.0-phase1',
  author: 'Izi Izudin',
  location: 'Pandeglang, Indonesia',
  email: 'hello@izi-izudin.dev',
  statusText: 'AVAILABLE FOR FREELANCE & ENTERPRISE',
  featureFlags: {
    enableThemeCustomizer: true,
    enableSoundEffects: true,
    enableScanlines: true,
    enableAIPhase2: false, // Staged for Phase 2 as instructed
    enableWhatsAppPhase2: false // Staged for Phase 2 as instructed
  }
};

export interface NavRoute {
  id: string;
  label: string;
  category: 'core' | 'engineering' | 'knowledge' | 'system';
  icon: string;
  badge?: string;
  description: string;
}

export const NAV_ROUTES: NavRoute[] = [
  {
    id: 'portfolio',
    label: 'Portfolio',
    category: 'core',
    icon: 'Globe',
    description: 'Izi Izudin Creative Coder presentation'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    category: 'core',
    icon: 'LayoutDashboard',
    badge: 'Live',
    description: 'Quantum System Telemetry & Metrics'
  },
  {
    id: 'api-center',
    label: 'API Center',
    category: 'engineering',
    icon: 'Terminal',
    badge: 'Proxy',
    description: 'API Playground, Collections & Security'
  },
  {
    id: 'projects',
    label: 'Projects',
    category: 'engineering',
    icon: 'FolderGit2',
    description: 'Active web experiences & deliverables'
  },
  {
    id: 'tickets',
    label: 'IT Tickets',
    category: 'engineering',
    icon: 'TicketCheck',
    badge: 'SLA',
    description: 'Incident tracker & support desk'
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    category: 'engineering',
    icon: 'Activity',
    badge: '99.98%',
    description: 'Server status, CPU, memory & node latencies'
  },
  {
    id: 'prompt-lab',
    label: 'Prompt Lab',
    category: 'knowledge',
    icon: 'FlaskConical',
    description: 'AI prompt engineering templates'
  },
  {
    id: 'library',
    label: 'Library IT',
    category: 'knowledge',
    icon: 'BookOpen',
    description: 'Architecture manuals & cheatsheets'
  },
  {
    id: 'settings',
    label: 'Theme & System',
    category: 'system',
    icon: 'Palette',
    badge: 'Themes',
    description: 'Cyberpunk design system & audio effects'
  },
  {
    id: 'docs',
    label: 'Setup Guide',
    category: 'system',
    icon: 'HelpCircle',
    description: 'Full stack architecture documentation'
  }
];
