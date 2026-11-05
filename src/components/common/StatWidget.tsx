import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';

export interface StatWidgetProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  colorAccent?: 'cyan' | 'magenta' | 'purple' | 'emerald' | 'amber';
  subtext?: string;
  onClick?: () => void;
  className?: string;
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  label,
  value,
  icon,
  trend,
  colorAccent = 'cyan',
  subtext,
  onClick,
  className = ''
}) => {
  const { playCyberSound } = useTheme();

  const colorStyles = {
    cyan: {
      border: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400',
      text: 'text-cyan-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]'
    },
    magenta: {
      border: 'hover:border-pink-500/50',
      iconBg: 'bg-pink-950/80 border-pink-500/40 text-pink-400',
      text: 'text-pink-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(255,0,127,0.2)]'
    },
    purple: {
      border: 'hover:border-purple-500/50',
      iconBg: 'bg-purple-950/80 border-purple-500/40 text-purple-400',
      text: 'text-purple-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]'
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
      text: 'text-emerald-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      text: 'text-amber-400',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
    }
  };

  const style = colorStyles[colorAccent];

  return (
    <div
      onClick={() => {
        if (onClick) {
          playCyberSound('click');
          onClick();
        }
      }}
      className={`group relative p-5 rounded-2xl bg-[#080c24] border border-[#1b2552] ${style.border} transition-all duration-300 shadow-lg ${style.glow} ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase">
          {label}
        </span>
        {icon && (
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${style.iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="text-3xl font-display font-black text-white group-hover:text-slate-100 transition tracking-tight">
        {value}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-mono">
        {trend && (
          <div className={`flex items-center gap-1 font-semibold ${trend.isPositive !== false ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.isPositive !== false ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{trend.value}</span>
            {trend.label && <span className="text-slate-500 font-normal">({trend.label})</span>}
          </div>
        )}

        {subtext && (
          <span className="text-slate-500 text-[11px] truncate">{subtext}</span>
        )}
      </div>
    </div>
  );
};
