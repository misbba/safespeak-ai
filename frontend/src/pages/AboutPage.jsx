import React from 'react';
import { 
  ShieldCheck, Lock, Cpu, Database, Eye, AlertOctagon, 
  Terminal, Globe, Sparkles, CheckCircle 
} from 'lucide-react';

export default function AboutPage({ setCurrentRoute }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>System Philosophy &amp; Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About SafeSpeak AI
        </h1>
        <p className="text-base text-cyan-300 font-semibold italic">
          &ldquo;Think Before You Click.&rdquo;
        </p>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          SafeSpeak AI was engineered for the <strong>Digital Safety &amp; Cybersecurity</strong> hackathon challenge 
          to bridge the gap between technical threat intelligence and everyday consumer protection.
        </p>
      </div>

      {/* Why We Built SafeSpeak AI */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white">
          The Problem with Traditional Scam Detection
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Every day, millions of students, job seekers, and senior citizens receive deceptive messages—fake internship 
          offers asking for ₹999 registration fees, artificial electricity disconnection warnings, or counterfeit banking alerts. 
          Existing tools either offer generic chatbot prompt boxes or flat binary &ldquo;Safe / Scam&rdquo; labels without explaining 
          the underlying deception.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>SafeSpeak AI is not a chatbot clone.</strong> It is a purpose-built cybersecurity evaluation engine. 
          It unpacks social engineering tactics through our signature <strong>Risk Story</strong> architecture: 
          revealing the trigger lure, the artificial urgency, the demanded action, and the potential consequence in crystal-clear plain English.
        </p>
      </div>

      {/* Technical Architecture Overview */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Technical Blueprint
          </span>
          <h2 className="text-2xl font-bold text-white">
            Architecture &amp; System Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Frontend */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Frontend Client
            </h3>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
              <li>• React 19 + Vite 8</li>
              <li>• Tailwind CSS v4 Cyber System</li>
              <li>• Lucide React Security Icons</li>
              <li>• Resilient Offline Client Fallback</li>
              <li>• Zero-dependency State Routing</li>
            </ul>
          </div>

          {/* Backend */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Backend API &amp; DB
            </h3>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
              <li>• Python 3.13 + Flask 3.1</li>
              <li>• SQLite3 ACID Database</li>
              <li>• OCR Extraction Service Abstraction</li>
              <li>• Pillow Image Verification</li>
              <li>• Strict Input Sanitization &amp; Limits</li>
            </ul>
          </div>

          {/* AI & Heuristics */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              AI &amp; Threat Engine
            </h3>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
              <li>• AI Service Abstraction Layer</li>
              <li>• Gemini / OpenAI API Provider</li>
              <li>• Heuristic RuleBasedAnalysisEngine</li>
              <li>• URL Structural Threat Inspector</li>
              <li>• 4-Stage Risk Story Synthesizer</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Responsible AI & Privacy Guarantees */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Ethical Standards &amp; User Protection
            </span>
            <h3 className="text-xl font-bold text-white">
              Responsible AI &amp; Privacy Pledge
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-white">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Local Privacy-First Processing</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              SafeSpeak processes scan information locally where possible. Passwords, banking OTPs, and PINs are never requested or stored. Users should review all information before exporting or sharing it.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-white">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Non-Defamatory Phrasing</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              URL inspections report &ldquo;Potential warning signs detected based on domain and URL structural heuristics&rdquo; rather than making unfounded absolute claims.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-white">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Probabilistic Advisory Disclaimer</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Risk scores are presented as AI-assisted evaluations based on indicators, never as mathematical or legal certainty.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-white">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Graceful Demo &amp; Fallback Mode</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              When an external AI key is absent or unreachable, the system gracefully shifts to our calibrated offline heuristic engine with 0 downtime.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentRoute('scan')}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5"
        >
          <span>Try SafeSpeak AI Scanner Now →</span>
        </button>
      </div>
    </div>
  );
}
