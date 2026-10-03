import React from 'react';
import { Lightbulb, MessageSquareQuote } from 'lucide-react';

export default function ExplainSimply({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-950/40 via-cyan-950/30 to-indigo-950/30 border border-cyan-500/30 shadow-md">
      <div className="flex items-start space-x-3.5">
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
              <span>Explain Simply</span>
            </h4>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/60">
              Plain English (No Jargon)
            </span>
          </div>
          <p className="text-sm text-cyan-100/90 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
