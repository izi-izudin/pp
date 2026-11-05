import React, { useState } from 'react';
import { Copy, Check, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';

export interface TerminalBoxProps {
  title?: string;
  initialLines?: string[];
  height?: string;
  className?: string;
  showInput?: boolean;
  onCommand?: (command: string) => string | void;
}

export const TerminalBox: React.FC<TerminalBoxProps> = ({
  title = 'izi-terminal // bash 5.2',
  initialLines = [
    '[SYSTEM] IZI Tech Project 2.0 Kernel initialized.',
    '[NET] Gateway proxy active on port 3000 (SSRF-Hardened).',
    '[SECURITY] HMAC-SHA256 signature verification online.',
    '[STATUS] Ready for commands. Type "help" for command matrix.'
  ],
  height = 'h-64',
  className = '',
  showInput = true,
  onCommand
}) => {
  const { playCyberSound } = useTheme();
  const [lines, setLines] = useState<string[]>(initialLines);
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputVal.trim();
      if (!cmd) return;
      playCyberSound('beep');

      const userLine = `guest@izi-core:~$ ${cmd}`;
      let responseLine = '';

      if (cmd.toLowerCase() === 'help') {
        responseLine = 'Available: status, clear, ping, tech, whoami, date';
      } else if (cmd.toLowerCase() === 'status') {
        responseLine = '[OK] All microservices operational. Latency: 12ms. CPU: 4.2%. Memory: 38%.';
      } else if (cmd.toLowerCase() === 'clear') {
        setLines([]);
        setInputVal('');
        return;
      } else if (cmd.toLowerCase() === 'whoami') {
        responseLine = 'Izi Izudin — Creative Coder & Tech Lead (Pandeglang, ID)';
      } else if (cmd.toLowerCase() === 'ping') {
        responseLine = 'PONG 64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms';
      } else if (cmd.toLowerCase() === 'tech') {
        responseLine = 'Stack: React 19, TypeScript, Tailwind CSS, Express, Three.js, WebGL, Node.js';
      } else if (cmd.toLowerCase() === 'date') {
        responseLine = new Date().toUTCString();
      } else if (onCommand) {
        const customRes = onCommand(cmd);
        if (customRes) responseLine = customRes;
      } else {
        responseLine = `bash: command not found: ${cmd}. Type "help" for valid commands.`;
      }

      setLines(prev => [...prev, userLine, responseLine]);
      setInputVal('');
    }
  };

  const copyTerminalOutput = () => {
    playCyberSound('click');
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl bg-[#040716] border border-[#1b2552] overflow-hidden flex flex-col font-mono text-xs shadow-2xl transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 h-auto' : height
      } ${className}`}
    >
      {/* Titlebar */}
      <div className="px-4 py-2.5 bg-[#090d24] border-b border-[#172048] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-[11px] text-slate-400 font-bold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{title}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={copyTerminalOutput}
            title="Copy terminal lines"
            className="p-1 hover:text-white transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Toggle maximize"
            className="p-1 hover:text-white transition cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Output Console Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1 text-slate-300 leading-relaxed">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.startsWith('guest@')
                ? 'text-cyan-300 font-semibold'
                : l.startsWith('[OK]')
                ? 'text-emerald-400'
                : l.startsWith('[SECURITY]')
                ? 'text-purple-300'
                : l.startsWith('[NET]')
                ? 'text-amber-300'
                : 'text-slate-300'
            }
          >
            {l}
          </div>
        ))}

        {/* Input prompt */}
        {showInput && (
          <div className="flex items-center gap-2 pt-1 text-cyan-400">
            <span>guest@izi-core:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type help, status, whoami..."
              className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-600"
            />
            <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
          </div>
        )}
      </div>
    </div>
  );
};
