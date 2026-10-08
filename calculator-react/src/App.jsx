import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CoatingCalculatorPage from './pages/CoatingCalculatorPage';
import SpecificationReadingPage from './pages/SpecificationReadingPage';
import CoatingProcedurePage from './pages/CoatingProcedurePage';
import UnitRateEstimationPage from './pages/UnitRateEstimationPage';
import ManpowerEstimationPage from './pages/ManpowerEstimationPage';
import BlasterQualificationPage from './pages/BlasterQualificationPage';
import PainterQualificationPage from './pages/PainterQualificationPage';
import TsaQualificationPage from './pages/TsaQualificationPage';
import InspectionReportingPage from './pages/InspectionReportingPage';
import AcademyLmsPage from './pages/AcademyLmsPage';
import ContractorManagementPage from './pages/ContractorManagementPage';
import KnowledgePage from './pages/KnowledgePage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { GuidelineProvider } from './context/GuidelineContext';

// Global Overlays
import ToastContainer from './components/ToastContainer';
import GuidelineDrawer from './components/GuidelineDrawer';
import HelpFaqDrawer from './components/HelpFaqDrawer';
import PlanUpgradeModal from './components/PlanUpgradeModal';

// Router Utilities
import { parseCurrentUrl, getUrlFor } from './utils/router';

