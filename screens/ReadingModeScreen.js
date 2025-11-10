import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getFontSize, getSpacing, getScreenData } from '../utils/ResponsiveDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOrientation from '../hooks/useOrientation';

const ReadingModeScreen = ({ navigation }) => {
  const orientation = useOrientation();
  const screenData = getScreenData();
  const isLandscape = orientation.isLandscape;
  const [readingMode, setReadingMode] = useState('default');
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    loadReadingPreferences();
  }, []);

  const loadReadingPreferences = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('reading_mode');
      const savedFontSize = await AsyncStorage.getItem('font_size');
      const savedTheme = await AsyncStorage.getItem('reading_theme');
      
      if (savedMode) setReadingMode(savedMode);
      if (savedFontSize) setFontSize(savedFontSize);
      if (savedTheme) setTheme(savedTheme);
    } catch (error) {
      // Error loading reading preferences
    }
  };

  const saveReadingPreferences = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const handleModeChange = (mode) => {
    setReadingMode(mode);
    saveReadingPreferences('reading_mode', mode);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    saveReadingPreferences('font_size', size);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    saveReadingPreferences('reading_theme', newTheme);
  };

  const readingModes = [
    { id: 'default', title: 'Default Mode', description: 'Standard reading experience', icon: '📖' },
    { id: 'night', title: 'Night Mode', description: 'Dark theme for night reading', icon: '🌙' },
    { id: 'sepia', title: 'Sepia Mode', description: 'Warm sepia tone for comfort', icon: '📜' },
  ];

  const fontSizes = [
    { id: 'small', title: 'Small', size: 14 },
    { id: 'medium', title: 'Medium', size: 16 },
    { id: 'large', title: 'Large', size: 18 },
    { id: 'xlarge', title: 'Extra Large', size: 20 },
  ];

  const themes = [
    { id: 'light', title: 'Light', description: 'White background', icon: '☀️' },
    { id: 'dark', title: 'Dark', description: 'Black background', icon: '🌑' },
    { id: 'sepia', title: 'Sepia', description: 'Warm brown tone', icon: '📜' },
  ];

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="Reading Mode"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showMenu={false}
      />
      
      <ScrollView style={styles.content}>
        <ResponsiveContainer style={styles.mainContent}>
          <ResponsiveText
            size="title"
            weight="bold"
            color="#1a237e"
            style={styles.title}
          >
            Reading Preferences
          </ResponsiveText>
          
          <ResponsiveText
            size="medium"
            color="#666666"
            style={styles.subtitle}
          >
            Customize your reading experience
          </ResponsiveText>

          {/* Reading Mode Selection */}
          <View style={styles.section}>
            <ResponsiveText
              size="large"
              weight="600"
              color="#333333"
              style={styles.sectionTitle}
            >
              Reading Mode
            </ResponsiveText>
            <View style={styles.optionsRow}>
              {readingModes.map((mode) => (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeCard,
                    readingMode === mode.id && styles.modeCardActive
                  ]}
                  onPress={() => handleModeChange(mode.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                  <ResponsiveText
                    size="small"
                    weight="600"
                    color={readingMode === mode.id ? "#1a237e" : "#666666"}
                    style={styles.modeTitle}
                  >
                    {mode.title}
                  </ResponsiveText>
                  <ResponsiveText
                    size="xsmall"
                    color={readingMode === mode.id ? "#1a237e" : "#999999"}
                    style={styles.modeDescription}
                  >
                    {mode.description}
                  </ResponsiveText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Font Size Selection */}
          <View style={styles.section}>
            <ResponsiveText
              size="large"
              weight="600"
              color="#333333"
              style={styles.sectionTitle}
            >
              Font Size
            </ResponsiveText>
            <View style={styles.fontSizeContainer}>
              {fontSizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.fontSizeButton,
                    fontSize === size.id && styles.fontSizeButtonActive
                  ]}
                  onPress={() => handleFontSizeChange(size.id)}
                  activeOpacity={0.7}
                >
                  <ResponsiveText
                    size="medium"
                    weight="600"
                    color={fontSize === size.id ? "#FFFFFF" : "#666666"}
                  >
                    {size.title}
                  </ResponsiveText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Theme Selection */}
          <View style={styles.section}>
            <ResponsiveText
              size="large"
              weight="600"
              color="#333333"
              style={styles.sectionTitle}
            >
              Theme
            </ResponsiveText>
            <View style={styles.optionsRow}>
              {themes.map((themeOption) => (
                <TouchableOpacity
                  key={themeOption.id}
                  style={[
                    styles.themeCard,
                    theme === themeOption.id && styles.themeCardActive
                  ]}
                  onPress={() => handleThemeChange(themeOption.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.themeIcon}>{themeOption.icon}</Text>
                  <ResponsiveText
                    size="small"
                    weight="600"
                    color={theme === themeOption.id ? "#1a237e" : "#666666"}
                    style={styles.themeTitle}
                  >
                    {themeOption.title}
                  </ResponsiveText>
                  <ResponsiveText
                    size="xsmall"
                    color={theme === themeOption.id ? "#1a237e" : "#999999"}
                    style={styles.themeDescription}
                  >
                    {themeOption.description}
                  </ResponsiveText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    paddingTop: getSpacing(20),
    paddingBottom: getSpacing(40),
  },
  title: {
    textAlign: 'center',
    marginBottom: getSpacing(10),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: getSpacing(30),
    fontStyle: 'italic',
  },
  section: {
    marginBottom: getSpacing(30),
    paddingHorizontal: getSpacing(10),
  },
  sectionTitle: {
    marginBottom: getSpacing(15),
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: getSpacing(10),
  },
  modeCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    padding: getSpacing(15),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  modeCardActive: {
    borderColor: '#1a237e',
    backgroundColor: '#E8EAF6',
  },
  modeIcon: {
    fontSize: getFontSize(32),
    marginBottom: getSpacing(8),
  },
  modeTitle: {
    marginBottom: getSpacing(5),
    textAlign: 'center',
  },
  modeDescription: {
    textAlign: 'center',
    fontSize: getFontSize(10),
  },
  fontSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getSpacing(10),
  },
  fontSizeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(8),
    padding: getSpacing(12),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  fontSizeButtonActive: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  themeCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    padding: getSpacing(15),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  themeCardActive: {
    borderColor: '#1a237e',
    backgroundColor: '#E8EAF6',
  },
  themeIcon: {
    fontSize: getFontSize(32),
    marginBottom: getSpacing(8),
  },
  themeTitle: {
    marginBottom: getSpacing(5),
    textAlign: 'center',
  },
  themeDescription: {
    textAlign: 'center',
    fontSize: getFontSize(10),
  },
});

export default ReadingModeScreen;


