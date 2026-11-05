export interface ProjectItem {
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

export interface TicketItem {
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

export interface ApiCollectionItem {
  id: string;
  name: string;
  project: string;
  description: string;
  requests: {
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
  }[];
}

export interface WhatsAppMessageLog {
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

export interface WhatsAppContact {
  phoneNumber: string;
  name: string;
  optIn: boolean;
  optInDate: string;
  role: 'Developer' | 'Admin' | 'Client' | 'DevOps';
}

export interface LibraryArticle {
  id: string;
  title: string;
  category: 'Linux' | 'Network' | 'Database' | 'Security' | 'DevOps' | 'Frontend';
  tags: string[];
  content: string;
  author: string;
  updatedAt: string;
}

class DatabaseService {
  private projects: ProjectItem[] = [
    {
      id: 'proj-1',
      name: 'Echoes of Tomorrow',
      category: 'Web Experience',
      description: 'Futuristic cyberpunk interactive 3D web experience with WebGL visual audio synchronization.',
      progress: 92,
      status: 'In Progress',
      techStack: ['Three.js', 'React', 'GLSL', 'Web Audio API', 'Tailwind CSS'],
      updatedAt: '2026-11-04 10:30',
      tasks: [
        { id: 't1', title: 'Optimize bloom post-processing shader on mobile', completed: true, assignee: 'Izi Izudin' },
        { id: 't2', title: 'Spatial audio node panning calibration', completed: true, assignee: 'Izi Izudin' },
        { id: 't3', title: 'Final cross-browser framerate benchmark', completed: false, assignee: 'Izi Izudin' },
      ]
    },
    {
      id: 'proj-2',
      name: 'Neon Atlas',
      category: 'Interactive Web',
      description: 'Interactive map and cyber city geospatial data visualization platform with real-time telemetry.',
      progress: 85,
      status: 'In Progress',
      techStack: ['TypeScript', 'MapLibre', 'GeoJSON', 'Vite', 'Node.js'],
      updatedAt: '2026-11-03 16:20',
      tasks: [
        { id: 't4', title: 'Tile caching layer implementation', completed: true, assignee: 'Izi Izudin' },
        { id: 't5', title: 'GeoJSON vector layer clustering', completed: true, assignee: 'Izi Izudin' },
        { id: 't6', title: 'Real-time WebSocket data stream integration', completed: false, assignee: 'Izi Izudin' }
      ]
    },
    {
      id: 'proj-3',
      name: 'Lunar Drift',
      category: 'Digital Experience',
      description: 'Audiovisual particle simulation engine running in real-time browser canvas with custom physics.',
      progress: 100,
      status: 'Completed',
      techStack: ['Canvas2D', 'TypeScript', 'Web Workers', 'AudioContext'],
      updatedAt: '2026-10-28 14:10',
      tasks: [
        { id: 't7', title: 'Gravity particle physics calculation', completed: true, assignee: 'Izi Izudin' },
        { id: 't8', title: 'WAV recorder and exporter', completed: true, assignee: 'Izi Izudin' }
      ]
    },
    {
      id: 'proj-4',
      name: 'Quantum Dashboard',
      category: 'Web Application',
      description: 'High performance enterprise analytics workspace with zero-latency streaming graphs and metrics.',
      progress: 78,
      status: 'In Progress',
      techStack: ['React 19', 'Express', 'Tailwind CSS', 'REST API', 'PostgreSQL'],
      updatedAt: '2026-11-04 18:45',
      tasks: [
        { id: 't9', title: 'API Center playground integration', completed: true, assignee: 'Izi Izudin' },
        { id: 't10', title: 'WhatsApp Meta Cloud API notification hook', completed: true, assignee: 'Izi Izudin' },
        { id: 't11', title: 'Multi-persona AI chatbot assistant', completed: true, assignee: 'Izi Izudin' }
      ]
    }
  ];

  private tickets: TicketItem[] = [
    {
      id: 'TCK-1042',
      title: 'High latency on API Gateway proxy endpoint',
      category: 'Infrastructure',
      priority: 'High',
      status: 'In Progress',
      description: 'Response time spiked to >1200ms during peak load on regional edge nodes.',
      requester: 'DevOps Team',
      assignedTo: 'Izi Izudin',
      source: 'System Alert',
      createdAt: '2026-11-04 09:12'
    },
    {
      id: 'TCK-1043',
      title: 'WhatsApp Webhook verification fails intermittently',
      category: 'Bug',
      priority: 'Critical',
      status: 'Resolved',
      description: 'Signature verification was missing raw payload buffer in express body parser.',
      requester: 'Meta Cloud API Monitor',
      assignedTo: 'Izi Izudin',
      source: 'WhatsApp',
      createdAt: '2026-11-04 11:30',
      resolvedAt: '2026-11-04 13:45'
    },
    {
      id: 'TCK-1044',
      title: 'Database connection pool exhaustion during batch backup',
      category: 'Database',
      priority: 'High',
      status: 'Open',
      description: 'PostgreSQL max_connections reached during nightly automated vacuum.',
      requester: 'DBA Admin',
      assignedTo: 'Izi Izudin',
      source: 'Web UI',
      createdAt: '2026-11-04 14:00'
    },
    {
      id: 'TCK-1045',
      title: 'Configure automated WhatsApp alert for critical server down',
      category: 'Feature',
      priority: 'Medium',
      status: 'Open',
      description: 'Ensure on-call engineer receives instant WhatsApp template notification on 5xx spike.',
      requester: 'Izi Izudin',
      assignedTo: 'Izi Izudin',
      source: 'Web UI',
      createdAt: '2026-11-04 15:20'
    }
  ];

  private apiCollections: ApiCollectionItem[] = [
    {
      id: 'col-1',
      name: 'Public Test API Suite',
      project: 'Quantum Dashboard',
      description: 'Standard endpoints for testing REST requests, headers, and payload parsing.',
      requests: [
        {
          id: 'req-1',
          name: 'Get Sample Users (JSONPlaceholder)',
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/users/1',
          headers: [
            { key: 'Accept', value: 'application/json', enabled: true },
            { key: 'User-Agent', value: 'IZI-Tech-Playground/2.0', enabled: true }
          ],
          params: [],
          bodyType: 'none',
          jsonBody: '',
          authType: 'none',
          authConfig: {}
        },
        {
          id: 'req-2',
          name: 'Echo POST Payload (Httpbin)',
          method: 'POST',
          url: 'https://httpbin.org/post',
          headers: [
            { key: 'Content-Type', value: 'application/json', enabled: true }
          ],
          params: [
            { key: 'source', value: 'izi_playground', enabled: true }
          ],
          bodyType: 'json',
          jsonBody: JSON.stringify({
            app: "IZI Tech Project",
            module: "API Center",
            timestamp: new Date().toISOString(),
            status: "active"
          }, null, 2),
          authType: 'none',
          authConfig: {}
        },
        {
          id: 'req-3',
          name: 'Get System Products (DummyJSON)',
          method: 'GET',
          url: 'https://dummyjson.com/products/1',
          headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
          params: [],
          bodyType: 'none',
          jsonBody: '',
          authType: 'none',
          authConfig: {}
        }
      ]
    },
    {
      id: 'col-2',
      name: 'IZI Internal API',
      project: 'Core Platform',
      description: 'Local workspace endpoints for tickets, projects, and health telemetry.',
      requests: [
        {
          id: 'req-4',
          name: 'Fetch System Tickets',
          method: 'GET',
          url: '/api/tickets',
          headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
          params: [],
          bodyType: 'none',
          jsonBody: '',
          authType: 'none',
          authConfig: {}
        },
        {
          id: 'req-5',
          name: 'Fetch Active Projects',
          method: 'GET',
          url: '/api/projects',
          headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
          params: [],
          bodyType: 'none',
          jsonBody: '',
          authType: 'none',
          authConfig: {}
        }
      ]
    }
  ];

  private whatsappContacts: WhatsAppContact[] = [
    {
      phoneNumber: '+6281234567890',
      name: 'Izi Izudin (Lead)',
      optIn: true,
      optInDate: '2026-10-01',
      role: 'Admin'
    },
    {
      phoneNumber: '+6281987654321',
      name: 'On-Call DevOps Specialist',
      optIn: true,
      optInDate: '2026-10-15',
      role: 'DevOps'
    },
    {
      phoneNumber: '+6285700112233',
      name: 'Client Tech Representative',
      optIn: true,
      optInDate: '2026-10-20',
      role: 'Client'
    }
  ];

  private whatsappLogs: WhatsAppMessageLog[] = [
    {
      id: 'wa-msg-1',
      direction: 'outgoing',
      toOrFrom: '+6281234567890',
      senderName: 'IZI Tech System',
      messageType: 'template',
      content: 'Template: ticket_critical_alert | ID: TCK-1043 | WhatsApp Webhook verification resolved',
      status: 'read',
      timestamp: '2026-11-04 13:46'
    },
    {
      id: 'wa-msg-2',
      direction: 'incoming',
      toOrFrom: '+6281234567890',
      senderName: 'Izi Izudin',
      messageType: 'text',
      content: 'Cek status ticket TCK-1042',
      status: 'received',
      timestamp: '2026-11-04 14:15',
      aiHandled: true
    },
    {
      id: 'wa-msg-3',
      direction: 'outgoing',
      toOrFrom: '+6281234567890',
      senderName: 'IZI AI WhatsApp Bot',
      messageType: 'text',
      content: 'Status Ticket [TCK-1042]: High latency on API Gateway proxy endpoint. Priority: HIGH. Status: IN PROGRESS. Assigned to: Izi Izudin.',
      status: 'delivered',
      timestamp: '2026-11-04 14:15',
      sourceContext: 'TCK-1042'
    }
  ];

  private libraryArticles: LibraryArticle[] = [
    {
      id: 'lib-1',
      title: 'Linux Server Hardening & UFW Firewall Setup',
      category: 'Linux',
      tags: ['Security', 'Ubuntu', 'SSH', 'Firewall'],
      content: `### Essential Linux Security Baseline
1. Update system packages:
   \`sudo apt update && sudo apt upgrade -y\`
2. Disable Root SSH Login in \`/etc/ssh/sshd_config\`:
   \`PermitRootLogin no\`
   \`PasswordAuthentication no\`
3. Configure UFW (Uncomplicated Firewall):
   \`sudo ufw default deny incoming\`
   \`sudo ufw default allow outgoing\`
   \`sudo ufw allow 22/tcp\`
   \`sudo ufw allow 80/tcp\`
   \`sudo ufw allow 443/tcp\`
   \`sudo ufw enable\`
4. Install Fail2ban to block brute-force attacks:
   \`sudo apt install fail2ban -y\``,
      author: 'Izi Izudin',
      updatedAt: '2026-11-02'
    },
    {
      id: 'lib-2',
      title: 'PostgreSQL Connection Pooling with PgBouncer',
      category: 'Database',
      tags: ['PostgreSQL', 'Performance', 'PgBouncer'],
      content: `### Optimizing High Concurrency with PgBouncer
When multiple backend microservices connect to PostgreSQL, creating too many idle connections exhausts memory.
- Install PgBouncer: \`sudo apt install pgbouncer\`
- Configure pool mode: \`pool_mode = transaction\`
- Recommended settings:
  \`max_client_conn = 1000\`
  \`default_pool_size = 20\`
  \`reserve_pool_size = 5\`
- Benefits:
  Reduces memory footprint by 80% and eliminates connection lag spikes under heavy load.`,
      author: 'Izi Izudin',
      updatedAt: '2026-11-03'
    },
    {
      id: 'lib-3',
      title: 'Meta WhatsApp Cloud API Webhook Integration Guide',
      category: 'Network',
      tags: ['WhatsApp', 'Meta Cloud API', 'Webhooks', 'Security'],
      content: `### Meta WhatsApp Cloud API Architecture
1. **Webhook Verification (GET)**:
   Meta sends \`hub.mode=subscribe\`, \`hub.verify_token\`, and \`hub.challenge\`.
   Server checks if \`verify_token === WHATSAPP_WEBHOOK_VERIFY_TOKEN\`, and returns \`hub.challenge\`.
2. **Payload Receipt (POST)**:
   Validate HMAC-SHA256 signature against \`X-Hub-Signature-256\` using your \`WHATSAPP_APP_SECRET\`.
3. **Deduplication**:
   Store \`message_id\` with a 24-hour TTL to prevent double processing when Meta retries on network blips.
4. **24-hour Customer Service Window**:
   Free-form text is only permitted within 24 hours of customer's last message. Outside this window, use approved Meta Message Templates.`,
      author: 'Izi Izudin',
      updatedAt: '2026-11-04'
    }
  ];

  // Projects methods
  getProjects() { return this.projects; }
  getProjectById(id: string) { return this.projects.find(p => p.id === id); }
  createProject(item: Omit<ProjectItem, 'id' | 'updatedAt'>) {
    const newProject: ProjectItem = {
      ...item,
      id: `proj-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    this.projects.unshift(newProject);
    return newProject;
  }
  updateProject(id: string, updates: Partial<Omit<ProjectItem, 'id'>>) {
    const proj = this.getProjectById(id);
    if (!proj) return null;
    Object.assign(proj, updates, {
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
    return proj;
  }
  deleteProject(id: string) {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    return true;
  }
  addTaskToProject(projectId: string, title: string, assignee: string = 'Izi Izudin') {
    const proj = this.getProjectById(projectId);
    if (!proj) return null;
    const newTask = {
      id: `t-${Date.now()}`,
      title,
      completed: false,
      assignee
    };
    proj.tasks.push(newTask);
    proj.updatedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    return newTask;
  }
  toggleTask(projectId: string, taskId: string) {
    const proj = this.getProjectById(projectId);
    if (!proj) return null;
    const task = proj.tasks.find(t => t.id === taskId);
    if (!task) return null;
    task.completed = !task.completed;
    
    // Auto-recalculate progress if tasks exist
    if (proj.tasks.length > 0) {
      const completedCount = proj.tasks.filter(t => t.completed).length;
      proj.progress = Math.round((completedCount / proj.tasks.length) * 100);
      if (proj.progress === 100) proj.status = 'Completed';
      else if (proj.status === 'Completed' && proj.progress < 100) proj.status = 'In Progress';
    }

    proj.updatedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    return task;
  }
  deleteTask(projectId: string, taskId: string) {
    const proj = this.getProjectById(projectId);
    if (!proj) return false;
    const idx = proj.tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return false;
    proj.tasks.splice(idx, 1);
    if (proj.tasks.length > 0) {
      const completedCount = proj.tasks.filter(t => t.completed).length;
      proj.progress = Math.round((completedCount / proj.tasks.length) * 100);
    }
    proj.updatedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    return true;
  }

  // Tickets methods
  getTickets() { return this.tickets; }
  getTicketById(id: string) { return this.tickets.find(t => t.id === id); }
  createTicket(item: Omit<TicketItem, 'id' | 'createdAt'>) {
    const newTicket: TicketItem = {
      ...item,
      id: `TCK-${1000 + this.tickets.length + 1}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    this.tickets.unshift(newTicket);
    return newTicket;
  }
  updateTicket(id: string, updates: Partial<Omit<TicketItem, 'id' | 'createdAt'>>) {
    const ticket = this.getTicketById(id);
    if (!ticket) return null;
    Object.assign(ticket, updates);
    if (updates.status === 'Resolved' || updates.status === 'Closed') {
      ticket.resolvedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
    return ticket;
  }
  updateTicketStatus(id: string, status: TicketItem['status']) {
    return this.updateTicket(id, { status });
  }
  deleteTicket(id: string) {
    const idx = this.tickets.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.tickets.splice(idx, 1);
    return true;
  }

  // Collections methods
  getCollections() { return this.apiCollections; }
  saveCollection(col: ApiCollectionItem) {
    const idx = this.apiCollections.findIndex(c => c.id === col.id);
    if (idx >= 0) {
      this.apiCollections[idx] = col;
    } else {
      this.apiCollections.push(col);
    }
    return col;
  }
  deleteCollection(id: string) {
    this.apiCollections = this.apiCollections.filter(c => c.id !== id);
    return true;
  }

  // WhatsApp methods
  getWhatsAppContacts() { return this.whatsappContacts; }
  getWhatsAppLogs() { return this.whatsappLogs; }
  addWhatsAppLog(log: Omit<WhatsAppMessageLog, 'id' | 'timestamp'>) {
    const newLog: WhatsAppMessageLog = {
      ...log,
      id: `wa-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    this.whatsappLogs.unshift(newLog);
    return newLog;
  }
  getContact(phoneNumber: string) {
    return this.whatsappContacts.find(c => c.phoneNumber.replace(/\D/g, '') === phoneNumber.replace(/\D/g, ''));
  }
  updateContactOptIn(phoneNumber: string, optIn: boolean, name?: string) {
    const clean = phoneNumber.replace(/\D/g, '');
    let contact = this.whatsappContacts.find(c => c.phoneNumber.replace(/\D/g, '') === clean);
    if (contact) {
      contact.optIn = optIn;
      if (name) contact.name = name;
    } else {
      contact = {
        phoneNumber,
        name: name || `Contact ${phoneNumber}`,
        optIn,
        optInDate: new Date().toISOString().slice(0, 10),
        role: 'Client'
      };
      this.whatsappContacts.push(contact);
    }
    return contact;
  }

  // Library methods
  getLibraryArticles() { return this.libraryArticles; }
  getLibraryArticleById(id: string) { return this.libraryArticles.find(a => a.id === id); }
  addLibraryArticle(article: Omit<LibraryArticle, 'id' | 'updatedAt'>) {
    const newArticle: LibraryArticle = {
      ...article,
      id: `lib-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    this.libraryArticles.unshift(newArticle);
    return newArticle;
  }
  updateLibraryArticle(id: string, updates: Partial<Omit<LibraryArticle, 'id'>>) {
    const art = this.getLibraryArticleById(id);
    if (!art) return null;
    Object.assign(art, updates, {
      updatedAt: new Date().toISOString().slice(0, 10)
    });
    return art;
  }
  deleteLibraryArticle(id: string) {
    const idx = this.libraryArticles.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.libraryArticles.splice(idx, 1);
    return true;
  }
}

export const db = new DatabaseService();
