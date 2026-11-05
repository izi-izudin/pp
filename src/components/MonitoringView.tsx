import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Globe2, 
  Zap,
  Terminal,
  Radio
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { CyberCard } from './common/CyberCard.js';
import { CyberBadge } from './common/CyberBadge.js';
import { CyberButton } from './common/CyberButton.js';
import { StatWidget } from './common/StatWidget.js';
import { TerminalBox } from './common/TerminalBox.js';

export const MonitoringView: React.FC = () => {
  const { playCyberSound } = useTheme();
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [restartingId, setRestartingId] = useState<string | null>(null);
  const [lastPing, setLastPing] = useState<string>(new Date().toLocaleTimeString());

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/monitoring/telemetry');
      const data = await res.json();
      if (data.success) {
        setTelemetry(data);
        setLastPing(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.warn('Failed to fetch telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000); // 15s auto polling
    return () => clearInterval(interval);
  }, []);

  const handleRestartProcess = async (processId: string, processName: string) => {
    if (!confirm(`Are you sure you want to restart process "${processName}"?`)) return;
    playCyberSound('alert');
    setRestartingId(processId);

    try {
      const res = await fetch('/api/monitoring/restart-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processId })
      });
      const data = await res.json();
      if (data.success) {
        playCyberSound('beep');
        alert(data.message);
        fetchTelemetry();
      }
    } catch {
      alert('Failed to restart process');
    } finally {
      setRestartingId(null);
    }
  };

  const server = telemetry?.server || {
    hostname: 'node-01.izi-tech.production',
    platform: 'Linux x86_64 // Ubuntu 24.04 LTS',
    kernel: '6.8.0-45-generic',
    uptime: '14d 7h 24m',
    uptimePercent: '99.98%',
    cpu: { cores: 8, loadPercent: 14.8, frequency: '3.40 GHz' },
    memory: { totalGB: 16, usedGB: 6.1, usedPercent: 38.4 },
    disk: { totalGB: 256, usedGB: 68.4, usedPercent: 26.7 },
    network: { inboundGbps: 1.24, outboundGbps: 2.18, totalRequestsToday: 14285 }
  };

  const microservices = telemetry?.microservices || [
    { name: 'SSRF Protected API Gateway', status: 'Operational', latency: '12ms', health: 100, port: 3000 },
    { name: 'PostgreSQL Database Transaction Pool', status: 'Operational', latency: '4ms', health: 100, activeConn: '7/20' },
    { name: 'Meta Cloud API Webhook Listener', status: 'Operational', latency: '18ms', health: 99.8, version: 'v21.0' },
    { name: 'Redis Cache & Rate Limiting Engine', status: 'Operational', latency: '1ms', health: 100, hitRate: '96.4%' },
    { name: 'Event Notification Dispatcher', status: 'Operational', latency: '22ms', health: 100, queue: '0 pending' }
  ];

  const edgeNodes = telemetry?.edgeNodes || [
    { city: 'Tokyo (NRT)', region: 'Asia-East', latencyMs: 14, status: 'Optimal' },
    { city: 'Singapore (SIN)', region: 'Asia-SE', latencyMs: 28, status: 'Optimal' },
    { city: 'Jakarta (CGK)', region: 'Asia-SE', latencyMs: 32, status: 'Optimal' },
    { city: 'Frankfurt (FRA)', region: 'EU-Central', latencyMs: 142, status: 'Good' },
    { city: 'N. Virginia (IAD)', region: 'US-East', latencyMs: 164, status: 'Good' }
  ];

  const containers = telemetry?.containers || [
    { id: 'cnt-1', name: 'izi-gateway-proxy', image: 'izi/proxy-ssrf:v2.0', status: 'Running', cpu: '1.4%', memory: '124MB', restarts: 0, uptime: '14d 7h' },
    { id: 'cnt-2', name: 'izi-express-core', image: 'izi/core-api:v2.0', status: 'Running', cpu: '2.8%', memory: '210MB', restarts: 0, uptime: '14d 7h' },
    { id: 'cnt-3', name: 'izi-pg-pooler', image: 'izi/pgbouncer:1.22', status: 'Running', cpu: '0.9%', memory: '84MB', restarts: 1, uptime: '6d 12h' },
    { id: 'cnt-4', name: 'izi-webhook-event', image: 'izi/meta-webhook:v21', status: 'Running', cpu: '1.1%', memory: '96MB', restarts: 0, uptime: '14d 7h' },
    { id: 'cnt-5', name: 'izi-redis-cache', image: 'redis:7.2-alpine', status: 'Running', cpu: '0.6%', memory: '64MB', restarts: 0, uptime: '14d 7h' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>TAHAP 2 // INFRASTRUCTURE TELEMETRY &amp; SERVER MONITORING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            SERVER STATUS &amp; WORKSPACE HEALTH
          </h1>
          <p className="text-slate-400 text-xs">
            Real-time telemetry, node latencies, microservice pools, and container process controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CyberBadge status="online" size="md">
            SLA: {server.uptimePercent}
          </CyberBadge>

          <CyberButton
            variant="secondary"
            size="sm"
            onClick={fetchTelemetry}
            loading={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />}
          >
            Live Ping ({lastPing})
          </CyberButton>
        </div>
      </div>

      {/* Server Status Master Banner */}
      <CyberCard noPadding>
        <div className="p-6 bg-gradient-to-r from-[#090e2d] via-[#101740] to-[#070b22] flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#182352]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-display font-black text-lg text-white">
                  {server.hostname}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  HEALTHY // OPTIMAL
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700">
                  LIVE TELEMETRY
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {server.platform} &bull; Kernel {server.kernel} &bull; Uptime: <strong className="text-cyan-300">{server.uptime}</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="px-3.5 py-2 rounded-xl bg-[#070b22] border border-[#1b2554]">
              <div className="text-slate-400 text-[10px]">CPU ARCH</div>
              <div className="text-white font-bold">{server.cpu.cores} Cores @ {server.cpu.frequency}</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#070b22] border border-[#1b2554]">
              <div className="text-slate-400 text-[10px]">MEMORY POOL</div>
              <div className="text-white font-bold">{server.memory.totalGB} GB DDR5 ECC</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#070b22] border border-[#1b2554]">
              <div className="text-slate-400 text-[10px]">TOTAL DISPATCHED TODAY</div>
              <div className="text-cyan-400 font-bold">{server.network.totalRequestsToday.toLocaleString()} reqs</div>
            </div>
          </div>
        </div>

        {/* 4 Hardware Usage Progress Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#182352] p-5">
          {/* CPU Gauge */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Load
              </span>
              <span className="text-cyan-400 font-bold">{server.cpu.loadPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0c1236] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${server.cpu.loadPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-right">8 Cores active</div>
          </div>

          {/* Memory Gauge */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> RAM Memory
              </span>
              <span className="text-purple-400 font-bold">{server.memory.usedPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0c1236] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${server.memory.usedPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-right">{server.memory.usedGB} GB of {server.memory.totalGB} GB</div>
          </div>

          {/* Disk NVMe Gauge */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> NVMe Storage
              </span>
              <span className="text-emerald-400 font-bold">{server.disk.usedPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0c1236] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${server.disk.usedPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-right">{server.disk.usedGB} GB of {server.disk.totalGB} GB</div>
          </div>

          {/* Network Throughput */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-amber-400" /> Network Bandwidth
              </span>
              <span className="text-amber-400 font-bold">{(parseFloat(server.network.inboundGbps) + parseFloat(server.network.outboundGbps)).toFixed(1)} Gbps</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0c1236] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full w-[45%]"></div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-right">In: {server.network.inboundGbps}G &bull; Out: {server.network.outboundGbps}G</div>
          </div>
        </div>
      </CyberCard>

      {/* Two Column Section: Microservices & Edge Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Microservices Health Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CyberCard
            title="MICROSERVICES RUNTIME STATUS"
            subtitle="Internal services pool health & latency"
            icon={<Zap className="w-4 h-4 text-cyan-400" />}
          >
            <div className="space-y-3">
              {microservices.map((ms: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0b102e] border border-[#182352] hover:border-cyan-500/40 transition flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-bold text-white truncate">{ms.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {ms.port && `Port ${ms.port} `}
                      {ms.activeConn && `Pool: ${ms.activeConn} `}
                      {ms.hitRate && `Cache Hit: ${ms.hitRate} `}
                      {ms.version && `Version: ${ms.version} `}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-[11px]">
                      {ms.latency}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                      {ms.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CyberCard>

          {/* Docker Containers Process Manager */}
          <CyberCard
            title="ACTIVE PROCESSES &amp; CONTAINERS"
            subtitle="Real-time process status with restart control"
            icon={<Layers className="w-4 h-4 text-purple-400" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-[#16204a]">
                <thead className="bg-[#0b102e] text-slate-400">
                  <tr>
                    <th className="p-2.5 border-b border-[#16204a]">Container / Image</th>
                    <th className="p-2.5 border-b border-[#16204a]">Status</th>
                    <th className="p-2.5 border-b border-[#16204a]">CPU</th>
                    <th className="p-2.5 border-b border-[#16204a]">RAM</th>
                    <th className="p-2.5 border-b border-[#16204a]">Uptime</th>
                    <th className="p-2.5 border-b border-[#16204a] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16204a]">
                  {containers.map((cnt: any) => (
                    <tr key={cnt.id} className="hover:bg-[#0c1236]">
                      <td className="p-2.5 text-white">
                        <div className="font-bold text-cyan-300">{cnt.name}</div>
                        <div className="text-[10px] text-slate-500">{cnt.image}</div>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                          {cnt.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-300">{cnt.cpu}</td>
                      <td className="p-2.5 text-purple-300">{cnt.memory}</td>
                      <td className="p-2.5 text-slate-400 whitespace-nowrap">{cnt.uptime}</td>
                      <td className="p-2.5 text-right">
                        <CyberButton
                          variant="outline"
                          size="xs"
                          loading={restartingId === cnt.id}
                          onClick={() => handleRestartProcess(cnt.id, cnt.name)}
                          icon={<RotateCcw className="w-3 h-3" />}
                        >
                          Restart
                        </CyberButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CyberCard>
        </div>

        {/* Right: Global Edge Nodes & Live HUD Terminal (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <CyberCard
            title="GLOBAL REGIONAL EDGE LATENCY"
            subtitle="Multi-region ping times to edge endpoints"
            icon={<Globe2 className="w-4 h-4 text-emerald-400" />}
          >
            <div className="space-y-3">
              {edgeNodes.map((node: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0b102e] border border-[#182352] flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="text-white font-bold">{node.city}</div>
                    <div className="text-[10px] text-slate-500">{node.region}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${
                      node.latencyMs < 50
                        ? 'text-emerald-400'
                        : node.latencyMs < 150
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}>
                      {node.latencyMs} ms
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">
                      {node.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CyberCard>

          {/* Embedded Terminal for Health Audit */}
          <CyberCard title="LIVE SYSTEM STDOUT" subtitle="Real-time kernel telemetry logs">
            <TerminalBox height="h-60" />
          </CyberCard>
        </div>
      </div>
    </div>
  );
};
