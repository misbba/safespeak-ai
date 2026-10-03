import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, Info, Activity } from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'LOW', confidence = 'High', summary = '' }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Gauge circular math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc (3/4 of a circle)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100;

  // Determine styling based on level
  let theme = {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'border-emerald-500/30',
    glowClass: 'cyber-glow-emerald',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    titleColor: 'text-emerald-400',
    icon: ShieldCheck,
    tag: 'LOW RISK'
  };

  if (level === 'HIGH' || normalizedScore >= 65) {
    theme = {
      color: '#f43f5e',
      bgColor: 'rgba(244, 63, 94, 0.12)',
      borderColor: 'border-rose-500/40',
      glowClass: 'cyber-glow-rose',
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
      titleColor: 'text-rose-400',
      icon: AlertTriangle,
      tag: 'HIGH RISK'
    };
  } else if (level === 'MEDIUM' || normalizedScore >= 35) {
    theme = {
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'border-amber-500/40',
      glowClass: 'cyber-glow-amber',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
      titleColor: 'text-amber-400',
      icon: AlertCircle,
      tag: 'MEDIUM RISK'
    };
  }

  const IconComponent = theme.icon;

  // Confidence badge color
  const confColor = confidence?.toLowerCase() === 'high' 
    ? 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40'
    : confidence?.toLowerCase() === 'medium'
      ? 'text-amber-300 bg-amber-950/70 border-amber-500/40'
      : 'text-slate-300 bg-slate-800 border-slate-700';

  return (
    <div className={`p-6 rounded-2xl bg-slate-900/90 border ${theme.borderColor} ${theme.glowClass} transition-all`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Interactive Radial Gauge */}
        <div className="relative flex items-center justify-center w-44 h-44 shrink-0">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
            {/* Background Track Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1e293b"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={theme.color}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {normalizedScore}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              / 100 Score
            </span>
          </div>
        </div>

        {/* Right: Assessment Level, Summary & Mandatory Disclaimer */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.badgeBg}`}>
              <IconComponent className="w-3.5 h-3.5" />
              <span>{theme.tag}</span>
            </span>

            {/* Confidence Badge */}
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${confColor}`}>
              <Activity className="w-3 h-3" />
              <span>Confidence: {confidence || 'High'}</span>
            </span>

            <span className="text-xs text-slate-400 font-medium">
              Calibrated Evaluation
            </span>
          </div>

          <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${theme.titleColor}`}>
            {level === 'HIGH' && 'High-Risk Warning Indicators Detected'}
            {level === 'MEDIUM' && 'Elevated Caution Recommended'}
            {level === 'LOW' && 'No Significant Warning Indicators Detected'}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            {summary || 'AI evaluation complete based on contextual heuristics and language patterns.'}
          </p>

          {/* AI Responsible Disclaimer Note */}
          <div className="flex items-start space-x-2 pt-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="text-slate-300 font-medium">Evaluation Note:</strong> Risk score reflects the strength of detected warning indicators. Confidence reflects the depth and specificity of available evidence. This assessment is not mathematical proof of fraud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
