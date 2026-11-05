import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Smartphone, 
  Terminal, 
  Database, 
  Activity, 
  ExternalLink,
  KeyRound,
  Check
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [id: string]: any }>({});

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/integrations/status');
      const data = await res.json();
      if (data.success && data.integrations) {
        setIntegrations(data.integrations);
      }
    } catch (e) {
      console.warn('Failed to fetch integrations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId: id })
      });
      const data = await res.json();
      setTestResults(prev => ({ ...prev, [id]: data }));
      fetchStatus();
    } catch (err: unknown) {
      setTestResults(prev => ({
        ...prev,
        [id]: {
          success: false,
          message: err instanceof Error ? err.message : String(err)
        }
      }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            MODULE 5 // INTEGRATION HUB
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            ENTERPRISE INTEGRATIONS &amp; SERVICES
          </h1>
          <p className="text-slate-400 text-xs">
            Manage live API keys, Meta WhatsApp Cloud API credentials, REST proxy firewalls, and persistence stores.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1438] border border-[#202c66] hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Integrations</span>
        </button>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((item) => {
          const testRes = testResults[item.id];
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-col justify-between space-y-4 shadow-xl hover:border-cyan-500/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0e153d] text-cyan-300 border border-[#202c64]">
                      {item.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.status === 'Connected'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : item.status === 'Demo Mode'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    Checked: {item.lastChecked}
                  </span>
                </div>

                <h2 className="text-lg font-display font-bold text-white mb-2">
                  {item.name}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.details}
                </p>

                {/* Configuration instructions */}
                {item.instructions && (
                  <div className="p-3.5 rounded-xl bg-[#050819] border border-[#16204c] text-slate-300 text-xs font-mono space-y-1 mb-4">
                    <div className="text-cyan-400 font-bold text-[11px] mb-1">
                      Configuration Guide:
                    </div>
                    <div className="whitespace-pre-line text-slate-400 leading-relaxed text-[11px]">
                      {item.instructions}
                    </div>
                  </div>
                )}

                {/* Test Result Banner */}
                {testRes && (
                  <div className={`p-3 rounded-xl text-xs font-mono mb-2 ${
                    testRes.success
                      ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                  }`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>Status: {testRes.status}</span>
                      {testRes.latencyMs && <span>{testRes.latencyMs} ms latency</span>}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">{testRes.message}</div>
                  </div>
                )}
              </div>

              {/* Bottom Card Action Bar */}
              <div className="pt-3 border-t border-[#141b40] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Secrets Managed on Backend</span>
                </span>

                <button
                  onClick={() => handleTestConnection(item.id)}
                  disabled={testingId === item.id}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0e1438] hover:bg-[#151f4d] border border-[#202c66] hover:border-cyan-500 text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingId === item.id ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
