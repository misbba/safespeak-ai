import React from 'react';
import Logo from './Logo';

export default function Footer({ setCurrentRoute }) {
  const handleNavClick = (route, sectionId = null) => {
    if (sectionId) {
      setCurrentRoute('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 box-border">
        {/* Main 4-Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* 1. LEFT BRAND SECTION (Slightly wider) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-4 space-y-3.5 pr-0 lg:pr-6">
            <Logo
              size="sm"
              showText={true}
              showTagline={false}
              onClick={() => handleNavClick('landing')}
            />

            <p className="text-cyan-400/90 text-xs font-semibold tracking-wide">
              &ldquo;Think Before You Click.&rdquo;
            </p>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              AI-powered digital safety assistant for safer online decisions.
            </p>
          </div>

          {/* 2. PRODUCT */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              PRODUCT
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('landing')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('landing', 'features')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('landing', 'how-it-works')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('about')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('safety-center')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Safety Center
                </button>
              </li>
            </ul>
          </div>

          {/* 3. TOOLS */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              TOOLS
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('scan-message')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Message Scanner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('url-checker')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  URL Checker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('screenshot-scanner')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Screenshot Scanner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('scan')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Scan Hub
                </button>
              </li>
            </ul>
          </div>

          {/* 4. SAFETY */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              SAFETY
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('report-cybercrime')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Report Incident
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('safety-center')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Cyber Safety Tips
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('about')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('report-cybercrime')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors duration-150 text-left text-xs"
                >
                  Report Cybercrime
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM ROW WITH THIN DIVIDER */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p className="text-slate-500 font-normal">
            &copy; 2026 SafeSpeak AI
          </p>
          <p className="text-slate-500 font-normal text-center sm:text-right">
            Built for Digital Safety &amp; Cybersecurity
          </p>
        </div>
      </div>
    </footer>
  );
}
