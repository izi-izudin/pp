import React, { useEffect, useState } from 'react';
import { 
  Bot, 
  Terminal, 
  MessageSquare, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity,
  TicketCheck,
  FolderGit2,
  RefreshCw,
  Send,
  ShieldCheck,
  Layers,
  TrendingUp,
  Server,
  BarChart3,
  Clock,
  Zap,
  Globe2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { CyberCard } from './common/CyberCard.js';
import { CyberBadge } from './common/CyberBadge.js';
import { CyberButton } from './common/CyberButton.js';
import { StatWidget } from './common/StatWidget.js';
import type { NavigationTab, Project, Ticket } from '../types.js';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  openContactModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, openContactModal }) => {
  const { playCyberSound } = useTheme();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('7D');
  const [activeChartMetric, setActiveChartMetric] = useState<'all' | 'tasks' | 'tickets' | 'api'>('all');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [tickRes, projRes, teleRes, metRes] = await Promise.allSettled([
        fetch('/api/tickets').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/monitoring/telemetry').then(r => r.json()),
        fetch('/api/monitoring/metrics').then(r => r.json())
      ]);

      if (tickRes.status === 'fulfilled' && tickRes.value?.success) {
        setTickets(tickRes.value.tickets || []);
      }
      if (projRes.status === 'fulfilled' && projRes.value?.success) {
        setProjects(projRes.value.projects || []);
      }
      if (teleRes.status === 'fulfilled' && teleRes.value?.success) {
        setTelemetry(teleRes.value);
      }
      if (metRes.status === 'fulfilled' && metRes.value?.success) {
        setMetrics(metRes.value);
      }
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = metrics?.kpis || {
    totalProjects: projects.length || 4,
    completedProjects: projects.filter(p => p.status === 'Completed').length || 1,
    inProgressProjects: projects.filter(p => p.status === 'In Progress').length || 3,
    projectCompletionRate: 88,
    totalTickets: tickets.length || 4,
    resolvedTickets: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length || 1,
    openTickets: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length || 3,
    criticalTickets: tickets.filter(t => t.priority === 'Critical').length || 0,
    ticketResolutionRate: 75,
    totalTasks: 11,
    completedTasks: 8,
    taskVelocityRate: 72,
    serverUptimePercent: '99.98%'
  };

  const activityData = [
    { day: 'Mon', tasks: 12, tickets: 4, apiCalls: 1840 },
    { day: 'Tue', tasks: 16, tickets: 7, apiCalls: 2150 },
    { day: 'Wed', tasks: 19, tickets: 5, apiCalls: 2490 },
    { day: 'Thu', tasks: 14, tickets: 8, apiCalls: 2210 },
    { day: 'Fri', tasks: 22, tickets: 9, apiCalls: 2840 },
    { day: 'Sat', tasks: 8, tickets: 3, apiCalls: 1420 },
    { day: 'Sun', tasks: 11, tickets: 4, apiCalls: 1680 }
  ];

  const maxTask = Math.max(...activityData.map(d => d.tasks));
  const maxTicket = Math.max(...activityData.map(d => d.tickets));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            TAHAP 2 // QUANTUM SYSTEM DASHBOARD
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            WORKSPACE KPI &amp; TELEMETRY OVERVIEW
          </h1>
          <p className="text-slate-400 text-xs">
            Aggregated system metrics across Projects, Support Tickets, Server Health, and Activity Charts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CyberBadge status="online" size="md">
            SLA: 99.98%
          </CyberBadge>

          <CyberButton
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            loading={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />}
          >
            Refresh Metrics
          </CyberButton>
        </div>
      </div>

      {/* KPI Tiles Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Projects Completion Rate */}
        <StatWidget
          label="PROJECT VELOCITY"
          value={`${kpis.projectCompletionRate}%`}
          trend={{ value: `${kpis.completedProjects} of ${kpis.totalProjects} Complete`, isPositive: true }}
          icon={<FolderGit2 className="w-4 h-4" />}
          colorAccent="cyan"
          subtext="Active Deliverables"
          onClick={() => onNavigate('projects')}
        />

        {/* KPI 2: Ticket SLA Resolution */}
        <StatWidget
          label="SUPPORT SLA RATE"
          value={`${kpis.ticketResolutionRate}%`}
          trend={{ value: `${kpis.openTickets} Open / ${kpis.criticalTickets} Critical`, isPositive: kpis.criticalTickets === 0 }}
          icon={<TicketCheck className="w-4 h-4" />}
          colorAccent="magenta"
          subtext="IT Incident Response"
          onClick={() => onNavigate('tickets')}
        />

        {/* KPI 3: Server Health & Uptime */}
        <StatWidget
          label="SYSTEM UPTIME"
          value="99.98%"
          trend={{ value: "14ms Latency", isPositive: true }}
          icon={<Server className="w-4 h-4" />}
          colorAccent="emerald"
          subtext="5 Operational Nodes"
          onClick={() => onNavigate('monitoring')}
        />

        {/* KPI 4: Proxy Gateway Output */}
        <StatWidget
          label="API GATEWAY REQS"
          value="14,285"
          trend={{ value: "+18.2%", isPositive: true, label: "24h" }}
          icon={<Terminal className="w-4 h-4" />}
          colorAccent="purple"
          subtext="SSRF-Protected"
          onClick={() => onNavigate('api-center')}
        />
      </div>

      {/* Middle Section: Interactive Activity Chart & Server Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Activity Chart (8 Cols) */}
        <div className="lg:col-span-8">
          <CyberCard
            title="SYSTEM ACTIVITY &amp; THROUGHPUT CHART"
            subtitle="Weekly workload telemetry across tasks, tickets, and proxy traffic"
            icon={<BarChart3 className="w-4 h-4 text-cyan-400" />}
            headerAction={
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {(['7D', '30D', '90D'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => {
                      playCyberSound('click');
                      setTimeframe(tf);
                    }}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      timeframe === tf
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            }
          >
            {/* Chart Legend Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#141b40] font-mono text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveChartMetric('all')}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${activeChartMetric === 'all' ? 'text-white font-bold' : 'text-slate-500'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                  <span>Overview (All)</span>
                </button>
                <button
                  onClick={() => setActiveChartMetric('tasks')}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${activeChartMetric === 'tasks' ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
                  <span>Tasks Closed</span>
                </button>
                <button
                  onClick={() => setActiveChartMetric('tickets')}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${activeChartMetric === 'tickets' ? 'text-pink-300 font-bold' : 'text-slate-500'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-pink-400"></span>
                  <span>Tickets Resolved</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500">Live Metric Simulation (DEMO)</span>
            </div>

            {/* High-Tech Cyberpunk SVG Bar & Line Chart */}
            <div className="h-64 w-full relative flex items-end justify-between gap-3 pt-6 px-2">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-cyan-500 w-full"></div>
                <div className="border-b border-cyan-500 w-full"></div>
                <div className="border-b border-cyan-500 w-full"></div>
                <div className="border-b border-cyan-500 w-full"></div>
              </div>

              {activityData.map((item, idx) => {
                const taskHeight = (item.tasks / 25) * 100;
                const ticketHeight = (item.tickets / 10) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                    <div className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      {item.tasks}t / {item.tickets}tk
                    </div>

                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Task Bar */}
                      {(activeChartMetric === 'all' || activeChartMetric === 'tasks') && (
                        <div
                          className="w-3 sm:w-4 rounded-t-md bg-gradient-to-t from-cyan-950 via-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)] group-hover:brightness-125 transition-all duration-300"
                          style={{ height: `${taskHeight}%` }}
                          title={`${item.day}: ${item.tasks} tasks completed`}
                        ></div>
                      )}

                      {/* Ticket Bar */}
                      {(activeChartMetric === 'all' || activeChartMetric === 'tickets') && (
                        <div
                          className="w-3 sm:w-4 rounded-t-md bg-gradient-to-t from-purple-950 via-pink-500 to-pink-300 shadow-[0_0_10px_rgba(255,0,127,0.4)] group-hover:brightness-125 transition-all duration-300"
                          style={{ height: `${ticketHeight}%` }}
                          title={`${item.day}: ${item.tickets} tickets resolved`}
                        ></div>
                      )}
                    </div>

                    <div className="text-xs font-mono text-slate-400 group-hover:text-cyan-300 transition">
                      {item.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </CyberCard>
        </div>

        {/* Right: Server Telemetry Snapshot (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <CyberCard
            title="SERVER TELEMETRY"
            subtitle="Node-01 cluster resources"
            icon={<Cpu className="w-4 h-4 text-emerald-400" />}
            headerAction={
              <button
                onClick={() => onNavigate('monitoring')}
                className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Full HUD</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">CPU Workload (8 Cores)</span>
                  <span className="text-cyan-400 font-bold">14.8%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0c1236]">
                  <div className="h-full bg-cyan-400 rounded-full w-[15%]"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">RAM Memory (DDR5)</span>
                  <span className="text-purple-400 font-bold">38.4% (6.1GB)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0c1236]">
                  <div className="h-full bg-purple-400 rounded-full w-[38%]"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">NVMe SSD Storage</span>
                  <span className="text-emerald-400 font-bold">26.7%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0c1236]">
                  <div className="h-full bg-emerald-400 rounded-full w-[27%]"></div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#141b40] space-y-2">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Edge Latency (NRT):</span>
                  <span className="text-emerald-400 font-bold">14 ms</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Active Containers:</span>
                  <span className="text-cyan-400 font-bold">5 Running</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>SSRF Proxy Shield:</span>
                  <span className="text-emerald-400 font-bold">Enforced</span>
                </div>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>

      {/* Bottom Row: Active Projects & Recent IT Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Progress Matrix */}
        <CyberCard
          title="ACTIVE PROJECTS PROGRESS"
          subtitle="Real-time completion telemetry"
          icon={<FolderGit2 className="w-4 h-4 text-cyan-400" />}
          headerAction={
            <CyberButton
              variant="outline"
              size="xs"
              onClick={() => onNavigate('projects')}
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Manage Projects
            </CyberButton>
          }
        >
          <div className="space-y-4">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white font-display">{p.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 ml-2">({p.category})</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">{p.progress}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#11173d] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full"
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>{p.tasks.filter(t => t.completed).length}/{p.tasks.length} Tasks Closed</span>
                  <span className="text-purple-300">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CyberCard>

        {/* Priority IT Support Incidents */}
        <CyberCard
          title="ACTIVE IT INCIDENTS"
          subtitle="Tickets filtered by SLA and escalation"
          icon={<TicketCheck className="w-4 h-4 text-pink-400" />}
          headerAction={
            <CyberButton
              variant="outline"
              size="xs"
              onClick={() => onNavigate('tickets')}
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Ticket Desk
            </CyberButton>
          }
        >
          <div className="space-y-3">
            {tickets.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-[#0b102e] border border-[#182352] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cyan-400">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    t.priority === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : t.priority === 'High'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {t.priority}
                  </span>
                </div>

                <div className="text-xs font-bold text-white line-clamp-1">
                  {t.title}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#16204c]">
                  <span>Requester: {t.requester}</span>
                  <span className="text-emerald-400 font-bold">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CyberCard>
      </div>
    </div>
  );
};
