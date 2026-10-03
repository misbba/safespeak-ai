import React, { useState, useEffect } from 'react';
import { 
  History, Search, Trash2, Filter, AlertTriangle, ShieldCheck, 
  ExternalLink, MessageSquare, Image as ImageIcon, Link as LinkIcon, 
  X, RefreshCw, Sparkles, ArrowLeft 
} from 'lucide-react';
import ScanResultView from '../components/ScanResultView';
import { api } from '../services/api';

export default function HistoryPage({ setCurrentRoute, selectedScan, setSelectedScan, onReportComplaint }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [activeModalScan, setActiveModalScan] = useState(selectedScan || null);
  const [actionMsg, setActionMsg] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory({ limit: 100 });
      setScans(data.scans || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (selectedScan) {
      setActiveModalScan(selectedScan);
    }
  }, [selectedScan]);

  const handleDeleteScan = async (scanId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this scan record?")) return;

    try {
      await api.deleteScan(scanId);
      setScans(prev => prev.filter(s => s.scan_id !== scanId));
      if (activeModalScan?.scan_id === scanId) {
        setActiveModalScan(null);
      }
      setActionMsg("Scan removed successfully.");
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err) {
      alert("Failed to delete scan: " + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to permanently clear all scan history?")) return;

    try {
      await api.clearHistory();
      setScans([]);
      setActiveModalScan(null);
      setActionMsg("All history cleared.");
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err) {
      alert("Failed to clear history: " + err.message);
    }
  };

  // Filter & Search
  const filteredScans = scans.filter(scan => {
    if (filterRisk !== 'ALL' && scan.risk_level !== filterRisk) return false;
    if (filterType !== 'ALL' && scan.content_type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const content = (scan.input_content || scan.extracted_text || '').toLowerCase();
      const summary = (scan.summary || '').toLowerCase();
      return content.includes(q) || summary.includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Analysis History &amp; Audit Logs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, re-inspect, or export previous threat evaluations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadHistory}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reload</span>
          </button>

          {scans.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
          {actionMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords in scan history..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Risk Level Filter Pills */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Risk:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterRisk(lvl)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterRisk === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Type:</span>
          {['ALL', 'message', 'screenshot', 'url'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                filterType === t
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scans List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 space-y-2">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-cyan-400" />
          <p>Loading historical records...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No matching scan records found</h3>
          <p className="text-xs text-slate-500">
            {scans.length === 0 ? "You haven't run any scans yet." : "Try adjusting your search query or filters."}
          </p>
          <button
            onClick={() => setCurrentRoute('scan')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
          >
            <span>Scan a Message Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredScans.map((scan) => {
            const isHigh = scan.risk_level === 'HIGH';
            const isMed = scan.risk_level === 'MEDIUM';
            const formattedDate = new Date(scan.created_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={scan.scan_id}
                onClick={() => setActiveModalScan(scan)}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Badge, Content, Summary */}
                <div className="flex items-start space-x-3.5 overflow-hidden">
                  <div className="flex flex-col items-center shrink-0">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase border ${
                      isHigh ? 'bg-rose-950/80 text-rose-300 border-rose-500/50' :
                      isMed ? 'bg-amber-950/80 text-amber-300 border-amber-500/50' :
                      'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                    }`}>
                      {scan.risk_level}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {scan.risk_score}/100
                    </span>
                  </div>

                  <div className="overflow-hidden space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] uppercase font-mono text-cyan-400 border border-slate-800">
                        {scan.content_type}
                      </span>
                      {scan.is_demo && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-[10px] font-semibold text-amber-300 border border-amber-800/40">
                          Demo
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {formattedDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate max-w-xl">
                      {scan.summary}
                    </h4>

                    <p className="text-xs text-slate-400 font-mono truncate max-w-xl">
                      &ldquo;{scan.input_content || scan.extracted_text}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
                  {(scan.risk_level === 'HIGH' || scan.risk_level === 'MEDIUM') && onReportComplaint && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReportComplaint(scan);
                      }}
                      title="Prepare Cybercrime Complaint"
                      className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>Prepare Complaint</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteScan(scan.scan_id, e)}
                    title="Delete Scan"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                    <span>Inspect</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {activeModalScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  Scan Audit Inspection
                </span>
                <span className="text-xs text-slate-400">
                  ID: {activeModalScan.scan_id?.slice(0, 8)}...
                </span>
              </div>
              <button
                onClick={() => { setActiveModalScan(null); if (setSelectedScan) setSelectedScan(null); }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ScanResultView
              result={activeModalScan}
              onReportComplaint={(scan) => {
                setActiveModalScan(null);
                if (setSelectedScan) setSelectedScan(null);
                onReportComplaint?.(scan);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