export default function App() {
  // Check auth state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bg_auth_logged_in') === 'true';
  });

  // Initialize state from current URL
  const initialRoute = parseCurrentUrl();
  const [activePage, setActivePageState] = useState(() => {
    if (initialRoute.page === 'login') return 'login';
    const authStatus = localStorage.getItem('bg_auth_logged_in') === 'true';
    if (!authStatus) return 'login';
    return initialRoute.page;
  });
  const [activeSubTool, setActiveSubToolState] = useState(initialRoute.subTool);
  
  // Mobile Sidebar Drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global Modals State
  const [helpOpen, setHelpOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Synchronize browser history and state
  const navigate = useCallback((page, subTool = 'hub', replace = false) => {
    setActivePageState(page);
    setActiveSubToolState(subTool);
    
    const targetUrl = getUrlFor(page, subTool);
    if (window.location.pathname !== targetUrl) {
      if (replace) {
        window.history.replaceState({ page, subTool }, '', targetUrl);
      } else {
        window.history.pushState({ page, subTool }, '', targetUrl);
      }
    }
  }, []);

  const setActivePage = useCallback((page) => {
    navigate(page, 'hub');
  }, [navigate]);

  const setActiveSubTool = useCallback((toolId) => {
    setActiveSubToolState(toolId);
    const targetUrl = getUrlFor(activePage, toolId);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ page: activePage, subTool: toolId }, '', targetUrl);
    }
  }, [activePage]);

  // Auth Handlers
  const handleLoginSuccess = useCallback((userData) => {
    setIsLoggedIn(true);
    navigate('dashboard', 'hub');
  }, [navigate]);

  const handleSkipGuest = useCallback(() => {
    setIsLoggedIn(true);
    navigate('dashboard', 'hub');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('bg_auth_logged_in');
    setIsLoggedIn(false);
    navigate('login', 'hub');
  }, [navigate]);

  // Listen for global logout events
  useEffect(() => {
    const handleLogoutEvent = () => handleLogout();
    window.addEventListener('bg_logout', handleLogoutEvent);
    return () => window.removeEventListener('bg_logout', handleLogoutEvent);
  }, [handleLogout]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { page, subTool } = parseCurrentUrl();
      const authStatus = localStorage.getItem('bg_auth_logged_in') === 'true';
      setIsLoggedIn(authStatus);
      if (!authStatus && page !== 'login') {
        setActivePageState('login');
      } else {
        setActivePageState(page);
      }
      setActiveSubToolState(subTool);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage key="dashboard" setActivePage={setActivePage} />;
      case 'coating-calculator':
      case 'calc':
        return (
          <CoatingCalculatorPage 
            key={`calc-${activeSubTool}`}
            activeSubTool={activeSubTool} 
            setActiveSubTool={setActiveSubTool} 
          />
        );
      case 'specification-reading':
      case 'design':
        return (
          <SpecificationReadingPage 
            key={`spec-${activeSubTool}`}
            activeSubSection={activeSubTool}
            onNavigateSubSection={(subSec) => navigate('specification-reading', subSec)}
          />
        );
      case 'coating-procedure':
      case 'procedure':
        return (
          <CoatingProcedurePage 
            key={`proc-${activeSubTool}`}
            currentSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'unit-rate-estimation':
      case 'cost-estimation':
        return (
          <UnitRateEstimationPage 
            key={`unitrate-${activeSubTool}`}
            currentSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'manpower-estimation':
        return (
          <ManpowerEstimationPage 
            key={`manpower-${activeSubTool}`}
            currentSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'blaster-qualification':
      case 'blaster':
        return (
          <BlasterQualificationPage 
            key={`blaster-${activeSubTool}`}
            currentSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'painter-qualification':
      case 'painter':
        return (
          <PainterQualificationPage 
            key={`painter-${activeSubTool}`}
            currentSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'tsa-qualification':
      case 'tsa':
        return (
          <TsaQualificationPage 
            key={`tsa-${activeSubTool}`}
            currentSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'inspection-reporting':
      case 'qa-qc-inspection':
        return (
          <InspectionReportingPage 
            key={`inspection-${activeSubTool}`}
            currentSubTool={activeSubTool}
            activeSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'academy-lms':
        return <AcademyLmsPage key="academy" />;
      case 'contractor-management':
      case 'contractor':
        return (
          <ContractorManagementPage 
            key={`contractor-${activeSubTool}`}
            currentSubTool={activeSubTool}
            onNavigate={(page, subTool) => navigate(page, subTool)}
          />
        );
      case 'knowledge':
        return <KnowledgePage key="knowledge" />;
      case 'support':
        return (
          <SupportPage 
            key="support"
            onSelectPage={(page, subTool) => {
              navigate(page, subTool || 'hub');
            }} 
          />
        );
      case 'settings':
        return <SettingsPage key="settings" />;
      case 'login':
        return (
          <LoginPage 
            key="login"
            onLoginSuccess={handleLoginSuccess}
            onSkipGuest={handleSkipGuest}
          />
        );
      default:
        return (
          <CoatingCalculatorPage 
            key={`calc-def-${activeSubTool}`}
            activeSubTool={activeSubTool} 
            setActiveSubTool={setActiveSubTool} 
          />
        );
    }
  };

  return (
    <ToastProvider>
      <GuidelineProvider>
        {!isLoggedIn || activePage === 'login' ? (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onSkipGuest={handleSkipGuest}
          />
        ) : (
          <div className="flex min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
            
            {/* Responsive Collapsible Sidebar Rail */}
            <Sidebar 
              activePage={activePage} 
              setActivePage={setActivePage} 
              activeSubTool={activeSubTool} 
              setActiveSubTool={setActiveSubTool} 
              onNavigate={navigate}
              mobileSidebarOpen={mobileSidebarOpen}
              setMobileSidebarOpen={setMobileSidebarOpen}
            />

            {/* Main Workspace Shell */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#F3F5F8]">
              <Header 
                activePage={activePage} 
                activeSubTool={activeSubTool} 
                setActivePage={setActivePage}
                setActiveSubTool={setActiveSubTool}
                setMobileSidebarOpen={setMobileSidebarOpen}
                onOpenHelp={() => setHelpOpen(true)}
                onOpenUpgrade={() => setUpgradeOpen(true)}
              />
              <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <ErrorBoundary title="Page View">
                  {renderPage()}
                </ErrorBoundary>
              </main>
            </div>

            {/* Global Modals & Notifications */}
            <GuidelineDrawer />
            <HelpFaqDrawer 
              isOpen={helpOpen} 
              onClose={() => setHelpOpen(false)} 
              onSelectPage={(page, subTool) => {
                setActivePage(page);
                if (subTool) setActiveSubTool(subTool);
              }} 
            />
            <PlanUpgradeModal 
              isOpen={upgradeOpen} 
              onClose={() => setUpgradeOpen(false)} 
            />

          </div>
        )}

        <ToastContainer />
      </GuidelineProvider>
    </ToastProvider>
  );
}
