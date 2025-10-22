import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, ImageBackground } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import SideMenu from '../components/SideMenu';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const HomeScreen = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const menuItems = [
    {
      id: 'resume',
      title: 'سيرة ذاتية',
      subtitle: 'RESUME',
      icon: '📖',
      description: 'Biography and life story',
    },
    {
      id: 'bookmarks',
      title: 'العلامات المرجعية',
      subtitle: 'BOOKMARKS',
      icon: '🔖',
      description: 'Your saved bookmarks',
    },
    {
      id: 'favourites',
      title: 'المفضلة',
      subtitle: 'FAVOURITES',
      icon: '⭐',
      description: 'Your favorite verses',
    },
    {
      id: 'surah_index',
      title: 'فهرس السور',
      subtitle: 'SURAH INDEX',
      icon: '📋',
      description: 'Browse all Surahs',
    },
    {
      id: 'juz_index',
      title: 'فهرس الأجزاء / الفقرات',
      subtitle: 'JUZ/PARA INDEX',
      icon: '📚',
      description: 'Browse by Juz/Para',
    },
    {
      id: 'go_to_page',
      title: 'انتقل إلى الصفحة',
      subtitle: 'GO TO PAGE',
      icon: '📄',
      description: 'Navigate to specific page',
    },
    {
      id: 'faqs',
      title: 'الأسئلة الشائعة',
      subtitle: 'FAQ\'s',
      icon: '❓',
      description: 'Frequently asked questions',
    },
  ];

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  const handleMenuItemPress = (itemId) => {
    console.log(`Menu item pressed: ${itemId}`);
    // Handle navigation to different screens based on itemId
    switch (itemId) {
      case 'resume':
        // Navigate to Quran reader
        if (navigation) {
          navigation.navigate('quran-reader');
        }
        break;
      case 'bookmarks':
        // Navigate to bookmarks screen
        console.log('Navigate to bookmarks');
        break;
      case 'favourites':
        // Navigate to favourites screen
        console.log('Navigate to favourites');
        break;
      case 'surah_index':
        // Navigate to surah index
        if (navigation) {
          navigation.navigate('all-surahs');
        }
        break;
      case 'juz_index':
        // Navigate to juz/para index
        if (navigation) {
          navigation.navigate('all-paras');
        }
        break;
      case 'go_to_page':
        // Navigate to go to page screen
        console.log('Navigate to go to page');
        break;
      case 'change_reading_mode':
        // Navigate to reading mode screen
        if (navigation) {
          navigation.navigate('reading-mode');
        }
        break;
      case 'backup_restore':
      case 'our_apps':
      case 'visit_website':
      case 'contact_us':
      case 'share_app':
      case 'rate_app':
        // Navigate to settings screen for these options
        if (navigation) {
          navigation.navigate('settings');
        }
        break;
      case 'faqs':
        // Navigate to FAQ screen
        if (navigation) {
          navigation.navigate('faqs');
        }
        break;
      default:
        console.log(`Unknown menu item: ${itemId}`);
    }
  };

  const handleCardPress = (itemId) => {
    console.log(`Card pressed: ${itemId}`);
    // Handle card press - same as menu item press
    handleMenuItemPress(itemId);
  };

  // Animation effect for home screen
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/home_item_bg.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <CommonHeader 
        title="القرآن الكريم"
        onMenuPress={handleMenuPress}
        showMenu={true}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <ResponsiveText
              size="title"
              weight="bold"
              color="#FFFFFF"
              style={styles.welcomeTitle}
            >
              Welcome to the Holy Quran
            </ResponsiveText>
            <ResponsiveText
              size="medium"
              color="#E0E0E0"
              style={styles.welcomeSubtitle}
            >
              Choose an option to continue
            </ResponsiveText>
          </View>

          {/* Menu Cards */}
          <View style={styles.cardsContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handleCardPress(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIcon}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                  </View>
                  
                  <View style={styles.cardText}>
                    <ResponsiveText
                      size="large"
                      weight="600"
                      color="#1a237e"
                      style={styles.cardTitle}
                    >
                      {item.title}
                    </ResponsiveText>
                    <ResponsiveText
                      size="medium"
                      color="#666666"
                      style={styles.cardSubtitle}
                    >
                      {item.subtitle}
                    </ResponsiveText>
                    <ResponsiveText
                      size="small"
                      color="#999999"
                      style={styles.cardDescription}
                    >
                      {item.description}
                    </ResponsiveText>
                  </View>

                  {item.id === 'go_to_page' && (
                    <View style={styles.actionButton}>
                      <View style={styles.arrowButton}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer Message */}
          <View style={styles.footerSection}>
            <ResponsiveText
              size="small"
              color="#E0E0E0"
              style={styles.footerText}
            >
              Screen par maujood Qur'an ki aayaat ko baghair wuzu chhoona durust nahin hai.
            </ResponsiveText>
          </View>
        </Animated.View>
      </ScrollView>

      <SideMenu
        visible={isMenuVisible}
        onClose={handleMenuClose}
        onMenuItemPress={handleMenuItemPress}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e', // Dark blue background as fallback
  },
  content: {
    flex: 1,
  },
  mainContent: {
    paddingTop: getSpacing(20),
    paddingBottom: getSpacing(40),
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: getSpacing(30),
    paddingHorizontal: getSpacing(20),
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: getSpacing(10),
  },
  welcomeSubtitle: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cardsContainer: {
    paddingHorizontal: getSpacing(10),
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
    borderRadius: getSpacing(12),
    marginBottom: getSpacing(15),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#1a237e',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(20),
  },
  cardIcon: {
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
  cardText: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: getSpacing(5),
  },
  cardSubtitle: {
    marginBottom: getSpacing(3),
    fontWeight: '500',
  },
  cardDescription: {
    fontStyle: 'italic',
  },
  actionButton: {
    marginLeft: getSpacing(10),
  },
  arrowButton: {
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
  footerSection: {
    marginTop: getSpacing(30),
    paddingHorizontal: getSpacing(20),
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    lineHeight: getFontSize(18),
    fontStyle: 'italic',
  },
});

export default HomeScreen;
