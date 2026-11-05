import React from 'react';
import { useTheme } from '../../context/ThemeContext.js';

export interface CyberCardProps {
  title?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  cornerAccent?: boolean;
  noPadding?: boolean;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  headerAction,
  children,
  className = '',
  glow = false,
  cornerAccent = true,
  noPadding = false
}) => {
  const { theme, glowIntensity } = useTheme();

  const glowShadow = glow
    ? glowIntensity === 'intense'
      ? `shadow-[0_0_30px_rgba(0,240,255,0.25)]`
      : glowIntensity === 'medium'
      ? `shadow-[0_0_15px_rgba(0,240,255,0.15)]`
      : `shadow-[0_0_8px_rgba(0,240,255,0.08)]`
    : 'shadow-xl';

  return (
    <div
      className={`relative rounded-2xl bg-[#080c24]/90 border border-[#1b2552] backdrop-blur-md transition-all duration-300 ${glowShadow} ${className}`}
    >
      {/* Cyberpunk Decorative Corner Brackets */}
      {cornerAccent && (
        <>
          <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm pointer-events-none"></div>
          <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm pointer-events-none"></div>
          <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-pink-400 rounded-bl-sm pointer-events-none"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-pink-400 rounded-br-sm pointer-events-none"></div>
        </>
      )}

      {/* Card Header if Title/Icon is provided */}
      {(title || icon || badge || headerAction) && (
        <div className="px-5 py-4 border-b border-[#141b40] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-[#0e153a] border border-[#232f6b] flex items-center justify-center shrink-0 text-cyan-400">
                {icon}
              </div>
            )}
            <div className="truncate">
              {title && (
                <div className="font-display font-bold text-white text-sm sm:text-base truncate flex items-center gap-2">
                  <span>{title}</span>
                  {badge && <span>{badge}</span>}
                </div>
              )}
              {subtitle && (
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Main Content */}
      <div className={noPadding ? '' : 'p-5 sm:p-6'}>{children}</div>
    </div>
  );
};
