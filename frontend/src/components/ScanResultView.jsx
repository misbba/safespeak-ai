import React from 'react';
import RiskGauge from './RiskGauge';
import WarningSignalsList from './WarningSignalsList';
import RiskStoryCard from './RiskStoryCard';
import ExplainSimply from './ExplainSimply';
import SafetyActionsChecklist from './SafetyActionsChecklist';
import { Sparkles, RotateCcw, ShieldAlert, Calendar, ArrowLeft, Cpu, FileText, ArrowRight } from 'lucide-react';

export default function ScanResultView({ result, onReset, onReportComplaint }) {
  if (!result) return null;

  const engineLabel = result.engine === 'hybrid' 
    ? 'Hybrid AI + Heuristic Engine' 
    : result.engine === 'url-heuristics'
      ? 'URL Structural Heuristics'
      : 'Rule-Based Safety Engine';

  const isSuspicious = result.risk_level === 'HIGH' || result.risk_level === 'MEDIUM' || (result.risk_score && result.risk_score >= 35);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Demo Mode Banner (if simulated) */}
      {result.is_demo && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">
              Demo Mode — simulated analysis
            </span>
          </div>
          <span className="text-[11px] text-amber-400/80 hidden sm:inline">
            Demonstrating calibrated detection logic &amp; Risk Story
          </span>
        </div>
      )}

      {/* Input Snippet & Engine Metadata Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start space-x-3 overflow-hidden">
          <span className="px-2 py-1 rounded bg-slate-800 text-cyan-300 font-semibold uppercase text-[10px] shrink-0 border border-slate-700">
            {result.content_type || 'Message'}
          </span>
          <div className="overflow-hidden">
            <span className="text-slate-400">Analyzed Content: </span>
            <span className="text-slate-200 font-mono truncate inline-block max-w-md sm:max-w-xl align-bottom">
              &ldquo;{result.input_content || result.extracted_text || 'Submitted sample'}&rdquo;
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>{engineLabel}</span>
          </span>

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scan Another</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Main Risk Assessment Gauge Card with Confidence */}
      <RiskGauge
        score={result.risk_score}
        level={result.risk_level}
        confidence={result.confidence || 'High'}
        summary={result.summary}
      />

      {/* 2. Detected Warning Signals List with Evidence & Severity */}
      <WarningSignalsList
        warningSignals={result.signals || result.warning_signals}
      />

      {/* 3. The Signature Risk Story ("How the Message Is Trying to Influence You") */}
      <RiskStoryCard
        riskStory={result.risk_story}
      />

      {/* 4. Explain Simply Non-Technical Breakdown */}
      <ExplainSimply
        explanation={result.explanation}
      />

      {/* 5. Recommended Safety Actions Checklist */}
      <SafetyActionsChecklist
        actions={result.recommended_actions}
        riskLevel={result.risk_level}
        inputContent={result.input_content || result.extracted_text || ''}
      />

      {/* 6. CONNECT SCAN RESULTS TO COMPLAINT ASSISTANCE */}
      {isSuspicious && onReportComplaint && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-cyan-950/30 border border-rose-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h4 className="text-base font-bold text-white">Suspect Digital Fraud or Scam Attempt?</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-700/50 uppercase font-mono">Incident Reporting</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Transfer this scan’s telemetry, detected warning indicators, and evidence directly into a formal cybercrime complaint draft for official submission at <strong>cybercrime.gov.in</strong> or helpline <strong>1930</strong>.
            </p>
          </div>

          <button
            onClick={() => onReportComplaint(result)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all shrink-0 transform hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4" />
            <span>Prepare a Cybercrime Complaint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Action Footer */}
      {onReset && (
        <div className="pt-4 flex justify-center space-x-4">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 hover:from-cyan-400 hover:to-sky-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Start a New Scan</span>
          </button>
        </div>
      )}
    </div>
  );
}
