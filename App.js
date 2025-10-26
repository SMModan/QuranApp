import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import useCachedResources from './hooks/useCachedResources';
import AppNavigator from './components/AppNavigator';

export default function App() {
  const isLoadingComplete = useCachedResources();

  // Don't show custom splash - let native splash handle it
  if (!isLoadingComplete) {
    return null; // This will show the native splash screen
  }

  return (
    <>
      <AppNavigator />
      <StatusBar 
        style="light" 
        backgroundColor="#1a237e"
        translucent={true}
        hidden={true}
      />
    </>
  );
}
