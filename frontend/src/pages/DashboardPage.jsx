import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, ShieldAlert, ShieldCheck, AlertTriangle, 
  Search, ArrowUpRight, Clock, MessageSquare, Image as ImageIcon, 
  Link as LinkIcon, RefreshCw, BarChart3, Shield 
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardPage({ setCurrentRoute, setSelectedScan }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleViewScan = (scan) => {
    if (setSelectedScan) {
      setSelectedScan(scan);
      setCurrentRoute('history');
    }
  };

  const total = stats?.total_scans || 0;
  const high = stats?.high_risk_count || 0;
  const med = stats?.medium_risk_count || 0;
  const low = stats?.low_risk_count || 0;

  const highPct = total ? Math.round((high / total) * 100) : 0;
  const medPct = total ? Math.round((med / total) * 100) : 0;
  const lowPct = total ? Math.round((low / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Security Overview Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry and risk distribution across analyzed messages, screenshots, and URLs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setCurrentRoute('scan')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>Run New Scan</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Scans */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Scans
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {loading ? '...' : total}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <span>Aggregated across all channels</span>
          </div>
        </div>

        {/* Card 2: High-Risk */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-2 cyber-glow-rose">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              High-Risk Detections
            </span>
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {loading ? '...' : high}
          </div>
          <div className="text-[11px] text-rose-300/80">
            {highPct}% of total scans flagged as critical
          </div>
        </div>

        {/* Card 3: Medium-Risk */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2 cyber-glow-amber">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Medium-Risk Detections
            </span>
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {loading ? '...' : med}
          </div>
          <div className="text-[11px] text-amber-300/80">
            {medPct}% required secondary verification
          </div>
        </div>

        {/* Card 4: Low-Risk */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2 cyber-glow-emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Low-Risk Detections
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {loading ? '...' : low}
          </div>
          <div className="text-[11px] text-emerald-300/80">
            {lowPct}% verified benign communication
          </div>
        </div>
      </div>

      {/* Middle Grid: Risk Distribution Visualizer & Surface Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Visual Bar */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Threat Severity Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Calibrated proportion of scanned items across threat levels.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {total} Scans Evaluated
            </span>
          </div>

          {/* Segmented Distribution Bar */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
              <div 
                style={{ width: `${highPct}%` }} 
                className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-l-full transition-all duration-700" 
                title={`High Risk: ${high} (${highPct}%)`}
              />
              <div 
                style={{ width: `${medPct}%` }} 
                className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-700" 
                title={`Medium Risk: ${med} (${medPct}%)`}
              />
              <div 
                style={{ width: `${lowPct}%` }} 
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-r-full transition-all duration-700" 
                title={`Low Risk: ${low} (${lowPct}%)`}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300">High Risk ({high} • {highPct}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300">Medium Risk ({med} • {medPct}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Low Risk ({low} • {lowPct}%)</span>
              </div>
            </div>
          </div>

          {/* Information summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>🛡️ Highest frequency detected pattern: <strong>Advance Fee / Internship Demands</strong></span>
            <button 
              onClick={() => setCurrentRoute('safety-center')}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Learn to spot →
            </button>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">
            Scans by Surface
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Text Messages &amp; Emails</span>
              </div>
              <span className="font-mono text-xs font-bold text-white">
                {stats?.type_distribution?.message || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                <span>Screenshot OCR Scans</span>
              </div>
              <span className="font-mono text-xs font-bold text-white">
                {stats?.type_distribution?.screenshot || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                <LinkIcon className="w-4 h-4 text-indigo-400" />
                <span>URL &amp; Domain Checks</span>
              </div>
              <span className="font-mono text-xs font-bold text-white">
                {stats?.type_distribution?.url || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Recent Analyses
            </h3>
          </div>
          <button
            onClick={() => setCurrentRoute('history')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Loading recent scan records...
          </div>
        ) : !stats?.recent_scans || stats.recent_scans.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No scans recorded yet. Run your first analysis above!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {stats.recent_scans.map((scan) => {
              const isHigh = scan.risk_level === 'HIGH';
              const isMed = scan.risk_level === 'MEDIUM';

              return (
                <div
                  key={scan.scan_id}
                  onClick={() => handleViewScan(scan)}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 p-2 rounded-lg cursor-pointer transition-all"
                >
                  <div className="flex items-start space-x-3 overflow-hidden">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 border mt-0.5 ${
                      isHigh ? 'bg-rose-950/80 text-rose-300 border-rose-500/40' :
                      isMed ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' :
                      'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {scan.risk_level} ({scan.risk_score})
                    </span>

                    <div className="overflow-hidden">
                      <p className="text-xs font-medium text-slate-200 truncate max-w-sm sm:max-w-md">
                        {scan.summary || scan.input_content}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm">
                        &ldquo;{scan.input_content}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 shrink-0 self-end sm:self-auto">
                    <span className="capitalize text-[11px] text-slate-500">{scan.content_type}</span>
                    <span className="text-cyan-400 hover:underline font-medium text-[11px]">View Details →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
