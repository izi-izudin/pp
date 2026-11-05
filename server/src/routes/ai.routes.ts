import { Router } from 'express';
import { processAIChat, ASSISTANT_PERSONAS } from '../services/ai.service.js';
import { config } from '../config/index.js';

const router = Router();

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { personaKey, messages, projectContextId, libraryContextId, provider, model } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = await processAIChat({
      personaKey: personaKey || 'programming',
      messages,
      projectContextId,
      libraryContextId,
      provider,
      model
    });

    res.json({ success: true, ...result });
  } catch (err: unknown) {
    console.error('Error in /api/ai/chat:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process AI chat request',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// GET /api/ai/providers
router.get('/providers', (_req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || config.geminiApiKey);

  const providers = [
    {
      id: 'gemini',
      name: 'Google Gemini API',
      connectionStatus: hasGeminiKey ? 'Connected' : 'Demo Mode (Key required in Secrets)',
      defaultModel: 'gemini-3.8-flash',
      availableModels: ['gemini-3.8-flash', 'gemini-3.1-flash-lite'],
      tokenLimit: 1048576,
      defaultTemperature: 0.7,
      isActive: true,
      requiresSecret: 'GEMINI_API_KEY'
    },
    {
      id: 'openai',
      name: 'OpenAI API',
      connectionStatus: process.env.OPENAI_API_KEY ? 'Connected' : 'Not Connected',
      defaultModel: 'gpt-4o',
      availableModels: ['gpt-4o', 'gpt-4o-mini', 'o1-mini'],
      tokenLimit: 128000,
      defaultTemperature: 0.7,
      isActive: Boolean(process.env.OPENAI_API_KEY),
      requiresSecret: 'OPENAI_API_KEY'
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude API',
      connectionStatus: process.env.ANTHROPIC_API_KEY ? 'Connected' : 'Not Connected',
      defaultModel: 'claude-3-5-sonnet-20241022',
      availableModels: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
      tokenLimit: 200000,
      defaultTemperature: 0.7,
      isActive: Boolean(process.env.ANTHROPIC_API_KEY),
      requiresSecret: 'ANTHROPIC_API_KEY'
    },
    {
      id: 'local_llm',
      name: 'Local LLM / OpenAI Compatible',
      connectionStatus: 'Demo Mode (http://localhost:11434)',
      defaultModel: 'llama3:8b',
      availableModels: ['llama3:8b', 'mistral:7b', 'deepseek-coder:6.7b'],
      tokenLimit: 32768,
      defaultTemperature: 0.6,
      isActive: false,
      baseUrl: 'http://localhost:11434/v1'
    }
  ];

  res.json({ success: true, providers });
});

// GET /api/ai/personas
router.get('/personas', (_req, res) => {
  const personas = Object.entries(ASSISTANT_PERSONAS).map(([key, val]) => ({
    key,
    title: val.title,
    category: val.category,
    description: val.description
  }));
  res.json({ success: true, personas });
});

export default router;
