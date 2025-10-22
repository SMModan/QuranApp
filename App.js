import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import CustomSplashScreen from './components/CustomSplashScreen';
import useCachedResources from './hooks/useCachedResources';
import AppNavigator from './components/AppNavigator';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return <CustomSplashScreen />;
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
