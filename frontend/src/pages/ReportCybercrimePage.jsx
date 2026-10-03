import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldAlert, AlertTriangle, CheckCircle2, Copy, Download, 
  ExternalLink, PhoneCall, ArrowLeft, ArrowRight, Printer, RefreshCw, 
  Clock, CreditCard, Send, Lock, HelpCircle, ChevronRight, Check, X
} from 'lucide-react';
import { api } from '../services/api';
import { generateLocalDraft, OFFICIAL_PORTAL_URL, FINANCIAL_FRAUD_HELPLINE, COMPLAINT_CATEGORIES } from '../services/complaintGenerator';

const CATEGORY_METADATA = [
  { id: 'Phishing or fake bank messages', icon: '🏦', desc: 'KYC alerts, fake bank SMS, deactivation threats, card blocking lures' },
  { id: 'UPI or payment fraud', icon: '💳', desc: 'Fraudulent QR codes, collect requests, fake refund links, advance UPI demands' },
  { id: 'Fake job or internship offers', icon: '💼', desc: 'Registration fees demanded, fake appointment letters, interview deposit traps' },
  { id: 'Online financial fraud', icon: '💰', desc: 'Unauthorized credit/debit card transactions, unauthorized netbanking debits' },
  { id: 'Social media impersonation', icon: '👤', desc: 'Cloned profiles, friend-in-distress scams, celebrity investment lures' },
  { id: 'Account compromise', icon: '🔐', desc: 'Unauthorized access to email, social media, WhatsApp, or cloud accounts' },
  { id: 'Online shopping fraud', icon: '📦', desc: 'Fake ecommerce portals, paid orders never delivered, fake parcel tracking' },
  { id: 'Identity theft', icon: '🪪', desc: 'Aadhaar, PAN, SSN or credentials misused to open fraudulent accounts' },
  { id: 'Suspicious website or link', icon: '🌐', desc: 'Deceptive phishing portals, malicious redirect URLs, typosquatting domains' },
  { id: 'Cyberbullying or online harassment', icon: '⚠️', desc: 'Online stalking, abusive messaging, blackmail, defamatory content' },
  { id: 'Other cybercrime', icon: '🛡️', desc: 'Malware, ransomware, crypto fraud, or unlisted digital threats' },
];

