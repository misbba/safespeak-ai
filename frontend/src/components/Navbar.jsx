import React, { useState } from 'react';
import { 
  ShieldAlert, Sparkles, BookOpen, Info, 
  FileText, Menu, X, ArrowRight, ShieldCheck, Search
} from 'lucide-react';

export default function Navbar({ currentRoute, setCurrentRoute, isDemoMode, setIsDemoMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Layer A Public Product Website Navigation Links
  const publicNavLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'features', label: 'Features', isSection: true },
    { id: 'how-it-works', label: 'How It Works', isSection: true },
    { id: 'about', label: 'About' },
    { id: 'safety-center', label: 'Safety Center' },
  ];

  const handleNavClick = (item) => {
    setMobileMenuOpen(false);
    if (item.isSection) {
      if (currentRoute !== 'landing') {
        setCurrentRoute('landing');
        setTimeout(() => {
          const el = document.getElementById(item.id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(item.id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setCurrentRoute(item.id);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => { setCurrentRoute('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-indigo-500/20 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  SafeSpeak <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-full uppercase">
                  Cyber Defense
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                &ldquo;Think Before You Click.&rdquo;
              </p>
            </div>
          </div>

          {/* Desktop Public Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {publicNavLinks.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`text-sm font-medium transition-colors hover:text-cyan-300 ${
                    isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Demo Toggle & Primary Scan Now CTA */}
          <div className="flex items-center space-x-3">
            {/* Demo Mode Toggle Button */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              title="Toggle simulated demo analysis vs live scanner"
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDemoMode
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Demo:</span>
              <span className={isDemoMode ? 'text-amber-300 font-bold' : 'text-slate-400 font-medium'}>
                {isDemoMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Quick Report Cybercrime Link (Desktop) */}
            <button
              onClick={() => setCurrentRoute('report-cybercrime')}
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300/90 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>Report Incident</span>
            </button>

            {/* Layer B Entrypoint: Primary Scan Now Button */}
            <button
              onClick={() => setCurrentRoute('scan')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_18px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Scan Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {publicNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900 transition-colors text-left"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            ))}

            <button
              onClick={() => { setCurrentRoute('report-cybercrime'); setMobileMenuOpen(false); }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-950/40 border border-rose-500/20 transition-colors text-left mt-2"
            >
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Report Cybercrime</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
            <span className="text-xs text-slate-400">Simulation Demo Mode:</span>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-3 py-1 rounded text-xs font-bold border ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {isDemoMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
