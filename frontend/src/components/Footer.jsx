import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink, Lock, AlertCircle, Heart } from 'lucide-react';

export default function Footer({ setCurrentRoute }) {
  const handleNavClick = (route, sectionId = null) => {
    if (sectionId) {
      setCurrentRoute('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/95 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div 
              onClick={() => handleNavClick('landing')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold">
                S
              </div>
              <span className="text-base font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                SafeSpeak AI
              </span>
            </div>
            <p className="text-cyan-300 font-mono text-xs font-semibold">
              &ldquo;Think Before You Click.&rdquo;
            </p>
            <p className="text-slate-400 leading-relaxed text-xs">
              AI-powered digital safety assistant helping ordinary users identify suspicious messages, phishing attempts, and scam tactics before taking action.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-cyan-300">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Zero-Retention Privacy</span>
            </div>
          </div>

          {/* Group 1: Website */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Website
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNavClick('landing')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('landing', 'features')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('landing', 'how-it-works')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('about')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('safety-center')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Safety Center
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: Tools (Layer B Application) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNavClick('scan-message')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Message Scanner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('url-checker')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  URL Checker
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('screenshot-scanner')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Screenshot Scanner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('scan')} 
                  className="hover:text-cyan-400 font-semibold text-cyan-300 transition-colors"
                >
                  All Scanners (Scan Hub) &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: Safety & Emergency Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Safety &amp; Assistance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNavClick('report-cybercrime')} 
                  className="hover:text-rose-300 text-rose-400/90 font-medium transition-colors"
                >
                  Report Cybercrime
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('about')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Privacy Commitment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('safety-center')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Safety Guidelines &amp; Red Flags
                </button>
              </li>
              <li className="pt-2">
                <a 
                  href="https://cybercrime.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <span>National Cyber Crime Portal (1930)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible AI Disclaimer & Legal Notice */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} SafeSpeak AI. Built for Digital Safety &amp; Cybersecurity Hackathon. MIT Licensed.
          </p>
          <p className="text-center md:text-right text-slate-400">
            Advisory risk scores are AI-assisted evaluations based on heuristic patterns. Never share passwords or live OTPs.
          </p>
        </div>
      </div>
    </footer>
  );
}
