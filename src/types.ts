export type NavigationTab = 
  | 'portfolio' 
  | 'dashboard' 
  | 'api-center' 
  | 'ai-chat' 
  | 'whatsapp' 
  | 'projects' 
  | 'tickets' 
  | 'prompt-lab' 
  | 'library' 
  | 'integrations'
  | 'monitoring'
  | 'settings'
  | 'docs';

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'Planning';
  tasks: { id: string; title: string; completed: boolean; assignee: string }[];
  techStack: string[];
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  category: 'Network' | 'Database' | 'Security' | 'Bug' | 'Infrastructure' | 'Feature';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  description: string;
  requester: string;
  assignedTo: string;
  source: 'Web UI' | 'WhatsApp' | 'AI Chat' | 'System Alert';
  createdAt: string;
  resolvedAt?: string;
}

export interface ApiCollection {
  id: string;
  name: string;
  project: string;
  description: string;
  requests: ApiSavedRequest[];
}

export interface ApiSavedRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: { key: string; value: string; enabled: boolean }[];
  params: { key: string; value: string; enabled: boolean }[];
  bodyType: 'json' | 'none';
  jsonBody: string;
  authType: 'none' | 'bearer' | 'basic' | 'apikey';
  authConfig: { token?: string; username?: string; password?: string; key?: string; value?: string };
}

export interface ApiResponseData {
  success: boolean;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  responseSizeBytes: number;
  headers: Record<string, string>;
  data: unknown;
  rawText: string;
  isJson: boolean;
  error?: string;
  securityNotice?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
  personaKey?: string;
}

export interface Conversation {
  id: string;
  title: string;
  personaKey: string;
  messages: ChatMessage[];
  updatedAt: string;
  provider: string;
  model: string;
  projectContextId?: string;
  libraryContextId?: string;
}

export interface WhatsAppLog {
  id: string;
  direction: 'outgoing' | 'incoming';
  toOrFrom: string;
  senderName: string;
  messageType: 'text' | 'template' | 'interactive' | 'notification';
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'received';
  timestamp: string;
  sourceContext?: string;
  aiHandled?: boolean;
}

export interface WhatsAppNotificationSettings {
  newTicket: boolean;
  criticalTicket: boolean;
  resolvedTicket: boolean;
  projectDeadline: boolean;
  projectCompleted: boolean;
  systemAlert: boolean;
  apiError: boolean;
  defaultRecipientPhone: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  category: 'Linux' | 'Network' | 'Database' | 'Security' | 'DevOps' | 'Frontend';
  tags: string[];
  content: string;
  author: string;
  updatedAt: string;
}
