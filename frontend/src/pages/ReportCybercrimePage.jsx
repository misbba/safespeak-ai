import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldAlert, AlertTriangle, CheckCircle2, Copy, Download, 
  ExternalLink, PhoneCall, ArrowLeft, ArrowRight, Printer, RefreshCw, 
  Clock, CreditCard, Send, Lock, HelpCircle, ChevronRight, Check
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
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Pre-fill from initialScanResult if provided
  useEffect(() => {
    if (initialScanResult) {
      // Determine probable category
      const text = initialScanResult.input_content || '';
      const signals = initialScanResult.signals || initialScanResult.warning_signals || [];
      const signalIds = signals.map(s => s.signal_id);

      if (signalIds.includes('JOB_OR_INTERNSHIP_FEE')) {
        setCategory('Fake job or internship offers');
      } else if (signalIds.includes('ACCOUNT_SUSPENSION') || signalIds.includes('OTP_REQUEST')) {
        setCategory('Phishing or fake bank messages');
      } else if (signalIds.includes('PAYMENT_REQUEST')) {
        setCategory('UPI or payment fraud');
      } else if (initialScanResult.content_type === 'url') {
        setCategory('Suspicious website or link');
      }

      if (initialScanResult.content_type === 'url') {
        setPlatform('Web Browser / Link');
        setSuspectIdentifier(text);
      } else {
        setPlatform('SMS / WhatsApp');
        // Extract URL or phone if present
        const urlMatch = text.match(/https?:\/\/[^\s]+/i);
        if (urlMatch) setSuspectIdentifier(urlMatch[0]);
      }

      // Build structured initial description
      let desc = `Suspicious communication received. Automated SafeSpeak AI assessment flagged as ${initialScanResult.risk_level} RISK (Score: ${initialScanResult.risk_score}/100).\n\nContent received:\n"${text}"`;
      if (initialScanResult.explanation) {
        desc += `\n\nIdentified threat pattern: ${initialScanResult.explanation}`;
      }
      setDescription(desc);

      // Pre-add scan findings to evidence
      setEvidenceItems(prev => [
        ...prev,
        `SafeSpeak AI Threat Telemetry Report (Scan ID: ${initialScanResult.scan_id || 'N/A'}, Risk Score: ${initialScanResult.risk_score}/100)`
      ]);

      // Jump straight to Step 2 if coming from a scan
      setStep(2);
    }
  }, [initialScanResult]);

  const handleToggleEvidence = (itemText) => {
    if (evidenceItems.includes(itemText)) {
      setEvidenceItems(evidenceItems.filter(i => i !== itemText));
    } else {
      setEvidenceItems([...evidenceItems, itemText]);
    }
  };

  const handleGenerateDraft = async () => {
    setValidationError(null);

    if (!description.trim() || description.trim().length < 10) {
      setValidationError("Please provide an incident description of at least 10 characters.");
      return;
    }

    if (moneyLost && (!amount || isNaN(Number(amount)) || Number(amount) <= 0)) {
      setValidationError("Please enter a valid monetary loss amount.");
      return;
    }

    setIsGenerating(true);

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
        explanation: initialScanResult.explanation
      } : null
    };

    try {
      const res = await api.generateComplaintDraft(payload);
      setDraftResult(res);
      setEditableDraft(res.draft_text);
      setStep(4);
    } catch (err) {
      console.warn("API draft failed, using local generator:", err);
      const localRes = generateLocalDraft(payload);
      setDraftResult(localRes);
      setEditableDraft(localRes.draft_text);
      setStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(editableDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([editableDraft], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `SafeSpeak_Cybercrime_Complaint_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

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

      {/* Emergency Helpline Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Financial Cyber Fraud Emergency</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700/60 font-mono">India 24x7</span>
            </div>
            <p className="text-xs text-slate-300">
              If you have lost money within the last few hours, immediately dial <strong className="text-rose-300 font-bold text-sm">1930</strong> (Citizen Financial Cyber Fraud Reporting System) and contact your bank to freeze transactions.
            </p>
          </div>
        </div>
        <a 
          href={`tel:${FINANCIAL_FRAUD_HELPLINE}`}
          className="self-start sm:self-center px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)]"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 1930</span>
        </a>
      </div>

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

      {/* STEP 1: CHOOSE INCIDENT TYPE */}
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

      {/* STEP 2: COLLECT INCIDENT DETAILS */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Step 2: Collect Incident Details</h2>
              <p className="text-xs text-slate-400">
                Provide clear, factual statements. Only include verified information. Do not enter passwords or live OTPs.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-medium">
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
                onChange={(e) => setDescription(e.target.value)}
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
                    onClick={() => setMoneyLost(false)}
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
                        onChange={(e) => setAmount(e.target.value)}
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
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg transition-all"
            >
              <span>Continue to Evidence Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EVIDENCE CHECKLIST */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Step 3: Evidence Checklist &amp; Preservation Guidance</h2>
            <p className="text-xs text-slate-400">
              Law enforcement and cybercrime investigators require verifiable digital artifacts. Check all items that you currently possess and preserve.
            </p>
          </div>

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
                  <strong>Privacy Pledge:</strong> SafeSpeak AI runs documentation locally. Your complaint text and evidence lists are not uploaded or stored in external databases.
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Legal Draft...</span>
                </>
              ) : (
                <>
                  <span>Generate Formal Complaint Draft</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DRAFT, PREVIEW, EDIT & EXPORT */}
      {step === 4 && draftResult && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                  Ready for Submission
                </span>
                <span className="text-xs text-slate-400">Step 4 of 4</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Review, Edit &amp; Export Complaint Draft</h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyDraft}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>Save .TXT</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Submission Guidance Box */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-cyan-100/90 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Next Steps: How to Submit to the National Cyber Crime Portal</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Review the generated draft below. You can edit any section directly inside the text box.</li>
              <li>Click <strong>Copy Text</strong> to copy your formatted complaint.</li>
              <li>Click the button below to open the official Government portal: <strong className="text-cyan-300">cybercrime.gov.in</strong>.</li>
              <li>On the portal, select <strong>&ldquo;Report Cyber Crime&rdquo;</strong>, register/login with your mobile, and paste this draft into the incident narrative box.</li>
            </ol>
          </div>

          {/* Editable Draft Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Editable Complaint Draft (Click inside to modify text):</span>
              <span>{editableDraft.length} characters</span>
            </div>
            <textarea
              rows={18}
              value={editableDraft}
              onChange={(e) => setEditableDraft(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
            />
          </div>

          {/* Proceed to Official Reporting Portal Call-to-Action */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">Continue to Official Submission</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 font-mono">Government of India</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                Open the official Indian National Cyber Crime Reporting Portal. SafeSpeak AI helps document your complaint; actual legal submission occurs directly on the government portal.
              </p>
            </div>

            <a
              href={OFFICIAL_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all shrink-0 transform hover:-translate-y-0.5"
            >
              <span>Open cybercrime.gov.in</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Incident Form</span>
            </button>
            <button
              onClick={() => {
                setStep(1);
                setDraftResult(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Start New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
