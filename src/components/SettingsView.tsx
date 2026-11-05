import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Eye, 
  Terminal, 
  Grid, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Check, 
  Radio
} from 'lucide-react';
import { useTheme, THEME_PRESETS, CyberThemeId } from '../context/ThemeContext.js';
import { CyberCard } from './common/CyberCard.js';
import { CyberButton } from './common/CyberButton.js';
import { CyberBadge } from './common/CyberBadge.js';
import { CyberInput } from './common/CyberInput.js';
import { StatWidget } from './common/StatWidget.js';
import { TerminalBox } from './common/TerminalBox.js';

export const SettingsView: React.FC = () => {
  const { 
    theme, 
    setThemeId, 
    scanlines, 
    setScanlines, 
    cyberGrid, 
    setCyberGrid, 
    soundEnabled, 
    setSoundEnabled, 
    glowIntensity, 
    setGlowIntensity, 
    playCyberSound 
  } = useTheme();

  const [testInput, setTestInput] = useState('izi.izudin@cyber-node.internal');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182352] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            TAHAP 1 // THEME SYSTEM &amp; DESIGN SYSTEM
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            CYBERPUNK THEME &amp; COMPONENT MATRIX
          </h1>
          <p className="text-slate-400 text-xs">
            Configure visual presets, CRT scanlines, Web Audio sound effects, and inspect reusable components.
          </p>
        </div>

        <CyberBadge status="online" size="md">
          DESIGN SYSTEM v2.0 READY
        </CyberBadge>
      </div>

      {/* Theme Presets Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>SELECT CYBERPUNK THEME PRESET</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(THEME_PRESETS).map((t) => {
            const isSelected = theme.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#0b102e] border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-[#080c24] border-[#1b2552] hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-md"
                        style={{ backgroundColor: t.primaryColor }}
                      ></span>
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-md"
                        style={{ backgroundColor: t.secondaryColor }}
                      ></span>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-cyan-400" /> Active
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition mb-1">
                    {t.name}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    {t.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#172048] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>HEX: {t.primaryColor}</span>
                  <span className="text-cyan-400">Apply Preset &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Effects & Audio Synthesizer Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Engine Controls */}
        <CyberCard
          title="DISPLAY &amp; VISUAL ENGINE"
          subtitle="Hardware-accelerated visual fidelity controls"
          icon={<Eye className="w-4 h-4 text-cyan-400" />}
        >
          <div className="space-y-4 font-mono text-xs">
            {/* Scanlines Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b102e] border border-[#182352]">
              <div>
                <div className="text-white font-bold flex items-center gap-2">
                  <span>CRT Scanlines Effect</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Retro HUD
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Simulates cathode-ray tube phosphor scanline grid overlay.
                </div>
              </div>

              <button
                onClick={() => setScanlines(!scanlines)}
                className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer ${
                  scanlines ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    scanlines ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Cyber Grid Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b102e] border border-[#182352]">
              <div>
                <div className="text-white font-bold flex items-center gap-2">
                  <span>Cyber Grid Matrix</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    Isometric
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Subtle isometric background grid with depth perception.
                </div>
              </div>

              <button
                onClick={() => setCyberGrid(!cyberGrid)}
                className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer ${
                  cyberGrid ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    cyberGrid ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Glow Intensity */}
            <div className="p-3.5 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Neon Glow Intensity</span>
                <span className="text-cyan-400 font-bold uppercase">{glowIntensity}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['subtle', 'medium', 'intense'] as const).map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => setGlowIntensity(intensity)}
                    className={`py-1.5 rounded-lg border text-center transition cursor-pointer capitalize ${
                      glowIntensity === intensity
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-sm font-bold'
                        : 'bg-[#070b22] text-slate-400 border-[#1a2350] hover:text-white'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CyberCard>

        {/* Audio Synthesizer Controls */}
        <CyberCard
          title="CYBER AUDIO SYNTHESIZER"
          subtitle="Real-time Web Audio API sound synthesis"
          icon={<Volume2 className="w-4 h-4 text-pink-400" />}
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b102e] border border-[#182352]">
              <div>
                <div className="text-white font-bold">Interactive Sound Feedback</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Produces synthesized micro-beeps on button click, theme toggle, and terminal input.
                </div>
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer ${
                  soundEnabled ? 'bg-pink-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Test Audio Cues */}
            <div className="p-3.5 rounded-xl bg-[#0b102e] border border-[#182352] space-y-2">
              <div className="text-white font-bold">Test Synthesized Cues:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <CyberButton variant="outline" size="xs" onClick={() => playCyberSound('click')}>
                  Click SFX
                </CyberButton>
                <CyberButton variant="outline" size="xs" onClick={() => playCyberSound('beep')}>
                  Beep SFX
                </CyberButton>
                <CyberButton variant="outline" size="xs" onClick={() => playCyberSound('toggle')}>
                  Toggle SFX
                </CyberButton>
                <CyberButton variant="outline" size="xs" onClick={() => playCyberSound('alert')}>
                  Alert SFX
                </CyberButton>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#050819] border border-[#141b3e] text-[11px] text-slate-400">
              💡 <em>Synthesizer generates clean sine/triangle oscillator waves dynamically without downloading external audio files.</em>
            </div>
          </div>
        </CyberCard>
      </div>

      {/* Reusable Components Matrix Showcase */}
      <div className="space-y-4">
        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>REUSABLE COMPONENT SHOWCASE GALLERY</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Buttons & Badges */}
          <CyberCard title="CyberButton &amp; CyberBadge" subtitle="Interactive states & variants">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400">Button Variants:</div>
                <div className="flex flex-wrap gap-2">
                  <CyberButton variant="primary" size="sm">Primary</CyberButton>
                  <CyberButton variant="secondary" size="sm">Secondary</CyberButton>
                  <CyberButton variant="accent" size="sm">Accent</CyberButton>
                  <CyberButton variant="outline" size="sm">Outline</CyberButton>
                  <CyberButton variant="danger" size="sm">Danger</CyberButton>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#141b40]">
                <div className="text-[11px] font-mono text-slate-400">Pulsing LED Status Badges:</div>
                <div className="flex flex-wrap gap-2">
                  <CyberBadge status="online">Online</CyberBadge>
                  <CyberBadge status="idle">Idle</CyberBadge>
                  <CyberBadge status="busy">Busy</CyberBadge>
                  <CyberBadge status="warning">Warning</CyberBadge>
                  <CyberBadge status="critical">Critical</CyberBadge>
                </div>
              </div>
            </div>
          </CyberCard>

          {/* Card 2: CyberInput & Form Elements */}
          <CyberCard title="CyberInput" subtitle="Framed input with error state">
            <div className="space-y-3">
              <CyberInput
                label="Node Host Address"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                helperText="Formatted with monospace & cyber border focus"
              />

              <CyberInput
                label="Security Key"
                type="password"
                defaultValue="super_secret_cyber_token"
                helperText="Protected against client-side exposure"
              />

              <CyberInput
                label="Validation Error State"
                defaultValue="invalid_host_ip"
                error="Invalid IPv4 or loopback forbidden"
              />
            </div>
          </CyberCard>

          {/* Card 3: StatWidget */}
          <CyberCard title="StatWidget" subtitle="High-impact metric tiles">
            <div className="space-y-3">
              <StatWidget
                label="KERNEL RESPONSE"
                value="99.98%"
                trend={{ value: "+0.4%", isPositive: true, label: "24h" }}
                colorAccent="cyan"
                subtext="Regional Edge Nodes"
              />
              <StatWidget
                label="ACTIVE DELIVERABLES"
                value="120+"
                trend={{ value: "15 Awards", isPositive: true }}
                colorAccent="magenta"
                subtext="Izi Izudin Projects"
              />
            </div>
          </CyberCard>
        </div>

        {/* Full-width Terminal Component */}
        <CyberCard title="Interactive Terminal Box" subtitle="HUD Shell Emulator">
          <TerminalBox />
        </CyberCard>
      </div>
    </div>
  );
};
