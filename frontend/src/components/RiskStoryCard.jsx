import React from 'react';
import { Target, Flame, ArrowDown, CreditCard, ShieldAlert, Sparkles } from 'lucide-react';

export default function RiskStoryCard({ riskStory }) {
  if (!riskStory) return null;

  const steps = [
    {
      num: '01',
      stage: 'TRIGGER',
      label: 'The Lure / Hook',
      desc: riskStory.trigger || 'Initial hook or communication opening.',
      icon: Target,
      color: 'text-sky-400',
      border: 'border-sky-500/30',
      badgeBg: 'bg-sky-950/70 text-sky-300 border-sky-500/40',
      lightBg: 'from-sky-950/20 to-slate-900/60'
    },
    {
      num: '02',
      stage: 'PRESSURE',
      label: 'Psychological Urgency',
      desc: riskStory.pressure || 'Artificial urgency or fear-inducing constraint.',
      icon: Flame,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
      lightBg: 'from-amber-950/20 to-slate-900/60'
    },
    {
      num: '03',
      stage: 'REQUEST',
      label: 'The Demanded Action',
      desc: riskStory.request || 'Call to action: payment, credentials, or link click.',
      icon: CreditCard,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      badgeBg: 'bg-rose-950/70 text-rose-300 border-rose-500/40',
      lightBg: 'from-rose-950/20 to-slate-900/60'
    },
    {
      num: '04',
      stage: 'POTENTIAL RISK',
      label: 'Vulnerability / Outcome',
      desc: riskStory.potential_risk || 'Resulting hazard if the user complies.',
      icon: ShieldAlert,
      color: 'text-red-400',
      border: 'border-red-500/30',
      badgeBg: 'bg-red-950/70 text-red-300 border-red-500/40',
      lightBg: 'from-red-950/20 to-slate-900/60'
    }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Signature AI Architecture
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            How the Message Is Trying to Influence You
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Deconstructing the psychological persuasion chain commonly used in social-engineering attacks.
        </p>
      </div>

      {/* 4-Stage Influence Chain */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.stage} className="relative flex flex-col">
              {/* Card */}
              <div className={`flex-1 p-4 rounded-xl bg-gradient-to-br ${step.lightBg} border ${step.border} transition-all hover:translate-y-[-2px] hover:shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${step.badgeBg}`}>
                    {step.stage}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-300 mb-1">
                  {step.label}
                </div>

                <p className="text-xs text-slate-300/90 leading-relaxed font-mono bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                  &ldquo;{step.desc}&rdquo;
                </p>
              </div>

              {/* Connecting arrow for mobile / desktop */}
              {!isLast && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 items-center justify-center text-slate-400">
                  <span className="text-[10px] font-bold">→</span>
                </div>
              )}
              {!isLast && (
                <div className="md:hidden flex justify-center my-1.5 text-slate-500">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
