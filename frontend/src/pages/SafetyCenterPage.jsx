import React, { useState } from 'react';
import { 
  BookOpen, ShieldCheck, AlertTriangle, Key, Lock, 
  ExternalLink, PhoneCall, HelpCircle, CheckCircle2, 
  XCircle, Award, Sparkles, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function SafetyCenterPage({ setCurrentRoute }) {
  // 8 Beginner-Friendly Topics
  const topics = [
    {
      id: "phishing",
      title: "1. How Phishing Works",
      category: "Fundamentals",
      icon: AlertTriangle,
      color: "border-sky-500/30 text-sky-400 bg-sky-950/20",
      summary: "Attackers impersonate trusted services (banks, couriers, streaming) to trick you into revealing passwords or credit card numbers.",
      ruleOfThumb: "Always check the sender's real address and never click login links sent via email or SMS.",
      details: [
        "Phishing emails often copy official logos and styling perfectly.",
        "They create false urgency: 'Your account is suspended' or 'Unusual charge detected'.",
        "The link leads to a counterfeit login page that steals your password as you type it."
      ]
    },
    {
      id: "fake-jobs",
      title: "2. Identifying Fake Job & Internship Offers",
      category: "Employment Scams",
      icon: ShieldCheck,
      color: "border-rose-500/30 text-rose-400 bg-rose-950/20",
      summary: "Scammers prey on job seekers by offering attractive work-from-home jobs or exclusive internships, then demanding 'registration' or 'equipment fees'.",
      ruleOfThumb: "Legitimate employers NEVER ask candidates to pay money for onboarding, laptops, or training.",
      details: [
        "Offers issued immediately without rigorous interviews or formal company domain emails.",
        "Demanding payments via UPI, Google Pay, or cryptocurrency.",
        "Vague job descriptions such as 'data entry' or 'typing' with unrealistically high salaries."
      ]
    },
    {
      id: "otp-safety",
      title: "3. OTP & 2FA Security",
      category: "Credential Defense",
      icon: Key,
      color: "border-amber-500/30 text-amber-400 bg-amber-950/20",
      summary: "One-Time Passwords (OTPs) are the final digital key protecting your bank accounts and identity.",
      ruleOfThumb: "No bank, police officer, or customer support agent will EVER ask you to read out your OTP.",
      details: [
        "OTPs authorize money debits, password resets, or device registrations.",
        "Scammers often claim: 'Share the OTP to cancel an unauthorized transaction'—this actually approves the theft!",
        "Always read the message body accompanying the OTP: it tells you what action is being authorized."
      ]
    },
    {
      id: "passwords",
      title: "4. Password Hygiene & Credential Theft",
      category: "Account Protection",
      icon: Lock,
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-950/20",
      summary: "Reusing the same password across multiple websites means one data breach compromises all your accounts.",
      ruleOfThumb: "Use a reputable password manager and enable Two-Factor Authentication (2FA) everywhere.",
      details: [
        "Passphrases made of 4-5 random words are both stronger and easier to remember than short complex strings.",
        "Never save passwords in plain text files or chat apps.",
        "Treat breach notifications seriously and rotate leaked credentials immediately."
      ]
    },
    {
      id: "suspicious-links",
      title: "5. Suspicious Links & Typosquatting",
      category: "Web Safety",
      icon: ExternalLink,
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/20",
      summary: "Attackers register domains that look nearly identical to authentic brands (e.g., paypa1.com or sbi-banking.xyz).",
      ruleOfThumb: "Inspect the domain right before the last slash. If it has extra words or strange extensions (.xyz, .top), do not enter.",
      details: [
        "Link shorteners (bit.ly) hide the destination URL so you can't see where you are headed.",
        "HTTPS (the padlock) only means connection is encrypted—it DOES NOT guarantee the site owner is honest!",
        "When in doubt, manually type the official web address in your browser."
      ]
    },
    {
      id: "social-engineering",
      title: "6. Social Engineering & Urgency Traps",
      category: "Psychological Defense",
      icon: Sparkles,
      color: "border-purple-500/30 text-purple-400 bg-purple-950/20",
      summary: "Social engineering targets human psychology—fear, excitement, curiosity, and authority—rather than computer code.",
      ruleOfThumb: "Whenever a message makes you feel panicked, rushed, or ecstatic, PAUSE. Artificial urgency is always the #1 red flag.",
      details: [
        "Deadlines like 'Act within 15 minutes' are crafted to stop you from asking a friend for advice.",
        "Authority exploits: pretending to be the police, income tax officer, or your company CEO.",
        "Excitement exploits: 'You won a lottery you never entered'."
      ]
    },
    {
      id: "fake-support",
      title: "7. Fake Customer Support & Search Scams",
      category: "Impersonation",
      icon: PhoneCall,
      color: "border-red-500/30 text-red-400 bg-red-950/20",
      summary: "Scammers post fake customer care phone numbers on Google Maps and search results for banks, airlines, and courier services.",
      ruleOfThumb: "Never search Google for 'customer support phone number'. Only look inside the official verified mobile app.",
      details: [
        "Fake support agents ask you to download AnyDesk, TeamViewer, or QuickSupport to 'assist' you.",
        "Once installed, they can see your screen, watch you enter passwords, and transfer funds.",
        "Never install screen-sharing software at the request of an inbound caller."
      ]
    },
    {
      id: "payment-scams",
      title: "8. Online Payment & QR Code Fraud",
      category: "Financial Defense",
      icon: ShieldCheck,
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20",
      summary: "QR codes and UPI PINs are only used to SEND money, never to RECEIVE money.",
      ruleOfThumb: "Entering your UPI PIN or scanning a QR code always DEBITS your account. You NEVER enter a PIN to receive payments.",
      details: [
        "Scammers posing as buyers on OLX or marketplace apps send a 'QR code to receive money'.",
        "Collect requests: They send a payment request disguised as a refund.",
        "Always verify your account balance in your banking app before accepting confirmation."
      ]
    }
  ];

  // Interactive Quiz State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestion = {
    scenario: "You receive an SMS: 'Dear Customer, your electricity power will be disconnected at 9:30 PM tonight due to an unpaid bill. Call our officer at 9876543210 to update immediately.'",
    options: [
      { id: 'A', text: "Call the phone number immediately to ensure your power isn't shut off.", isCorrect: false, explanation: "Wrong! Calling the unverified mobile number puts you in contact with the scammer who will ask for fee transfer or screen sharing." },
      { id: 'B', text: "Ignore the SMS, open your official electricity board app or website, and check your real account status there.", isCorrect: true, explanation: "Correct! Always verify utility status via official platforms. Power companies do not send threats from personal mobile numbers." },
      { id: 'C', text: "Forward the SMS to family members to ask if they paid it.", isCorrect: false, explanation: "Spreading unverified messages can cause panic and lead relatives into calling the scammer." }
    ]
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer) {
      setQuizSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-semibold">
          <img src="/assets/safespeak-logo.png" alt="SafeSpeak AI" className="w-4 h-4 object-contain rounded" />
          <span>Cybersecurity Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SafeSpeak AI Safety Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Short, actionable guides designed for ordinary internet users. Learn how scammers operate, 
          recognize red flags instantly, and protect yourself before you click.
        </p>
      </div>

      {/* 8 Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border ${t.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                      {t.category}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {t.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.summary}
              </p>

              {/* Rule of thumb highlight box */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-cyan-200 flex items-start space-x-2">
                <span className="text-cyan-400 font-bold shrink-0">💡 Rule of Thumb:</span>
                <span className="leading-snug">{t.ruleOfThumb}</span>
              </div>

              {/* Key takeaways */}
              <ul className="space-y-1.5 pt-1 text-xs text-slate-400">
                {t.details.map((d, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-slate-500 font-mono mt-0.5">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Interactive Scam Spotter Mini-Quiz */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/30 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Interactive Skill Builder
            </span>
            <h3 className="text-xl font-bold text-white">
              Spot the Red Flag Mini-Quiz
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono">
          &ldquo;{quizQuestion.scenario}&rdquo;
        </div>

        <div className="space-y-3">
          {quizQuestion.options.map((opt) => {
            const isSelected = selectedQuizAnswer === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => !quizSubmitted && setSelectedQuizAnswer(opt.id)}
                className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start space-x-3 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="font-mono font-bold text-cyan-400 shrink-0">[{opt.id}]</span>
                <span className="flex-1 leading-relaxed">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {!quizSubmitted ? (
          <button
            onClick={handleQuizSubmit}
            disabled={!selectedQuizAnswer}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            {quizQuestion.options.find(o => o.id === selectedQuizAnswer)?.isCorrect ? (
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Spot On! Perfect Cybersecurity Instincts.</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Careful! That action falls into the scammer's trap.</span>
              </div>
            )}
            <p className="text-xs text-slate-300">
              {quizQuestion.options.find(o => o.id === selectedQuizAnswer)?.explanation}
            </p>
            <button
              onClick={() => { setQuizSubmitted(false); setSelectedQuizAnswer(null); }}
              className="text-xs text-cyan-400 underline pt-1 inline-block"
            >
              Reset Quiz
            </button>
          </div>
        )}
      </div>

      {/* Emergency Cyber Reporting Helplines Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-bold text-white">
            Emergency Cybersecurity Contacts &amp; Helplines
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          If you have been targeted or incurred financial loss, report immediately to block unauthorized accounts:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-cyan-400">India</span>
            <div className="text-base font-bold text-white font-mono">1930</div>
            <p className="text-[11px] text-slate-400">National Cybercrime Reporting Portal (cybercrime.gov.in)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-sky-400">United States</span>
            <div className="text-base font-bold text-white font-mono">ReportFraud.ftc.gov</div>
            <p className="text-[11px] text-slate-400">Federal Trade Commission Fraud Defense Bureau</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-indigo-400">Global / FBI</span>
            <div className="text-base font-bold text-white font-mono">ic3.gov</div>
            <p className="text-[11px] text-slate-400">Internet Crime Complaint Center (IC3)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
