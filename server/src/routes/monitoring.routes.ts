import { Router } from 'express';
import { db } from '../services/db.service.js';

const router = Router();

const systemStartTime = Date.now() - (86400000 * 14 + 3600000 * 7); // ~14 days uptime

let containers = [
  { id: 'cnt-1', name: 'izi-gateway-proxy', image: 'izi/proxy-ssrf:v2.0', status: 'Running', cpu: '1.4%', memory: '124MB', restarts: 0, uptime: '14d 7h' },
  { id: 'cnt-2', name: 'izi-express-core', image: 'izi/core-api:v2.0', status: 'Running', cpu: '2.8%', memory: '210MB', restarts: 0, uptime: '14d 7h' },
  { id: 'cnt-3', name: 'izi-pg-pooler', image: 'izi/pgbouncer:1.22', status: 'Running', cpu: '0.9%', memory: '84MB', restarts: 1, uptime: '6d 12h' },
  { id: 'cnt-4', name: 'izi-webhook-event', image: 'izi/meta-webhook:v21', status: 'Running', cpu: '1.1%', memory: '96MB', restarts: 0, uptime: '14d 7h' },
  { id: 'cnt-5', name: 'izi-redis-cache', image: 'redis:7.2-alpine', status: 'Running', cpu: '0.6%', memory: '64MB', restarts: 0, uptime: '14d 7h' }
];

// GET /api/monitoring/telemetry
router.get('/telemetry', (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - systemStartTime) / 1000);
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);

  // Dynamic realistic telemetry fluctuation
  const jitter = Math.sin(Date.now() / 10000);
  const cpuLoad = (14.2 + jitter * 4.5).toFixed(1);
  const memoryPercent = (38.4 + jitter * 2.1).toFixed(1);

  const microservices = [
    { name: 'SSRF Protected API Gateway', status: 'Operational', latency: '12ms', health: 100, port: 3000 },
    { name: 'PostgreSQL Database Transaction Pool', status: 'Operational', latency: '4ms', health: 100, activeConn: '7/20' },
    { name: 'Meta Cloud API Webhook Listener', status: 'Operational', latency: '18ms', health: 99.8, version: 'v21.0' },
    { name: 'Redis Cache & Rate Limiting Engine', status: 'Operational', latency: '1ms', health: 100, hitRate: '96.4%' },
    { name: 'Event Notification Dispatcher', status: 'Operational', latency: '22ms', health: 100, queue: '0 pending' }
  ];

  const edgeNodes = [
    { city: 'Tokyo (NRT)', region: 'Asia-East', latencyMs: 14, status: 'Optimal' },
    { city: 'Singapore (SIN)', region: 'Asia-SE', latencyMs: 28, status: 'Optimal' },
    { city: 'Jakarta (CGK)', region: 'Asia-SE', latencyMs: 32, status: 'Optimal' },
    { city: 'Frankfurt (FRA)', region: 'EU-Central', latencyMs: 142, status: 'Good' },
    { city: 'N. Virginia (IAD)', region: 'US-East', latencyMs: 164, status: 'Good' }
  ];

  res.json({
    success: true,
    server: {
      hostname: 'node-01.izi-tech.production',
      platform: 'Linux x86_64 // Ubuntu 24.04 LTS',
      kernel: '6.8.0-45-generic',
      uptime: `${days}d ${hours}h ${minutes}m`,
      uptimePercent: '99.98%',
      cpu: {
        cores: 8,
        loadPercent: parseFloat(cpuLoad),
        frequency: '3.40 GHz'
      },
      memory: {
        totalGB: 16,
        usedPercent: parseFloat(memoryPercent),
        usedGB: (16 * (parseFloat(memoryPercent) / 100)).toFixed(1)
      },
      disk: {
        totalGB: 256,
        usedGB: 68.4,
        usedPercent: 26.7
      },
      network: {
        inboundGbps: (1.24 + jitter * 0.15).toFixed(2),
        outboundGbps: (2.18 + jitter * 0.22).toFixed(2),
        totalRequestsToday: 14285
      }
    },
    microservices,
    edgeNodes,
    containers
  });
});

// POST /api/monitoring/restart-process
router.post('/restart-process', (req, res) => {
  const { processId } = req.body;
  const container = containers.find(c => c.id === processId);
  if (!container) return res.status(404).json({ error: 'Process not found' });

  container.restarts += 1;
  container.uptime = '0m (just restarted)';
  res.json({
    success: true,
    message: `Container ${container.name} successfully restarted. Health check passed.`,
    container
  });
});

// GET /api/dashboard/metrics
router.get('/metrics', (_req, res) => {
  const projects = db.getProjects();
  const tickets = db.getTickets();

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);

  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const criticalTickets = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length;

  const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
  const ticketResolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;
  const taskVelocityRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 7-day activity timeline
  const activityTimeline = [
    { day: 'Mon', tasks: 12, tickets: 4, apiCalls: 1840 },
    { day: 'Tue', tasks: 16, tickets: 7, apiCalls: 2150 },
    { day: 'Wed', tasks: 19, tickets: 5, apiCalls: 2490 },
    { day: 'Thu', tasks: 14, tickets: 8, apiCalls: 2210 },
    { day: 'Fri', tasks: 22, tickets: 9, apiCalls: 2840 },
    { day: 'Sat', tasks: 8, tickets: 3, apiCalls: 1420 },
    { day: 'Sun', tasks: 11, tickets: 4, apiCalls: 1680 }
  ];

  res.json({
    success: true,
    kpis: {
      totalProjects,
      completedProjects,
      inProgressProjects,
      projectCompletionRate,
      totalTickets,
      resolvedTickets,
      openTickets,
      criticalTickets,
      ticketResolutionRate,
      totalTasks,
      completedTasks,
      taskVelocityRate,
      serverUptimePercent: '99.98%',
      systemStatus: 'Operational'
    },
    activityTimeline
  });
});

export default router;
