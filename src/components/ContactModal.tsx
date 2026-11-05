import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2 
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Interactive Website');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create ticket for the inquiry & trigger WhatsApp notification
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[Project Inquiry] ${projectType} from ${name}`,
          category: 'Feature',
          priority: 'High',
          status: 'Open',
          description: `Client: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject Type: ${projectType}\nMessage: ${message}`,
          requester: name || 'Prospective Client',
          assignedTo: 'Izi Izudin',
          source: 'Web UI'
        })
      });

      setSubmitted(true);
    } catch {
      alert('Failed to send message, please contact via direct email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#070b22] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Glow decorative blur */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-[#182352] pb-4">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
              IZI IZUDIN /// CREATIVE CODER
            </div>
            <h2 className="text-xl font-display font-black text-white">
              LET'S BUILD SOMETHING EXTRAORDINARY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0e1438] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-white text-base">MESSAGE RECEIVED!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Terima kasih! Tiket inquiry Anda telah dibuat dan notifikasi instan telah dikirimkan ke WhatsApp Izi Izudin.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sophie Bennett"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b102e] border border-[#1f2b60] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sophie@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b102e] border border-[#1f2b60] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">WhatsApp Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+6281234567890"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b102e] border border-[#1f2b60] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Project Interest</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b102e] border border-[#1f2b60] text-white"
                >
                  <option value="Interactive Website (WebGL/3D)">Interactive Website (WebGL/3D)</option>
                  <option value="Enterprise Web Application">Enterprise Web Application</option>
                  <option value="Creative Coding / Audiovisual">Creative Coding / Audiovisual</option>
                  <option value="Meta WhatsApp Cloud API Solution">Meta WhatsApp Cloud API Solution</option>
                  <option value="Full Architecture & UI/UX">Full Architecture &amp; UI/UX</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tell me about your project &amp; timeline</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We want to build a cyberpunk real-time dashboard..."
                className="w-full p-3 rounded-xl bg-[#0b102e] border border-[#1f2b60] text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-display font-bold text-xs tracking-wider shadow-lg shadow-pink-500/25 hover:opacity-95 transition cursor-pointer"
            >
              {loading ? 'DISPATCHING INQUIRY...' : 'SEND INQUIRY & DISPATCH ALERT &rarr;'}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-[#141b40] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>hello@izi-izudin.dev</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            <span>Pandeglang, Indonesia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open for Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};
