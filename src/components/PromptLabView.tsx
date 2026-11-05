import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Send, 
  Terminal, 
  Bot, 
  BookOpen
} from 'lucide-react';

interface PromptLabViewProps {
  onOpenChatWithPrompt?: (prompt: string) => void;
}

export const PromptLabView: React.FC<PromptLabViewProps> = ({ onOpenChatWithPrompt }) => {
  const categories = ['All', 'Full-Stack', 'Security & SSRF', 'Database', 'WhatsApp & API', 'DevOps'];
  const [selectedCat, setSelectedCat] = useState('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const templates = [
    {
      title: 'Zero-Trust SSRF Defense Blueprint',
      category: 'Security & SSRF',
      description: 'Generates robust URL validation logic against private IPs, AWS/GCP metadata, and DNS rebinding.',
      prompt: `Act as a Principal Application Security Architect.
Evaluate the following URL ingestion handler for Server-Side Request Forgery (SSRF) vulnerabilities:
\`\`\`typescript
{{code}}
\`\`\`
1. Enumerate all bypass vectors (DNS rebinding, IPv6 mapped IPv4, redirect loops, cloud metadata 169.254.169.254).
2. Provide a hardened, production-ready TypeScript validator module using strict CIDR blocking and safe socket resolution.
3. Include zero-allocation checks and rate limiting rules.`
    },
    {
      title: 'PostgreSQL EXPLAIN ANALYZE Optimization',
      category: 'Database',
      description: 'Deep dive into query execution plans, buffer hits, index scans, and PgBouncer connection tuning.',
      prompt: `Act as a PostgreSQL Performance Engineer.
Here is a query execution plan output from EXPLAIN (ANALYZE, BUFFERS):
\`\`\`sql
{{execution_plan}}
\`\`\`
1. Identify high-cost operations (Seq Scan, Hash Join spills, buffer reads).
2. Propose composite or partial indexes with CONCURRENTLY syntax.
3. Suggest query rewrites using CTEs or window functions for maximum throughput.`
    },
    {
      title: 'Meta WhatsApp Cloud API Webhook Handler',
      category: 'WhatsApp & API',
      description: 'Implements production HMAC-SHA256 signature verification, message deduplication, and 24hr window logic.',
      prompt: `Act as a Senior Backend Integration Architect.
Provide a complete, fault-tolerant Express.js router for Meta WhatsApp Business Cloud API v21.0:
Requirements:
1. GET verification endpoint matching hub.verify_token and returning hub.challenge.
2. POST message handler computing HMAC-SHA256 of raw request body against process.env.WHATSAPP_APP_SECRET.
3. In-memory or Redis-backed message ID deduplication with 24h TTL.
4. Routing logic differentiating 24h customer-initiated sessions from automated Meta Templates.`
    },
    {
      title: 'React 19 Server Actions vs Optimistic UI',
      category: 'Full-Stack',
      description: 'Architecting ultra-responsive UI with optimistic updates, useActionState, and graceful server error recovery.',
      prompt: `Act as a Staff Frontend Engineer specializing in React 19 and Tailwind CSS.
Provide an architectural pattern and idiomatic code for:
{{feature_requirement}}
- Implement using useOptimistic and startTransition.
- Handle server action validation errors without losing client form inputs.
- Apply high-contrast cyberpunk neon aesthetics with Tailwind CSS utility classes.`
    },
    {
      title: 'Linux Production Container Hardening',
      category: 'DevOps',
      description: 'Minimal rootless container setup, seccomp profiles, read-only root filesystems, and healthcheck probes.',
      prompt: `Act as a DevSecOps Lead.
Review the following Dockerfile / compose file:
\`\`\`dockerfile
{{dockerfile}}
\`\`\`
Provide a hardened multi-stage build:
1. Run as non-root user with UID 10001.
2. Drop all Linux capabilities except NET_BIND_SERVICE.
3. Mount root filesystem as read-only.
4. Implement a local healthcheck endpoint with curl/wget fallback.`
    }
  ];

  const filteredTemplates = templates.filter(t => {
    if (selectedCat === 'All') return true;
    return t.category === selectedCat;
  });

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            PROMPT LAB // AI PROMPT ENGINEER
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            PROMPT LAB &amp; AI TEMPLATES
          </h1>
          <p className="text-slate-400 text-xs">
            High-leverage prompt patterns engineered for LLMs, security audits, and systems architecture.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedCat === c
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-[#080c24] text-slate-400 border border-[#1a2350] hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((t, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {t.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Chain-of-Thought Pattern
                </span>
              </div>

              <h3 className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition mb-1">
                {t.title}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{t.description}</p>

              <pre className="p-3.5 rounded-xl bg-[#050819] border border-[#16204c] font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {t.prompt}
              </pre>
            </div>

            <div className="pt-3 border-t border-[#141b40] flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => handleCopy(idx, t.prompt)}
                className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === idx ? 'Copied' : 'Copy Prompt'}</span>
              </button>

              <button
                onClick={() => onOpenChatWithPrompt?.(t.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Test in IZI AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