export default function ReportCybercrimePage({ initialScanResult = null, setCurrentRoute }) {
  // Wizard Steps: 1: Category, 2: Incident Details, 3: Evidence Checklist, 4: Draft & Export
  const [step, setStep] = useState(1);

  // Form State
  const [category, setCategory] = useState('Phishing or fake bank messages');
  const [incidentDate, setIncidentDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [platform, setPlatform] = useState('SMS / WhatsApp');
  const [description, setDescription] = useState('');
  const [suspectIdentifier, setSuspectIdentifier] = useState('');
  const [moneyLost, setMoneyLost] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [transactionRef, setTransactionRef] = useState('');
  const [bankContacted, setBankContacted] = useState(false);
  
  // Evidence items selected
  const [evidenceItems, setEvidenceItems] = useState([
    'Full unedited screenshot with sender phone/handle and timestamp',
    'Original message text or email headers preserved without changes',
    'Suspect link or phone number saved'
  ]);

  // Draft Result State
  const [draftResult, setDraftResult] = useState(null);
  const [editableDraft, setEditableDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // 1930 Helpline Modal State (for Desktop)
  const [showHelplineModal, setShowHelplineModal] = useState(false);
  const [copiedHelpline, setCopiedHelpline] = useState(false);

  // Pre-fill from initialScanResult if provided
  useEffect(() => {
    if (initialScanResult) {
      // Determine probable category
      const text = initialScanResult.input_content || initialScanResult.extracted_text || '';
      const signals = initialScanResult.signals || initialScanResult.warning_signals || [];
      const signalIds = signals.map(s => s.signal_id);

      if (signalIds.includes('JOB_OR_INTERNSHIP_FEE')) {
        setCategory('Fake job or internship offers');
      } else if (signalIds.includes('ACCOUNT_SUSPENSION') || signalIds.includes('OTP_REQUEST') || signalIds.includes('CREDENTIAL_REQUEST')) {
        setCategory('Phishing or fake bank messages');
      } else if (signalIds.includes('PAYMENT_REQUEST')) {
        setCategory('UPI or payment fraud');
      } else if (initialScanResult.content_type === 'url' || signalIds.includes('SUSPICIOUS_URL')) {
        setCategory('Suspicious website or link');
      } else if (signalIds.includes('REWARD_OR_PRIZE')) {
        setCategory('Online financial fraud');
      }

      if (initialScanResult.content_type === 'url') {
        setPlatform('Web Browser / Link');
        setSuspectIdentifier(text);
      } else {
        setPlatform('SMS / WhatsApp');
        const urlMatch = text.match(/https?:\/\/[^\s]+/i);
        const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
        if (urlMatch) setSuspectIdentifier(urlMatch[0]);
        else if (phoneMatch) setSuspectIdentifier(phoneMatch[0]);
      }

      // Build structured initial description from actual scan data
      let desc = `Suspicious communication received. SafeSpeak AI automated evaluation flagged content as ${initialScanResult.risk_level || 'HIGH'} RISK (Risk Score: ${initialScanResult.risk_score || 'N/A'}/100).\n\nOriginal content received:\n"${text}"`;
      if (initialScanResult.explanation) {
        desc += `\n\nIdentified threat pattern: ${initialScanResult.explanation}`;
      }
      setDescription(desc);

      // Pre-add scan findings to evidence
      setEvidenceItems(prev => [
        ...prev,
        `SafeSpeak AI Threat Telemetry Report (Scan ID: ${initialScanResult.scan_id || 'N/A'}, Risk Score: ${initialScanResult.risk_score || 'N/A'}/100)`
      ]);

      // Jump straight to Step 2 if coming from a scan
      setStep(2);
    }
  }, [initialScanResult]);

  // Robust Cross-Device Call 1930 Handler
  const handleCall1930 = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));

    if (isMobile) {
      window.location.href = `tel:${FINANCIAL_FRAUD_HELPLINE}`;
    } else {
      setShowHelplineModal(true);
    }
  };

  const handleCopy1930 = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText('1930');
      } else {
        const ta = document.createElement('textarea');
        ta.value = '1930';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedHelpline(true);
      setTimeout(() => setCopiedHelpline(false), 2500);
    } catch (err) {
      console.error("Failed to copy 1930:", err);
    }
  };

  const handleToggleEvidence = (itemText) => {
    if (evidenceItems.includes(itemText)) {
      setEvidenceItems(evidenceItems.filter(i => i !== itemText));
    } else {
      setEvidenceItems([...evidenceItems, itemText]);
    }
  };

  // Step 2 Validation when advancing to Step 3
  const handleProceedToEvidence = () => {
    setValidationError(null);

    if (!description.trim() || description.trim().length < 10) {
      setValidationError("Please describe what occurred in the incident statement (at least 10 characters).");
      return;
    }

    if (moneyLost && (!amount || isNaN(Number(amount)) || Number(amount) <= 0)) {
      setValidationError("Please enter a valid positive monetary loss amount.");
      return;
    }

    setStep(3);
  };

  // Step 3 -> Generate Formal Complaint Draft
  const handleGenerateDraft = async () => {
    setValidationError(null);

    if (!description.trim() || description.trim().length < 10) {
      setValidationError("Please complete the incident description (at least 10 characters). Click 'Back to Details' to enter it.");
      return;
    }

    if (moneyLost && (!amount || isNaN(Number(amount)) || Number(amount) <= 0)) {
      setValidationError("Please provide a valid monetary loss amount. Click 'Back to Details' to enter it.");
      return;
    }

    setIsGenerating(true);
    setGenerateSuccess(false);

    const payload = {
      category,
      incident_date: incidentDate,
      platform,
      description: description.trim(),
      suspect_identifier: suspectIdentifier.trim(),
      money_lost: moneyLost,
      amount: moneyLost ? Number(amount) : 0,
      currency,
      transaction_ref: transactionRef.trim(),
      bank_contacted: bankContacted,
      evidence_items: evidenceItems,
      scan_findings: initialScanResult ? {
        risk_level: initialScanResult.risk_level,
        risk_score: initialScanResult.risk_score,
        confidence: initialScanResult.confidence,
        signals: initialScanResult.signals || initialScanResult.warning_signals,
        explanation: initialScanResult.explanation,
        scan_id: initialScanResult.scan_id
      } : null
    };

    try {
      const res = await api.generateComplaintDraft(payload);
      setDraftResult(res);
      setEditableDraft(res.draft_text);
      setGenerateSuccess(true);
      setTimeout(() => {
        setStep(4);
        setGenerateSuccess(false);
      }, 500);
    } catch (err) {
      console.warn("Backend API draft generation failed, using local generator:", err);
      const localRes = generateLocalDraft(payload);
      setDraftResult(localRes);
      setEditableDraft(localRes.draft_text);
      setGenerateSuccess(true);
      setTimeout(() => {
        setStep(4);
        setGenerateSuccess(false);
      }, 500);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDraft = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(editableDraft);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = editableDraft;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([editableDraft], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "safespeak-cybercrime-complaint.txt";
    document.body.appendChild(element);
    element.click();
    setTimeout(() => {
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    }, 100);
  };

  const handleOpenPortal = () => {
    window.open(OFFICIAL_PORTAL_URL, '_blank', 'noopener,noreferrer');
  };

  const handleEditDetails = () => {
    setStep(2);
  };

  // Extract signals to display in draft panel
  const detectedSignalsList = initialScanResult?.signals || initialScanResult?.warning_signals || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Official Reporting Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Report Cybercrime &amp; Document Incident
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Prepare a factual, standardized complaint draft to report online fraud, phishing, or scams to the National Cyber Crime Reporting Portal (<a href={OFFICIAL_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">cybercrime.gov.in</a>) or your local law enforcement.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SECTION 6: EMERGENCY BANNER                              */}
      {/* ======================================================== */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
            <PhoneCall className="w-4 h-4 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                FINANCIAL CYBER FRAUD EMERGENCY
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700/60 font-mono">
                India 24x7
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If money has been lost due to financial cyber fraud, contact <strong>1930</strong> immediately and contact your bank/payment provider.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={handleCall1930}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(244,63,94,0.35)]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 1930</span>
          </button>

          <button
            type="button"
            onClick={handleOpenPortal}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            <span>Report Online</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1930 DESKTOP MODAL / DIALOG (Section 1)                  */}
      {/* ======================================================== */}
      {showHelplineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowHelplineModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Financial Cyber Fraud?
                </h3>
                <p className="text-sm font-semibold text-rose-400">
                  Call 1930 immediately.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              1930 is the National Cyber Crime Helpline for reporting financial cyber fraud. Reporting within the golden hour helps law enforcement freeze fraudulent bank transactions.
            </p>

            {copiedHelpline && (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Helpline number 1930 copied to clipboard!</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => { window.location.href = `tel:${FINANCIAL_FRAUD_HELPLINE}`; }}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1930</span>
              </button>

              <button
                onClick={handleCopy1930}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy 1930</span>
              </button>

              <button
                onClick={() => {
                  setShowHelplineModal(false);
                  handleOpenPortal();
                }}
                className="py-2.5 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Report Online</span>
              </button>

              <button
                onClick={() => setShowHelplineModal(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Wizard Navigation */}
      <div className="grid grid-cols-4 gap-2 border-b border-slate-800 pb-3">
        {[
          { num: 1, label: 'Incident Type' },
          { num: 2, label: 'Incident Details' },
          { num: 3, label: 'Evidence Checklist' },
          { num: 4, label: 'Draft & Export' }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            className={`flex items-center space-x-2 pb-2 text-left transition-all border-b-2 -mb-3.5 ${
              step === s.num
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : step > s.num
                ? 'border-emerald-500 text-emerald-400 hover:text-emerald-300 cursor-pointer'
                : 'border-transparent text-slate-500 cursor-not-allowed'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === s.num
                ? 'bg-cyan-500 text-slate-950'
                : step > s.num
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {step > s.num ? <Check className="w-3 h-3" /> : s.num}
            </span>
            <span className="text-xs hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* STEP 1: CHOOSE INCIDENT TYPE                             */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Step 1: Select the Incident Category</span>
            </h2>
            <p className="text-xs text-slate-400">
              Choose the category that best matches what occurred. This helps structure the complaint in accordance with official law enforcement portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CATEGORY_METADATA.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span className="text-2xl shrink-0 p-1 bg-slate-950 rounded-lg border border-slate-800">{cat.icon}</span>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {cat.id}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg transition-all"
            >
              <span>Continue to Incident Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: INCIDENT DETAILS                                 */}
      {/* ======================================================== */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Step 2: Collect Incident Details</h2>
              <p className="text-xs text-slate-400">
                Provide clear, factual statements. Only include verified information. Do not enter passwords, live OTPs, or PINs.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-medium truncate max-w-xs">
              Category: {category}
            </span>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            {/* Row 1: Date & Platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Incident Date &amp; Time (Approximate) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Platform / Channel <span className="text-rose-400">*</span>
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="SMS / WhatsApp">SMS / WhatsApp Message</option>
                  <option value="Email">Email Communication</option>
                  <option value="Telegram">Telegram Channel / Direct Message</option>
                  <option value="Phone Call / Voice">Unsolicited Phone Call / Voice</option>
                  <option value="Instagram / Facebook">Social Media (Instagram / Facebook / X)</option>
                  <option value="Web Browser / Link">Deceptive Website / Phishing URL</option>
                  <option value="Other Digital Channel">Other Digital Channel</option>
                </select>
              </div>
            </div>

            {/* Suspect Identifiers */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Suspect Phone Number, Email, URL, or Social Handle (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. +91-9876543210, fraud-alert@xyz.com, http://sbi-fake-kyc.xyz, @scam_account"
                value={suspectIdentifier}
                onChange={(e) => setSuspectIdentifier(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Include the exact sender handle, link, or phone number used by the suspected entity.
              </p>
            </div>

            {/* Incident Statement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                What Happened? (Chronological Statement) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="State the facts clearly: What message was received? What action was demanded? What links were clicked? Mention exact dates, times, and amounts if any..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full p-3.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Be objective and factual. Avoid unverified assumptions.</span>
                <span>{description.length} characters</span>
              </div>
            </div>

            {/* Financial Loss Toggle */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Did you suffer a direct monetary loss?</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Indicate if money was debited from your bank, UPI, credit card, or crypto wallet.
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => { setMoneyLost(false); setValidationError(null); }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      !moneyLost ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    No Loss
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoneyLost(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      moneyLost ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Yes, Money Lost
                  </button>
                </div>
              </div>

              {/* Conditional Loss Fields */}
              {moneyLost && (
                <div className="pt-3 border-t border-slate-800 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Amount Lost <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-400"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Transaction Ref / UTR / UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UPI/123456789012"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="bankContacted"
                      checked={bankContacted}
                      onChange={(e) => setBankContacted(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="bankContacted" className="text-xs text-slate-300">
                      I have already alerted my bank / payment app customer support to dispute or freeze this transaction.
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Category</span>
            </button>
            <button
              onClick={handleProceedToEvidence}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg transition-all"
            >
              <span>Continue to Evidence Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: EVIDENCE CHECKLIST                               */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Step 3: Evidence Checklist &amp; Preservation Guidance</h2>
            <p className="text-xs text-slate-400">
              Law enforcement and cybercrime investigators require verifiable digital artifacts. Check all items that you currently possess and preserve.
            </p>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interactive Checklist */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Evidence Items in Your Possession</span>
              </h3>

              <div className="space-y-2">
                {[
                  'Full unedited screenshot with sender phone/handle and timestamp',
                  'Original message text or email headers preserved without changes',
                  'Suspect link, website URL, or phone number saved',
                  'Transaction receipt, UTR number, or bank debit statement',
                  'Call log showing incoming phone number and timestamp',
                  'Chat export / conversation history backup',
                  'Payment app confirmation or QR code copy'
                ].map((item, idx) => {
                  const isChecked = evidenceItems.includes(item);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleEvidence(item)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center space-x-2.5 transition-colors ${
                        isChecked 
                          ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-100'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                      />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidence Preservation Guidelines */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>How to Preserve Digital Evidence</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span><strong>Do not delete chats:</strong> Never delete the fraudulent SMS or WhatsApp conversation thread, even if upset. Law enforcement can request carrier logs.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span><strong>Capture full device screens:</strong> Ensure screenshots include the top status bar (showing clock/date, network) and the sender’s full handle/phone number.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span><strong>Save Bank Statements:</strong> Download the official PDF debit advisory showing the unique 12-digit UPI UTR number or IMPS reference.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span><strong>Avoid Alteration:</strong> Do not crop, annotate, or alter evidence images with photo editors.</span>
                </li>
              </ul>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Note:</strong> SafeSpeak processes incident documentation locally where possible. Review information before exporting or sharing it.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Details</span>
            </button>

            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg transition-all ${
                generateSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950'
              } disabled:opacity-60`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generating Draft...</span>
                </>
              ) : generateSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Complaint Draft Ready ✓</span>
                </>
              ) : (
                <>
                  <span>Generate Formal Complaint Draft</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: DRAFT RESULT & EXPORT (Section 3)                */}
      {/* ======================================================== */}
      {step === 4 && (
        <div className="space-y-6">
          {/* Important Submission Advisory Banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">
                SafeSpeak AI prepares this draft for your review. It does not submit complaints to law enforcement.
              </p>
              <p className="text-slate-300 text-[11px]">
                Copy or download this text, then paste it directly into the official portal (<a href={OFFICIAL_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">cybercrime.gov.in</a>).
              </p>
            </div>
          </div>

          {/* Action Bar with Requested Working Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                Draft Ready
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {editableDraft.length} chars
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyDraft}
                className="px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? 'Complaint draft copied!' : 'Copy Draft'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>Download TXT</span>
              </button>

              <button
                onClick={handleOpenPortal}
                className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow"
              >
                <span>Open Cyber Crime Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleEditDetails}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            </div>
          </div>

          {/* Structured Formal Cybercrime Complaint Draft View */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                  Official Standardized Format
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
                FORMAL CYBERCRIME COMPLAINT DRAFT
              </h2>
            </div>

            {/* Field Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Incident Type
                </span>
                <p className="text-white font-bold text-sm">
                  {category}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Incident Date / Time
                </span>
                <p className="text-white font-mono text-sm">
                  {incidentDate.replace('T', ' ')}
                </p>
              </div>
            </div>

            {/* Incident Description */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Incident Description (Chronological Statement)
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {/* Suspicious Indicators */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Suspicious Indicators
              </span>
              {detectedSignalsList.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {detectedSignalsList.map((sig, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center space-x-1"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>{sig.title || sig.signal_id}</span>
                      {sig.score_contribution && (
                        <span className="text-[10px] text-rose-400 font-mono">+{sig.score_contribution}</span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Category: {category} &bull; Communication channel: {platform} {suspectIdentifier ? `&bull; Identifier: ${suspectIdentifier}` : ''}
                </p>
              )}
            </div>

            {/* Evidence Available */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Evidence Available &amp; Preserved
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {evidenceItems.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Information */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Additional Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500">Platform:</span> <strong className="text-white">{platform}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Suspect Identifier:</span> <strong className="text-white font-mono">{suspectIdentifier || "Under Investigation"}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Financial Loss:</span> <strong className={moneyLost ? "text-rose-400 font-bold" : "text-slate-300"}>
                    {moneyLost ? `${currency} ${amount} (Ref: ${transactionRef || 'N/A'})` : 'No direct monetary loss reported'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Bank Contacted:</span> <strong className="text-white">{bankContacted ? 'Yes - Bank alerted' : 'No / N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Requested Action */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
              <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
                Requested Action
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                Factual request for law enforcement review, investigation, and digital infrastructure trace under the Information Technology Act &amp; applicable criminal provisions{moneyLost ? `, and immediate fund freeze assistance via the National Cyber Crime Portal (1930)` : ''}.
              </p>
            </div>

            {/* Editable Full Draft Textarea */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">
                  Full Formatted Text (Ready to Copy/Download):
                </span>
                <span>{editableDraft.length} characters</span>
              </div>
              <textarea
                rows={14}
                value={editableDraft}
                onChange={(e) => setEditableDraft(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
