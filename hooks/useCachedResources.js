import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          // You can add custom fonts here
          // 'custom-font': require('../assets/fonts/CustomFont.ttf'),
        });

        // Shorter loading time to avoid double splash
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        // Error loading resources
      } finally {
        setLoadingComplete(true);
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
