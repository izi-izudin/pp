import { Router } from 'express';
import { config } from '../config/index.js';
import { handleIncomingWhatsAppMessage, verifyMetaWebhookSignature } from '../services/whatsapp.service.js';

const router = Router();

// GET /api/whatsapp/webhook - Meta Verification Challenge
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const configuredToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || config.whatsapp.verifyToken;

  if (mode && token) {
    if (mode === 'subscribe' && token === configuredToken) {
      console.log('[Meta Webhook Verified Successfully]');
      return res.status(200).send(challenge);
    } else {
      console.warn('[Meta Webhook Verification Failed: Token Mismatch]');
      return res.sendStatus(403);
    }
  }

  return res.status(400).send('Missing hub parameters');
});

// POST /api/whatsapp/webhook - Receive Meta Messages
router.post('/', async (req, res) => {
  const signature = req.headers['x-hub-signature-256'] as string | undefined;

  // Verify HMAC signature if payload buffer is present
  const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;
  if (rawBody && !verifyMetaWebhookSignature(signature, rawBody)) {
    console.warn('[Meta Webhook Signature Verification Failed]');
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  const body = req.body;

  // Always respond with 200 OK fast to acknowledge Meta receipt
  res.status(200).json({ status: 'EVENT_RECEIVED' });

  // Process event in background
  try {
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const fromPhone = `+${message.from}`;
        const senderName = value?.contacts?.[0]?.profile?.name || 'WhatsApp Contact';
        const messageId = message.id;

        let messageText = '';
        if (message.type === 'text') {
          messageText = message.text?.body || '';
        } else if (message.type === 'interactive') {
          messageText = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || 'Interactive response';
        }

        if (messageText) {
          console.log(`[WhatsApp Incoming] from ${fromPhone} (${senderName}): "${messageText}"`);
          await handleIncomingWhatsAppMessage(fromPhone, senderName, messageText, messageId);
        }
      }
    }
  } catch (err) {
    console.error('Error handling Meta Webhook payload:', err);
  }
});

export default router;
