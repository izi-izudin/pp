import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    appSecret: process.env.WHATSAPP_APP_SECRET || '',
    verifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'izi_tech_verify_token_secure',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
    metaApiBaseUrl: 'https://graph.facebook.com'
  },
  apiPlayground: {
    requestTimeoutMs: 12000,
    maxResponseSizeBytes: 1024 * 1024 * 2, // 2MB
    allowedDomains: (process.env.ALLOWED_API_DOMAINS || 'jsonplaceholder.typicode.com,httpbin.org,api.github.com,dummyjson.com,pokeapi.co,reqres.in')
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean)
  }
};
