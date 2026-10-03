import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, Copy, Check, AlertCircle } from 'lucide-react';

export default function SafetyActionsChecklist({ actions = [], riskLevel = 'HIGH', inputContent = '' }) {
  const [completed, setCompleted] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleAction = (idx) => {
    setCompleted(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyReport = () => {
    const reportText = `[SafeSpeak AI Safety Report]
Risk Level: ${riskLevel}
Detected Content:
"${inputContent.slice(0, 300)}"

Recommended Safety Actions:
${actions.map((act, i) => `${i + 1}. ${act}`).join('\n')}

Generated via SafeSpeak AI - "Think Before You Click."`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              What Should You Do?
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Practical defense checklist tailored to this specific threat.
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Report Copied!' : 'Copy Incident Report'}</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {actions.map((action, idx) => {
          const isDone = !!completed[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleAction(idx)}
              className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-all border ${
                isDone 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400' 
                  : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="mt-0.5 text-cyan-400 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                )}
              </div>
              <span className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}`}>
                {action}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
