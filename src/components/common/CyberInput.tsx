import React from 'react';

export interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const CyberInput: React.FC<CyberInputProps> = ({
  label,
  helperText,
  error,
  prefixIcon,
  suffixIcon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="space-y-1 w-full font-mono">
      {label && (
        <label className="text-xs text-slate-300 font-semibold block flex items-center justify-between">
          <span>{label}</span>
          {error && <span className="text-rose-400 text-[10px] font-normal">{error}</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {prefixIcon && (
          <div className="absolute left-3 text-slate-500 pointer-events-none flex items-center">
            {prefixIcon}
          </div>
        )}

        <input
          disabled={disabled}
          className={`w-full py-2 rounded-xl bg-[#090e2a] border text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200 ${
            prefixIcon ? 'pl-9' : 'pl-3.5'
          } ${suffixIcon ? 'pr-9' : 'pr-3.5'} ${
            error
              ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
              : 'border-[#1e2a5c] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-900' : ''} ${className}`}
          {...props}
        />

        {suffixIcon && (
          <div className="absolute right-3 text-slate-500 flex items-center">
            {suffixIcon}
          </div>
        )}
      </div>

      {helperText && !error && (
        <div className="text-[10px] text-slate-500">{helperText}</div>
      )}
    </div>
  );
};
