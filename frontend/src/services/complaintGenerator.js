/**
 * SafeSpeak AI - Client-side Cybercrime Complaint Draft Generator
 * Provides offline-resilient factual drafting and text/PDF formatting.
 */

export const OFFICIAL_PORTAL_URL = "https://cybercrime.gov.in/";
export const FINANCIAL_FRAUD_HELPLINE = "1930";

export const COMPLAINT_CATEGORIES = [
  "Online financial fraud",
  "UPI or payment fraud",
  "Phishing or fake bank messages",
  "Fake job or internship offers",
  "Social media impersonation",
  "Account compromise",
  "Online shopping fraud",
  "Cyberbullying or online harassment",
  "Identity theft",
  "Suspicious website or link",
  "Other cybercrime"
];

export function generateLocalDraft(data) {
  const category = (data.category || "Cybercrime Incident").trim();
  const dateTime = (data.incident_date || new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC').trim();
  const platform = (data.platform || "Digital Communication Channel").trim();
  const description = (data.description || "").trim();
  const suspect = (data.suspect_identifier || "").trim() || "Not specifically identified / Under investigation";
  const moneyLost = Boolean(data.money_lost);
  const amount = data.amount || "0";
  const currency = (data.currency || "INR").trim().toUpperCase();
  const transactionRef = (data.transaction_ref || "").trim() || "N/A";
  const bankContacted = Boolean(data.bank_contacted);
  
  let evidenceList = data.evidence_items || [];
  if (typeof evidenceList === 'string') {
    evidenceList = evidenceList.split('\n').map(s => s.trim()).filter(Boolean);
  }

  const scanFindings = data.scan_findings;

  const subject = moneyLost
    ? `COMPLAINT: Incident of ${category} involving financial loss of ${currency} ${amount}`
    : `COMPLAINT: Incident of ${category} via ${platform}`;

  const lines = [
    "========================================================================",
    "CYBERCRIME INCIDENT REPORT DRAFT",
    "Prepared using SafeSpeak AI Incident Documentation Assistant",
    "========================================================================",
    "",
    `DATE OF REPORT : ${new Date().toISOString()}`,
    `INCIDENT TYPE  : ${category}`,
    `PRIMARY PORTAL : ${OFFICIAL_PORTAL_URL} (India: Helpline ${FINANCIAL_FRAUD_HELPLINE})`,
    "",
    "------------------------------------------------------------------------",
    `SUBJECT: ${subject}`,
    "------------------------------------------------------------------------",
    "",
    "1. INCIDENT SUMMARY & TIMELINE:",
    `   - Approximate Date & Time of Occurrence : ${dateTime}`,
    `   - Channel / Platform of Occurrence      : ${platform}`,
    `   - Suspect Contact / Identifier / URL    : ${suspect}`,
    "",
    "2. DETAILED CHRONOLOGICAL STATEMENT:",
    `   ${description}`,
    ""
  ];

  if (moneyLost) {
    lines.push(
      "3. FINANCIAL LOSS INFORMATION:",
      `   - Total Amount Defrauded         : ${currency} ${amount}`,
      `   - Bank / Payment Transaction Ref : ${transactionRef}`,
      `   - Bank / Provider Notified       : ${bankContacted ? 'Yes - Bank was alerted' : 'No / In progress'}`,
      `   - Emergency Helpline Status      : Advised to report immediately to ${FINANCIAL_FRAUD_HELPLINE} for golden-hour freezing.`,
      ""
    );
  } else {
    lines.push(
      "3. FINANCIAL LOSS INFORMATION:",
      "   - Direct Financial Loss          : None reported at this time.",
      `   - Bank / Provider Notified       : ${bankContacted ? 'Yes' : 'Not applicable'}`,
      ""
    );
  }

  lines.push(
    "4. EVIDENCE AVAILABLE & PRESERVED:",
    "   (The complainant maintains unaltered original records of the following):"
  );

  if (evidenceList && evidenceList.length > 0) {
    evidenceList.forEach(item => {
      lines.push(`   [x] ${item}`);
    });
  } else {
    lines.push("   [x] Full unedited screenshots of communication with timestamps.");
    lines.push("   [x] Suspect phone numbers, email headers, or URL links.");
    if (moneyLost) {
      lines.push("   [x] Bank transaction receipt and account debit statement.");
    }
  }

  lines.push("");

  if (scanFindings) {
    lines.push(
      "5. AUTOMATED TECHNICAL TELEMETRY (SafeSpeak AI Scan Findings):",
      `   - Assessed Risk Level : ${scanFindings.risk_level || 'N/A'}`,
      `   - Risk Score          : ${scanFindings.risk_score || 'N/A'}/100`,
      `   - Confidence Rating   : ${scanFindings.confidence || 'N/A'}`
    );
    const signals = scanFindings.signals || scanFindings.warning_signals || [];
    if (signals.length > 0) {
      const names = signals.map(s => s.title || s.signal_id || '').filter(Boolean);
      lines.push(`   - Detected Red Flags  : ${names.join(', ')}`);
    }
    if (scanFindings.explanation) {
      lines.push(`   - Technical Notes     : ${scanFindings.explanation}`);
    }
    lines.push("   * Note: The above findings represent automated threat heuristic analysis.");
    lines.push("");
  }

  lines.push(
    "6. REQUESTED LAW ENFORCEMENT ACTION:",
    "   - Register this complaint under appropriate provisions of the Information Technology Act",
    "     and Indian Penal Code / Bharatiya Nyaya Sanhita (or applicable jurisdiction).",
    "   - Trace and block the fraudulent identifiers, bank accounts, or digital infrastructure.",
    moneyLost 
      ? `   - Assist in potential fund recovery / lien marked via the National Cyber Crime Portal (${FINANCIAL_FRAUD_HELPLINE}).` 
      : "   - Take necessary preventive and investigative measures.",
    "",
    "7. DECLARATION:",
    "   I hereby confirm that the facts stated above are true and accurate to the best of my knowledge.",
    "   I have preserved the original digital evidence and will present it upon request.",
    "",
    "========================================================================",
    "IMPORTANT SUBMISSION ADVISORY:",
    "This draft has been prepared to facilitate your filing. You must now submit this information",
    `directly at the official National Cyber Crime Reporting Portal: ${OFFICIAL_PORTAL_URL}`,
    `If financial loss occurred, call ${FINANCIAL_FRAUD_HELPLINE} immediately to freeze funds before they are withdrawn.`,
    "========================================================================"
  );

  return {
    subject,
    draft_text: lines.join("\n"),
    category,
    money_lost: moneyLost,
    amount: moneyLost ? amount : 0,
    currency,
    official_portal_url: OFFICIAL_PORTAL_URL,
    helpline: FINANCIAL_FRAUD_HELPLINE,
    generated_at: new Date().toISOString()
  };
}
