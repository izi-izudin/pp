import React from 'react';
import { useTheme } from '../../context/ThemeContext.js';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const { theme, playCyberSound } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playCyberSound('click');
    onClick?.(e);
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1 text-[11px] gap-1',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base gap-2.5'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `bg-gradient-to-r from-[${theme.primaryColor}] via-indigo-600 to-[${theme.secondaryColor}] text-white font-bold shadow-lg hover:brightness-110 active:scale-95 border border-[${theme.primaryColor}]/50`;
      case 'secondary':
        return `bg-[#0e1438] hover:bg-[#162054] text-slate-200 border border-[${theme.primaryColor}]/40 shadow-sm active:scale-95`;
      case 'accent':
        return `bg-gradient-to-r from-[${theme.secondaryColor}] to-[${theme.accentColor}] text-white font-bold shadow-lg hover:brightness-110 active:scale-95`;
      case 'outline':
        return `bg-transparent hover:bg-[${theme.primaryColor}]/10 text-[${theme.primaryColor}] border border-[${theme.primaryColor}]/50 active:scale-95`;
      case 'danger':
        return `bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/60 shadow-lg shadow-rose-950/50 active:scale-95`;
      case 'ghost':
        return `bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white border border-transparent`;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center rounded-xl font-mono tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
