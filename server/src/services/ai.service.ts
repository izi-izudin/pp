import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';
import { db } from './db.service.js';

// Pre-defined personas with specialized system instructions
export const ASSISTANT_PERSONAS: Record<string, { title: string; category: string; description: string; systemPrompt: string }> = {
  'programming': {
    title: 'Programming Assistant',
    category: 'Software Engineering',
    description: 'Expert in TypeScript, React, Node.js, Python, Go, clean code, design patterns, and debugging.',
    systemPrompt: `You are IZI AI - Senior Programming Assistant created for IZI Tech Project.
You specialize in modern web architectures (React 19, TypeScript, Node.js, Next.js, WebGL/Three.js, Tailwind CSS), algorithms, clean code principles, refactoring, and debugging complex runtime errors.
Provide clean, idiomatic code snippets with concise explanations. Format code in markdown blocks with proper language syntax.`
  },
  'network': {
    title: 'Network Engineer Assistant',
    category: 'Infrastructure & NetOps',
    description: 'Expert in routing, switching, DNS, SSL/TLS, reverse proxies, Nginx, VPN, BGP, and TCP/IP.',
    systemPrompt: `You are IZI AI - Network Engineer Assistant for IZI Tech Project.
You specialize in enterprise networking: TCP/IP, OSI model, DNS propagation, SSL/TLS certificates, Nginx/Caddy reverse proxies, Subnetting, VLAN, VPN (WireGuard/OpenVPN), firewall rules (iptables/ufw), and latency optimization.`
  },
  'database': {
    title: 'Database Assistant',
    category: 'Data Architecture',
    description: 'Master of PostgreSQL, SQLite, MySQL, Redis, MongoDB, indexing, query optimization, and schema design.',
    systemPrompt: `You are IZI AI - Senior Database Architect for IZI Tech Project.
You specialize in relational and NoSQL databases: PostgreSQL indexing, EXPLAIN ANALYZE query tuning, ACID transactions, PgBouncer pooling, Redis caching patterns, normalized schema design, migrations, and ORMs (Drizzle, Prisma).`
  },
  'cybersecurity': {
    title: 'Cybersecurity Assistant',
    category: 'SecOps & Penetration Testing',
    description: 'Specialist in OWASP Top 10, SSRF prevention, JWT security, zero-trust, cryptography, and vulnerability audits.',
    systemPrompt: `You are IZI AI - Cybersecurity Specialist for IZI Tech Project.
You specialize in application and cloud security: OWASP Top 10 mitigations (SSRF, SQLi, XSS, CSRF), secure authentication (OAuth 2.0, JWT, HMAC signatures), API rate limiting, TLS configuration, secrets management, and security compliance.`
  },
  'linux': {
    title: 'Linux Assistant',
    category: 'SysAdmin & Linux Kernels',
    description: 'Expert in Ubuntu/Debian/RHEL, bash scripting, systemd services, permissions, kernel tuning, and CLI.',
    systemPrompt: `You are IZI AI - Linux Systems Administrator for IZI Tech Project.
You provide precise bash commands, systemd unit configurations, cron schedules, memory/CPU diagnostic commands (top, htop, vmstat, netstat, lsof, journalctl), package management, and disk troubleshooting.`
  },
  'windows': {
    title: 'Windows Troubleshooting',
    category: 'OS & Enterprise Support',
    description: 'Specialist in PowerShell, Event Viewer, Active Directory, registry tuning, BSOD analysis, and services.',
    systemPrompt: `You are IZI AI - Windows Systems & Enterprise Support Specialist.
You provide PowerShell automation scripts, Windows Event Log analysis, service management, registry diagnostic steps, network adapter resets, and enterprise Active Directory troubleshooting.`
  },
  'itsupport': {
    title: 'IT Support Assistant',
    category: 'Service Desk & Hardware',
    description: 'Helpdesk specialist for hardware diagnostics, ticketing escalation, printer/peripheral issues, and SLA management.',
    systemPrompt: `You are IZI AI - IT Support & Service Desk Lead.
You troubleshoot user hardware, peripherals, corporate email setups, office networks, ticket prioritization (ITIL framework), and clear step-by-step remediation instructions for technical and non-technical staff.`
  },
  'datascience': {
    title: 'Data Science Assistant',
    category: 'Analytics & Machine Learning',
    description: 'Specialist in Python (Pandas, NumPy, Scikit-learn), ETL pipelines, statistical modeling, and data visualization.',
    systemPrompt: `You are IZI AI - Data Science & Analytics Specialist.
You specialize in data manipulation (Pandas, SQL), exploratory data analysis, data cleaning, statistical significance, machine learning model architectures, and interactive dashboard metrics.`
  },
  'uiux': {
    title: 'UI/UX Assistant',
    category: 'Design & Interaction',
    description: 'Specialist in cyberpunk aesthetics, design systems, Tailwind CSS, accessibility (WCAG), and UX psychology.',
    systemPrompt: `You are IZI AI - Creative UI/UX Design Specialist.
You specialize in futuristic cyberpunk and neo-brutalist interfaces, dark mode micro-interactions, responsive typography, WCAG AA accessibility, user flow optimization, and Tailwind CSS utility design.`
  },
  'prompteng': {
    title: 'AI Prompt Engineer',
    category: 'LLM & Generative AI',
    description: 'Master of prompt patterns (Chain-of-Thought, Few-Shot, ReAct), system instruction design, and token tuning.',
    systemPrompt: `You are IZI AI - Master AI Prompt Engineer.
You specialize in structuring high-leverage prompts for LLMs (Gemini, Claude, GPT): Chain-of-Thought reasoning, constraint enforcement, structured JSON schema output, tone control, context window optimization, and prompt refactoring.`
  }
};

let genAIInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || config.geminiApiKey;
  if (!apiKey) return null;
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIInstance;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateChatRequest {
  personaKey: string;
  messages: ChatMessage[];
  projectContextId?: string;
  libraryContextId?: string;
  provider?: string;
  model?: string;
}

export async function processAIChat(request: GenerateChatRequest) {
  const persona = ASSISTANT_PERSONAS[request.personaKey] || ASSISTANT_PERSONAS['programming'];
  const provider = request.provider || (config.geminiApiKey ? 'Google Gemini API' : 'Demo Offline Engine');
  const modelName = request.model || 'gemini-3.8-flash';

  // Build context if selected
  let contextInjection = '';
  if (request.projectContextId) {
    const proj = db.getProjectById(request.projectContextId);
    if (proj) {
      contextInjection += `\n[SELECTED PROJECT CONTEXT: "${proj.name}" (${proj.category}) - Progress: ${proj.progress}%, Tech: ${proj.techStack.join(', ')}. Tasks: ${proj.tasks.map(t => `${t.title} [${t.completed ? 'Done' : 'Pending'}]`).join('; ')}]\n`;
    }
  }

  if (request.libraryContextId) {
    const articles = db.getLibraryArticles();
    const art = articles.find(a => a.id === request.libraryContextId);
    if (art) {
      contextInjection += `\n[SELECTED IT LIBRARY REFERENCE: "${art.title}" (${art.category})\nContent summary: ${art.content.slice(0, 500)}...]\n`;
    }
  }

  const systemInstruction = `${persona.systemPrompt}
You are operating within IZI Tech Project - Izi Izudin's Creative Coder & Tech Workspace.
${contextInjection}
Always provide crisp, helpful, and technically accurate responses with markdown code blocks where applicable.`;

  const ai = getGenAI();

  if (ai) {
    try {
      // Build conversation text from history
      const formattedHistory = request.messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
      const response = await ai.models.generateContent({
        model: modelName,
        contents: formattedHistory,
        config: {
          systemInstruction: systemInstruction
        }
      });

      const replyText = response.text || 'No response generated from model.';
      return {
        reply: replyText,
        provider: 'Google Gemini API',
        model: modelName,
        status: 'Connected (Live)',
        timestamp: new Date().toISOString()
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn('Gemini API call failed, falling back to simulated intelligence:', errorMessage);
      // Fall through to deterministic offline generator
    }
  }

  // Fallback / Demo Mode response generator when API key is missing or offline
  const lastUserMsg = request.messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
  const simulatedReply = generateSimulatedResponse(persona.title, lastUserMsg, request.projectContextId, request.libraryContextId);

  return {
    reply: simulatedReply,
    provider: provider === 'Google Gemini API' ? 'Google Gemini API (Demo Fallback)' : provider,
    model: modelName,
    status: config.geminiApiKey ? 'Live Fallback' : 'Demo Mode (Add GEMINI_API_KEY in Secrets for Live API)',
    timestamp: new Date().toISOString()
  };
}

function generateSimulatedResponse(personaTitle: string, query: string, projectId?: string, libraryId?: string): string {
  const queryLower = query.toLowerCase();
  
  // Context awareness
  let contextMention = '';
  if (projectId) {
    const p = db.getProjectById(projectId);
    if (p) contextMention = `\n\n*Applied context from Project: **${p.name}** (${p.techStack.join(', ')})*`;
  }
  if (libraryId) {
    const a = db.getLibraryArticles().find(x => x.id === libraryId);
    if (a) contextMention += `\n*Referencing IT Library documentation: **${a.title}***`;
  }

  if (queryLower.includes('error') || queryLower.includes('debug') || queryLower.includes('troubleshoot')) {
    return `### 🔍 ${personaTitle} - Root Cause & Diagnostic Plan

Berdasarkan analisis error pada sistem:

1. **Identifikasi Masalah**:
   - Kemungkinan timeout koneksi atau kegagalan parsing pada payload incoming.
   - Periksa log journalctl / docker logs dengan filter:
   \`\`\`bash
   journalctl -u izi-app -n 100 --no-pager | grep -i "error"
   \`\`\`

2. **Langkah Remediasi**:
   - Pastikan environment variables (\`.env\`) telah dimuat dengan benar.
   - Periksa firewall port dan validasi koneksi upstream.
   - Uji koneksi dengan curl:
   \`\`\`bash
   curl -I -X GET http://localhost:3000/api/whatsapp/status
   \`\`\`

3. **Rekomendasi Best Practice**:
   - Tambahkan retry dengan exponential backoff dan fallback response yang gracefully handled.${contextMention}`;
  }

  if (queryLower.includes('whatsapp') || queryLower.includes('meta')) {
    return `### 📱 WhatsApp Cloud API Integration Overview

Berikut adalah alur resmi pengiriman pesan dan verifikasi webhook Meta:

\`\`\`typescript
// Contoh implementasi kirim pesan WhatsApp Cloud API (v21.0)
async function sendWhatsAppMessage(toPhone: string, text: string) {
  const endpoint = \`https://graph.facebook.com/v21.0/\${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages\`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.WHATSAPP_ACCESS_TOKEN}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toPhone.replace(/\\D/g, ''),
      type: 'text',
      text: { preview_url: false, body: text }
    })
  });

  return await response.json();
}
\`\`\`

**Catatan Keamanan**:
- Jangan simpan token di LocalStorage.
- Verifikasi signature \`X-Hub-Signature-256\` pada webhook POST.${contextMention}`;
  }

  if (queryLower.includes('sql') || queryLower.includes('query') || queryLower.includes('database')) {
    return `### 🗄️ Database Architecture & Query Optimization

Berikut adalah query dan indeks yang dioptimasi untuk high-throughput ticketing & audit logs:

\`\`\`sql
-- Membuat indeks komposit untuk query status dan created_at
CREATE INDEX CONCURRENTLY idx_tickets_status_priority 
ON tickets (status, priority, created_at DESC);

-- Query analisis waktu resolusi tiket
SELECT 
  category,
  COUNT(*) as total_tickets,
  AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600)::numeric(10,2) AS avg_resolution_hours
FROM tickets
WHERE status = 'Resolved'
GROUP BY category
ORDER BY total_tickets DESC;
\`\`\`

💡 **Tips DBA**: Gunakan \`EXPLAIN (ANALYZE, BUFFERS)\` sebelum merilis migrasi ke production untuk mencegah full-table scans.${contextMention}`;
  }

  // Default smart technical response
  return `### ⚡ ${personaTitle} Analysis

Terima kasih atas pertanyaannya mengenai: **"${query.slice(0, 60)}${query.length > 60 ? '...' : ''}"**

Berikut adalah rekomendasi arsitektur dan solusi implementasi:

1. **Arsitektur & Konsep Inti**:
   - Pisahkan layer presentasi (UI components) dengan service layer dan backend proxy.
   - Enforce tipe data yang kuat menggunakan TypeScript interface untuk mencegah runtime type coercion.

2. **Implementasi Kode**:
\`\`\`typescript
// Handler modular dengan error handling terpusat
export async function executeOperation(payload: Record<string, unknown>) {
  try {
    const res = await fetch('/api/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    return await res.json();
  } catch (err) {
    console.error('[IZI AI Operation Error]:', err);
    throw err;
  }
}
\`\`\`

3. **Langkah Berikutnya**:
   - Anda dapat menyimpan jawaban ini langsung ke **Library IT** atau mengonversinya menjadi **Ticket** / **Task Project** menggunakan tombol tool di bawah chat.${contextMention}`;
}
