import { generateLocalDraft, COMPLAINT_CATEGORIES, OFFICIAL_PORTAL_URL, FINANCIAL_FRAUD_HELPLINE } from './complaintGenerator';

const API_BASE = '/api';

function formatApiError(status, errObj) {
  if (errObj && errObj.error) return errObj.error;
  if (status === 502 || status === 503) {
    return 'Cannot connect to SafeSpeak AI Backend on port 5000. Please ensure "Backend (Flask)" or "SafeSpeak AI (Full Stack)" is running in IntelliJ IDEA.';
  }
  return `Server responded with ${status}`;
}

export const api = {
  // Health & Provider Info
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Backend health check failed, running in resilient client mode:", err);
      return {
        status: "offline_fallback",
        ai_provider_configured: false,
        ai_mode: "CLIENT_RESILIENT_MODE"
      };
    }
  },

  // Pre-configured Demo Samples
  async getDemoSamples() {
    try {
      const res = await fetch(`${API_BASE}/demo/samples`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        samples: [
          {
            id: "sample-internship",
            title: "Fake Internship Offer",
            category: "Internship Scam",
            content_type: "message",
            text: "Congratulations! You have been selected for an exclusive internship at TechVanguard Solutions. Pay ₹999 registration fee within 30 minutes to confirm your position. Click here: http://secure-job-enroll.biz/pay",
            tag: "High Risk",
            expected_risk: "HIGH"
          },
          {
            id: "sample-bank",
            title: "Fake Bank KYC Alert",
            category: "Banking Phishing",
            content_type: "message",
            text: "Dear SBI Customer, Your A/C XX4892 is temporarily blocked due to pending KYC verification. To avoid permanent suspension, update your PAN & Aadhaar details immediately at http://sbi-banking-kyc-update.xyz/verify-pan within 24 hours.",
            tag: "High Risk",
            expected_risk: "HIGH"
          },
          {
            id: "sample-lottery",
            title: "Prize / Lottery Scam",
            category: "Lottery Fraud",
            content_type: "message",
            text: "DEAR WINNER! Your mobile number won cash prize of Rs 25,00,000 in KBC All India Lucky Draw 2026. To claim your prize cheque, contact WhatsApp Manager Mr. Rana on +91-9876543210 and pay Rs 1,500 file processing fee now. Ticket ID: KBC-998822.",
            tag: "High Risk",
            expected_risk: "HIGH"
          },
          {
            id: "sample-login",
            title: "Suspicious Login Security Alert",
            category: "Credential Theft",
            content_type: "message",
            text: "SECURITY ALERT: We detected an unauthorized login attempt to your Amazon account from Moscow, Russia. If this was not you, verify your identity immediately to protect your saved payment methods: http://amazon-account-protection.site/restore",
            tag: "High Risk",
            expected_risk: "HIGH"
          },
          {
            id: "sample-legit",
            title: "Normal Legitimate Meeting Invite",
            category: "Normal Message",
            content_type: "message",
            text: "Hi Team, the project design sync is confirmed for tomorrow at 3:00 PM on Google Meet. Please find the agenda attached in our shared workspace drive. See you then! - Priya",
            tag: "Low Risk",
            expected_risk: "LOW"
          },
          {
            id: "sample-url-phish",
            title: "Suspicious Banking URL",
            category: "Phishing Link",
            content_type: "url",
            text: "http://sbi-banking-kyc-update.xyz/verify-pan",
            tag: "High Risk",
            expected_risk: "HIGH"
          },
          {
            id: "sample-url-legit",
            title: "Legitimate Official Domain",
            category: "Verified URL",
            content_type: "url",
            text: "https://www.onlinesbi.sbi",
            tag: "Low Risk",
            expected_risk: "LOW"
          }
        ]
      };
    }
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Using local fallback stats:", err);
      return {
        total_scans: 12,
        high_risk_count: 6,
        medium_risk_count: 4,
        low_risk_count: 2,
        type_distribution: { message: 7, screenshot: 2, url: 3 },
        recent_scans: []
      };
    }
  },

  // Analyze Message
  async analyzeMessage(message, isDemo = false) {
    try {
      const res = await fetch(`${API_BASE}/analyze/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, is_demo: isDemo })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(formatApiError(res.status, err));
      }
      return await res.json();
    } catch (networkErr) {
      if (networkErr.message && !networkErr.message.includes('Server responded')) {
        throw networkErr;
      }
      throw new Error('Cannot connect to SafeSpeak AI Backend on port 5000. Please ensure "Backend (Flask)" is running in IntelliJ IDEA.');
    }
  },

  // Analyze URL
  async analyzeUrl(url, isDemo = false) {
    try {
      const res = await fetch(`${API_BASE}/analyze/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, is_demo: isDemo })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(formatApiError(res.status, err));
      }
      return await res.json();
    } catch (networkErr) {
      if (networkErr.message && !networkErr.message.includes('Server responded')) {
        throw networkErr;
      }
      throw new Error('Cannot connect to SafeSpeak AI Backend on port 5000. Please ensure "Backend (Flask)" is running in IntelliJ IDEA.');
    }
  },

  // OCR Screenshot Text Extraction
  async extractScreenshotText(file, presetHint = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (presetHint) formData.append('preset_hint', presetHint);

    const res = await fetch(`${API_BASE}/analyze/screenshot/extract`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `OCR extraction failed (${res.status})`);
    }
    return await res.json();
  },

  // Analyze Extracted Screenshot Text
  async analyzeScreenshot(data) {
    const res = await fetch(`${API_BASE}/analyze/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Analysis failed (${res.status})`);
    }
    return await res.json();
  },

  // Scan History
  async getHistory({ limit = 50, contentType, riskLevel } = {}) {
    const params = new URLSearchParams();
    if (limit) params.set('limit', limit);
    if (contentType) params.set('content_type', contentType);
    if (riskLevel) params.set('risk_level', riskLevel);

    const res = await fetch(`${API_BASE}/history?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to load history (${res.status})`);
    return await res.json();
  },

  // Scan Detail
  async getScanDetail(scanId) {
    const res = await fetch(`${API_BASE}/history/${scanId}`);
    if (!res.ok) throw new Error(`Scan not found (${res.status})`);
    return await res.json();
  },

  // Delete Scan
  async deleteScan(scanId) {
    const res = await fetch(`${API_BASE}/history/${scanId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Failed to delete scan (${res.status})`);
    return await res.json();
  },

  // Clear All History
  async clearHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Failed to clear history (${res.status})`);
    return await res.json();
  },

  // Cybercrime Complaint Assistance
  async getComplaintCategories() {
    try {
      const res = await fetch(`${API_BASE}/complaint/categories`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        categories: COMPLAINT_CATEGORIES,
        official_portal_url: OFFICIAL_PORTAL_URL,
        helpline: FINANCIAL_FRAUD_HELPLINE
      };
    }
  },

  async generateComplaintDraft(complaintData) {
    try {
      const res = await fetch(`${API_BASE}/complaint/generate-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to generate draft (${res.status})`);
      }
      return await res.json();
    } catch (err) {
      console.warn("Backend complaint generator unavailable, using resilient local generator:", err);
      return generateLocalDraft(complaintData);
    }
  }
};
