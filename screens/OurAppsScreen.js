import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, Platform, Share } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import SideMenu from '../components/SideMenu';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';

const OurAppsScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const apps = [
    {
      id: 1,
      name: 'CALIMO DRIVER APP',
      description: 'Professional driver app for transportation services',
      icon: '🚗',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Real-time tracking', 'Route optimization', 'Driver dashboard']
    },
    {
      id: 2,
      name: 'Marvin Taxi Driver',
      description: 'Complete taxi driver solution with dispatch system',
      icon: '🚕',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Passenger pickup', 'Fare calculation', 'Navigation integration']
    },
    {
      id: 3,
      name: 'AC Checker',
      description: 'Air conditioning system diagnostic tool',
      icon: '❄️',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['System diagnostics', 'Performance monitoring', 'Maintenance alerts']
    },
    {
      id: 4,
      name: 'AC Checker Driver',
      description: 'Driver version of AC diagnostic application',
      icon: '🔧',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Mobile diagnostics', 'Real-time monitoring', 'Report generation']
    },
    {
      id: 5,
      name: 'Reykjavik Private Tours',
      description: 'Private tour booking and management system',
      icon: '🏔️',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Tour booking', 'Guide matching', 'Itinerary planning']
    },
    {
      id: 6,
      name: 'Marvin Taxi Dispatcher',
      description: 'Advanced dispatch system for taxi operations',
      icon: '📡',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Fleet management', 'Real-time dispatch', 'Performance analytics']
    },
    {
      id: 7,
      name: 'Big Blue Dispatcher',
      description: 'Comprehensive dispatch management solution',
      icon: '🚛',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Multi-vehicle tracking', 'Route optimization', 'Driver communication']
    },
    {
      id: 8,
      name: 'SmartiGo Driver',
      description: 'Smart transportation driver application',
      icon: '🚙',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Smart routing', 'Passenger management', 'Earnings tracking']
    },
    {
      id: 9,
      name: 'Black Limousine - Driver',
      description: 'Premium limousine service driver app',
      icon: '🚗',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Luxury service management', 'Client communication', 'Premium features']
    },
    {
      id: 10,
      name: 'Black Limousine',
      description: 'Premium limousine booking service',
      icon: '🖤',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Luxury booking', 'Professional service', 'Premium experience']
    },
    {
      id: 11,
      name: 'Desert Breeze Transportation',
      description: 'Desert transportation service booking',
      icon: '🏜️',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Desert tours', 'Adventure booking', 'Specialized transport']
    },
    {
      id: 12,
      name: 'Desert Breeze Driver',
      description: 'Driver app for desert transportation services',
      icon: '🌵',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Desert navigation', 'Safety features', 'Tour management']
    },
    {
      id: 13,
      name: 'SmartiGo',
      description: 'Smart transportation booking platform',
      icon: '🚀',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Smart booking', 'Multiple transport options', 'Real-time tracking']
    },
    {
      id: 14,
      name: 'YelowSoft POS',
      description: 'Point of Sale system for businesses',
      icon: '💳',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Payment processing', 'Inventory management', 'Sales analytics']
    },
    {
      id: 15,
      name: 'AJL Transfer Driver',
      description: 'Transfer service driver application',
      icon: '🔄',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Transfer management', 'Route planning', 'Client service']
    },
    {
      id: 16,
      name: 'ELEC - Request a ride',
      description: 'Electric vehicle ride request platform',
      icon: '⚡',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Electric vehicles', 'Eco-friendly transport', 'Green mobility']
    },
    {
      id: 17,
      name: 'ELEC Driver',
      description: 'Electric vehicle driver application',
      icon: '🔋',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['EV management', 'Charging stations', 'Eco-friendly service']
    },
    {
      id: 18,
      name: 'Aer VIP Dispatch Driver',
      description: 'VIP dispatch driver application',
      icon: '✈️',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['VIP service', 'Premium dispatch', 'High-end transport']
    },
    {
      id: 19,
      name: 'Excursia Dispatcher',
      description: 'Excursion dispatch management system',
      icon: '🗺️',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Tour dispatch', 'Excursion planning', 'Guide coordination']
    },
    {
      id: 20,
      name: 'Aer VIP',
      description: 'VIP transportation service',
      icon: '👑',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['VIP booking', 'Premium service', 'Luxury transport']
    },
    {
      id: 21,
      name: 'Anake Taxi',
      description: 'Modern taxi booking service',
      icon: '🚖',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Quick booking', 'Real-time tracking', 'Multiple payment options']
    },
    {
      id: 22,
      name: 'Anake Driver',
      description: 'Taxi driver application',
      icon: '👨‍💼',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Driver dashboard', 'Earnings tracking', 'Passenger management']
    },
    {
      id: 23,
      name: 'Excursia Driver Partner',
      description: 'Driver partner for excursion services',
      icon: '🤝',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Partner management', 'Excursion coordination', 'Service delivery']
    },
    {
      id: 24,
      name: 'Big Blue',
      description: 'Transportation service platform',
      icon: '🌊',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Service booking', 'Fleet management', 'Customer service']
    },
    {
      id: 25,
      name: 'Big Blue Driver',
      description: 'Driver application for Big Blue services',
      icon: '🚚',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Service delivery', 'Route management', 'Customer interaction']
    },
    {
      id: 26,
      name: 'Yelowsoft Driver',
      description: 'General driver application',
      icon: '👨‍✈️',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Multi-service support', 'Flexible operations', 'Driver tools']
    },
    {
      id: 27,
      name: 'Yelowsoft Vendor',
      description: 'Vendor management application',
      icon: '🏪',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Vendor dashboard', 'Service management', 'Business tools']
    },
    {
      id: 28,
      name: 'Yelowsoft Dispatcher',
      description: 'Comprehensive dispatch management',
      icon: '📊',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.yelowsoft.user',
      features: ['Fleet dispatch', 'Performance monitoring', 'Operations management']
    }
  ];

  const handleAppPress = (app) => {
    Alert.alert(
      app.name,
      `Would you like to download ${app.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => openAppStore(app.storeUrl)
        }
      ]
    );
  };

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  const handleMenuItemPress = (itemId) => {
    switch (itemId) {
      case 'our_apps':
        // Already on our apps page
        break;
      case 'visit_website':
        Linking.openURL('https://www.peerbits.com/').catch(err => {
          Alert.alert('Error', 'Could not open website');
        });
        break;
      case 'contact_us':
        navigation.navigate('contact-us');
        break;
      case 'share_app':
        // Share app functionality
        const shareApp = async () => {
          try {
            const result = await Share.share({
              message: 'Check out this amazing Quran app! Download it now.',
              url: 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo',
              title: 'Quran App'
            });
            
            if (result.action === Share.sharedAction) {
              console.log('App shared successfully');
            }
          } catch (error) {
            console.log('Error sharing app:', error);
            Alert.alert('Error', 'Could not share the app');
          }
        };
        shareApp();
        break;
      case 'rate_app':
        // Rate app functionality
        const rateApp = () => {
          const appStoreUrl = Platform.OS === 'ios' 
            ? 'https://apps.apple.com/app/id123456789' // Replace with actual iOS app ID when available
            : 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo'; // Using the actual package name from app.json
          
          Linking.openURL(appStoreUrl).catch(err => {
            Alert.alert('Error', 'Could not open app store');
          });
        };
        rateApp();
        break;
      case 'faqs':
        navigation.navigate('faqs');
        break;
      default:
        break;
    }
  };

  const openAppStore = (url) => {
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Could not open app store');
    });
  };

  const renderAppCard = (app) => (
    <TouchableOpacity
      style={styles.appCard}
      onPress={() => handleAppPress(app)}
      activeOpacity={0.8}
    >
      <View style={styles.appHeader}>
        <Text style={styles.appIcon}>{app.icon}</Text>
        <View style={styles.appInfo}>
          <ResponsiveText style={styles.appName}>{app.name}</ResponsiveText>
          <ResponsiveText style={styles.appDescription}>{app.description}</ResponsiveText>
        </View>
      </View>
      
      <View style={styles.featuresContainer}>
        {app.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <ResponsiveText style={styles.featureText}>{feature}</ResponsiveText>
          </View>
        ))}
      </View>
      
      <View style={styles.downloadButton}>
        <ResponsiveText style={styles.downloadText}>Download Now</ResponsiveText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="Our Apps"
        onBackPress={handleBackPress}
        showBackButton={true}
        showMenu={false}
      />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <ResponsiveText style={styles.title}>
            Discover More Islamic Apps
          </ResponsiveText>
          
          <ResponsiveText style={styles.description}>
            Explore our collection of Islamic applications designed to enhance your spiritual journey.
          </ResponsiveText>

          <View style={styles.appsContainer}>
            {apps.map((app) => (
              <View key={app.id}>
                {renderAppCard(app)}
              </View>
            ))}
          </View>

          <View style={styles.footerSection}>
            <ResponsiveText style={styles.footerTitle}>
              More Apps Coming Soon
            </ResponsiveText>
            <ResponsiveText style={styles.footerText}>
              We're constantly working on new Islamic applications to serve the Muslim community.
            </ResponsiveText>
          </View>
        </View>
      </ScrollView>

      <SideMenu
        visible={isMenuVisible}
        onClose={handleMenuClose}
        onMenuItemPress={handleMenuItemPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: getSpacing(20),
  },
  title: {
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(10),
    textAlign: 'center',
  },
  description: {
    fontSize: getFontSize(16),
    color: '#7F8C8D',
    marginBottom: getSpacing(30),
    textAlign: 'center',
    lineHeight: 24,
  },
  appsContainer: {
    marginBottom: getSpacing(30),
  },
  appCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    padding: getSpacing(20),
    marginBottom: getSpacing(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(15),
  },
  appIcon: {
    fontSize: getFontSize(32),
    marginRight: getSpacing(15),
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(5),
  },
  appDescription: {
    fontSize: getFontSize(14),
    color: '#7F8C8D',
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: getSpacing(15),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: getSpacing(5),
  },
  featureBullet: {
    fontSize: getFontSize(14),
    color: '#27AE60',
    marginRight: getSpacing(8),
    marginTop: 2,
  },
  featureText: {
    fontSize: getFontSize(14),
    color: '#5D6D7E',
    flex: 1,
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: '#3498DB',
    paddingVertical: getSpacing(10),
    paddingHorizontal: getSpacing(20),
    borderRadius: getSpacing(8),
    alignItems: 'center',
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: 'bold',
  },
  footerSection: {
    backgroundColor: '#E8F4FD',
    borderRadius: getSpacing(12),
    padding: getSpacing(20),
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getSpacing(10),
  },
  footerText: {
    fontSize: getFontSize(14),
    color: '#5D6D7E',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OurAppsScreen;

