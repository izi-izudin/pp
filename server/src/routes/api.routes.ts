import { Router } from 'express';
import { executeProxiedRequest } from '../services/apiPlayground.service.js';
import { db } from '../services/db.service.js';
import { config } from '../config/index.js';

const router = Router();

// POST /api/api-playground/request
router.post('/request', async (req, res) => {
  try {
    const { method, url, headers, params, body, authType, authConfig } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: url'
      });
    }

    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    const chosenMethod = (method || 'GET').toUpperCase();
    if (!validMethods.includes(chosenMethod)) {
      return res.status(400).json({
        success: false,
        error: `Invalid HTTP Method: ${chosenMethod}. Allowed: ${validMethods.join(', ')}`
      });
    }

    const result = await executeProxiedRequest({
      method: chosenMethod as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      url,
      headers,
      params,
      body,
      authType,
      authConfig
    });

    res.json(result);
  } catch (err: unknown) {
    console.error('Playground proxy error:', err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      statusText: 'Internal Proxy Error',
      responseTimeMs: 0,
      responseSizeBytes: 0,
      headers: {},
      data: null,
      rawText: '',
      isJson: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// GET /api/api-playground/collections
router.get('/collections', (_req, res) => {
  res.json({
    success: true,
    collections: db.getCollections()
  });
});

// POST /api/api-playground/collections
router.post('/collections', (req, res) => {
  const collection = req.body;
  if (!collection || !collection.name) {
    return res.status(400).json({ error: 'Collection name is required' });
  }

  const saved = db.saveCollection({
    id: collection.id || `col-${Date.now()}`,
    name: collection.name,
    project: collection.project || 'General',
    description: collection.description || '',
    requests: collection.requests || []
  });

  res.json({ success: true, collection: saved });
});

// DELETE /api/api-playground/collections/:id
router.delete('/collections/:id', (req, res) => {
  db.deleteCollection(req.params.id);
  res.json({ success: true, message: 'Collection deleted successfully' });
});

// GET /api/api-playground/docs
router.get('/docs', (_req, res) => {
  const documentation = [
    {
      name: 'AI Chat Endpoint',
      baseUrl: config.appUrl,
      endpoint: '/api/ai/chat',
      method: 'POST',
      authentication: 'None (Proxied via backend session / Gemini API Key)',
      parameters: [
        { name: 'personaKey', type: 'string', required: true, description: 'One of: programming, network, database, cybersecurity, linux, windows, itsupport, datascience, uiux, prompteng' },
        { name: 'messages', type: 'Array<{role: string, content: string}>', required: true, description: 'Conversation turn history' },
        { name: 'projectContextId', type: 'string', required: false, description: 'Optional project ID to inject context' },
        { name: 'libraryContextId', type: 'string', required: false, description: 'Optional IT Library article ID to inject' }
      ],
      body: JSON.stringify({
        personaKey: 'programming',
        messages: [{ role: 'user', content: 'Explain React 19 server actions vs client hooks' }]
      }, null, 2),
      responseExample: JSON.stringify({
        success: true,
        reply: "React 19 Server Actions allow defining asynchronous code...",
        provider: "Google Gemini API",
        model: "gemini-3.8-flash",
        status: "Connected (Live)"
      }, null, 2),
      errorHandling: 'Returns 400 for missing messages array, 500 with descriptive error message if generation fails.'
    },
    {
      name: 'API Playground Request Proxy',
      baseUrl: config.appUrl,
      endpoint: '/api/api-playground/request',
      method: 'POST',
      authentication: 'Optional Bearer/Basic/APIKey passed in request payload',
      parameters: [
        { name: 'method', type: 'string', required: true, description: 'GET, POST, PUT, PATCH, DELETE' },
        { name: 'url', type: 'string', required: true, description: 'Target destination URL (SSRF validated)' },
        { name: 'headers', type: 'Record<string, string>', required: false, description: 'Key-value custom headers' },
        { name: 'params', type: 'Record<string, string>', required: false, description: 'Query parameters' },
        { name: 'body', type: 'string', required: false, description: 'JSON payload string for POST/PUT/PATCH' }
      ],
      body: JSON.stringify({
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/todos/1",
        headers: { "Accept": "application/json" }
      }, null, 2),
      responseExample: JSON.stringify({
        success: true,
        statusCode: 200,
        statusText: "OK",
        responseTimeMs: 84,
        responseSizeBytes: 83,
        data: { userId: 1, id: 1, title: "delectus aut autem", completed: false }
      }, null, 2),
      errorHandling: 'Returns 403 Forbidden for internal IP addresses, localhosts, and cloud metadata (SSRF defense).'
    },
    {
      name: 'Send WhatsApp Message',
      baseUrl: config.appUrl,
      endpoint: '/api/whatsapp/send',
      method: 'POST',
      authentication: 'Backend Meta Bearer Token',
      parameters: [
        { name: 'to', type: 'string', required: true, description: 'Recipient phone number with country code (+62...)' },
        { name: 'type', type: 'string', required: true, description: '"text" or "template"' },
        { name: 'text', type: 'string', required: false, description: 'Text message content (within 24-hr customer service window)' },
        { name: 'templateName', type: 'string', required: false, description: 'Meta approved template name' }
      ],
      body: JSON.stringify({
        to: "+6281234567890",
        type: "text",
        text: "Halo! Tiket TCK-1042 sedang diproses oleh Izi Izudin."
      }, null, 2),
      responseExample: JSON.stringify({
        success: true,
        mode: "DEMO_MODE",
        note: "Message simulated and recorded in local system log. Configure Meta Cloud API credentials in Integrations for live sending.",
        messageId: "wa-msg-1730784912"
      }, null, 2),
      errorHandling: 'Returns 400 for invalid phone numbers or opted-out contacts.'
    },
    {
      name: 'Meta WhatsApp Webhook Endpoint',
      baseUrl: config.appUrl,
      endpoint: '/api/whatsapp/webhook',
      method: 'GET & POST',
      authentication: 'GET: hub.verify_token | POST: X-Hub-Signature-256 HMAC',
      parameters: [
        { name: 'hub.mode', type: 'string', required: true, description: 'Must be "subscribe"' },
        { name: 'hub.verify_token', type: 'string', required: true, description: 'Matches WHATSAPP_WEBHOOK_VERIFY_TOKEN' },
        { name: 'hub.challenge', type: 'string', required: true, description: 'Challenge integer returned by server' }
      ],
      body: 'Standard Meta WhatsApp Business Webhook JSON Payload',
      responseExample: 'hub.challenge string for GET, {"status": "EVENT_RECEIVED"} for POST',
      errorHandling: 'Returns 403 if verify token does not match.'
    }
  ];

  res.json({ success: true, documentation });
});

export default router;
