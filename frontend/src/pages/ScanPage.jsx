import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Image as ImageIcon, Link as LinkIcon, Search, 
  Sparkles, Upload, FileText, CheckCircle2, AlertTriangle, 
  RotateCcw, ArrowRight, ShieldAlert, Edit3, Loader2, Lock, 
  ArrowLeft, History, ExternalLink, ShieldCheck 
} from 'lucide-react';
import DemoSelector from '../components/DemoSelector';
import ScanResultView from '../components/ScanResultView';
import { api } from '../services/api';

export default function ScanPage({ 
  isDemoMode, 
  initialSample = null, 
  initialTab = null, 
  onReportComplaint,
  onNavigateHistory 
}) {
  // Current scanner mode: null (shows Hub: "What would you like to check?"), 'message', 'url', 'screenshot'
  const [selectedScanner, setSelectedScanner] = useState(initialTab || 'message');

  useEffect(() => {
    if (initialTab) {
      setSelectedScanner(initialTab);
    }
  }, [initialTab]);

  // Input states
  const [messageInput, setMessageInput] = useState(initialSample ? initialSample.text : '');
  const [urlInput, setUrlInput] = useState(initialSample && initialSample.content_type === 'url' ? initialSample.text : '');
  const [selectedSampleId, setSelectedSampleId] = useState(initialSample ? initialSample.id : null);

  // Screenshot states
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [ocrMetadata, setOcrMetadata] = useState(null);
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [ocrUnavailable, setOcrUnavailable] = useState(false);
  const fileInputRef = useRef(null);

  // Analysis Lifecycle states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  // Handle selecting a predefined sample
  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setScanResult(null);
    setErrorMsg(null);

    if (sample.content_type === 'url') {
      setSelectedScanner('url');
      setUrlInput(sample.text);
    } else {
      setSelectedScanner('message');
      setMessageInput(sample.text);
    }
  };

  // Helper for animated progress steps
  const runProgressSteps = async (steps) => {
    for (const step of steps) {
      setAnalysisStep(step);
      await new Promise(r => setTimeout(r, 340));
    }
  };

  // 1. Analyze Message
  const handleAnalyzeMessage = async () => {
    if (!messageInput.trim()) {
      setErrorMsg("Please paste or type a message to analyze.");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      await runProgressSteps([
        "Parsing communication structure & tone...",
        "Identifying urgency & coercion markers...",
        "Evaluating monetary demands & credential requests...",
        "Deconstructing psychological persuasion chain (Risk Story)...",
        "Calibrating threat score and recommended actions..."
      ]);

      const result = await api.analyzeMessage(messageInput, isDemoMode);
      setScanResult(result);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to analyze message. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // 2. OCR Extract Screenshot
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setErrorMsg(null);
    setOcrUnavailable(false);
    setIsExtractingOcr(true);

    try {
      const data = await api.extractScreenshotText(file);
      setExtractedText(data.extracted_text || '');
      setOcrMetadata(data);
      if (!data.extracted_text || data.extracted_text.trim() === '') {
        setOcrUnavailable(true);
      }
    } catch (err) {
      console.warn("OCR service unavailable, allowing manual paste:", err);
      setOcrUnavailable(true);
      setExtractedText("");
    } finally {
      setIsExtractingOcr(false);
    }
  };

  // Pre-load demo screenshot simulation
  const handleLoadDemoScreenshot = async (presetType) => {
    setErrorMsg(null);
    setIsExtractingOcr(true);
    setOcrUnavailable(false);
    setSelectedImageFile({ name: `${presetType}_screenshot.png` });
    setImagePreviewUrl(null);

    await new Promise(r => setTimeout(r, 500));

    if (presetType === 'internship') {
      setExtractedText(
        "Congratulations! You have been selected for an exclusive internship at TechVanguard Solutions. " +
        "Pay ₹999 registration fee within 30 minutes to confirm your position. " +
        "Click here: http://secure-job-enroll.biz/pay"
      );
      setOcrMetadata({
        method: "demo_preset",
        filename: "whatsapp_internship_offer.png",
        dimensions: "1080x2400 (Mobile Screenshot)",
        notes: "Matched mobile chat screenshot pattern. Ready for user verification."
      });
    } else if (presetType === 'bank') {
      setExtractedText(
        "Dear SBI Customer, Your A/C XX4892 is temporarily blocked due to pending KYC verification. " +
        "To avoid permanent suspension, update your PAN & Aadhaar details immediately at " +
        "http://sbi-banking-kyc-update.xyz/verify-pan within 24 hours."
      );
      setOcrMetadata({
        method: "demo_preset",
        filename: "sms_bank_kyc_alert.png",
        dimensions: "1080x1920 (SMS Screenshot)",
        notes: "Matched mobile SMS notification pattern."
      });
    }
    setIsExtractingOcr(false);
  };

  // Analyze Screenshot Extracted Text
  const handleAnalyzeScreenshotText = async () => {
    if (!extractedText.trim()) {
      setErrorMsg("No text available to analyze. Please upload an image or enter text below.");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      await runProgressSteps([
        "Verifying OCR text integrity...",
        "Detecting visual impersonation & brand spoofing...",
        "Identifying psychological coercion & urgency lures...",
        "Synthesizing 4-stage Risk Story...",
        "Calibrating threat level and safety guidance..."
      ]);

      const result = await api.analyzeScreenshot({
        extracted_text: extractedText,
        filename: selectedImageFile?.name || "screenshot.png",
        is_demo: isDemoMode
      });
      setScanResult(result);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to analyze screenshot text.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // 3. Analyze URL
  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) {
      setErrorMsg("Please enter a URL to inspect.");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      await runProgressSteps([
        "Deconstructing domain hierarchy & TLD reputation...",
        "Checking cryptographic HTTPS security protocol...",
        "Analyzing Punycode & homograph brand spoofing...",
        "Evaluating redirect disguises & path payloads...",
        "Calculating non-defamatory risk assessment..."
      ]);

      const result = await api.analyzeUrl(urlInput.trim(), isDemoMode);
      setScanResult(result);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to analyze URL.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleResetScan = () => {
    setScanResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar with Mode Info & Secondary Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              SafeSpeak Security Scanner
            </h1>
            <p className="text-xs text-slate-400">
              Interactive threat evaluation and psychological manipulation analysis
            </p>
          </div>
        </div>

        {/* In-App Utility Links */}
        <div className="flex items-center space-x-3 text-xs">
          {onNavigateHistory && (
            <button
              onClick={onNavigateHistory}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scan History</span>
            </button>
          )}

          {scanResult && (
            <button
              onClick={handleResetScan}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Scan</span>
            </button>
          )}
        </div>
      </div>

      {/* SCAN RESULTS VIEW */}
      {scanResult ? (
        <ScanResultView
          result={scanResult}
          onReset={handleResetScan}
          onReportComplaint={onReportComplaint}
        />
      ) : (
        <div className="space-y-6">
          {/* ======================================================== */}
          {/* SECTION 14: SCAN HUB — "What would you like to check?"    */}
          {/* ======================================================== */}
          <div className="space-y-3">
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What would you like to check?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose a scanner to inspect text, analyze links, or extract messages from screenshots.
              </p>
            </div>

            {/* 3 Large Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Option 1: Message */}
              <button
                onClick={() => { setSelectedScanner('message'); setErrorMsg(null); }}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 group ${
                  selectedScanner === 'message'
                    ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    {selectedScanner === 'message' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Message
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Analyze suspicious text (SMS, WhatsApp, emails, fake job or internship offers).
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-cyan-400 flex items-center space-x-1">
                  <span>Open Scanner</span>
                  <span>&rarr;</span>
                </div>
              </button>

              {/* Option 2: URL */}
              <button
                onClick={() => { setSelectedScanner('url'); setErrorMsg(null); }}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 group ${
                  selectedScanner === 'url'
                    ? 'bg-sky-950/40 border-sky-400/80 shadow-[0_0_20px_rgba(14,165,233,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    {selectedScanner === 'url' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    URL
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Check a suspicious link for deceptive domain heuristics and phishing patterns.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-sky-400 flex items-center space-x-1">
                  <span>Open Scanner</span>
                  <span>&rarr;</span>
                </div>
              </button>

              {/* Option 3: Screenshot */}
              <button
                onClick={() => { setSelectedScanner('screenshot'); setErrorMsg(null); }}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 group ${
                  selectedScanner === 'screenshot'
                    ? 'bg-indigo-950/40 border-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    {selectedScanner === 'screenshot' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Screenshot
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Analyze a screenshot of a suspicious chat or notification with OCR extraction.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-indigo-400 flex items-center space-x-1">
                  <span>Open Scanner</span>
                  <span>&rarr;</span>
                </div>
              </button>
            </div>
          </div>

          {/* Predefined Test Scenarios Selector */}
          <DemoSelector
            onSelectSample={handleSelectSample}
            activeSampleId={selectedSampleId}
          />

          {/* Privacy Notice Banner */}
          <div className="flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 shadow-sm">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="leading-snug">
              <strong className="text-slate-200">Privacy Notice:</strong> SafeSpeak processes scan information locally where possible. Review information before exporting or sharing it. Do not enter passwords, live OTPs, PINs or other sensitive credentials.
            </span>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ACTIVE SCANNER CONTAINER                                 */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* SCANNER 1: MESSAGE SCANNER (Section 15) */}
            {selectedScanner === 'message' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>Analyze a Suspicious Message</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Paste a suspicious message below and SafeSpeak will identify warning signals and explain the potential risks.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <textarea
                      rows={6}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Paste a suspicious message, email, job offer, or WhatsApp message here..."
                      className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all resize-y"
                    />
                    <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-500">
                      {messageInput.length} chars
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Supported: English, Tamil (தமிழ்), and mixed code-switching.
                  </p>
                </div>

                <button
                  onClick={handleAnalyzeMessage}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-60 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{analysisStep || "Analyzing with SafeSpeak AI..."}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-slate-950" />
                      <span>Analyze with SafeSpeak AI</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SCANNER 2: URL CHECKER (Section 19) */}
            {selectedScanner === 'url' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5 text-sky-400" />
                    <span>Check a Suspicious URL</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Inspect a link for phishing indicators, protocol encryption, and domain deception heuristics.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/login or paste a suspicious link..."
                      className="w-full p-4 pl-11 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 font-mono transition-all"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    SafeSpeak uses structural heuristics without directly navigating to or executing potentially harmful web links.
                  </p>
                </div>

                <button
                  onClick={handleAnalyzeUrl}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 hover:from-sky-300 hover:to-cyan-300 shadow-[0_0_20px_rgba(14,165,233,0.35)] disabled:opacity-60 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{analysisStep || "Inspecting URL heuristics..."}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-slate-950" />
                      <span>Inspect URL with SafeSpeak AI</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SCANNER 3: SCREENSHOT SCANNER (Section 20) */}
            {selectedScanner === 'screenshot' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    <span>Scan a Screenshot (OCR)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Upload a screenshot of a suspicious message or email. SafeSpeak will extract the text for your review before analysis.
                  </p>
                </div>

                {/* Upload Drag & Drop Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-indigo-400/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/60 hover:bg-slate-950/90 space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Click to upload an image or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      PNG, JPG, JPEG, WEBP up to 10MB
                    </p>
                  </div>
                </div>

                {/* Quick Simulation Presets for Screenshot */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400">Sample Screenshots:</span>
                  <button
                    type="button"
                    onClick={() => handleLoadDemoScreenshot('internship')}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  >
                    Internship Offer SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadDemoScreenshot('bank')}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                  >
                    Bank KYC Notification
                  </button>
                </div>

                {/* Image Preview & OCR Extract Status */}
                {imagePreviewUrl && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                    <img
                      src={imagePreviewUrl}
                      alt="Uploaded Screenshot"
                      className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-mono text-slate-200 truncate font-semibold">
                        {selectedImageFile?.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Image uploaded. Review extracted wording below.
                      </p>
                    </div>
                  </div>
                )}

                {/* OCR Fallback Alert if OCR unavailable */}
                {ocrUnavailable && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Text extraction is unavailable.</p>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        You can manually paste the message text in the review box below to continue the SafeSpeak analysis.
                      </p>
                    </div>
                  </div>
                )}

                {/* OCR Extracted Text Review & Edit Window */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Review / Edit Extracted Text Before Analysis</span>
                    </label>
                    {isExtractingOcr && (
                      <span className="text-xs text-indigo-400 flex items-center space-x-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Running OCR...</span>
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={5}
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder="Extracted text will appear here. You can edit or paste text manually before scanning..."
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-mono transition-all resize-y"
                  />
                </div>

                <button
                  onClick={handleAnalyzeScreenshotText}
                  disabled={isAnalyzing || isExtractingOcr}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 hover:from-indigo-300 hover:to-sky-300 shadow-[0_0_20px_rgba(99,102,241,0.35)] disabled:opacity-60 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{analysisStep || "Analyzing extracted text..."}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-slate-950" />
                      <span>Analyze Extracted Text</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
