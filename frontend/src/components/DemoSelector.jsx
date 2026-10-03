import React from 'react';
import { Sparkles, Briefcase, Landmark, Trophy, ShieldAlert, CheckCircle, Link } from 'lucide-react';

export default function DemoSelector({ onSelectSample, activeSampleId = null }) {
  const samples = [
    {
      id: 'sample-internship',
      title: 'Fake Internship Offer',
      category: 'Job / Internship Scam',
      icon: Briefcase,
      color: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
      badge: 'High Risk (87/100)',
      text: 'Congratulations! You have been selected for an exclusive internship at TechVanguard Solutions. Pay ₹999 registration fee within 30 minutes to confirm your position. Click here: http://secure-job-enroll.biz/pay'
    },
    {
      id: 'sample-bank',
      title: 'Fake Bank KYC Alert',
      category: 'Banking Phishing',
      icon: Landmark,
      color: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
      badge: 'High Risk (92/100)',
      text: 'Dear SBI Customer, Your A/C XX4892 is temporarily blocked due to pending KYC verification. To avoid permanent suspension, update your PAN & Aadhaar details immediately at http://sbi-banking-kyc-update.xyz/verify-pan within 24 hours.'
    },
    {
      id: 'sample-lottery',
      title: 'Prize / Lottery Scam',
      category: 'Lottery Scam',
      icon: Trophy,
      color: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
      badge: 'High Risk (89/100)',
      text: 'DEAR WINNER! Your mobile number won cash prize of Rs 25,00,000 in KBC All India Lucky Draw 2026. To claim your prize cheque, contact WhatsApp Manager Mr. Rana on +91-9876543210 and pay Rs 1,500 file processing fee now. Ticket ID: KBC-998822.'
    },
    {
      id: 'sample-login',
      title: 'Suspicious Login Alert',
      category: 'Credential Theft',
      icon: ShieldAlert,
      color: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
      badge: 'High Risk (85/100)',
      text: 'SECURITY ALERT: We detected an unauthorized login attempt to your Amazon account from Moscow, Russia. If this was not you, verify your identity immediately to protect your saved payment methods: http://amazon-account-protection.site/restore'
    },
    {
      id: 'sample-legit',
      title: 'Normal Legitimate Message',
      category: 'Work Communication',
      icon: CheckCircle,
      color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
      badge: 'Low Risk (12/100)',
      text: 'Hi Team, the project design sync is confirmed for tomorrow at 3:00 PM on Google Meet. Please find the agenda attached in our shared workspace drive. See you then! - Priya'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Predefined Test Examples:</span>
        </span>
        <span className="text-[11px] text-slate-500">
          Click to load realistic sample
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {samples.map((sample) => {
          const Icon = sample.icon;
          const isSelected = activeSampleId === sample.id;

          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <Icon className="w-3.5 h-3.5 text-slate-300" />
                  <span className="font-semibold text-white truncate max-w-[130px]">
                    {sample.title}
                  </span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${sample.color}`}>
                  {sample.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 italic font-mono bg-slate-950/40 p-1.5 rounded">
                &ldquo;{sample.text}&rdquo;
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
