import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import HistoryPage from './pages/HistoryPage';
import SafetyCenterPage from './pages/SafetyCenterPage';
import AboutPage from './pages/AboutPage';
import ReportCybercrimePage from './pages/ReportCybercrimePage';

export default function App() {
  const validRoutes = [
    'landing', 
    'dashboard', 
    'scan-message', 
    'url-checker', 
    'screenshot-scanner', 
    'scan', 
    'history', 
    'report-cybercrime', 
    'safety-center', 
    'about'
  ];

  // Read initial route from URL hash or default to 'landing'
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    return validRoutes.includes(hash) ? hash : 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default ON for instantaneous out-of-the-box evaluation
  const [selectedScanForHistory, setSelectedScanForHistory] = useState(null);
  const [scanInitialSample, setScanInitialSample] = useState(null);
  const [complaintInitialScanResult, setComplaintInitialScanResult] = useState(null);

  // Sync route with URL hash
  const navigateTo = (route, options = {}) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (options.sample) {
      setScanInitialSample(options.sample);
    }

    if (options.complaintScanResult) {
      setComplaintInitialScanResult(options.complaintScanResult);
    }
  };

  // Handler to bridge Scan Results into the Cybercrime Complaint Assistant
  const handleReportComplaintFromScan = (scanResult) => {
    setComplaintInitialScanResult(scanResult);
    navigateTo('report-cybercrime');
  };

  // Listen to hash change events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Quick Demo Trigger from Hero
  const handleLaunchDemo = () => {
    navigateTo('scan-message', {
      sample: {
        id: 'sample-internship',
        title: 'Fake Internship Offer',
        category: 'Internship Scam',
        content_type: 'message',
        text: 'Congratulations! You have been selected for an exclusive internship at TechVanguard Solutions. Pay ₹999 registration fee within 30 minutes to confirm your position. Click here: http://secure-job-enroll.biz/pay'
      }
    });
  };

  // Determine active scanner tab from route
  const getScannerTab = () => {
    if (currentRoute === 'url-checker') return 'url';
    if (currentRoute === 'screenshot-scanner') return 'screenshot';
    if (currentRoute === 'scan-message') return 'message';
    return 'message';
  };

  const isScannerRoute = ['scan-message', 'url-checker', 'screenshot-scanner', 'scan'].includes(currentRoute);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 cyber-grid selection:bg-cyan-500 selection:text-slate-950">
      {/* Persistent SaaS Navbar */}
      <Navbar
        currentRoute={currentRoute}
        setCurrentRoute={navigateTo}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
      />

      {/* Main Page Render Area */}
      <main className="flex-1 pb-16">
        {currentRoute === 'landing' && (
          <LandingPage
            setCurrentRoute={navigateTo}
            onLaunchDemo={handleLaunchDemo}
          />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardPage
            setCurrentRoute={navigateTo}
            setSelectedScan={(scan) => {
              setSelectedScanForHistory(scan);
              navigateTo('history');
            }}
          />
        )}

        {isScannerRoute && (
          <ScanPage
            isDemoMode={isDemoMode}
            initialSample={scanInitialSample}
            initialTab={getScannerTab()}
            onReportComplaint={handleReportComplaintFromScan}
            onNavigateHistory={() => navigateTo('history')}
          />
        )}

        {currentRoute === 'history' && (
          <HistoryPage
            setCurrentRoute={navigateTo}
            selectedScan={selectedScanForHistory}
            setSelectedScan={setSelectedScanForHistory}
            onReportComplaint={handleReportComplaintFromScan}
          />
        )}

        {currentRoute === 'report-cybercrime' && (
          <ReportCybercrimePage
            initialScanResult={complaintInitialScanResult}
            setCurrentRoute={navigateTo}
          />
        )}

        {currentRoute === 'safety-center' && (
          <SafetyCenterPage
            setCurrentRoute={navigateTo}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            setCurrentRoute={navigateTo}
          />
        )}
      </main>

      {/* Persistent SaaS Footer */}
      <Footer
        setCurrentRoute={navigateTo}
      />
    </div>
  );
}
