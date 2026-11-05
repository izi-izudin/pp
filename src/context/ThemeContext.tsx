import React, { createContext, useContext, useState, useEffect } from 'react';

export type CyberThemeId = 'cyber-cyan' | 'synth-magenta' | 'matrix-emerald' | 'voltage-amber';

export interface CyberThemeConfig {
  id: CyberThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgDark: string;
  borderClass: string;
  glowClass: string;
  badgeClass: string;
  textAccentClass: string;
}

export const THEME_PRESETS: Record<CyberThemeId, CyberThemeConfig> = {
  'cyber-cyan': {
    id: 'cyber-cyan',
    name: 'Neo Cyberpunk (Cyan & Pink)',
    tagline: 'High-contrast futuristic neon aesthetic inspired by Neo-Tokyo nightscapes.',
    primaryColor: '#00f0ff',
    secondaryColor: '#ff007f',
    accentColor: '#7928ca',
    bgDark: '#050713',
    borderClass: 'border-cyan-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    textAccentClass: 'text-cyan-400'
  },
  'synth-magenta': {
    id: 'synth-magenta',
    name: 'Synthwave Sunset (Magenta & Ultraviolet)',
    tagline: 'Deep retro-wave neon glowing in ultraviolet magenta and electric purple.',
    primaryColor: '#ff00a0',
    secondaryColor: '#9d00ff',
    accentColor: '#00f0ff',
    bgDark: '#090514',
    borderClass: 'border-pink-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,0,160,0.3)]',
    badgeClass: 'bg-pink-950/80 text-pink-300 border-pink-500/40',
    textAccentClass: 'text-pink-400'
  },
  'matrix-emerald': {
    id: 'matrix-emerald',
    name: 'Matrix Terminal (Phosphor Green)',
    tagline: 'Classic phosphor hacker console aesthetic with emerald code telemetry.',
    primaryColor: '#00ff66',
    secondaryColor: '#00e5ff',
    accentColor: '#ffb700',
    bgDark: '#030c06',
    borderClass: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(0,255,102,0.3)]',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    textAccentClass: 'text-emerald-400'
  },
  'voltage-amber': {
    id: 'voltage-amber',
    name: 'High Voltage (Amber Gold & Flame)',
    tagline: 'Industrial cybernetic warning amber with radiant flame accents.',
    primaryColor: '#ffb700',
    secondaryColor: '#ff4500',
    accentColor: '#00e5ff',
    bgDark: '#0c0702',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(255,183,0,0.3)]',
    badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    textAccentClass: 'text-amber-400'
  }
};

interface ThemeContextType {
  theme: CyberThemeConfig;
  setThemeId: (id: CyberThemeId) => void;
  scanlines: boolean;
  setScanlines: (enabled: boolean) => void;
  cyberGrid: boolean;
  setCyberGrid: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  glowIntensity: 'subtle' | 'medium' | 'intense';
  setGlowIntensity: (intensity: 'subtle' | 'medium' | 'intense') => void;
  playCyberSound: (type?: 'click' | 'beep' | 'toggle' | 'alert') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<CyberThemeId>(() => {
    return (localStorage.getItem('izi_cyber_theme') as CyberThemeId) || 'cyber-cyan';
  });
  const [scanlines, setScanlinesState] = useState<boolean>(() => {
    return localStorage.getItem('izi_scanlines') !== 'false';
  });
  const [cyberGrid, setCyberGridState] = useState<boolean>(() => {
    return localStorage.getItem('izi_cybergrid') !== 'false';
  });
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('izi_sound_effects') !== 'false';
  });
  const [glowIntensity, setGlowIntensityState] = useState<'subtle' | 'medium' | 'intense'>('medium');

  const theme = THEME_PRESETS[themeId] || THEME_PRESETS['cyber-cyan'];

  const setThemeId = (id: CyberThemeId) => {
    setThemeIdState(id);
    localStorage.setItem('izi_cyber_theme', id);
    playCyberSound('toggle');
  };

  const setScanlines = (enabled: boolean) => {
    setScanlinesState(enabled);
    localStorage.setItem('izi_scanlines', String(enabled));
    playCyberSound('click');
  };

  const setCyberGrid = (enabled: boolean) => {
    setCyberGridState(enabled);
    localStorage.setItem('izi_cybergrid', String(enabled));
    playCyberSound('click');
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem('izi_sound_effects', String(enabled));
  };

  const setGlowIntensity = (intensity: 'subtle' | 'medium' | 'intense') => {
    setGlowIntensityState(intensity);
    playCyberSound('click');
  };

  // Web Audio API Synthesizer for Cyber Click & Beep SFX
  const playCyberSound = (type: 'click' | 'beep' | 'toggle' | 'alert' = 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'toggle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch {
      // AudioContext might be blocked before user gesture; silently ignore
    }
  };

  useEffect(() => {
    // Apply body theme background
    document.body.style.backgroundColor = theme.bgDark;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
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
      }}
    >
      <div 
        className={`relative min-h-screen text-slate-100 transition-colors duration-500 theme-${theme.id}`}
        style={{ backgroundColor: theme.bgDark }}
      >
        {/* Retro CRT Scanline Overlay */}
        {scanlines && (
          <div className="pointer-events-none fixed inset-0 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40"></div>
        )}

        {/* Ambient Grid Background */}
        {cyberGrid && (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-25 cyber-grid"></div>
        )}

        <div className="relative z-10">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
