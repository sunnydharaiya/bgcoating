import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CoatingCalculatorPage from './pages/CoatingCalculatorPage';
import SpecificationReadingPage from './pages/SpecificationReadingPage';
import KnowledgePage from './pages/KnowledgePage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [activePage, setActivePage] = useState('coating-calculator');
  const [activeSubTool, setActiveSubTool] = useState('hub');
  
  // Mobile Sidebar Drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'coating-calculator':
        return <CoatingCalculatorPage activeSubTool={activeSubTool} setActiveSubTool={setActiveSubTool} />;
      case 'specification-reading':
        return <SpecificationReadingPage />;
      case 'knowledge':
        return <KnowledgePage />;
      case 'support':
        return <SupportPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
      
      {/* Responsive Collapsible Sidebar Rail (Desktop Fixed + Mobile Overlay Drawer) */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activeSubTool={activeSubTool} 
        setActiveSubTool={setActiveSubTool} 
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace Shell */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F3F5F8]">
        <Header 
          activePage={activePage} 
          activeSubTool={activeSubTool} 
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {renderPage()}
        </main>
      </div>

    </div>
  );
}
