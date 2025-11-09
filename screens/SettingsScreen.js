import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking, Share, Platform } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const handleBackup = async () => {
    try {
      // Get all data to backup
      const bookmarks = await AsyncStorage.getItem('quran_bookmarks');
      const favorites = await AsyncStorage.getItem('quran_favorites');
      const resumeData = await AsyncStorage.getItem('quran_resume_data');
      
      const backupData = {
        bookmarks: bookmarks ? JSON.parse(bookmarks) : [],
        favorites: favorites ? JSON.parse(favorites) : [],
        resumeData: resumeData ? JSON.parse(resumeData) : null,
        timestamp: new Date().toISOString()
      };
      
      // Share as JSON file
      const result = await Share.share({
        message: JSON.stringify(backupData, null, 2),
        title: 'Quran App Backup'
      });
      
      if (result.action === Share.sharedAction) {
        Alert.alert('Success', 'Backup data has been shared. Save it to restore later.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create backup');
    }
  };

  const handleRestore = () => {
    Alert.alert(
      'Restore Data',
      'To restore your data, paste the backup JSON content. This will replace your current data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          onPress: () => {
            Alert.alert(
              'Restore Data',
              'Please paste your backup JSON data in the next dialog.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Continue', 
                  onPress: () => {
                    // In a real app, you'd have a text input here
                    // For now, show instructions
                    Alert.alert(
                      'Restore Instructions',
                      'Restore functionality requires a text input. This feature will be enhanced in a future update.'
                    );
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this amazing Quran app! Download it now.',
        url: 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo',
        title: 'Quran App'
      });
      
      if (result.action === Share.sharedAction) {
        // App shared successfully
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share the app');
    }
  };

  const handleRateApp = () => {
    const appStoreUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/id123456789'
      : 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo';
    
    Linking.openURL(appStoreUrl).catch(err => {
      Alert.alert('Error', 'Could not open app store');
    });
  };

  const handleContactUs = () => {
    if (navigation) {
      navigation.navigate('contact-us');
    }
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://www.peerbits.com/').catch(err => {
      Alert.alert('Error', 'Could not open website');
    });
  };

  const handleOurApps = () => {
    if (navigation) {
      navigation.navigate('our-apps');
    }
  };

  const settingsOptions = [
    {
      id: 'backup',
      title: 'Backup & Restore',
      subtitle: 'Backup your data to cloud',
      icon: '☁️',
      onPress: handleBackup,
    },
    {
      id: 'restore',
      title: 'Restore Data',
      subtitle: 'Restore from cloud backup',
      icon: '📥',
      onPress: handleRestore,
    },
    {
      id: 'our_apps',
      title: 'Our Apps',
      subtitle: 'Check out our other apps',
      icon: '📱',
      onPress: handleOurApps,
    },
    {
      id: 'visit_website',
      title: 'Visit Website',
      subtitle: 'Visit our official website',
      icon: '🌐',
      onPress: handleVisitWebsite,
    },
    {
      id: 'contact_us',
      title: 'Contact Us',
      subtitle: 'Get support and feedback',
      icon: '👤',
      onPress: handleContactUs,
    },
    {
      id: 'share_app',
      title: 'Share this App',
      subtitle: 'Share with friends and family',
      icon: '📤',
      onPress: handleShareApp,
    },
    {
      id: 'rate_app',
      title: 'Rate this App',
      subtitle: 'Rate us on the app store',
      icon: '⭐',
      onPress: handleRateApp,
    },
  ];

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="Settings"
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
            App Settings
          </ResponsiveText>
          
          <ResponsiveText
            size="medium"
            color="#666666"
            style={styles.subtitle}
          >
            Manage your app preferences and data
          </ResponsiveText>

          <View style={styles.optionsContainer}>
            {settingsOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIcon}>
                    <Text style={styles.iconText}>{option.icon}</Text>
                  </View>
                  
                  <View style={styles.optionText}>
                    <ResponsiveText
                      size="large"
                      weight="600"
                      color="#333333"
                      style={styles.optionTitle}
                    >
                      {option.title}
                    </ResponsiveText>
                    <ResponsiveText
                      size="small"
                      color="#666666"
                      style={styles.optionSubtitle}
                    >
                      {option.subtitle}
                    </ResponsiveText>
                  </View>

                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  optionsContainer: {
    paddingHorizontal: getSpacing(10),
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    marginBottom: getSpacing(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(20),
  },
  optionIcon: {
    width: getSpacing(50),
    height: getSpacing(50),
    borderRadius: getSpacing(25),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getSpacing(15),
  },
  iconText: {
    fontSize: getFontSize(24),
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    marginBottom: getSpacing(5),
  },
  optionSubtitle: {
    fontStyle: 'italic',
  },
  arrowContainer: {
    width: getSpacing(30),
    alignItems: 'center',
  },
  arrow: {
    fontSize: getFontSize(20),
    color: '#666666',
  },
});

export default SettingsScreen;
