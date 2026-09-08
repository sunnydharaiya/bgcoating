import React, { createContext, useContext, useState, useCallback } from 'react';

const GuidelineContext = createContext(null);

export function GuidelineProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guidelineData, setGuidelineData] = useState(null);

  const openGuideline = useCallback((data) => {
    setGuidelineData(data);
    setIsOpen(true);
  }, []);

  const closeGuideline = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <GuidelineContext.Provider value={{ isOpen, guidelineData, openGuideline, closeGuideline }}>
      {children}
    </GuidelineContext.Provider>
  );
}

export function useGuideline() {
  const context = useContext(GuidelineContext);
  if (!context) {
    throw new Error('useGuideline must be used within a GuidelineProvider');
  }
  return context;
}
