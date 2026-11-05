import { validateSafeUrl } from '../middleware/security.js';
import { config } from '../config/index.js';

export interface ExecuteApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
  authType?: 'none' | 'bearer' | 'basic' | 'apikey';
  authConfig?: {
    token?: string;
    username?: string;
    password?: string;
    key?: string;
    value?: string;
  };
}

export interface ApiExecutionResult {
  success: boolean;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  responseSizeBytes: number;
  headers: Record<string, string>;
  data: unknown;
  rawText: string;
  isJson: boolean;
  error?: string;
  securityNotice?: string;
}

export async function executeProxiedRequest(options: ExecuteApiRequestOptions): Promise<ApiExecutionResult> {
  const startTime = Date.now();

  // If URL starts with relative /api, resolve to local server
  let fullUrl = options.url.trim();
  if (fullUrl.startsWith('/')) {
    fullUrl = `http://localhost:${config.port}${fullUrl}`;
  }

  // Validate URL & SSRF
  const validation = validateSafeUrl(fullUrl, config.apiPlayground.allowedDomains);
  if (!validation.safe) {
    return {
      success: false,
      statusCode: 403,
      statusText: 'Forbidden - Security Policy',
      responseTimeMs: Date.now() - startTime,
      responseSizeBytes: 0,
      headers: {},
      data: null,
      rawText: '',
      isJson: false,
      error: validation.reason || 'URL violates security policy.'
    };
  }

  // Construct query params
  const urlObj = new URL(fullUrl);
  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (key && val !== undefined) {
        urlObj.searchParams.set(key, String(val));
      }
    });
  }

  // Prepare outgoing headers
  const outgoingHeaders: Record<string, string> = {
    'User-Agent': 'IZI-Tech-API-Center/2.0 (SSRF-Protected-Client)',
    'Accept': 'application/json, text/plain, */*'
  };

  if (options.headers) {
    Object.entries(options.headers).forEach(([k, v]) => {
      // Do not allow overriding dangerous hop-by-hop headers
      const lower = k.toLowerCase();
      if (!['host', 'connection', 'transfer-encoding', 'content-length'].includes(lower)) {
        outgoingHeaders[k] = v;
      }
    });
  }

  // Handle Authentication
  if (options.authType === 'bearer' && options.authConfig?.token) {
    outgoingHeaders['Authorization'] = `Bearer ${options.authConfig.token}`;
  } else if (options.authType === 'basic' && (options.authConfig?.username || options.authConfig?.password)) {
    const creds = Buffer.from(`${options.authConfig.username || ''}:${options.authConfig.password || ''}`).toString('base64');
    outgoingHeaders['Authorization'] = `Basic ${creds}`;
  } else if (options.authType === 'apikey' && options.authConfig?.key && options.authConfig?.value) {
    outgoingHeaders[options.authConfig.key] = options.authConfig.value;
  }

  // Abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.apiPlayground.requestTimeoutMs);

  try {
    const fetchOptions: RequestInit = {
      method: options.method,
      headers: outgoingHeaders,
      signal: controller.signal
    };

    if (['POST', 'PUT', 'PATCH'].includes(options.method) && options.body) {
      fetchOptions.body = options.body;
      if (!outgoingHeaders['Content-Type'] && !outgoingHeaders['content-type']) {
        outgoingHeaders['Content-Type'] = 'application/json';
      }
    }

    const res = await fetch(urlObj.toString(), fetchOptions);
    clearTimeout(timeoutId);

    const responseTimeMs = Date.now() - startTime;
    const resHeaders: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      resHeaders[key] = val;
    });

    const rawText = await res.text();
    const responseSizeBytes = Buffer.byteLength(rawText, 'utf8');

    // Check size limit
    if (responseSizeBytes > config.apiPlayground.maxResponseSizeBytes) {
      return {
        success: false,
        statusCode: 413,
        statusText: 'Payload Too Large',
        responseTimeMs,
        responseSizeBytes,
        headers: resHeaders,
        data: null,
        rawText: rawText.slice(0, 1000) + '... [TRUNCATED DUE TO SIZE LIMIT]',
        isJson: false,
        error: `Response size exceeds limit (${(config.apiPlayground.maxResponseSizeBytes / 1024 / 1024).toFixed(1)}MB).`
      };
    }

    let parsedJson: unknown = null;
    let isJson = false;
    try {
      parsedJson = JSON.parse(rawText);
      isJson = true;
    } catch {
      isJson = false;
    }

    return {
      success: res.ok,
      statusCode: res.status,
      statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
      responseTimeMs,
      responseSizeBytes,
      headers: resHeaders,
      data: isJson ? parsedJson : rawText,
      rawText,
      isJson,
      securityNotice: 'Request safely routed through IZI SSRF-Protected Proxy Gateway.'
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const isTimeout = err instanceof Error && err.name === 'AbortError';

    return {
      success: false,
      statusCode: isTimeout ? 504 : 502,
      statusText: isTimeout ? 'Gateway Timeout' : 'Bad Gateway',
      responseTimeMs: duration,
      responseSizeBytes: 0,
      headers: {},
      data: null,
      rawText: '',
      isJson: false,
      error: isTimeout
        ? `Request timed out after ${config.apiPlayground.requestTimeoutMs}ms`
        : `Network request failed: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}
