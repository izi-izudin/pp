import { Router } from 'express';
import { db } from '../services/db.service.js';
import { triggerNotification } from '../services/whatsapp.service.js';

const router = Router();

// GET /api/tickets
router.get('/', (_req, res) => {
  res.json({
    success: true,
    tickets: db.getTickets()
  });
});

// GET /api/tickets/:id
router.get('/:id', (req, res) => {
  const ticket = db.getTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  res.json({ success: true, ticket });
});

// POST /api/tickets
router.post('/', async (req, res) => {
  try {
    const { title, category, priority, status, description, requester, assignedTo, source } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Ticket title is required' });
    }

    const newTicket = db.createTicket({
      title,
      category: category || 'Bug',
      priority: priority || 'Medium',
      status: status || 'Open',
      description: description || '',
      requester: requester || 'Web User',
      assignedTo: assignedTo || 'Izi Izudin',
      source: source || 'Web UI'
    });

    // Trigger WhatsApp Notification
    if (newTicket.priority === 'Critical') {
      await triggerNotification('criticalTicket', {
        title: `🚨 CRITICAL: ${newTicket.title}`,
        id: newTicket.id,
        meta: `Requester: ${newTicket.requester} | Source: ${newTicket.source}`
      });
    } else {
      await triggerNotification('newTicket', {
        title: newTicket.title,
        id: newTicket.id,
        meta: `Priority: ${newTicket.priority} | Cat: ${newTicket.category}`
      });
    }

    res.json({ success: true, ticket: newTicket });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// PATCH /api/tickets/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = db.updateTicketStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Ticket not found' });

    if (status === 'Resolved') {
      await triggerNotification('resolvedTicket', {
        title: `Resolved: ${updated.title}`,
        id: updated.id,
        meta: `Assigned: ${updated.assignedTo} | Resolved on: ${updated.resolvedAt}`
      });
    }

    res.json({ success: true, ticket: updated });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// PUT /api/tickets/:id
router.put('/:id', (req, res) => {
  const updated = db.updateTicket(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Ticket not found' });
  res.json({ success: true, ticket: updated });
});

// DELETE /api/tickets/:id
router.delete('/:id', (req, res) => {
  const deleted = db.deleteTicket(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Ticket not found' });
  res.json({ success: true, message: 'Ticket deleted successfully' });
});

export default router;
