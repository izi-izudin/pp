import React from 'react';

export type BadgeStatus = 'online' | 'idle' | 'busy' | 'critical' | 'warning' | 'info' | 'offline';

export interface CyberBadgeProps {
  status?: BadgeStatus;
  children: React.ReactNode;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const CyberBadge: React.FC<CyberBadgeProps> = ({
  status = 'online',
  children,
  pulse = true,
  size = 'sm',
  className = ''
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'online':
        return {
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400'
        };
      case 'idle':
        return {
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          dot: 'bg-cyan-400'
        };
      case 'busy':
        return {
          badge: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-400'
        };
      case 'warning':
        return {
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400'
        };
      case 'critical':
        return {
          badge: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
          dot: 'bg-rose-500'
        };
      case 'info':
        return {
          badge: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400'
        };
      case 'offline':
        return {
          badge: 'bg-slate-900/80 text-slate-400 border-slate-700',
          dot: 'bg-slate-500'
        };
    }
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  };

  const styles = getStatusStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-bold border tracking-wider uppercase select-none ${sizeClasses[size]} ${styles.badge} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && status !== 'offline' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.dot}`}></span>
      </span>
      <span>{children}</span>
    </span>
  );
};
