// src/BlocklyContext.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Create the context
const BlocklyContext = createContext();

// 2. Create a "Provider" component
export function BlocklyProvider({ children }) {
  const [xmlToLoad, setXmlToLoad] = useState(null);
  const navigate = useNavigate();

  // This function will be called from TutorialsPage
  const loadSampleAndNavigate = (xml) => {
    setXmlToLoad(xml);
    navigate('/workspace');
  };

  const value = {
    xmlToLoad,
    setXmlToLoad, // Add this so workspace can clear it
    loadSampleAndNavigate,
  };

  return (
    <BlocklyContext.Provider value={value}>
      {children}
    </BlocklyContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export function useBlockly() {
  const context = useContext(BlocklyContext);
  if (context === undefined) {
    throw new Error('useBlockly must be used within a BlocklyProvider');
  }
  return context;
}