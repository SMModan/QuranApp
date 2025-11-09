import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, ImageBackground, Image, TextInput, Alert, KeyboardAvoidingView, Platform, Linking, Share, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import SideMenu from '../components/SideMenu';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollViewRef = useRef(null);

  const menuItems = [
    {
      id: 'resume',
      title: 'ریزیومے',
      subtitle: 'RESUME',
      icon: '📖',
      iconImage: require('../assets/icons/ic_home_item_resume.png'),
      description: 'Biography and life story',
    },
    {
      id: 'bookmarks',
      title: 'بک مارکس',
      subtitle: 'BOOKMARKS',
      icon: '🔖',
      iconImage: require('../assets/icons/ic_home_item_bookmark.png'),
      description: 'Your saved bookmarks',
    },
    {
      id: 'favourites',
      title: 'پسندیدہ',
      subtitle: 'FAVOURITES',
      icon: '⭐',
      iconImage: require('../assets/icons/ic_home_favourites.png'),
      description: 'Your favorite verses',
    },
    {
      id: 'surah_index',
      title: 'سورتوں کی فہرست',
      subtitle: 'SURAH INDEX',
      icon: '📋',
      iconImage: require('../assets/icons/ic_home_surah_index.png'),
      description: 'Browse all Surahs',
    },
    {
      id: 'juz_index',
      title: 'جزو/پارہ کی فہرست',
      subtitle: 'JUZ/PARA INDEX',
      icon: '📚',
      iconImage: require('../assets/icons/home_juz_para_index.png'),
      description: 'Browse by Juz/Para',
    },
    {
      id: 'go_to_page',
      title: 'صفحہ پر جائیں',
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

  const isPageNumberValid = () => {
    const page = parseInt(pageNumber);
    return pageNumber.trim() !== '' && !isNaN(page) && page >= 1 && page <= 134;
  };

  const handleGoToPage = () => {
    const page = parseInt(pageNumber);
    
    console.log('Go to page - Input pageNumber:', pageNumber);
    console.log('Go to page - Parsed page:', page);
    
    if (!pageNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الصفحة');
      return;
    }
    
    if (isNaN(page) || page < 1 || page > 134) {
      Alert.alert('خطأ', 'رقم الصفحة يجب أن يكون بين 1 و 134');
      return;
    }
    
    // Dismiss keyboard before navigation
    Keyboard.dismiss();
    
    console.log('Navigating to page:', page);
    
    // Navigate to QuranReaderScreen with the specified page
    if (navigation) {
      const navigationParams = { 
        pageNumber: page,
        chapterName: `الصفحة ${page}`,
        verseNumber: '1',
        sectionNumber: '1',
        juzNumber: 'الجزء'
      };
      console.log('Navigation params:', navigationParams);
      navigation.navigate('quran-reader', navigationParams);
    }
  };

  const handleInputFocus = () => {
    // Optional: Add any focus handling if needed
    console.log('Input focused');
  };

  // Share app functionality
  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this amazing Quran app! Download it now.',
        url: 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo', // Using the actual package name from app.json
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

  // Rate app functionality
  const rateApp = () => {
    const appStoreUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/id123456789' // Replace with actual iOS app ID when available
      : 'https://play.google.com/store/apps/details?id=com.anonymous.QuranAppExpo'; // Using the actual package name from app.json
    
    Linking.openURL(appStoreUrl).catch(err => {
      Alert.alert('Error', 'Could not open app store');
    });
  };

  // Load saved page and navigate to Quran reader
  const loadResumePage = async () => {
    try {
      const savedResumeData = await AsyncStorage.getItem('quran_resume_data');
      if (savedResumeData) {
        const resumeData = JSON.parse(savedResumeData);
        console.log('Loading resume page:', resumeData.page);
        navigation.navigate('quran-reader', { pageNumber: resumeData.page });
      } else {
        console.log('No saved page found, navigating to page 1');
        navigation.navigate('quran-reader', { pageNumber: 1 });
      }
    } catch (error) {
      console.log('Error loading resume page:', error);
      // Fallback to page 1 if there's an error
      navigation.navigate('quran-reader', { pageNumber: 1 });
    }
  };

  const handleMenuItemPress = (itemId) => {
    console.log(`Menu item pressed: ${itemId}`);
    // Handle navigation to different screens based on itemId
    switch (itemId) {
      case 'resume':
        // Navigate to Quran reader with saved page
        if (navigation) {
          loadResumePage();
        }
        break;
      case 'bookmarks':
        // Navigate to bookmarks screen
        if (navigation) {
          navigation.navigate('bookmarks');
        }
        break;
      case 'favourites':
        // Navigate to favourites screen
        if (navigation) {
          navigation.navigate('favorites');
        }
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
        // Navigate directly to Quran reader with current page number
        if (navigation && pageNumber) {
          const page = parseInt(pageNumber);
          if (!isNaN(page) && page >= 1 && page <= 134) {
            navigation.navigate('quran-reader', { 
              pageNumber: page,
              chapterName: `الصفحة ${page}`,
              verseNumber: '1',
              sectionNumber: '1',
              juzNumber: 'الجزء'
            });
          } else {
            // If no valid page number, go to page 1
            navigation.navigate('quran-reader', { pageNumber: 1 });
          }
        }
        break;
      case 'backup_restore':
        // Navigate to backup/restore screen
        if (navigation) {
          navigation.navigate('backup-restore');
        }
        break;
      case 'our_apps':
        // Navigate to our apps screen
        if (navigation) {
          navigation.navigate('our-apps');
        }
        break;
      case 'visit_website':
        // Open Peerbits website in browser
        Linking.openURL('https://www.peerbits.com/').catch(err => {
          Alert.alert('Error', 'Could not open website');
        });
        break;
      case 'contact_us':
        // Navigate to contact us screen
        if (navigation) {
          navigation.navigate('contact-us');
        }
        break;
      case 'share_app':
        // Share app functionality
        shareApp();
        break;
      case 'rate_app':
        // Rate app functionality
        rateApp();
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
    if (itemId === 'go_to_page') {
      // Do nothing for go to page card - only input field and button work
      return;
    } else {
      handleMenuItemPress(itemId);
    }
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
      
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            keyboardDismissMode="interactive"
          >
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
                          style={[
                            styles.goToPageTextInput,
                            {
                              flex: 1,
                              textAlign: 'center',
                              textAlignVertical: 'center',
                              paddingVertical: 0,
                              marginVertical: 0,
                              height: '100%'
                            }
                          ]}
                          keyboardType="numeric"
                          maxLength={3}
                          value={pageNumber}
                          onChangeText={setPageNumber}
                          onFocus={handleInputFocus}
                          underlineColorAndroid="transparent"
                          returnKeyType="done"
                          blurOnSubmit={true}
                          onSubmitEditing={handleGoToPage}
                        />
                        <TouchableOpacity
                          style={[
                            styles.goToPageButton,
                            !isPageNumberValid() && styles.goToPageButtonDisabled
                          ]}
                          onPress={handleGoToPage}
                          activeOpacity={isPageNumberValid() ? 0.8 : 1}
                          disabled={!isPageNumberValid()}
                        >
                          <Image
                            source={require('../assets/icons/ic_home_goto_page_right_side_icon.png')}
                            style={[
                              styles.goToPageButtonIcon,
                              !isPageNumberValid() && styles.goToPageButtonIconDisabled
                            ]}
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
        </TouchableWithoutFeedback>
      </View>

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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: getSpacing(5),
  },
  mainContent: {
    paddingTop: getSpacing(20),
    paddingBottom: getSpacing(10),
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
    height: getSpacing(55),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: getSpacing(27),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: getSpacing(12),
    paddingTop: getSpacing(12),
    paddingBottom: getSpacing(12),
    paddingRight: getSpacing(8),
    position: 'relative',
  },
  goToPageTextInput: {
    flex: 1,
    fontSize: getFontSize(20),
    color: '#000000',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: getSpacing(4),
    paddingVertical: getSpacing(6),
    backgroundColor: 'transparent',
    borderWidth: 0,
    outline: 'none',
    lineHeight: getFontSize(24),
    minHeight: getSpacing(40),
    justifyContent: 'center',
    alignItems: 'center',
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
  goToPageButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
  goToPageButtonIconDisabled: {
    opacity: 0.5,
  },
});

export default HomeScreen;
