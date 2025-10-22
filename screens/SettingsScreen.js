import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const SettingsScreen = ({ navigation }) => {
  const handleMenuPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleBackup = () => {
    Alert.alert(
      'Backup Data',
      'Your bookmarks and reading progress will be backed up to the cloud.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Backup', onPress: () => console.log('Backup started') }
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert(
      'Restore Data',
      'This will restore your bookmarks and reading progress from the cloud.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => console.log('Restore started') }
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share App',
      'Share this amazing Quran app with your friends and family!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Share app') }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate App',
      'Please rate our app on the app store to help us improve!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rate', onPress: () => console.log('Rate app') }
      ]
    );
  };

  const handleContactUs = () => {
    Alert.alert(
      'Contact Us',
      'Get in touch with us for support or feedback.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact', onPress: () => console.log('Contact us') }
      ]
    );
  };

  const handleVisitWebsite = () => {
    Alert.alert(
      'Visit Website',
      'Opening our website in your browser...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Visit website') }
      ]
    );
  };

  const handleOurApps = () => {
    Alert.alert(
      'Our Apps',
      'Check out our other amazing Islamic apps!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Apps', onPress: () => console.log('View our apps') }
      ]
    );
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
        onMenuPress={handleMenuPress}
        showMenu={true}
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
