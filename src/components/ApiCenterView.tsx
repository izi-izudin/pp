import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Trash2, 
  Save, 
  Copy, 
  Check, 
  FolderPlus, 
  Download, 
  Upload, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Code, 
  Plus, 
  Minus, 
  Search,
  ExternalLink,
  Layers,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import type { ApiCollection, ApiSavedRequest, ApiResponseData } from '../types.js';

export const ApiCenterView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'playground' | 'collections' | 'docs' | 'security'>('playground');

  // Playground state
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users/1');
  const [activeReqTab, setActiveReqTab] = useState<'params' | 'headers' | 'auth' | 'body'>('params');
  
  // Params
  const [params, setParams] = useState<{ id: string; key: string; value: string; enabled: boolean }[]>([
    { id: 'p1', key: '', value: '', enabled: true }
  ]);

  // Headers
  const [headers, setHeaders] = useState<{ id: string; key: string; value: string; enabled: boolean }[]>([
    { id: 'h1', key: 'Accept', value: 'application/json', enabled: true },
    { id: 'h2', key: 'User-Agent', value: 'IZI-Tech-Playground/2.0', enabled: true }
  ]);

  // Auth
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic' | 'apikey'>('none');
  const [bearerToken, setBearerToken] = useState('');
  const [basicUser, setBasicUser] = useState('');
  const [basicPass, setBasicPass] = useState('');
  const [apiKeyName, setApiKeyName] = useState('X-API-Key');
  const [apiKeyValue, setApiKeyValue] = useState('');

  // Body
  const [bodyType, setBodyType] = useState<'none' | 'json'>('none');
  const [jsonBody, setJsonBody] = useState('{\n  "name": "Izi Izudin",\n  "project": "Quantum Dashboard",\n  "status": "active"\n}');

  // Response state
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponseData | null>(null);
  const [responseTab, setResponseTab] = useState<'json' | 'raw' | 'headers'>('json');
  const [copied, setCopied] = useState(false);

  // Collections state
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveReqName, setSaveReqName] = useState('');
  const [saveColId, setSaveColId] = useState('');
  const [newColName, setNewColName] = useState('');
  const [newColProject, setNewColProject] = useState('General');

  // Docs state
  const [docsList, setDocsList] = useState<any[]>([]);

  // Abort controller reference for Cancel Request
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch collections & docs on mount
  useEffect(() => {
    fetchCollections();
    fetchDocs();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/api-playground/collections');
      const data = await res.json();
      if (data.success && data.collections) {
        setCollections(data.collections);
        if (data.collections.length > 0 && !selectedCollectionId) {
          setSelectedCollectionId(data.collections[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch collections:', e);
    }
  };

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/api-playground/docs');
      const data = await res.json();
      if (data.success && data.documentation) {
        setDocsList(data.documentation);
      }
    } catch (e) {
      console.warn('Failed to fetch docs:', e);
    }
  };

  // Execute Request via SSRF-safe backend proxy
  const handleSendRequest = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResponse(null);
    abortControllerRef.current = new AbortController();

    // Build params dict
    const paramDict: Record<string, string> = {};
    params.forEach(p => {
      if (p.enabled && p.key.trim()) {
        paramDict[p.key.trim()] = p.value;
      }
    });

    // Build headers dict
    const headerDict: Record<string, string> = {};
    headers.forEach(h => {
      if (h.enabled && h.key.trim()) {
        headerDict[h.key.trim()] = h.value;
      }
    });

    // Auth config
    const authConfig: Record<string, string> = {};
    if (authType === 'bearer') authConfig.token = bearerToken;
    if (authType === 'basic') {
      authConfig.username = basicUser;
      authConfig.password = basicPass;
    }
    if (authType === 'apikey') {
      authConfig.key = apiKeyName;
      authConfig.value = apiKeyValue;
    }

    try {
      const res = await fetch('/api/api-playground/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url,
          params: paramDict,
          headers: headerDict,
          body: bodyType === 'json' ? jsonBody : undefined,
          authType,
          authConfig
        }),
        signal: abortControllerRef.current.signal
      });

      const data: ApiResponseData = await res.json();
      setResponse(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setResponse({
          success: false,
          statusCode: 499,
          statusText: 'Client Cancelled Request',
          responseTimeMs: 0,
          responseSizeBytes: 0,
          headers: {},
          data: null,
          rawText: '',
          isJson: false,
          error: 'Request was cancelled by user.'
        });
      } else {
        setResponse({
          success: false,
          statusCode: 500,
          statusText: 'Connection Error',
          responseTimeMs: 0,
          responseSizeBytes: 0,
          headers: {},
          data: null,
          rawText: '',
          isJson: false,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleClear = () => {
    setUrl('');
    setParams([{ id: 'p1', key: '', value: '', enabled: true }]);
    setHeaders([{ id: 'h1', key: 'Accept', value: 'application/json', enabled: true }]);
    setJsonBody('{}');
    setResponse(null);
  };

  const handleCopyResponse = () => {
    if (!response) return;
    const text = response.isJson ? JSON.stringify(response.data, null, 2) : response.rawText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Load saved request into playground
  const handleLoadRequest = (req: ApiSavedRequest) => {
    setMethod(req.method);
    setUrl(req.url);
    setHeaders(req.headers.map((h, i) => ({ ...h, id: `h-${i}` })));
    setParams(req.params.map((p, i) => ({ ...p, id: `p-${i}` })));
    setBodyType(req.bodyType);
    setJsonBody(req.jsonBody || '{}');
    setAuthType(req.authType);
    if (req.authConfig) {
      setBearerToken(req.authConfig.token || '');
      setBasicUser(req.authConfig.username || '');
      setBasicPass(req.authConfig.password || '');
      setApiKeyName(req.authConfig.key || 'X-API-Key');
      setApiKeyValue(req.authConfig.value || '');
    }
    setActiveSubTab('playground');
  };

  // Save current request to collection
  const handleSaveToCollection = async () => {
    if (!saveReqName.trim()) return;
    let targetCol = collections.find(c => c.id === saveColId);

    const newRequest: ApiSavedRequest = {
      id: `req-${Date.now()}`,
      name: saveReqName.trim(),
      method,
      url,
      headers: headers.filter(h => h.key.trim() !== ''),
      params: params.filter(p => p.key.trim() !== ''),
      bodyType,
      jsonBody,
      authType,
      authConfig: {
        token: bearerToken,
        username: basicUser,
        password: basicPass,
        key: apiKeyName,
        value: apiKeyValue
      }
    };

    if (targetCol) {
      targetCol.requests.push(newRequest);
    } else {
      // Create new collection
      targetCol = {
        id: `col-${Date.now()}`,
        name: newColName.trim() || 'My Collection',
        project: newColProject.trim() || 'General',
        description: 'User created API collection',
        requests: [newRequest]
      };
    }

    try {
      await fetch('/api/api-playground/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetCol)
      });
      fetchCollections();
      setShowSaveModal(false);
      setSaveReqName('');
    } catch (e) {
      console.warn('Failed to save collection:', e);
    }
  };

  // Export collection JSON
  const handleExportCollections = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(collections, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'izi_api_collections.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import collection JSON
  const handleImportCollections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        const list = Array.isArray(imported) ? imported : [imported];
        for (const col of list) {
          await fetch('/api/api-playground/collections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(col)
          });
        }
        fetchCollections();
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Sub-navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            MODULE 1 // API CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            API PLAYGROUND &amp; DOCUMENTATION
          </h1>
          <p className="text-slate-400 text-xs">
            Test, inspect, organize collections, and document APIs with SSRF defense and rate-limiting.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090d29] border border-[#1d2757]">
          <button
            onClick={() => setActiveSubTab('playground')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              activeSubTab === 'playground'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveSubTab('collections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              activeSubTab === 'collections'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Collections ({collections.reduce((acc, c) => acc + c.requests.length, 0)})
          </button>
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              activeSubTab === 'docs'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Documentation
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Security Policy
          </button>
        </div>
      </div>

      {/* VIEW 1: PLAYGROUND */}
      {activeSubTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Request Builder */}
          <div className="lg:col-span-7 space-y-4">
            {/* URL & Method Bar */}
            <div className="p-4 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Method Dropdown */}
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold border transition ${
                    method === 'GET'
                      ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40'
                      : method === 'POST'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                      : method === 'PUT'
                      ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                      : method === 'PATCH'
                      ? 'bg-purple-950/80 text-purple-400 border-purple-500/40'
                      : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                  }`}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>

                {/* URL Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/v1/resource or /api/tickets"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c1236] border border-[#212d64] text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {loading ? (
                    <button
                      onClick={handleCancelRequest}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600 text-rose-300 font-mono text-xs font-bold transition cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-rose-400" />
                      <span>Cancel</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSendRequest}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:opacity-95 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Send</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Utility Row */}
              <div className="flex items-center justify-between pt-2 border-t border-[#141b40] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#10173e] hover:bg-[#182358] text-slate-300 hover:text-white border border-[#222f6c] transition cursor-pointer"
                  >
                    <Save className="w-3 h-3 text-cyan-400" />
                    <span>Save Request</span>
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#10173e] hover:bg-[#182358] text-slate-400 hover:text-rose-400 border border-[#222f6c] transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-cyan-400" /> SSRF Firewall Active
                </span>
              </div>
            </div>

            {/* Request Config Tabs */}
            <div className="p-4 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#182352] pb-2 font-mono text-xs">
                <button
                  onClick={() => setActiveReqTab('params')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    activeReqTab === 'params'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Params ({params.filter(p => p.key).length})
                </button>
                <button
                  onClick={() => setActiveReqTab('headers')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    activeReqTab === 'headers'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Headers ({headers.filter(h => h.key).length})
                </button>
                <button
                  onClick={() => setActiveReqTab('auth')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    activeReqTab === 'auth'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Authorization ({authType.toUpperCase()})
                </button>
                <button
                  onClick={() => setActiveReqTab('body')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    activeReqTab === 'body'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Body ({bodyType.toUpperCase()})
                </button>
              </div>

              {/* Params Tab */}
              {activeReqTab === 'params' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 mb-2">Query Parameters</div>
                  {params.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={p.enabled}
                        onChange={(e) => {
                          const copy = [...params];
                          copy[idx].enabled = e.target.checked;
                          setParams(copy);
                        }}
                        className="rounded border-[#29366f] bg-[#0c1236] text-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Key"
                        value={p.key}
                        onChange={(e) => {
                          const copy = [...params];
                          copy[idx].key = e.target.value;
                          setParams(copy);
                        }}
                        className="w-1/3 px-3 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={p.value}
                        onChange={(e) => {
                          const copy = [...params];
                          copy[idx].value = e.target.value;
                          setParams(copy);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => {
                          if (params.length > 1) {
                            setParams(params.filter((_, i) => i !== idx));
                          }
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setParams([...params, { id: `p-${Date.now()}`, key: '', value: '', enabled: true }])}
                    className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 pt-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Parameter</span>
                  </button>
                </div>
              )}

              {/* Headers Tab */}
              {activeReqTab === 'headers' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 mb-2">Request Headers</div>
                  {headers.map((h, idx) => (
                    <div key={h.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={h.enabled}
                        onChange={(e) => {
                          const copy = [...headers];
                          copy[idx].enabled = e.target.checked;
                          setHeaders(copy);
                        }}
                        className="rounded border-[#29366f] bg-[#0c1236] text-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Header Key (e.g. Content-Type)"
                        value={h.key}
                        onChange={(e) => {
                          const copy = [...headers];
                          copy[idx].key = e.target.value;
                          setHeaders(copy);
                        }}
                        className="w-1/3 px-3 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. application/json)"
                        value={h.value}
                        onChange={(e) => {
                          const copy = [...headers];
                          copy[idx].value = e.target.value;
                          setHeaders(copy);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => {
                          if (headers.length > 1) {
                            setHeaders(headers.filter((_, i) => i !== idx));
                          }
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setHeaders([...headers, { id: `h-${Date.now()}`, key: '', value: '', enabled: true }])}
                    className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 pt-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Header</span>
                  </button>
                </div>
              )}

              {/* Authorization Tab */}
              {activeReqTab === 'auth' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400">Type:</span>
                    {(['none', 'bearer', 'basic', 'apikey'] as const).map((t) => (
                      <label key={t} className="flex items-center gap-1.5 text-xs font-mono text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="authType"
                          value={t}
                          checked={authType === t}
                          onChange={() => setAuthType(t)}
                          className="text-cyan-500"
                        />
                        <span className="capitalize">{t}</span>
                      </label>
                    ))}
                  </div>

                  {authType === 'bearer' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Bearer Token</label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={bearerToken}
                        onChange={(e) => setBearerToken(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs"
                      />
                      <p className="text-[10px] text-slate-500 font-mono">
                        Tokens are kept securely in memory for the proxy session and never logged.
                      </p>
                    </div>
                  )}

                  {authType === 'basic' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono text-slate-400">Username</label>
                        <input
                          type="text"
                          value={basicUser}
                          onChange={(e) => setBasicUser(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-slate-400">Password</label>
                        <input
                          type="password"
                          value={basicPass}
                          onChange={(e) => setBasicPass(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {authType === 'apikey' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono text-slate-400">Header Name</label>
                        <input
                          type="text"
                          value={apiKeyName}
                          onChange={(e) => setApiKeyName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono text-slate-400">API Key Value</label>
                        <input
                          type="password"
                          value={apiKeyValue}
                          onChange={(e) => setApiKeyValue(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0b102e] border border-[#1f2b60] text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Body Tab */}
              {activeReqTab === 'body' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="bodyType"
                          value="none"
                          checked={bodyType === 'none'}
                          onChange={() => setBodyType('none')}
                        />
                        <span>none</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="bodyType"
                          value="json"
                          checked={bodyType === 'json'}
                          onChange={() => setBodyType('json')}
                        />
                        <span className="text-cyan-400 font-semibold">JSON (application/json)</span>
                      </label>
                    </div>

                    {bodyType === 'json' && (
                      <button
                        onClick={() => {
                          try {
                            setJsonBody(JSON.stringify(JSON.parse(jsonBody), null, 2));
                          } catch {
                            alert('Invalid JSON syntax');
                          }
                        }}
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                      >
                        Beautify JSON
                      </button>
                    )}
                  </div>

                  {bodyType === 'json' && (
                    <textarea
                      rows={8}
                      value={jsonBody}
                      onChange={(e) => setJsonBody(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#050819] border border-[#1f2c66] text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    ></textarea>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Response Viewer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-col h-full min-h-[480px]">
              {/* Response Header Stats */}
              <div className="flex items-center justify-between border-b border-[#182352] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">RESPONSE</span>
                  {response && (
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        response.statusCode >= 200 && response.statusCode < 300
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : response.statusCode >= 400 && response.statusCode < 500
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : response.statusCode >= 500
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}
                    >
                      {response.statusCode} {response.statusText}
                    </span>
                  )}
                </div>

                {response && (
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {response.responseTimeMs} ms
                    </span>
                    <span>{(response.responseSizeBytes / 1024).toFixed(1)} KB</span>
                    <button
                      onClick={handleCopyResponse}
                      className="p-1 rounded bg-[#10173e] hover:text-white text-slate-400 transition"
                      title="Copy response"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Response View Tabs */}
              {response && (
                <div className="flex items-center gap-2 mb-3 text-xs font-mono">
                  <button
                    onClick={() => setResponseTab('json')}
                    className={`px-2.5 py-1 rounded transition ${
                      responseTab === 'json' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setResponseTab('raw')}
                    className={`px-2.5 py-1 rounded transition ${
                      responseTab === 'raw' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    Raw
                  </button>
                  <button
                    onClick={() => setResponseTab('headers')}
                    className={`px-2.5 py-1 rounded transition ${
                      responseTab === 'headers' ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    Headers ({Object.keys(response.headers).length})
                  </button>
                </div>
              )}

              {/* Response Body Area */}
              <div className="flex-1 rounded-xl bg-[#040614] border border-[#131b3e] p-3 overflow-auto max-h-[460px]">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-slate-400 text-xs font-mono">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                    <div>Sending request through safe gateway proxy...</div>
                  </div>
                ) : !response ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-slate-500 text-xs font-mono text-center space-y-2">
                    <Code className="w-8 h-8 text-slate-700 mx-auto" />
                    <div>No request sent yet.</div>
                    <div className="text-[11px] text-slate-600">
                      Configure your HTTP method, headers, and press Send.
                    </div>
                  </div>
                ) : (
                  <div className="font-mono text-xs">
                    {response.error && (
                      <div className="mb-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
                        <strong>Error:</strong> {response.error}
                      </div>
                    )}

                    {responseTab === 'json' && (
                      <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
                        {response.isJson ? JSON.stringify(response.data, null, 2) : response.rawText}
                      </pre>
                    )}

                    {responseTab === 'raw' && (
                      <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {response.rawText || 'Empty body'}
                      </pre>
                    )}

                    {responseTab === 'headers' && (
                      <div className="space-y-1">
                        {Object.entries(response.headers).map(([k, v]) => (
                          <div key={k} className="flex gap-2 text-[11px]">
                            <span className="text-purple-400 font-semibold">{k}:</span>
                            <span className="text-slate-300 break-all">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {response?.securityNotice && (
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-cyan-400" />
                  <span>{response.securityNotice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COLLECTIONS */}
      {activeSubTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-white">API COLLECTIONS</h2>
              <p className="text-xs text-slate-400">
                Organize endpoints into project-based suites. Export and share test scenarios.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1438] border border-[#202c66] text-xs font-mono text-slate-300 hover:text-white cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleImportCollections} className="hidden" />
              </label>

              <button
                onClick={handleExportCollections}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1438] border border-[#202c66] text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export All</span>
              </button>

              <button
                onClick={() => {
                  const name = prompt('Enter new Collection Name:');
                  if (name) {
                    const project = prompt('Enter Project Name:', 'Quantum Dashboard') || 'General';
                    fetch('/api/api-playground/collections', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, project, requests: [] })
                    }).then(() => fetchCollections());
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>New Collection</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div
                key={col.id}
                className="p-5 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      Project: {col.project}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete collection "${col.name}"?`)) {
                          fetch(`/api/api-playground/collections/${col.id}`, { method: 'DELETE' })
                            .then(() => fetchCollections());
                        }
                      }}
                      className="text-slate-500 hover:text-rose-400 text-xs font-mono"
                    >
                      Delete
                    </button>
                  </div>

                  <h3 className="text-base font-display font-bold text-white mb-1">
                    {col.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">{col.description}</p>

                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                      Requests ({col.requests.length})
                    </div>
                    {col.requests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => handleLoadRequest(req)}
                        className="p-2.5 rounded-lg bg-[#0b102e] border border-[#16204d] hover:border-cyan-500/40 flex items-center justify-between transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            req.method === 'GET' ? 'bg-cyan-950 text-cyan-400' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {req.method}
                          </span>
                          <span className="text-xs text-slate-300 group-hover:text-cyan-300 truncate font-mono">
                            {req.name}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#151c42] flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>ID: {col.id}</span>
                  <span className="text-cyan-400">Click request to test &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DOCUMENTATION */}
      {activeSubTab === 'docs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-2">
            <h2 className="text-xl font-display font-bold text-white">SYSTEM API SPECIFICATION</h2>
            <p className="text-xs text-slate-400">
              Interactive reference for IZI Tech Project server endpoints. Built for integration with external dashboards and microservices.
            </p>
          </div>

          <div className="space-y-4">
            {docsList.map((doc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#182352] pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                      doc.method.includes('POST')
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {doc.method}
                    </span>
                    <span className="text-sm font-mono font-bold text-white">{doc.endpoint}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Auth: {doc.authentication}</span>
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-white">API Name:</strong> {doc.name}
                </div>

                {/* Parameters */}
                {doc.parameters && doc.parameters.length > 0 && (
                  <div>
                    <div className="text-xs font-mono font-bold text-cyan-400 mb-2">Request Parameters</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs border border-[#172048]">
                        <thead className="bg-[#0b102e] text-slate-400">
                          <tr>
                            <th className="p-2 border-b border-[#172048]">Param</th>
                            <th className="p-2 border-b border-[#172048]">Type</th>
                            <th className="p-2 border-b border-[#172048]">Required</th>
                            <th className="p-2 border-b border-[#172048]">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#172048]">
                          {doc.parameters.map((p: any, pIdx: number) => (
                            <tr key={pIdx} className="hover:bg-[#0c1236]">
                              <td className="p-2 text-cyan-300 font-semibold">{p.name}</td>
                              <td className="p-2 text-purple-400">{p.type}</td>
                              <td className="p-2 text-slate-300">{p.required ? 'Yes' : 'Optional'}</td>
                              <td className="p-2 text-slate-400">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Request Body Example */}
                {doc.body && (
                  <div>
                    <div className="text-xs font-mono font-bold text-purple-400 mb-1">Request Body (JSON)</div>
                    <pre className="p-3 rounded-xl bg-[#040614] border border-[#141b40] font-mono text-xs text-slate-300 overflow-x-auto">
                      {doc.body}
                    </pre>
                  </div>
                )}

                {/* Response Example */}
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mb-1">Response Example</div>
                  <pre className="p-3 rounded-xl bg-[#040614] border border-[#141b40] font-mono text-xs text-emerald-300 overflow-x-auto">
                    {doc.responseExample}
                  </pre>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                  <span className="text-rose-400 font-semibold">Error Handling:</span> {doc.errorHandling}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: SECURITY POLICY */}
      {activeSubTab === 'security' && (
        <div className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">API SECURITY ARCHITECTURE</h2>
              <p className="text-xs text-slate-400">Zero-Trust &amp; SSRF Defense Standards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
              <div className="font-bold text-cyan-300 font-mono">1. SSRF Mitigation &amp; Loopback Protection</div>
              <p className="text-slate-400 leading-relaxed">
                The gateway strictly blocks outbound calls to internal IP ranges (127.0.0.1, localhost, 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12) and cloud instance metadata endpoints (169.254.169.254).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
              <div className="font-bold text-purple-300 font-mono">2. Zero Client Secret Exposure</div>
              <p className="text-slate-400 leading-relaxed">
                API keys and tokens are never stored in localStorage or exposed to the browser. All live provider keys are managed strictly on the server via environment variables.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
              <div className="font-bold text-pink-300 font-mono">3. Rate Limiting &amp; Payload Clamping</div>
              <p className="text-slate-400 leading-relaxed">
                Requests are limited to 120 calls per minute per IP. The maximum response payload size is capped at 2MB with a strict 12-second abort timeout.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
              <div className="font-bold text-emerald-300 font-mono">4. Honest Status &amp; Demo Mode Fallbacks</div>
              <p className="text-slate-400 leading-relaxed">
                If external APIs fail or are unreachable, the system transparently indicates failure or Demo Mode rather than masquerading fake 200 OK statuses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save to Collection Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0a0e2a] border border-cyan-500/40 shadow-2xl space-y-4">
            <h3 className="text-base font-display font-bold text-white">SAVE REQUEST TO COLLECTION</h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Request Name</label>
                <input
                  type="text"
                  value={saveReqName}
                  onChange={(e) => setSaveReqName(e.target.value)}
                  placeholder="e.g. Get User Profile"
                  className="w-full px-3 py-2 rounded-lg bg-[#0f153d] border border-[#232f66] text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Collection</label>
                <select
                  value={saveColId}
                  onChange={(e) => setSaveColId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0f153d] border border-[#232f66] text-white"
                >
                  <option value="">+ Create New Collection</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.project})</option>
                  ))}
                </select>
              </div>

              {!saveColId && (
                <>
                  <div>
                    <label className="text-slate-400 block mb-1">New Collection Name</label>
                    <input
                      type="text"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      placeholder="e.g. Payment Microservice"
                      className="w-full px-3 py-2 rounded-lg bg-[#0f153d] border border-[#232f66] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Project Tag</label>
                    <input
                      type="text"
                      value={newColProject}
                      onChange={(e) => setNewColProject(e.target.value)}
                      placeholder="e.g. Quantum Dashboard"
                      className="w-full px-3 py-2 rounded-lg bg-[#0f153d] border border-[#232f66] text-white"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-lg bg-[#141b44] hover:bg-[#1a2358] text-slate-300 font-mono text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToCollection}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-mono text-xs font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
