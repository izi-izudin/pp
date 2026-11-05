import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { rateLimiter, requestLogger } from './middleware/security.js';
import aiRoutes from './routes/ai.routes.js';
import apiRoutes from './routes/api.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import ticketsRoutes from './routes/tickets.routes.js';
import integrationsRoutes from './routes/integrations.routes.js';
import monitoringRoutes from './routes/monitoring.routes.js';

export function createApp() {
  const app = express();

  // Basic security and parsing
  app.use(express.json({
    limit: '5mb',
    verify: (req: Request & { rawBody?: Buffer }, _res: Response, buf: Buffer) => {
      // Retain raw buffer for HMAC signature verification
      req.rawBody = buf;
    }
  }));

  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use('/api', rateLimiter(120, 60000));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'IZI Tech Project',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Mount modular route handlers
  app.use('/api/ai', aiRoutes);
  app.use('/api/api-playground', apiRoutes);
  app.use('/api/whatsapp/webhook', webhookRoutes);
  app.use('/api/whatsapp', whatsappRoutes);
  app.use('/api/projects', projectsRoutes);
  app.use('/api/tickets', ticketsRoutes);
  app.use('/api/integrations', integrationsRoutes);
  app.use('/api/monitoring', monitoringRoutes);

  // Global API error handler
  app.use('/api', (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[API Unhandled Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    });
  });

  return app;
}
