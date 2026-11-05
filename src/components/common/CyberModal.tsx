import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';

export interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const CyberModal: React.FC<CyberModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg'
}) => {
  const { playCyberSound } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        playCyberSound('click');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, playCyberSound]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} bg-[#070b22] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden relative my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner highlights */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-pink-400 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-400 pointer-events-none"></div>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#182352] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base sm:text-lg">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              playCyberSound('click');
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#0e1438] hover:bg-[#162054] text-slate-400 hover:text-white border border-[#202c66] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#182352] bg-[#050819] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
