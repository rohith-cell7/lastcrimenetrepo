import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api.js';

const CIRAContext = createContext(null);

export function CIRAProvider({ children }) {
  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [loadingCases, setLoadingCases] = useState(false);

  const refreshCases = useCallback(async () => {
    setLoadingCases(true);
    try {
      const data = await api.getCases();
      setCases(data || []);
    } catch (e) {
      console.warn('Failed to load cases', e);
    } finally {
      setLoadingCases(false);
    }
  }, []);

  const openCaseWorkspace = useCallback((caseItem) => {
    setActiveCase(caseItem);
    setActiveView('case-detail');
  }, []);

  const openDashboard = useCallback(() => {
    setActiveCase(null);
    setActiveView('dashboard');
  }, []);

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  const value = {
    cases,
    activeCase,
    activeView,
    loadingCases,
    refreshCases,
    setActiveCase,
    setActiveView,
    openCaseWorkspace,
    openDashboard,
  };

  return <CIRAContext.Provider value={value}>{children}</CIRAContext.Provider>;
}

export function useCIRA() {
  const ctx = useContext(CIRAContext);
  if (!ctx) throw new Error('useCIRA must be used within CIRAProvider');
  return ctx;
}
