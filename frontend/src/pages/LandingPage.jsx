import React from 'react';
import { 
  ShieldCheck, ShieldAlert, ArrowRight, Sparkles, Search, 
  FileText, Image as ImageIcon, Link as LinkIcon, AlertTriangle, 
  CheckCircle2, Lock, Cpu, Eye, HelpCircle, Terminal, PhoneCall, 
  Globe, Clock, ShieldX, Check, Flame, ChevronRight
} from 'lucide-react';

export default function LandingPage({ setCurrentRoute, onLaunchDemo }) {
  const howItWorksSteps = [
    {
      num: "01",
      step: "Submit",
      title: "Submit Content",
      desc: "Paste a suspicious message, upload a screenshot, or enter a questionable URL.",
      icon: Terminal,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20"
    },
    {
      num: "02",
      step: "Analyze",
      title: "Deep Analysis",
      desc: "SafeSpeak inspects linguistic coercion, hidden financial traps, and warning signals.",
      icon: Cpu,
      color: "text-sky-400",
      border: "border-sky-500/30",
      bg: "bg-sky-950/20"
    },
    {
      num: "03",
      step: "Understand",
      title: "Understand the Risk",
      desc: "See calibrated risk score, quoted evidence, clear explanation, and the 4-stage Risk Story.",
      icon: Eye,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-950/20"
    },
    {
      num: "04",
      step: "Act",
      title: "Take Safety Action",
      desc: "Follow protective checklists, block threats, or prepare an official cybercrime complaint draft.",
      icon: ShieldCheck,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20"
    }
  ];

  const whySafeSpeakCards = [
    {
      title: "Explainable Analysis",
      desc: "Understand WHY something may be suspicious with clear non-technical explanations instead of opaque verdicts.",
      icon: Eye,
      badge: "Zero Jargon",
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20"
    },
    {
      title: "Privacy First",
      desc: "SafeSpeak processes scan information locally where possible. Review information before exporting or sharing it, and never enter passwords, live OTPs, or PINs.",
      icon: Lock,
      badge: "Local & Private",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
    },
    {
      title: "Tamil + English",
      desc: "Full UTF-8 Unicode support for regional threat scripts across English, Tamil (தமிழ்), and mixed code-switching.",
      icon: Globe,
      badge: "Multilingual",
      color: "text-teal-400 border-teal-500/30 bg-teal-950/20"
    },
    {
      title: "AI + Safety Rules",
      desc: "Combines an intelligent local deterministic rule engine with optional LLM enrichment and guaranteed graceful fallback.",
      icon: Cpu,
      badge: "Dual Architecture",
      color: "text-sky-400 border-sky-500/30 bg-sky-950/20"
    }
  ];

  const safetyTips = [
    "Never share One-Time Passwords (OTPs), PINs, or account passwords with anyone.",
    "Do not pay unexpected upfront registration, kit, or training fees for job or internship offers.",
    "Verify suspicious links independently before clicking or submitting personal credentials.",
    "Do not panic when a message creates artificial urgency, account deactivation threats, or countdowns.",
    "Preserve uncropped screenshots and transaction reference numbers if you believe you were targeted."
  ];

  return (
    <div className="space-y-24">
      {/* ======================================================== */}
      {/* SECTION 1 — HERO SECTION                                 */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-900">
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-sky-600/10 to-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Product Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold shadow-inner">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>SafeSpeak AI &bull; Digital Safety Assistant</span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  SafeSpeak <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">AI</span>
                </h1>
                <p className="text-2xl sm:text-3xl font-bold text-cyan-300 tracking-wide font-mono">
                  &ldquo;Think Before You Click.&rdquo;
                </p>
              </div>

              {/* Subhead */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Identify suspicious messages, phishing links, fake job offers and digital scams before they put you at risk.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setCurrentRoute('scan')}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Scan Now</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={() => setCurrentRoute('report-cybercrime')}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/40 hover:border-rose-500/70 transition-all"
                >
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>Report Cybercrime</span>
                </button>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Local Privacy-First Processing</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tamil + English Analysis</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Official 1930 / Portal Guidance</span>
                </div>
              </div>
            </div>

            {/* Right Hero Cybersecurity Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 shadow-2xl space-y-5">
                {/* Header telemetry mockup */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block animate-pulse" />
                    <span className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                      Threat Analysis Telemetry
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    Live Inspector
                  </span>
                </div>

                {/* Simulated Attack Sample Analysis Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Incoming WhatsApp Msg:</span>
                    <span className="text-rose-400 font-bold uppercase tracking-wider bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40 text-[10px]">
                      HIGH RISK (98/100)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono italic bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    &ldquo;Congratulations! Selected for TechVanguard internship. Pay ₹999 fee within 30 mins to confirm...&rdquo;
                  </p>
                </div>

                {/* Red Flag Indicators */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Detected Threat Signals
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">Upfront Fee Demand</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">30-Min Coercive Urgency</span>
                    </div>
                  </div>
                </div>

                {/* 4-Stage Risk Story Snippet */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5 text-xs">
                  <div className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Risk Story Deconstruction</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong className="text-cyan-200">Trigger:</strong> Fake internship bait &bull; <strong className="text-amber-300">Pressure:</strong> Artificial 30m deadline &bull; <strong className="text-rose-300">Hazard:</strong> Direct ₹999 loss.
                  </p>
                </div>

                {/* Quick Demo Button */}
                <button
                  onClick={onLaunchDemo}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Launch Live Interactive Simulation &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2 — WHAT SAFESPEAK CAN CHECK (3 CLEAN CARDS)     */}
      {/* ======================================================== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
            <span>Specialized Inspection Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What SafeSpeak Can Check
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Three dedicated threat scanners designed to dissect deception across text, links, and screenshots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Message Scanner */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all group hover:bg-slate-900/90 shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Message Scanner
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Analyze suspicious SMS, emails, WhatsApp messages, fake job offers and other text.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setCurrentRoute('scan-message')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
              >
                <span>Scan a Message</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Card 2: URL Checker */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all group hover:bg-slate-900/90 shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                URL Checker
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Analyze suspicious links and identify common phishing indicators.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setCurrentRoute('url-checker')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-sky-300 bg-sky-950/60 hover:bg-sky-500/20 border border-sky-500/30 transition-all"
              >
                <span>Check a URL</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </div>
          </div>

          {/* Card 3: Screenshot Scanner */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all group hover:bg-slate-900/90 shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Screenshot Scanner
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Upload a screenshot of a suspicious message and extract the text for analysis.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setCurrentRoute('screenshot-scanner')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all"
              >
                <span>Scan Screenshot</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3 — HOW IT WORKS (4-STEP PROFESSIONAL FLOW)     */}
      {/* ======================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
            <span>Structured Cybersecurity Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            A clear four-stage workflow transforming raw suspicious inputs into understandable, actionable digital defense.
          </p>
        </div>

        {/* 4-Step Cards with Visual Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {howItWorksSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.num} 
                className={`relative rounded-2xl p-6 bg-slate-900/60 border ${s.border} space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-600 font-mono">
                      {s.num}
                    </span>
                    <div className={`p-2.5 rounded-xl ${s.bg} border ${s.border}`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {s.step} &bull; {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Visual Pipeline Banner */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-center flex-wrap gap-3 text-xs sm:text-sm text-slate-300 font-semibold text-center">
          <span className="text-cyan-400">01. Submit</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-sky-400">02. Analyze</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-amber-400">03. Understand</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-emerald-400">04. Act</span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4 — WHY SAFESPEAK AI (4 CLEAN CARDS)             */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
            <span>Core Principles &amp; Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Why SafeSpeak AI
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Engineered specifically to solve the shortcomings of generic AI chatbots and binary scam detectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whySafeSpeakCards.map((c) => {
            const Icon = c.icon;
            return (
              <div 
                key={c.title}
                className="rounded-2xl p-6 bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${c.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {c.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5 — SHOW THE RISK STORY (VISUAL PERSUASION CHAIN)*/}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/80 border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Signature Feature</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Deconstructing the Attack: The Risk Story
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              SafeSpeak AI does not simply label a message &ldquo;SCAM&rdquo;. Instead, it deconstructs how social engineers psychologically manipulate recipients into hasty mistakes.
            </p>
          </div>

          {/* 4-Stage Visual Chain */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stage 1: Trigger */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Stage 01</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Trigger</h3>
              <p className="text-xs text-slate-300">
                What caught the user&apos;s attention? (e.g. attractive internship offer, bank security alert, lottery prize).
              </p>
            </div>

            {/* Stage 2: Pressure */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">Stage 02</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Pressure</h3>
              <p className="text-xs text-slate-300">
                Is the message creating artificial urgency, fear, or a 30-minute deadline to bypass calm rational thinking?
              </p>
            </div>

            {/* Stage 3: Request */}
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase">Stage 03</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Request</h3>
              <p className="text-xs text-slate-300">
                What is the user being asked to do? (Pay an upfront fee, share an OTP, or enter credentials on an unverified link).
              </p>
            </div>

            {/* Stage 4: Potential Risk */}
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Stage 04</span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Potential Risk</h3>
              <p className="text-xs text-slate-300">
                Why could this be dangerous? (Direct monetary theft, ongoing recurring charges, or identity impersonation).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
            Every scan report produces this breakdown in clear, non-technical language so users learn the manipulation patterns for life.
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 6 — CYBERCRIME ASSISTANCE SECTION                */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/30 border border-rose-500/30 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>Victim Assistance &bull; Official Helplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Think you&apos;ve been scammed?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              SafeSpeak can help you organize incident details, preserve relevant evidence and prepare a complaint draft before continuing to the appropriate official reporting channel.
            </p>
            <p className="text-xs text-slate-400 italic">
              * Note: SafeSpeak AI assists in preparing and formatting your factual incident statement. You submit the final report directly at official government portals (cybercrime.gov.in / 1930 Helpline).
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
            <button
              onClick={() => setCurrentRoute('report-cybercrime')}
              className="px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Prepare a Complaint
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl font-medium text-xs text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-center"
            >
              Visit cybercrime.gov.in &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 7 — PRACTICAL SAFETY TIPS                        */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
            <span>Essential Cyber Hygiene</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Everyday Safety Tips
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Five simple rules to protect your digital identity, bank accounts, and personal peace of mind.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {safetyTips.map((tip, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3.5 hover:border-slate-700 transition-all"
            >
              <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 8 — FINAL HOME PAGE CTA                          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Not sure whether it&apos;s safe?
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              Check before you click.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Never second-guess suspicious WhatsApp messages, questionable job offers, or urgent SMS warnings. Let SafeSpeak AI verify the evidence first.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentRoute('scan')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Scan Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => setCurrentRoute('report-cybercrime')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/40 transition-all"
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Report Cybercrime</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
