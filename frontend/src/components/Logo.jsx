import React from 'react';
import logoImg from '../assets/safespeak-logo.png';

/**
 * Reusable SafeSpeak AI Logo Component
 * Centralizes the official brand mark across all pages, headers, and footers.
 */
export default function Logo({ 
  size = 'md', 
  showText = true, 
  showTagline = false,
  showBadge = false,
  taglineClassName = '',
  className = '',
  imgClassName = '',
  onClick = null
}) {
  // Size mapping for the logo mark container
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
    xl: 'w-14 h-14 sm:w-16 sm:h-16'
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-2.5 sm:space-x-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Brand Mark: Preserves original aspect ratio and sharpness */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] ${currentSize}`}>
        <img
          src={logoImg || '/assets/safespeak-logo.png'}
          alt="SafeSpeak AI"
          className={`w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-200 ${imgClassName}`}
          loading="eager"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              SafeSpeak <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">AI</span>
            </span>
            {showBadge && (
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-full uppercase">
                Cyber Defense
              </span>
            )}
          </div>
          {showTagline && (
            <p className={`text-[11px] text-cyan-400/90 font-mono tracking-wide hidden sm:block ${taglineClassName}`}>
              &ldquo;Think Before You Click.&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
