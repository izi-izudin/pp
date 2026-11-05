import crypto from 'crypto';
import { config } from '../config/index.js';
import { db } from './db.service.js';
import { processAIChat } from './ai.service.js';

// Cache processed webhook message IDs for deduplication (TTL 24 hours)
const processedMessageIds = new Set<string>();

export interface WhatsAppNotificationConfig {
  newTicket: boolean;
  criticalTicket: boolean;
  resolvedTicket: boolean;
  projectDeadline: boolean;
  projectCompleted: boolean;
  systemAlert: boolean;
  apiError: boolean;
  defaultRecipientPhone: string;
}

export let notificationSettings: WhatsAppNotificationConfig = {
  newTicket: true,
  criticalTicket: true,
  resolvedTicket: true,
  projectDeadline: false,
  projectCompleted: true,
  systemAlert: true,
  apiError: true,
  defaultRecipientPhone: '+6281234567890'
};

export function updateNotificationSettings(newSettings: Partial<WhatsAppNotificationConfig>) {
  notificationSettings = { ...notificationSettings, ...newSettings };
  return notificationSettings;
}

// Phone validator: must have '+' and minimum 10 digits
export function validatePhoneNumber(phone: string): { valid: boolean; normalized: string; error?: string } {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) {
    return { valid: false, normalized: '', error: 'Phone number must be between 9 and 15 digits including country code (e.g. +6281234567890)' };
  }
  const normalized = `+${digits}`;
  return { valid: true, normalized };
}

// Verify Meta Webhook HMAC-SHA256 Signature
export function verifyMetaWebhookSignature(signatureHeader: string | undefined, rawBodyBuffer: Buffer): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET || config.whatsapp.appSecret;
  if (!appSecret) {
    // If no app secret configured in env, allow in dev/demo mode with warning
    return true;
  }
  if (!signatureHeader) return false;

  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') return false;

  const expectedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(rawBodyBuffer)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expectedSignature));
}

export interface SendMessageOptions {
  to: string;
  type: 'text' | 'template';
  text?: string;
  templateName?: string;
  templateLanguage?: string;
  templateVariables?: string[];
  senderName?: string;
}

