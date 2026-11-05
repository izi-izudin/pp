import { Router } from 'express';
import {
  sendWhatsAppMessage,
  handleIncomingWhatsAppMessage,
  notificationSettings,
  updateNotificationSettings,
  triggerNotification
} from '../services/whatsapp.service.js';
import { db } from '../services/db.service.js';
import { config } from '../config/index.js';

const router = Router();

// GET /api/whatsapp/status
router.get('/status', (_req, res) => {
  const logs = db.getWhatsAppLogs();
  const sent = logs.filter(l => l.direction === 'outgoing' && (l.status === 'sent' || l.status === 'delivered' || l.status === 'read')).length;
  const received = logs.filter(l => l.direction === 'incoming').length;
  const failed = logs.filter(l => l.status === 'failed').length;
  const lastActivity = logs[0]?.timestamp || 'No activity';

  const hasCredentials = Boolean(
    (process.env.WHATSAPP_PHONE_NUMBER_ID || config.whatsapp.phoneNumberId) &&
    (process.env.WHATSAPP_ACCESS_TOKEN || config.whatsapp.accessToken)
  );

  res.json({
    success: true,
    connectionStatus: hasCredentials ? 'Connected (Meta Cloud API Live)' : 'Demo Mode',
    businessPhoneNumber: '+62 812-3456-7890 (Izi Izudin Tech Business)',
    phoneNumberId: config.whatsapp.phoneNumberId ? `${config.whatsapp.phoneNumberId.slice(0, 4)}...${config.whatsapp.phoneNumberId.slice(-4)}` : 'Demo ID: 104829103982',
    businessAccountId: config.whatsapp.businessAccountId ? `${config.whatsapp.businessAccountId.slice(0, 4)}...${config.whatsapp.businessAccountId.slice(-4)}` : 'Demo Account: 5938201948',
    apiVersion: config.whatsapp.apiVersion,
    webhookUrl: `${config.appUrl}/api/whatsapp/webhook`,
    stats: {
      totalMessages: logs.length,
      messagesSent: sent,
      messagesReceived: received,
      failedMessages: failed,
      lastActivity
    },
    isLive: hasCredentials
  });
});

// POST /api/whatsapp/send
router.post('/send', async (req, res) => {
  try {
    const { to, type, text, templateName, templateLanguage, templateVariables, senderName } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, error: 'Recipient phone number is required' });
    }

    if (type === 'text' && !text) {
      return res.status(400).json({ success: false, error: 'Text message body is required' });
    }

    const result = await sendWhatsAppMessage({
      to,
      type: type || 'text',
      text,
      templateName,
      templateLanguage,
      templateVariables,
      senderName
    });
    res.json(result);
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// GET /api/whatsapp/logs
router.get('/logs', (_req, res) => {
  res.json({
    success: true,
    logs: db.getWhatsAppLogs()
  });
});

// GET /api/whatsapp/contacts
router.get('/contacts', (_req, res) => {
  res.json({
    success: true,
    contacts: db.getWhatsAppContacts()
  });
});

// POST /api/whatsapp/contacts/optin
router.post('/contacts/optin', (req, res) => {
  const { phoneNumber, optIn, name } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }

  const updated = db.updateContactOptIn(phoneNumber, Boolean(optIn), name);
  res.json({ success: true, contact: updated });
});

// GET /api/whatsapp/notifications/settings
router.get('/notifications/settings', (_req, res) => {
  res.json({
    success: true,
    settings: notificationSettings
  });
});

// POST /api/whatsapp/notifications/settings
router.post('/notifications/settings', (req, res) => {
  const updated = updateNotificationSettings(req.body);
  res.json({ success: true, settings: updated });
});

// POST /api/whatsapp/notifications/trigger-test
router.post('/notifications/trigger-test', async (req, res) => {
  try {
    const { eventType, title, id, meta } = req.body;
    const result = await triggerNotification(eventType || 'systemAlert', {
      title: title || 'Test System Alert from IZI Tech Dashboard',
      id: id || 'SYS-TEST-01',
      meta: meta || 'Manual test triggered from WhatsApp Center UI'
    });
    res.json({ success: true, result });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// POST /api/whatsapp/simulate-incoming
// Interactive simulator for testing WhatsApp AI auto-responses and quick actions
router.post('/simulate-incoming', async (req, res) => {
  try {
    const { fromPhone, senderName, messageText } = req.body;
    if (!fromPhone || !messageText) {
      return res.status(400).json({ error: 'fromPhone and messageText are required' });
    }

    const simulatedId = `wamid.HBgL${Date.now()}`;
    const result = await handleIncomingWhatsAppMessage(
      fromPhone,
      senderName || 'Simulator User',
      messageText,
      simulatedId
    );

    res.json({ success: true, ...result });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

export default router;
