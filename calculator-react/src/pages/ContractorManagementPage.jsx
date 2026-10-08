// src/pages/ContractorManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { 
  INITIAL_CONTRACTOR_STATE, 
  calcContractorKPIs 
} from '../data/contractorDatabase';

// Subcomponents
import ContractorHub from '../tools/contractor/ContractorHub';
import ContractorDailyProgressModal from '../tools/contractor/ContractorDailyProgressModal';
import ContractorStockModal from '../tools/contractor/ContractorStockModal';
import ContractorEmployeeModal from '../tools/contractor/ContractorEmployeeModal';
import ContractorProjectModal from '../tools/contractor/ContractorProjectModal';
import ContractorMasterDataView from '../tools/contractor/ContractorMasterDataView';
import ContractorAnalyticsView from '../tools/contractor/ContractorAnalyticsView';

const CONTRACTOR_STORAGE_KEY = 'bg_contractor_state_v1';

export default function ContractorManagementPage({
  currentSubTool = 'hub',
  onNavigate
}) {
  const { addToast } = useToast();

  // Master State with LocalStorage Caching
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(CONTRACTOR_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading contractor state:', e);
    }
    return INITIAL_CONTRACTOR_STATE;
  });

  // Modal open states
  const [dailyProgressModalOpen, setDailyProgressModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  // Auto-save state
  useEffect(() => {
    try {
      localStorage.setItem(CONTRACTOR_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving contractor state:', e);
    }
  }, [state]);

  // Sync sub-tool navigation triggers
  useEffect(() => {
    if (currentSubTool === 'daily-progress') {
      setDailyProgressModalOpen(true);
    } else if (currentSubTool === 'stock-update') {
      setStockModalOpen(true);
    } else if (currentSubTool === 'add-employee') {
      setEmployeeModalOpen(true);
    } else if (currentSubTool === 'create-project') {
      setProjectModalOpen(true);
    }
  }, [currentSubTool]);

  // KPIs
  const kpis = calcContractorKPIs(state);

  // Handlers
  const handleSaveDailyProgress = (newLog, stats) => {
    setState(prev => ({
      ...prev,
      dailyLogs: [newLog, ...(prev.dailyLogs || [])]
    }));
    addToast('Daily Progress Logged', `Recorded ${stats.coatArea} m² coating output.`, 'success');
  };

  const handleSaveStock = (newTx, newLog) => {
    setState(prev => ({
      ...prev,
      stockTransactions: [newTx, ...(prev.stockTransactions || [])],
      dailyLogs: [newLog, ...(prev.dailyLogs || [])]
    }));
    addToast('Stock Updated', `Stock transaction saved: ${newTx.item}`, 'success');
  };

  const handleSaveEmployee = (newEmp) => {
    setState(prev => ({
      ...prev,
      workforce: [newEmp, ...(prev.workforce || [])]
    }));
    addToast('Employee Registered', `Added ${newEmp.name} (${newEmp.role}) to workforce.`, 'success');
  };

  const handleSaveProject = (newProj) => {
    setState(prev => ({
      ...prev,
      projects: [newProj, ...(prev.projects || [])]
    }));
    addToast('Project Created', `Initiated project ${newProj.code} - ${newProj.name}.`, 'success');
  };

  const navigateSub = (subToolId) => {
    if (onNavigate) {
      onNavigate('contractor-management', subToolId);
    }
  };

  // Render view depending on subtool
  const renderContent = () => {
    switch (currentSubTool) {
      case 'master-data':
      case 'master':
        return (
          <ContractorMasterDataView
            state={state}
            onOpenCreateProject={() => setProjectModalOpen(true)}
            onOpenAddEmployee={() => setEmployeeModalOpen(true)}
            onOpenStockUpdate={() => setStockModalOpen(true)}
          />
        );

      case 'executive-dashboard':
        return (
          <ContractorAnalyticsView
            state={state}
            kpis={kpis}
            initialTab="executive"
          />
        );

      case 'daily-dashboard':
        return (
          <ContractorAnalyticsView
            state={state}
            kpis={kpis}
            initialTab="daily"
          />
        );

      case 'stock-dashboard':
        return (
          <ContractorAnalyticsView
            state={state}
            kpis={kpis}
            initialTab="stock"
          />
        );

      case 'hub':
      default:
        return (
          <ContractorHub
            state={state}
            kpis={kpis}
            onOpenDailyProgress={() => setDailyProgressModalOpen(true)}
            onOpenStockUpdate={() => setStockModalOpen(true)}
            onOpenAddEmployee={() => setEmployeeModalOpen(true)}
            onOpenCreateProject={() => setProjectModalOpen(true)}
            onNavigateSection={navigateSub}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {renderContent()}

      {/* Quick Action Modals */}
      <ContractorDailyProgressModal
        isOpen={dailyProgressModalOpen}
        onClose={() => setDailyProgressModalOpen(false)}
        projects={state.projects}
        sites={state.sites}
        onSave={handleSaveDailyProgress}
      />

      <ContractorStockModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        consumables={state.consumables}
        sites={state.sites}
        onSave={handleSaveStock}
      />

      <ContractorEmployeeModal
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        sites={state.sites}
        onSave={handleSaveEmployee}
      />

      <ContractorProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        sites={state.sites}
        onSave={handleSaveProject}
      />
    </div>
  );
}
