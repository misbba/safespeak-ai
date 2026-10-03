import React from 'react';
import { Flag, CheckCircle2, AlertOctagon, ShieldAlert } from 'lucide-react';

export default function WarningSignalsList({ warningSignals = [] }) {
  if (!warningSignals || warningSignals.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 text-center space-y-2">
        <div className="inline-flex p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h4 className="text-base font-semibold text-slate-200">
          No Red Flag Warning Signals Detected
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The content does not contain common social-engineering patterns, urgency triggers, or deceptive payment/credential solicitations.
        </p>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-950/80 text-red-300 border-red-500/60';
      case 'high':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      case 'medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'low':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
          <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertOctagon className="w-4 h-4" />
          </span>
          <span>Detected Warning Indicators</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 font-mono">
            {warningSignals.length} Flag{warningSignals.length > 1 ? 's' : ''}
          </span>
        </h3>
        <span className="text-xs text-slate-400">
          Transparent evidence-backed risk signals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {warningSignals.map((signal, idx) => {
          const evidence = signal.evidence || signal.quote;
          const description = signal.description || signal.explanation;
          const severity = signal.severity || 'high';

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-400/50 transition-all space-y-2.5 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
            >
              {/* Header: Flag icon, title, severity & points */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🚩</span>
                  <h4 className="text-sm font-semibold text-rose-300">
                    {signal.title || 'Warning Indicator'}
                  </h4>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(severity)}`}>
                    {severity}
                  </span>
                  {signal.score_contribution && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-rose-300 border border-slate-800">
                      +{signal.score_contribution} pts
                    </span>
                  )}
                </div>
              </div>

              {/* Quoted Evidence */}
              {evidence && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                    Detected Evidence:
                  </span>
                  <div className="text-xs font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 text-rose-200/90 italic">
                    &ldquo;{evidence}&rdquo;
                  </div>
                </div>
              )}

              {/* Description / Explanation */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
