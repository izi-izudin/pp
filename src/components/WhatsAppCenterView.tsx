import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bell, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Smartphone, 
  Terminal, 
  Clock, 
  UserCheck, 
  Radio, 
  HelpCircle,
  Copy,
  Check,
  Zap,
  Play
} from 'lucide-react';
import type { WhatsAppLog, WhatsAppNotificationSettings } from '../types.js';

export const WhatsAppCenterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'send' | 'notifications' | 'bot-simulator' | 'settings'>('dashboard');

  // Dashboard status
  const [status, setStatus] = useState({
    connectionStatus: 'Demo Mode',
    businessPhoneNumber: '+62 812-3456-7890 (Izi Izudin Tech Business)',
    phoneNumberId: 'Demo ID: 104829103982',
    businessAccountId: 'Demo Account: 5938201948',
    apiVersion: 'v21.0',
    webhookUrl: 'https://ais-dev-peljnxiy7f6klksw3sl6xl-20976031313.asia-northeast1.run.app/api/whatsapp/webhook',
    stats: {
      totalMessages: 0,
      messagesSent: 0,
      messagesReceived: 0,
      failedMessages: 0,
      lastActivity: '-'
    },
    isLive: false
  });

  const [logs, setLogs] = useState<WhatsAppLog[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Send message form state
  const [recipientPhone, setRecipientPhone] = useState('+6281234567890');
  const [msgType, setMsgType] = useState<'text' | 'template'>('text');
  const [textBody, setTextBody] = useState('Halo dari IZI Tech Project! Sistem siap melayani integrasi dan konsultasi IT.');
  const [selectedTemplate, setSelectedTemplate] = useState('ticket_alert');
  const [templateVar1, setTemplateVar1] = useState('TCK-1042');
  const [templateVar2, setTemplateVar2] = useState('High latency on API Gateway');
  const [sendResult, setSendResult] = useState<any | null>(null);

  // Notification settings
  const [notifSettings, setNotifSettings] = useState<WhatsAppNotificationSettings>({
    newTicket: true,
    criticalTicket: true,
    resolvedTicket: true,
    projectDeadline: false,
    projectCompleted: true,
    systemAlert: true,
    apiError: true,
    defaultRecipientPhone: '+6281234567890'
  });

  // Simulator state
  const [simSenderPhone, setSimSenderPhone] = useState('+6281234567890');
  const [simSenderName, setSimSenderName] = useState('Izi Izudin (Lead)');
  const [simMessage, setSimMessage] = useState('menu');
  const [simLoading, setSimLoading] = useState(false);
  const [simHistory, setSimHistory] = useState<Array<{ sender: string; text: string; isBot: boolean }>>([
    { sender: 'System', text: 'Selamat datang di Simulator Interaktif Meta WhatsApp AI. Kirim pesan seperti "menu", "tiket", atau pertanyaan teknis apa pun.', isBot: true }
  ]);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statusRes, logsRes, contactsRes, notifRes] = await Promise.all([
        fetch('/api/whatsapp/status').then(r => r.json()),
        fetch('/api/whatsapp/logs').then(r => r.json()),
        fetch('/api/whatsapp/contacts').then(r => r.json()),
        fetch('/api/whatsapp/notifications/settings').then(r => r.json())
      ]);

      if (statusRes.success) setStatus(statusRes);
      if (logsRes.success) setLogs(logsRes.logs || []);
      if (contactsRes.success) setContacts(contactsRes.contacts || []);
      if (notifRes.success) setNotifSettings(notifRes.settings);
    } catch (e) {
      console.warn('Failed to fetch WhatsApp data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Send message action
  const handleSendMessage = async () => {
    setLoading(true);
    setSendResult(null);

    const payload: any = {
      to: recipientPhone,
      type: msgType,
      text: msgType === 'text' ? textBody : undefined,
      templateName: msgType === 'template' ? selectedTemplate : undefined,
      templateVariables: msgType === 'template' ? [templateVar1, templateVar2] : undefined
    };

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSendResult(data);
      fetchData();
    } catch (err: unknown) {
      setSendResult({
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle notification setting
  const handleToggleNotif = async (key: keyof WhatsAppNotificationSettings) => {
    const updated = {
      ...notifSettings,
      [key]: !notifSettings[key]
    };
    setNotifSettings(updated);

    try {
      await fetch('/api/whatsapp/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.warn('Failed to update notification settings:', e);
    }
  };

  // Trigger test alert
  const handleTriggerTestAlert = async (type: string) => {
    try {
      const res = await fetch('/api/whatsapp/notifications/trigger-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: type,
          title: `Automated Test Alert (${type})`,
          meta: 'Verified via WhatsApp Center interactive trigger'
        })
      });
      const data = await res.json();
      alert(`Notification test dispatched! Mode: ${data.result?.mode || 'Demo'}`);
      fetchData();
    } catch {
      alert('Failed to trigger alert.');
    }
  };

  // Simulate Inbound Webhook message
  const handleSimulateWebhook = async (presetText?: string) => {
    const messageToSend = presetText || simMessage;
    if (!messageToSend.trim() || simLoading) return;

    setSimLoading(true);
    const newChatEntry = { sender: simSenderName, text: messageToSend, isBot: false };
    setSimHistory(prev => [...prev, newChatEntry]);
    if (!presetText) setSimMessage('');

    try {
      const res = await fetch('/api/whatsapp/simulate-incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPhone: simSenderPhone,
          senderName: simSenderName,
          messageText: messageToSend
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setSimHistory(prev => [
          ...prev,
          { sender: 'IZI AI WhatsApp Bot', text: data.reply, isBot: true }
        ]);
      }
      fetchData();
    } catch (err: unknown) {
      setSimHistory(prev => [
        ...prev,
        { sender: 'System Error', text: `Failed to simulate webhook: ${err instanceof Error ? err.message : String(err)}`, isBot: true }
      ]);
    } finally {
      setSimLoading(false);
    }
  };

  // Copy webhook URL
  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(status.webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            MODULE 3 // WHATSAPP CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            META WHATSAPP CLOUD API PLATFORM
          </h1>
          <p className="text-slate-400 text-xs">
            Official Meta WhatsApp Business Cloud API v21.0 integration, webhook verification, and AI customer bot.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090d29] border border-[#1d2757]">
          {(['dashboard', 'send', 'notifications', 'bot-simulator', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium capitalize transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className="p-5 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-display font-bold text-white">
                    {status.businessPhoneNumber}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    status.isLive
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {status.connectionStatus}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Phone ID: {status.phoneNumberId} &bull; Account ID: {status.businessAccountId} &bull; API {status.apiVersion}
                </div>
              </div>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1438] border border-[#202c66] hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh Stats</span>
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#080c24] border border-[#1b2552]">
              <div className="text-xs font-mono text-slate-400 mb-1">TOTAL MESSAGES</div>
              <div className="text-3xl font-display font-black text-white">{status.stats.totalMessages}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-2">All time logs</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#080c24] border border-[#1b2552]">
              <div className="text-xs font-mono text-emerald-400 mb-1">MESSAGES SENT</div>
              <div className="text-3xl font-display font-black text-emerald-400">{status.stats.messagesSent}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-2">Outbound notifications &amp; texts</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#080c24] border border-[#1b2552]">
              <div className="text-xs font-mono text-cyan-400 mb-1">RECEIVED</div>
              <div className="text-3xl font-display font-black text-cyan-400">{status.stats.messagesReceived}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-2">Inbound client queries</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#080c24] border border-[#1b2552]">
              <div className="text-xs font-mono text-rose-400 mb-1">FAILED MESSAGES</div>
              <div className="text-3xl font-display font-black text-rose-400">{status.stats.failedMessages}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-2">Delivery rejections &amp; opt-outs</div>
            </div>
          </div>

          {/* Recent Message History Table */}
          <div className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-white">WHATSAPP MESSAGE AUDIT LOG</h3>
              <span className="text-xs font-mono text-slate-500">Last activity: {status.stats.lastActivity}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-[#16204a]">
                <thead className="bg-[#0b102e] text-slate-400">
                  <tr>
                    <th className="p-2.5 border-b border-[#16204a]">Time</th>
                    <th className="p-2.5 border-b border-[#16204a]">Direction</th>
                    <th className="p-2.5 border-b border-[#16204a]">Phone / User</th>
                    <th className="p-2.5 border-b border-[#16204a]">Message Content</th>
                    <th className="p-2.5 border-b border-[#16204a]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16204a]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#0c1236]">
                      <td className="p-2.5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.direction === 'outgoing'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {log.direction}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-200 whitespace-nowrap">
                        <div>{log.toOrFrom}</div>
                        <div className="text-[10px] text-slate-500">{log.senderName}</div>
                      </td>
                      <td className="p-2.5 text-slate-300 max-w-md">
                        <div className="line-clamp-2">{log.content}</div>
                      </td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          log.status === 'failed'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SEND MESSAGE */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sender Form */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-5">
            <h2 className="text-base font-display font-bold text-white">SEND OFFICIAL WHATSAPP MESSAGE</h2>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">
                  Recipient Phone Number (with Country Code)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+6281234567890"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0c1236] border border-[#212d64] text-white"
                  />
                  <select
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-[#0c1236] border border-[#212d64] text-slate-300"
                  >
                    <option value="">Pick Contact</option>
                    {contacts.map((c, i) => (
                      <option key={i} value={c.phoneNumber}>{c.name} ({c.phoneNumber})</option>
                    ))}
                  </select>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Recipient must have given explicit opt-in consent according to Meta Business terms.
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">Message Format</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mtype"
                      checked={msgType === 'text'}
                      onChange={() => setMsgType('text')}
                      className="text-emerald-500"
                    />
                    <span>Freeform Text (within 24hr service window)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mtype"
                      checked={msgType === 'template'}
                      onChange={() => setMsgType('template')}
                      className="text-emerald-500"
                    />
                    <span>Approved Meta Template</span>
                  </label>
                </div>
              </div>

              {msgType === 'text' ? (
                <div>
                  <label className="text-slate-400 block mb-1.5 font-bold">Text Message Content</label>
                  <textarea
                    rows={4}
                    value={textBody}
                    onChange={(e) => setTextBody(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-3 rounded-xl bg-[#0c1236] border border-[#212d64] text-white font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-3 p-3.5 rounded-xl bg-[#0a0f2e] border border-[#1d2757]">
                  <div>
                    <label className="text-slate-400 block mb-1">Approved Template Name</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0c1236] border border-[#212d64] text-white"
                    >
                      <option value="ticket_alert">ticket_alert (Ticket Status &amp; Updates)</option>
                      <option value="system_critical">system_critical (Critical Infrastructure Incident)</option>
                      <option value="project_update">project_update (Project Milestone Delivery)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Variable {'{{1}}'}</label>
                      <input
                        type="text"
                        value={templateVar1}
                        onChange={(e) => setTemplateVar1(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0c1236] border border-[#212d64] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Variable {'{{2}}'}</label>
                      <input
                        type="text"
                        value={templateVar2}
                        onChange={(e) => setTemplateVar2(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0c1236] border border-[#212d64] text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-emerald-500/20 hover:opacity-95 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>SEND MESSAGE VIA META CLOUD API</span>
              </button>

              {sendResult && (
                <div className={`p-3 rounded-xl text-xs font-mono ${
                  sendResult.success
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                }`}>
                  <div className="font-bold">
                    {sendResult.success ? 'Message Processed' : 'Dispatch Error'}
                  </div>
                  <div>{sendResult.note || sendResult.error || 'Done.'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Message Preview (Device Frame Mock) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-col justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-400 mb-4">WHATSAPP MESSAGE PREVIEW</h3>

            <div className="max-w-xs mx-auto w-full p-4 rounded-3xl bg-[#0a101d] border-2 border-[#1e2a4a] shadow-2xl relative">
              {/* WhatsApp Chat Bubble */}
              <div className="p-3 rounded-2xl rounded-tr-none bg-[#005c4b] text-white text-xs space-y-1 shadow">
                <div className="font-semibold text-emerald-200 text-[10px]">
                  IZI Tech Business
                </div>
                <div className="whitespace-pre-wrap font-sans">
                  {msgType === 'text'
                    ? textBody
                    : `[Template: ${selectedTemplate}]\nRef: ${templateVar1}\nDetail: ${templateVar2}`}
                </div>
                <div className="text-[9px] text-right text-emerald-200 font-mono">
                  14:20 ✓✓
                </div>
              </div>
            </div>

            <div className="mt-6 text-[11px] font-mono text-slate-500 text-center">
              Target: <strong className="text-slate-300">{recipientPhone}</strong>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AUTOMATED NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-white">AUTOMATED WHATSAPP NOTIFICATIONS</h2>
              <p className="text-xs text-slate-400">
                Trigger real-time WhatsApp alerts to on-call engineers and project leads for system events.
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              Default Recipient: {notifSettings.defaultRecipientPhone}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'newTicket', title: '1. Ticket Baru', desc: 'Notifikasi saat ada tiket bantuan baru masuk' },
              { key: 'criticalTicket', title: '2. Ticket Critical', desc: 'Alert instan prioritas tinggi untuk insiden kritis' },
              { key: 'resolvedTicket', title: '3. Ticket Resolved', desc: 'Konfirmasi pemulihan tiket kepada pemohon' },
              { key: 'projectDeadline', title: '4. Project Deadline', desc: 'Peringatan tenggat waktu deliverable proyek' },
              { key: 'projectCompleted', title: '5. Project Completed', desc: 'Notifikasi penyelesaian milestone dan deployment' },
              { key: 'systemAlert', title: '6. System Alert', desc: 'Peringatan CPU / Memory spike dan kegagalan container' },
              { key: 'apiError', title: '7. API Error Spikes', desc: 'Alert lonjakan status 5xx pada gateway API' },
            ].map((n) => {
              const isEnabled = notifSettings[n.key as keyof WhatsAppNotificationSettings];
              return (
                <div
                  key={n.key}
                  className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] flex items-center justify-between"
                >
                  <div className="space-y-1 pr-4">
                    <div className="font-display font-bold text-xs text-white">{n.title}</div>
                    <div className="text-[11px] text-slate-400">{n.desc}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTriggerTestAlert(n.key)}
                      className="px-2 py-1 rounded bg-[#10173e] hover:bg-[#182258] text-[10px] font-mono text-cyan-300 border border-[#202c66] transition cursor-pointer"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => handleToggleNotif(n.key as keyof WhatsAppNotificationSettings)}
                      className={`w-10 h-6 rounded-full transition p-0.5 cursor-pointer ${
                        isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition transform ${
                          isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: BOT & WEBHOOK SIMULATOR */}
      {activeTab === 'bot-simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick Actions & Instructions */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-4">
            <h3 className="text-sm font-display font-bold text-white">WHATSAPP QUICK ACTIONS</h3>
            <p className="text-xs text-slate-400">
              Pengguna WhatsApp dapat mengetik menu interaktif berikut untuk mendapatkan balasan otomatis:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <button
                onClick={() => handleSimulateWebhook('menu')}
                className="w-full p-2.5 rounded-xl bg-[#0b102e] border border-[#182352] hover:border-emerald-500 text-left text-slate-200 transition cursor-pointer"
              >
                📱 <strong>menu</strong> - Tampilkan Menu Utama
              </button>
              <button
                onClick={() => handleSimulateWebhook('1')}
                className="w-full p-2.5 rounded-xl bg-[#0b102e] border border-[#182352] hover:border-emerald-500 text-left text-slate-200 transition cursor-pointer"
              >
                📋 <strong>tiket</strong> - Cek Status Ticket
              </button>
              <button
                onClick={() => handleSimulateWebhook('2')}
                className="w-full p-2.5 rounded-xl bg-[#0b102e] border border-[#182352] hover:border-emerald-500 text-left text-slate-200 transition cursor-pointer"
              >
                🚀 <strong>project</strong> - Cek Progress Project
              </button>
              <button
                onClick={() => handleSimulateWebhook('lapor server database down')}
                className="w-full p-2.5 rounded-xl bg-[#0b102e] border border-[#182352] hover:border-emerald-500 text-left text-slate-200 transition cursor-pointer"
              >
                🚨 <strong>lapor [kendala]</strong> - Buat Ticket Baru
              </button>
              <button
                onClick={() => handleSimulateWebhook('Bagaimana cara konfigurasi firewall UFW di Ubuntu?')}
                className="w-full p-2.5 rounded-xl bg-[#0b102e] border border-[#182352] hover:border-emerald-500 text-left text-slate-200 transition cursor-pointer"
              >
                🤖 <strong>Konsultasi IZI AI</strong> - Tanya IT
              </button>
              <button
                onClick={() => handleSimulateWebhook('kontak')}
                className="w-full p-2.5 rounded-xl bg-[#0b102e] border border-[#182352] hover:border-emerald-500 text-left text-slate-200 transition cursor-pointer"
              >
                👤 <strong>kontak</strong> - Hubungi Administrator
              </button>
            </div>
          </div>

          {/* Right: Interactive Simulator Chatbox */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] flex flex-col justify-between space-y-4 min-h-[520px]">
            <div className="flex items-center justify-between border-b border-[#182352] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-display font-bold text-xs text-white">
                  WEBHOOK &amp; AI AUTO-REPLY SIMULATOR
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Simulating: {simSenderPhone} ({simSenderName})
              </span>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-[#040614] border border-[#141b3e] max-h-[380px]">
              {simHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${item.isBot ? 'items-start' : 'items-end'}`}
                >
                  <div className="text-[10px] font-mono text-slate-500 mb-0.5">{item.sender}</div>
                  <div
                    className={`p-3 rounded-2xl max-w-lg text-xs leading-relaxed whitespace-pre-wrap ${
                      item.isBot
                        ? 'bg-[#0f1d24] border border-emerald-900/60 text-emerald-200 font-sans'
                        : 'bg-[#005c4b] text-white font-sans'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
              {simLoading && (
                <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-emerald-400 border-t-transparent animate-spin"></div>
                  <span>IZI AI WhatsApp Bot is formulating reply...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={simMessage}
                onChange={(e) => setSimMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSimulateWebhook()}
                placeholder="Type message like 'menu', 'tiket', or IT question..."
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#0c1236] border border-[#212d64] text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSimulateWebhook()}
                disabled={simLoading || !simMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-mono text-xs font-bold cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: CONNECTION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#080c24] border border-[#1b2552] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">META CLOUD API CONFIGURATION</h2>
              <p className="text-xs text-slate-400">Secure backend credentials and webhook endpoint verification</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Webhook Callback URL</span>
                <button
                  onClick={handleCopyWebhookUrl}
                  className="flex items-center gap-1 text-cyan-400 hover:text-white"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={status.webhookUrl}
                className="w-full px-3 py-2 rounded-lg bg-[#050819] border border-[#1f2c66] text-slate-300 select-all"
              />
              <div className="text-[10px] text-slate-500">
                Paste this into Meta App Dashboard &gt; WhatsApp &gt; Configuration &gt; Webhook Callback URL.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] space-y-1">
                <span className="text-slate-400">Webhook Verify Token</span>
                <div className="font-bold text-cyan-300">izi_tech_verify_token_secure</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0b102e] border border-[#182352] space-y-1">
                <span className="text-slate-400">Meta Graph API Version</span>
                <div className="font-bold text-emerald-300">v21.0</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#130d24] border border-pink-500/30 text-slate-300 space-y-2">
              <div className="font-bold text-pink-400 font-display">SECURITY NOTICE:</div>
              <p className="text-[11px] leading-relaxed">
                Tokens and secrets (WHATSAPP_ACCESS_TOKEN and WHATSAPP_APP_SECRET) are securely loaded by the Node.js server from <code>.env</code>. They are strictly prohibited from being saved in LocalStorage or transmitted in plaintext client payloads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