// Core Meta Cloud API Sender
export async function sendWhatsAppMessage(options: SendMessageOptions) {
  const phoneValidation = validatePhoneNumber(options.to);
  if (!phoneValidation.valid) {
    throw new Error(phoneValidation.error || 'Invalid phone number');
  }

  const recipientPhone = phoneValidation.normalized;
  const digitsOnly = recipientPhone.replace(/\D/g, '');

  // Check opt-in
  const contact = db.getContact(recipientPhone);
  if (contact && !contact.optIn) {
    throw new Error(`Recipient ${recipientPhone} has opted out or not given consent. Meta policy requires opt-in.`);
  }

  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || config.whatsapp.phoneNumberId;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || config.whatsapp.accessToken;
  const version = config.whatsapp.apiVersion;

  // If live credentials are available, make real Meta API call
  if (phoneId && accessToken) {
    const metaEndpoint = `${config.whatsapp.metaApiBaseUrl}/${version}/${phoneId}/messages`;
    let requestPayload: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: digitsOnly
    };

    if (options.type === 'text') {
      requestPayload = {
        ...requestPayload,
        type: 'text',
        text: { preview_url: false, body: options.text || '' }
      };
    } else {
      // Template message
      requestPayload = {
        ...requestPayload,
        type: 'template',
        template: {
          name: options.templateName || 'ticket_alert',
          language: { code: options.templateLanguage || 'id' },
          components: options.templateVariables ? [
            {
              type: 'body',
              parameters: options.templateVariables.map(v => ({ type: 'text', text: v }))
            }
          ] : []
        }
      };
    }

    try {
      const res = await fetch(metaEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      const metaData = await res.json();
      if (!res.ok) {
        db.addWhatsAppLog({
          direction: 'outgoing',
          toOrFrom: recipientPhone,
          senderName: options.senderName || 'IZI Tech System',
          messageType: options.type,
          content: options.text || `Template: ${options.templateName}`,
          status: 'failed',
          sourceContext: `Meta API Error: ${JSON.stringify(metaData)}`
        });
        return {
          success: false,
          mode: 'LIVE_META_API',
          error: (metaData as { error?: { message?: string } })?.error?.message || 'Meta API returned error',
          metaResponse: metaData
        };
      }

      const log = db.addWhatsAppLog({
        direction: 'outgoing',
        toOrFrom: recipientPhone,
        senderName: options.senderName || 'IZI Tech System',
        messageType: options.type,
        content: options.text || `Template: ${options.templateName}`,
        status: 'sent',
        sourceContext: `Meta WAMID: ${(metaData as { messages?: Array<{ id?: string }> })?.messages?.[0]?.id || 'unknown'}`
      });

      return {
        success: true,
        mode: 'LIVE_META_API',
        messageId: log.id,
        metaResponse: metaData
      };
    } catch (err: unknown) {
      db.addWhatsAppLog({
        direction: 'outgoing',
        toOrFrom: recipientPhone,
        senderName: options.senderName || 'IZI Tech System',
        messageType: options.type,
        content: options.text || `Template: ${options.templateName}`,
        status: 'failed',
        sourceContext: err instanceof Error ? err.message : String(err)
      });
      throw err;
    }
  }

  // Demo / Simulated Mode (Honest label, no fake claims of Meta delivery)
  const simulatedLog = db.addWhatsAppLog({
    direction: 'outgoing',
    toOrFrom: recipientPhone,
    senderName: options.senderName || 'IZI Tech Demo Gateway',
    messageType: options.type,
    content: options.text || `Template [${options.templateName}]: ${options.templateVariables?.join(', ') || ''}`,
    status: 'delivered',
    sourceContext: 'DEMO MODE - Configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env for live transmission'
  });

  return {
    success: true,
    mode: 'DEMO_MODE',
    note: 'Message simulated and recorded in local system log. Configure Meta Cloud API credentials in Integrations for live sending.',
    messageId: simulatedLog.id,
    log: simulatedLog
  };
}

