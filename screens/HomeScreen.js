import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, ImageBackground, Image, TextInput, Alert } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import SideMenu from '../components/SideMenu';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const HomeScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const menuItems = [
    {
      id: 'resume',
      title: 'سيرة ذاتية',
      subtitle: 'RESUME',
      icon: '📖',
      iconImage: require('../assets/icons/ic_home_item_resume.png'),
      description: 'Biography and life story',
    },
    {
      id: 'bookmarks',
      title: 'العلامات المرجعية',
      subtitle: 'BOOKMARKS',
      icon: '🔖',
      iconImage: require('../assets/icons/ic_home_item_bookmark.png'),
      description: 'Your saved bookmarks',
    },
    {
      id: 'favourites',
      title: 'المفضلة',
      subtitle: 'FAVOURITES',
      icon: '⭐',
      iconImage: require('../assets/icons/ic_home_favourites.png'),
      description: 'Your favorite verses',
    },
    {
      id: 'surah_index',
      title: 'فهرس السور',
      subtitle: 'SURAH INDEX',
      icon: '📋',
      iconImage: require('../assets/icons/ic_home_surah_index.png'),
      description: 'Browse all Surahs',
    },
    {
      id: 'juz_index',
      title: 'فهرس الأجزاء / الفقرات',
      subtitle: 'JUZ/PARA INDEX',
      icon: '📚',
      iconImage: require('../assets/icons/home_juz_para_index.png'),
      description: 'Browse by Juz/Para',
    },
    {
      id: 'go_to_page',
      title: 'انتقل إلى الصفحة',
      subtitle: 'GO TO PAGE',
      icon: '📄',
      iconImage: require('../assets/icons/ic_home_go_to_page.png'),
      description: 'Navigate to specific page',
    }
  ];

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  const handleGoToPage = () => {
    const page = parseInt(pageNumber);
    
    if (!pageNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الصفحة');
      return;
    }
    
    if (isNaN(page) || page < 1 || page > 604) {
      Alert.alert('خطأ', 'رقم الصفحة يجب أن يكون بين 1 و 604');
      return;
    }
    
    // Navigate to QuranReaderScreen with the specified page
    if (navigation) {
      navigation.navigate('quran-reader', { 
        page: page,
        title: `الصفحة ${page}`
      });
    }
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
        console.log('Navigating to go-to-page screen');
        if (navigation) {
          navigation.navigate('go-to-page');
        }
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
    <View style={styles.container}>
      <CommonHeader 
        title="القرآن الكريم"
        onMenuPress={handleMenuPress}
        showMenu={true}
        backgroundColor="#083569"
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

          {/* Menu Cards */}
          <View style={styles.cardsContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handleCardPress(item.id)}
                activeOpacity={0.8}
              >
                <ImageBackground 
                  source={require('../assets/icons/home_item_bg.png')} 
                  style={styles.cardBackground}
                  resizeMode="stretch"
                >
                  <View style={styles.cardContent}>
                  <View style={styles.cardIcon}>
                    {item.iconImage ? (
                      <Image 
                        source={item.iconImage} 
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.iconText}>{item.icon}</Text>
                    )}
                  </View>
                  
                  <View style={styles.cardText}>
                    <ResponsiveText
                      size="large"
                      weight="600"
                      color="#1a237e"
                      style={[styles.cardTitle, { fontSize: 16 }]}
                    >
                      {item.title}
                    </ResponsiveText>
                    <ResponsiveText
                      size="medium"
                      color="#1a237e"
                      style={[styles.cardSubtitle, { fontSize: 18 }]}
                    >
                      {item.subtitle}
                    </ResponsiveText>
                  </View>

                  {item.id === 'go_to_page' && (
                    <View style={styles.goToPageInputContainer}>
                      <View style={styles.goToPageInputField}>
                        <TextInput
                          style={styles.goToPageTextInput}
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                          maxLength={3}
                          value={pageNumber}
                          onChangeText={setPageNumber}
                        />
                        <TouchableOpacity
                          style={styles.goToPageButton}
                          onPress={handleGoToPage}
                          activeOpacity={0.8}
                        >
                          <Image
                            source={require('../assets/icons/ic_home_goto_page_right_side_icon.png')}
                            style={styles.goToPageButtonIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer Message */}
          <View style={styles.footerSection}>
            <ResponsiveText
              size="small"
              color="#083569"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBECFF', // Light blue background
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
    marginBottom: getSpacing(15),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardBackground: {
    borderRadius: getSpacing(12),
    overflow: 'hidden',
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
  iconImage: {
    width: getSpacing(40),
    height: getSpacing(40),
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
  // Go to Page simple input styles
  goToPageInputContainer: {
    marginTop: getSpacing(10),
  },
  goToPageInputField: {
    width: getSpacing(120),
    height: getSpacing(45),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: getSpacing(22),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: getSpacing(12),
    paddingTop: getSpacing(8),
    paddingBottom: getSpacing(8),
    paddingRight: getSpacing(6),
    position: 'relative',
  },
  goToPageTextInput: {
    flex: 1,
    fontSize: getFontSize(14),
    color: '#083569',
    textAlign: 'left',
    paddingRight: getSpacing(10),
  },
  goToPageButton: {
    backgroundColor: '#083569',
    borderRadius: getSpacing(18),
    width: getSpacing(36),
    height: getSpacing(36),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goToPageButtonIcon: {
    width: getSpacing(18),
    height: getSpacing(18),
  },
});

export default HomeScreen;
