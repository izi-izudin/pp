import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  BookOpen, 
  Smartphone, 
  Cpu, 
  CheckCircle2, 
  FileCode2, 
  FolderTree, 
  Server,
  Layers
} from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'meta-whatsapp' | 'backend-arch' | 'testing'>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#070b22] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-[#182352] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                IZI TECH PROJECT — ARCHITECTURE &amp; SETUP GUIDE
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Installation, Meta WhatsApp Cloud API credentials, and testing manual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0e1438] hover:bg-[#151f4d] text-slate-400 hover:text-white border border-[#202c66] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-[#151c44] flex items-center gap-2 font-mono text-xs overflow-x-auto">
          {[
            { id: 'quickstart', label: '1. Local Quickstart' },
            { id: 'meta-whatsapp', label: '2. Meta WhatsApp Setup' },
            { id: 'backend-arch', label: '3. Backend & DB Architecture' },
            { id: 'testing', label: '4. Testing Guide' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <h3 className="text-sm font-display font-bold text-white">CARA MENJALANKAN SECARA LOKAL</h3>
              <p>
                Aplikasi ini dibangun menggunakan arsitektur full-stack: React 19 SPA di frontend dan Express.js server di backend yang dimount menggunakan Vite middleware.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>1. Clone &amp; Install Dependencies</span>
                  <button
                    onClick={() => copyCode('step1', 'npm install')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-white"
                  >
                    {copiedKey === 'step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'step1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#040614] border border-[#16204a] font-mono text-xs text-cyan-300">
                  npm install
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>2. Konfigurasi File .env</span>
                  <button
                    onClick={() => copyCode('step2', 'cp .env.example .env')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-white"
                  >
                    {copiedKey === 'step2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'step2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#040614] border border-[#16204a] font-mono text-xs text-slate-300">
                  cp .env.example .env
                </pre>
                <p className="text-[11px] text-slate-400">
                  Buka file <code>.env</code> dan masukkan <code>GEMINI_API_KEY</code> atau kredensial WhatsApp jika ingin mode LIVE API. Tanpa kredensial, aplikasi otomatis berjalan dalam <strong>DEMO MODE</strong> yang aman dan interaktif.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>3. Jalankan Full-Stack Development Server</span>
                  <button
                    onClick={() => copyCode('step3', 'npm run dev')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-white"
                  >
                    {copiedKey === 'step3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'step3' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#040614] border border-[#16204a] font-mono text-xs text-emerald-300">
                  npm run dev
                </pre>
                <p className="text-[11px] text-slate-400">
                  Aplikasi akan online di <code>http://localhost:3000</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'meta-whatsapp' && (
            <div className="space-y-4">
              <h3 className="text-sm font-display font-bold text-white">INTEGRASI RESMI META WHATSAPP CLOUD API</h3>
              <p>
                Aplikasi ini mengimplementasikan WhatsApp Business Platform resmi (Graph API v21.0), bukan scraping atau WhatsApp Web automation tidak resmi.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#090e2d] border border-[#1b2554] space-y-1.5">
                  <strong className="text-emerald-400">Langkah 1: Registrasi Akun Pengembang Meta</strong>
                  <p className="text-slate-300 font-sans">
                    Kunjungi <code>developers.facebook.com</code> &gt; Create App &gt; Pilih kategori "Business" &gt; Tambahkan produk "WhatsApp".
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#090e2d] border border-[#1b2554] space-y-1.5">
                  <strong className="text-emerald-400">Langkah 2: Ambil Kredensial</strong>
                  <p className="text-slate-300 font-sans">
                    Di menu <em>API Setup</em>, salin <code>Phone Number ID</code>, <code>WhatsApp Business Account ID</code>, dan buat Permanent Access Token.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#090e2d] border border-[#1b2554] space-y-1.5">
                  <strong className="text-emerald-400">Langkah 3: Konfigurasi Webhook Meta</strong>
                  <p className="text-slate-300 font-sans">
                    Masukkan Callback URL: <code>https://your-domain/api/whatsapp/webhook</code> dan Verify Token: <code>izi_tech_verify_token_secure</code>.
                    Beri centang pada event <code>messages</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#090e2d] border border-[#1b2554] space-y-1.5">
                  <strong className="text-emerald-400">Langkah 4: Aturan Customer Service Window 24 Jam</strong>
                  <p className="text-slate-300 font-sans">
                    Pesan teks bebas hanya dapat dikirim dalam jendela 24 jam setelah pengguna mengirim pesan. Di luar jendela tersebut, Meta mewajibkan pengiriman menggunakan Template Message yang telah disetujui.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backend-arch' && (
            <div className="space-y-4">
              <h3 className="text-sm font-display font-bold text-white">STRUKTUR BACKEND &amp; SCHEMA DATABASE</h3>
              <p>
                Struktur direktori backend modular sesuai arsitektur Module 4:
              </p>

              <pre className="p-4 rounded-xl bg-[#040614] border border-[#16204a] font-mono text-xs text-purple-300 leading-relaxed overflow-x-auto">
{`server/
├── src/
│   ├── config/
│   │   └── index.ts          # Environment variables & timeouts
│   ├── middleware/
│   │   └── security.ts        # SSRF filter & IP rate limiter
│   ├── routes/
│   │   ├── ai.routes.ts       # POST /api/ai/chat, GET /api/ai/providers
│   │   ├── api.routes.ts      # POST /api/api-playground/request, collections
│   │   ├── whatsapp.routes.ts # POST /api/whatsapp/send, status, logs
│   │   ├── webhook.routes.ts  # GET & POST /api/whatsapp/webhook (Meta challenge & HMAC)
│   │   ├── projects.routes.ts # GET /api/projects, tasks
│   │   ├── tickets.routes.ts  # GET & POST /api/tickets, PATCH status
│   │   └── integrations.routes.ts # Health check & latency test
│   ├── services/
│   │   ├── ai.service.ts      # GoogleGenAI SDK integration (gemini-3.8-flash)
│   │   ├── apiPlayground.service.ts # Safe SSRF proxy gateway
│   │   ├── whatsapp.service.ts# Meta Cloud API, deduplication & notifications
│   │   └── db.service.ts      # In-memory transactional database store
│   └── app.ts                 # Express builder with raw body buffer verification
├── server.ts                  # Root fullstack entrypoint with Vite middlewares`}
              </pre>

              <h4 className="text-xs font-mono font-bold text-cyan-400 pt-2">Database Schema</h4>
              <p className="text-[11px] text-slate-400">
                Terdiri dari 5 tabel relational/document: <code>projects</code>, <code>tickets</code>, <code>api_collections</code>, <code>whatsapp_logs</code>, dan <code>it_library</code>.
              </p>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-4">
              <h3 className="text-sm font-display font-bold text-white">PANDUAN PENGUJIAN LENGKAP</h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#0a0f2e] border border-[#1d2757] space-y-1">
                  <div className="text-cyan-300 font-bold">1. Uji API Playground &amp; SSRF Filter:</div>
                  <div className="text-slate-300 font-sans text-xs">
                    Masuk ke tab <strong>API Center</strong> &gt; coba masukkan <code>https://jsonplaceholder.typicode.com/users/1</code> dan tekan Send. Coba juga URL terlarang seperti <code>http://127.0.0.1:8080</code> atau <code>http://169.254.169.254</code> untuk memverifikasi proteksi SSRF memblokir request tersebut dengan status 403 Forbidden.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0a0f2e] border border-[#1d2757] space-y-1">
                  <div className="text-purple-300 font-bold">2. Uji IZI AI Chatbot &amp; Personas:</div>
                  <div className="text-slate-300 font-sans text-xs">
                    Buka tab <strong>IZI AI</strong> &gt; pilih persona (misal: <em>Cybersecurity</em> atau <em>Database Assistant</em>) &gt; kirim pertanyaan. Uji tombol <em>Convert to Ticket</em> untuk melihat jawaban AI langsung dikonversi menjadi tiket bantuan dan dikirim via notifikasi.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0a0f2e] border border-[#1d2757] space-y-1">
                  <div className="text-emerald-300 font-bold">3. Uji Webhook Simulator &amp; WhatsApp Quick Actions:</div>
                  <div className="text-slate-300 font-sans text-xs">
                    Buka tab <strong>WhatsApp</strong> &gt; pilih sub-tab <em>Bot Simulator</em> &gt; ketik <code>menu</code>, <code>1</code> (tiket), atau <code>lapor database lambat</code>. Simulator akan memanggil backend handler, menduplikasi ID pesan, dan mengembalikan respon resmi Meta WhatsApp bot.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#151c44] flex items-center justify-between text-xs font-mono text-slate-500">
          <span>IZI Tech Project v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#141b44] hover:bg-[#1a2358] text-white cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