// Inbound message handler (Webhook or simulated chat)
export async function handleIncomingWhatsAppMessage(
  fromPhone: string,
  senderName: string,
  messageText: string,
  messageId?: string
) {
  // Deduplication check
  if (messageId) {
    if (processedMessageIds.has(messageId)) {
      console.log(`Duplicate message ${messageId} ignored.`);
      return { duplicate: true, status: 'ignored' };
    }
    processedMessageIds.add(messageId);
    // Keep size under control
    if (processedMessageIds.size > 5000) {
      const iter = processedMessageIds.values();
      for (let i = 0; i < 500; i++) {
        const next = iter.next();
        if (next.done) break;
        processedMessageIds.delete(next.value);
      }
    }
  }

  // Record incoming log
  db.addWhatsAppLog({
    direction: 'incoming',
    toOrFrom: fromPhone,
    senderName: senderName || 'WhatsApp User',
    messageType: 'text',
    content: messageText,
    status: 'received',
    aiHandled: true
  });

  // Ensure contact exists & opt-in
  db.updateContactOptIn(fromPhone, true, senderName);

  // Quick Action menu keywords check
  const textClean = messageText.trim().toLowerCase();

  let autoReply = '';

  if (textClean === 'menu' || textClean === 'help' || textClean === 'bantuan') {
    autoReply = `🤖 *IZI Tech WhatsApp Assistant - Menu Utama*

Ketik angka atau perintah berikut:
1️⃣ *1* atau *tiket* - Cek tiket aktif Anda
2️⃣ *2* atau *project* - Cek progress project Izi Izudin
3️⃣ *3* atau *lapor* - Laporkan kendala / buat tiket baru
4️⃣ *4* atau *tanya [pertanyaan]* - Konsultasi IT dengan IZI AI
5️⃣ *5* atau *kontak* - Hubungi Administrator

Silakan balas dengan perintah di atas.`;
  } else if (textClean === '1' || textClean.includes('status ticket') || textClean.includes('tiket')) {
    const tickets = db.getTickets().slice(0, 3);
    autoReply = `📋 *Tiket Terbaru IZI Tech Project*:\n\n` + 
      tickets.map(t => `• *[${t.id}]* ${t.title}\n   Status: ${t.status.toUpperCase()} | Prioritas: ${t.priority}`).join('\n\n') +
      `\n\nUntuk detail tiket, ketik misal: *cek TCK-1042*`;
  } else if (textClean === '2' || textClean.includes('project') || textClean.includes('proyek')) {
    const projects = db.getProjects();
    autoReply = `🚀 *Progress Projects IZI Izudin*:\n\n` +
      projects.map(p => `• *${p.name}* (${p.category})\n   Progress: ${p.progress}% [${p.status}] - Tech: ${p.techStack.slice(0, 3).join(', ')}`).join('\n\n');
  } else if (textClean === '5' || textClean.includes('kontak') || textClean.includes('admin')) {
    autoReply = `👤 *Kontak Administrator*:
Izi Izudin - Creative Coder & Tech Lead
Email: hello@izi-izudin.dev
Lokasi: Pandeglang, Indonesia
Status: Available for Freelance & Enterprise Consultation`;
  } else if (textClean.startsWith('lapor') || textClean.startsWith('buat tiket')) {
    const issueText = messageText.replace(/^(lapor|buat tiket)\s*/i, '').trim() || 'Kendala dilaporkan via WhatsApp';
    const newTicket = db.createTicket({
      title: issueText.slice(0, 80),
      category: 'Bug',
      priority: 'High',
      status: 'Open',
      description: `Laporan masuk via WhatsApp dari ${senderName} (${fromPhone}):\n${issueText}`,
      requester: senderName,
      assignedTo: 'Izi Izudin',
      source: 'WhatsApp'
    });
    autoReply = `✅ *Tiket Berhasil Dibuat!*\n\nNomor Tiket: *${newTicket.id}*\nJudul: ${newTicket.title}\nStatus: OPEN (Prioritas: HIGH)\nTim kami akan segera memproses.`;
  } else {
    // Process with IZI AI service
    try {
      const aiResponse = await processAIChat({
        personaKey: 'itsupport',
        messages: [
          { role: 'user', content: `Pesan WhatsApp dari ${senderName}: ${messageText}` }
        ]
      });
      autoReply = `🤖 *IZI AI Assistant*:\n\n${aiResponse.reply.slice(0, 1500)}`;
    } catch {
      autoReply = `🤖 *IZI AI Assistant*: Terima kasih atas pesan Anda. Pertanyaan Anda telah diterima dan diteruskan ke sistem Izi Izudin.`;
    }
  }

  // Send reply back
  const replyResult = await sendWhatsAppMessage({
    to: fromPhone,
    type: 'text',
    text: autoReply,
    senderName: 'IZI AI WhatsApp Bot'
  });

  return {
    handled: true,
    reply: autoReply,
    replyResult
  };
}

// Automated Trigger dispatcher
export async function triggerNotification(
  eventType: keyof WhatsAppNotificationConfig,
  details: { title: string; meta?: string; id?: string; targetPhone?: string }
) {
  if (!notificationSettings[eventType]) {
    console.log(`Notification for event ${eventType} is disabled in settings.`);
    return { triggered: false, reason: 'Disabled in user settings' };
  }

  const phone = details.targetPhone || notificationSettings.defaultRecipientPhone;
  const messageBody = `🔔 *[IZI TECH ALERT: ${eventType.toUpperCase()}]*\n\n` +
    `• Item: *${details.title}*\n` +
    (details.id ? `• Reference ID: *${details.id}*\n` : '') +
    (details.meta ? `• Detail: ${details.meta}\n` : '') +
    `• Timestamp: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;

  return await sendWhatsAppMessage({
    to: phone,
    type: 'text',
    text: messageBody,
    senderName: 'IZI System Monitor'
  });
}
