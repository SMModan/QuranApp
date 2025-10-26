import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AllParasScreen from '../screens/AllParasScreen';
import AllSurahsScreen from '../screens/AllSurahsScreen';
import FAQsScreen from '../screens/FAQsScreen';
import ReadingModeScreen from '../screens/ReadingModeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import QuranReaderScreen from '../screens/QuranReaderScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import OurAppsScreen from '../screens/OurAppsScreen';
import ContactUsScreen from '../screens/ContactUsScreen';

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [routeParams, setRouteParams] = useState(null);

  const navigation = {
    navigate: (screenName, params = null) => {
      setCurrentScreen(screenName);
      setRouteParams(params);
    },
    goBack: () => {
      setCurrentScreen('home');
      setRouteParams(null);
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
        return <QuranReaderScreen navigation={navigation} route={{ params: routeParams }} />;
      case 'favorites':
        return <FavoritesScreen navigation={navigation} />;
      case 'bookmarks':
        return <BookmarkScreen navigation={navigation} />;
      case 'our-apps':
        return <OurAppsScreen navigation={navigation} />;
      case 'contact-us':
        return <ContactUsScreen navigation={navigation} />;
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
