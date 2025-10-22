import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AllParasScreen from '../screens/AllParasScreen';
import AllSurahsScreen from '../screens/AllSurahsScreen';
import FAQsScreen from '../screens/FAQsScreen';
import ReadingModeScreen from '../screens/ReadingModeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import QuranReaderWebView from '../screens/QuranReaderWebView';
import GoToPageScreen from '../screens/GoToPageScreen';

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  const navigation = {
    navigate: (screenName) => {
      setCurrentScreen(screenName);
    },
    goBack: () => {
      setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen navigation={navigation} />;
      case 'all-paras':
        return <AllParasScreen navigation={navigation} />;
      case 'all-surahs':
        return <AllSurahsScreen navigation={navigation} />;
      case 'faqs':
        return <FAQsScreen navigation={navigation} />;
      case 'reading-mode':
        return <ReadingModeScreen navigation={navigation} />;
      case 'settings':
        return <SettingsScreen navigation={navigation} />;
      case 'quran-reader':
        return <QuranReaderWebView navigation={navigation} />;
      case 'go-to-page':
        console.log('Rendering GoToPageScreen');
        return <GoToPageScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  );
};

export default AppNavigator;
