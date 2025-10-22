import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [navigationHistory, setNavigationHistory] = useState(['home']);

  const navigate = (screenName) => {
    setNavigationHistory(prev => [...prev, screenName]);
    setCurrentScreen(screenName);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  const resetToHome = () => {
    setCurrentScreen('home');
    setNavigationHistory(['home']);
  };

  const value = {
    currentScreen,
    navigate,
    goBack,
    resetToHome,
    canGoBack: navigationHistory.length > 1,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

