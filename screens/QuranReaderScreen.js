import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Platform,
  Alert,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  I18nManager
} from 'react-native';
import { 
  PanGestureHandler,
  PinchGestureHandler,
  State
} from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuranReaderScreen = ({ navigation, route }) => {
  // Get initial page from route params, default to 1
  const initialPage = route?.params?.pageNumber || route?.params?.page || 1;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(134);
  const [showControls, setShowControls] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [bookmarkComment, setBookmarkComment] = useState('');
  const [showSlider, setShowSlider] = useState(false);
  const [hideTimer, setHideTimer] = useState(null);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  
  const pinchRef = useRef(null);
  const panRef = useRef(null);
  
  // Validate navigation object
  const safeNavigation = navigation || { goBack: () => console.log('Navigation not available') };

  // Get image source for current page
  const getImageSource = (pageNumber) => {
    console.log('Getting image source for page:', pageNumber);
    // Create a mapping of page numbers to image sources
    const imageMap = {
      1: require('../assets/quran_safa/quran_safa_1.jpg'),
      2: require('../assets/quran_safa/quran_safa_2.jpg'),
      3: require('../assets/quran_safa/quran_safa_3.jpg'),
      4: require('../assets/quran_safa/quran_safa_4.jpg'),
      5: require('../assets/quran_safa/quran_safa_5.jpg'),
      6: require('../assets/quran_safa/quran_safa_6.jpg'),
      7: require('../assets/quran_safa/quran_safa_7.jpg'),
      8: require('../assets/quran_safa/quran_safa_8.jpg'),
      9: require('../assets/quran_safa/quran_safa_9.jpg'),
      10: require('../assets/quran_safa/quran_safa_10.jpg'),
      11: require('../assets/quran_safa/quran_safa_11.jpg'),
      12: require('../assets/quran_safa/quran_safa_12.jpg'),
      13: require('../assets/quran_safa/quran_safa_13.jpg'),
      14: require('../assets/quran_safa/quran_safa_14.jpg'),
      15: require('../assets/quran_safa/quran_safa_15.jpg'),
      16: require('../assets/quran_safa/quran_safa_16.jpg'),
      17: require('../assets/quran_safa/quran_safa_17.jpg'),
      18: require('../assets/quran_safa/quran_safa_18.jpg'),
      19: require('../assets/quran_safa/quran_safa_19.jpg'),
      20: require('../assets/quran_safa/quran_safa_20.jpg'),
      21: require('../assets/quran_safa/quran_safa_21.jpg'),
      22: require('../assets/quran_safa/quran_safa_22.jpg'),
      23: require('../assets/quran_safa/quran_safa_23.jpg'),
      24: require('../assets/quran_safa/quran_safa_24.jpg'),
      25: require('../assets/quran_safa/quran_safa_25.jpg'),
      26: require('../assets/quran_safa/quran_safa_26.jpg'),
      27: require('../assets/quran_safa/quran_safa_27.jpg'),
      28: require('../assets/quran_safa/quran_safa_28.jpg'),
      29: require('../assets/quran_safa/quran_safa_29.jpg'),
      30: require('../assets/quran_safa/quran_safa_30.jpg'),
      31: require('../assets/quran_safa/quran_safa_31.jpg'),
      32: require('../assets/quran_safa/quran_safa_32.jpg'),
      33: require('../assets/quran_safa/quran_safa_33.jpg'),
      34: require('../assets/quran_safa/quran_safa_34.jpg'),
      35: require('../assets/quran_safa/quran_safa_35.jpg'),
      36: require('../assets/quran_safa/quran_safa_36.jpg'),
      37: require('../assets/quran_safa/quran_safa_37.jpg'),
      38: require('../assets/quran_safa/quran_safa_38.jpg'),
      39: require('../assets/quran_safa/quran_safa_39.jpg'),
      40: require('../assets/quran_safa/quran_safa_40.jpg'),
      41: require('../assets/quran_safa/quran_safa_41.jpg'),
      42: require('../assets/quran_safa/quran_safa_42.jpg'),
      43: require('../assets/quran_safa/quran_safa_43.jpg'),
      44: require('../assets/quran_safa/quran_safa_44.jpg'),
      45: require('../assets/quran_safa/quran_safa_45.jpg'),
      46: require('../assets/quran_safa/quran_safa_46.jpg'),
      47: require('../assets/quran_safa/quran_safa_47.jpg'),
      48: require('../assets/quran_safa/quran_safa_48.jpg'),
      49: require('../assets/quran_safa/quran_safa_49.jpg'),
      50: require('../assets/quran_safa/quran_safa_50.jpg'),
      51: require('../assets/quran_safa/quran_safa_51.jpg'),
      52: require('../assets/quran_safa/quran_safa_52.jpg'),
      53: require('../assets/quran_safa/quran_safa_53.jpg'),
      54: require('../assets/quran_safa/quran_safa_54.jpg'),
      55: require('../assets/quran_safa/quran_safa_55.jpg'),
      56: require('../assets/quran_safa/quran_safa_56.jpg'),
      57: require('../assets/quran_safa/quran_safa_57.jpg'),
      58: require('../assets/quran_safa/quran_safa_58.jpg'),
      59: require('../assets/quran_safa/quran_safa_59.jpg'),
      60: require('../assets/quran_safa/quran_safa_60.jpg'),
      61: require('../assets/quran_safa/quran_safa_61.jpg'),
      62: require('../assets/quran_safa/quran_safa_62.jpg'),
      63: require('../assets/quran_safa/quran_safa_63.jpg'),
      64: require('../assets/quran_safa/quran_safa_64.jpg'),
      65: require('../assets/quran_safa/quran_safa_65.jpg'),
      66: require('../assets/quran_safa/quran_safa_66.jpg'),
      67: require('../assets/quran_safa/quran_safa_67.jpg'),
      68: require('../assets/quran_safa/quran_safa_68.jpg'),
      69: require('../assets/quran_safa/quran_safa_69.jpg'),
      70: require('../assets/quran_safa/quran_safa_70.jpg'),
      71: require('../assets/quran_safa/quran_safa_71.jpg'),
      72: require('../assets/quran_safa/quran_safa_72.jpg'),
      73: require('../assets/quran_safa/quran_safa_73.jpg'),
      74: require('../assets/quran_safa/quran_safa_74.jpg'),
      75: require('../assets/quran_safa/quran_safa_75.jpg'),
      76: require('../assets/quran_safa/quran_safa_76.jpg'),
      77: require('../assets/quran_safa/quran_safa_77.jpg'),
      78: require('../assets/quran_safa/quran_safa_78.jpg'),
      79: require('../assets/quran_safa/quran_safa_79.jpg'),
      80: require('../assets/quran_safa/quran_safa_80.jpg'),
      81: require('../assets/quran_safa/quran_safa_81.jpg'),
      82: require('../assets/quran_safa/quran_safa_82.jpg'),
      83: require('../assets/quran_safa/quran_safa_83.jpg'),
      84: require('../assets/quran_safa/quran_safa_84.jpg'),
      85: require('../assets/quran_safa/quran_safa_85.jpg'),
      86: require('../assets/quran_safa/quran_safa_86.jpg'),
      87: require('../assets/quran_safa/quran_safa_87.jpg'),
      88: require('../assets/quran_safa/quran_safa_88.jpg'),
      89: require('../assets/quran_safa/quran_safa_89.jpg'),
      90: require('../assets/quran_safa/quran_safa_90.jpg'),
      91: require('../assets/quran_safa/quran_safa_91.jpg'),
      92: require('../assets/quran_safa/quran_safa_92.jpg'),
      93: require('../assets/quran_safa/quran_safa_93.jpg'),
      94: require('../assets/quran_safa/quran_safa_94.jpg'),
      95: require('../assets/quran_safa/quran_safa_95.jpg'),
      96: require('../assets/quran_safa/quran_safa_96.jpg'),
      97: require('../assets/quran_safa/quran_safa_97.jpg'),
      98: require('../assets/quran_safa/quran_safa_98.jpg'),
      99: require('../assets/quran_safa/quran_safa_99.jpg'),
      100: require('../assets/quran_safa/quran_safa_100.jpg'),
      101: require('../assets/quran_safa/quran_safa_101.jpg'),
      102: require('../assets/quran_safa/quran_safa_102.jpg'),
      103: require('../assets/quran_safa/quran_safa_103.jpg'),
      104: require('../assets/quran_safa/quran_safa_104.jpg'),
      105: require('../assets/quran_safa/quran_safa_105.jpg'),
      106: require('../assets/quran_safa/quran_safa_106.jpg'),
      107: require('../assets/quran_safa/quran_safa_107.jpg'),
      108: require('../assets/quran_safa/quran_safa_108.jpg'),
      109: require('../assets/quran_safa/quran_safa_109.jpg'),
      110: require('../assets/quran_safa/quran_safa_110.jpg'),
      111: require('../assets/quran_safa/quran_safa_111.jpg'),
      112: require('../assets/quran_safa/quran_safa_112.jpg'),
      113: require('../assets/quran_safa/quran_safa_113.jpg'),
      114: require('../assets/quran_safa/quran_safa_114.jpg'),
      115: require('../assets/quran_safa/quran_safa_115.jpg'),
      116: require('../assets/quran_safa/quran_safa_116.jpg'),
      117: require('../assets/quran_safa/quran_safa_117.jpg'),
      118: require('../assets/quran_safa/quran_safa_118.jpg'),
      119: require('../assets/quran_safa/quran_safa_119.jpg'),
      120: require('../assets/quran_safa/quran_safa_120.jpg'),
      121: require('../assets/quran_safa/quran_safa_121.jpg'),
      122: require('../assets/quran_safa/quran_safa_122.jpg'),
      123: require('../assets/quran_safa/quran_safa_123.jpg'),
      124: require('../assets/quran_safa/quran_safa_124.jpg'),
      125: require('../assets/quran_safa/quran_safa_125.jpg'),
      126: require('../assets/quran_safa/quran_safa_126.jpg'),
      127: require('../assets/quran_safa/quran_safa_127.jpg'),
      128: require('../assets/quran_safa/quran_safa_128.jpg'),
      129: require('../assets/quran_safa/quran_safa_129.jpg'),
      130: require('../assets/quran_safa/quran_safa_130.jpg'),
      131: require('../assets/quran_safa/quran_safa_131.jpg'),
      132: require('../assets/quran_safa/quran_safa_132.jpg'),
      133: require('../assets/quran_safa/quran_safa_133.jpg'),
      134: require('../assets/quran_safa/quran_safa_134.jpg'),
    };
    
    const imageSource = imageMap[pageNumber] || imageMap[1]; // Fallback to page 1 if not found
    console.log('Image source found:', !!imageSource);
    return imageSource;
  };

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem('quran_bookmarks');
      if (savedBookmarks) {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        setBookmarks(parsedBookmarks);
        
        // Check if current page is bookmarked
        const isCurrentPageBookmarked = parsedBookmarks.some(bookmark => bookmark.page === currentPage);
        setIsBookmarked(isCurrentPageBookmarked);
      }
    } catch (error) {
      console.log('Error loading bookmarks:', error);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [currentPage]);

  // Log memory usage when page changes
  useEffect(() => {
    logMemoryUsage();
  }, [currentPage]);

  // Start auto-hide timer when component mounts
  useEffect(() => {
    startHideTimer();
    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, []);


  // Memory cleanup effect
  useEffect(() => {
    return () => {
      // Clear any pending timers
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [hideTimer]);

  // Save current page to local storage for resume functionality
  const saveCurrentPage = async (page) => {
    try {
      const resumeData = {
        page: page,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem('quran_resume_data', JSON.stringify(resumeData));
    } catch (error) {
      console.log('Error saving current page:', error);
    }
  };

  // Load current page from local storage
  const loadCurrentPage = async () => {
    try {
      const savedData = await AsyncStorage.getItem('quran_resume_data');
      if (savedData) {
        const resumeData = JSON.parse(savedData);
        setCurrentPage(resumeData.page || initialPage);
      }
    } catch (error) {
      console.log('Error loading current page:', error);
    }
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      saveCurrentPage(newPage);
      console.log('Navigating to next page:', newPage);
    }
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      saveCurrentPage(newPage);
      console.log('Navigating to previous page:', newPage);
    }
  };




  // Auto-hide controls after 3 seconds
  const startHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    setHideTimer(timer);
  };

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
    if (!showControls) {
      startHideTimer();
    } else {
      if (hideTimer) {
        clearTimeout(hideTimer);
        setHideTimer(null);
      }
    }
  };

  // Toggle full screen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // Auto-hide indicator after 2 seconds
    setTimeout(() => {
      // Indicator will be hidden by the showControls state
    }, 2000);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark();
    } else {
      setShowBookmarkDialog(true);
    }
  };

  // Add bookmark
  const addBookmark = async () => {
    try {
      const newBookmark = {
        id: Date.now(),
        page: currentPage,
        comment: bookmarkComment,
        timestamp: new Date().toISOString()
      };
      
      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);
      setIsBookmarked(true);
      setShowBookmarkDialog(false);
      setBookmarkComment('');
      
      await AsyncStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
      Alert.alert('Success', 'Bookmark added successfully!');
    } catch (error) {
      console.log('Error saving bookmark:', error);
      Alert.alert('Error', 'Failed to save bookmark');
    }
  };

  // Remove bookmark
  const removeBookmark = async () => {
    try {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.page !== currentPage);
      setBookmarks(updatedBookmarks);
      setIsBookmarked(false);
      
      await AsyncStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
      Alert.alert('Success', 'Bookmark removed successfully!');
    } catch (error) {
      console.log('Error removing bookmark:', error);
      Alert.alert('Error', 'Failed to remove bookmark');
    }
  };

  // Toggle slider
  const toggleSlider = () => {
    setShowSlider(!showSlider);
  };

  // Handle slider change
  const onSliderChange = (value) => {
    const newPage = Math.round(value);
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      saveCurrentPage(newPage);
      scrollToPage(newPage);
    }
  };

  console.log('QuranReaderScreen rendering - currentPage:', currentPage, 'totalPages:', totalPages);
  
  // Memory monitoring
  const logMemoryUsage = () => {
    if (__DEV__) {
      console.log('Memory usage - Current page:', currentPage, 'Rendering pages:', 
        Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => Math.abs(page - currentPage) <= 1)
      );
    }
  };
  
  return (
    <GestureHandlerRootView style={[styles.container, { direction: 'rtl' }]}>
      <View style={[styles.container, { direction: 'rtl' }]}>
      
       <StatusBar hidden={true} />
      {/* Image Slider */}
      <PanGestureHandler
        onGestureEvent={(event) => {
          const { translationX } = event.nativeEvent;
          // Handle swipe gestures for navigation
        }}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            const { translationX, velocityX } = event.nativeEvent;
            
            // RTL Navigation: Swipe right = next page, Swipe left = previous page
            if (translationX > 50 || velocityX > 500) {
              goToNextPage(); // Swipe right = next page in RTL
            }
            else if (translationX < -50 || velocityX < -500) {
              goToPreviousPage(); // Swipe left = previous page in RTL
            }
          }
        }}
      >
        <View style={styles.pageContainer}>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={toggleControls}
            onLongPress={toggleFullScreen}
            activeOpacity={1}
          >
            <Image
              source={getImageSource(currentPage)}
              style={styles.quranImage}
              resizeMode="stretch"
              onError={(error) => {
                console.log('Image load error for page', currentPage, error);
              }}
              onLoad={() => {
                console.log('Image loaded successfully for page', currentPage);
              }}
              fadeDuration={300}
              loadingIndicatorSource={null}
              defaultSource={require('../assets/quran_safa/quran_safa_1.jpg')}
            />
          </TouchableOpacity>
        </View>
      </PanGestureHandler>

      {/* Floating Back Button */}
      {showControls && (
        <TouchableOpacity 
          style={styles.floatingBackButton}
          onPress={() => safeNavigation.goBack()}
          activeOpacity={0.7}
        >
          <Image 
            source={require('../assets/icons/ic_back.png')}
            style={styles.backIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {/* Floating Bookmark Button */}
      {showControls && (
        <TouchableOpacity 
          style={styles.floatingBookmarkButton}
          onPress={toggleBookmark}
          activeOpacity={0.7}
        >
          <Image 
            source={require('../assets/icons/ic_bookmark.png')}
            style={[styles.bookmarkIconImage, isBookmarked && styles.bookmarkedIcon]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}



      {/* Page Slider */}
      {showSlider && (
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderTitle}>Go to Page</Text>
            <TouchableOpacity onPress={toggleSlider}>
              <Text style={styles.closeSliderText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Custom Slider Implementation */}
          <View style={styles.customSliderContainer}>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderProgress, 
                  { width: `${((currentPage - 1) / (totalPages - 1)) * 100}%` }
                ]} 
              />
              <View 
                style={[
                  styles.sliderThumb,
                  { left: `${((currentPage - 1) / (totalPages - 1)) * 100}%` }
                ]}
              />
            </View>
            
          </View>
          
        </View>
      )}

      {/* Page Info - Removed header as requested */}

      {/* Bookmark Input Dialog */}
      {showBookmarkDialog && (
        <View style={styles.bookmarkModal}>
          <View style={styles.bookmarkModalContent}>
            <View style={styles.bookmarkModalHeader}>
              <Text style={styles.bookmarkModalTitle}>Add Bookmark</Text>
              <TouchableOpacity onPress={() => setShowBookmarkDialog(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.bookmarkModalSubtitle}>Page {currentPage}</Text>
            
            <TextInput
              style={styles.bookmarkInput}
              placeholder="Add a comment (optional)"
              value={bookmarkComment}
              onChangeText={setBookmarkComment}
              multiline
              maxLength={100}
              textAlign="right" // RTL text alignment
              writingDirection="rtl" // RTL writing direction
            />
            
            <View style={styles.bookmarkModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBookmarkDialog(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={addBookmark}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    direction: 'rtl',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
    margin: 0,
    padding: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    minHeight: screenHeight,
    margin: 0,
    padding: 0,
  },
  pageContainer: {
    width: screenWidth,
    height: screenHeight,
    margin: 0,
    padding: 0,
    direction: 'rtl',
  },
  gestureContainer: {
    flex: 1,
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    backgroundColor: '#000000',
    direction: 'rtl',
  },
  quranImage: {
    width: screenWidth,
    height: screenHeight,
    margin: 0,
    padding: 0,
  },
  floatingBackButton: {
    position: 'absolute',
    bottom: getSpacing(20),
    right: getSpacing(15), // Changed from left to right for RTL
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: 'rgba(26, 35, 126, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  floatingBookmarkButton: {
    position: 'absolute',
    bottom: getSpacing(20),
    left: getSpacing(15), // Changed from right to left for RTL
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: 'rgba(26, 35, 126, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backIconImage: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },
  bookmarkIconImage: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },
  bookmarkedIcon: {
    tintColor: '#FFD700', // Gold color when bookmarked
  },
  pageInfo: {
    position: 'absolute',
    top: getSpacing(50),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSpacing(20),
    zIndex: 9999,
  },
  pageText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: getSpacing(15),
    paddingVertical: getSpacing(8),
    borderRadius: getSpacing(20),
  },
  sliderButton: {
    backgroundColor: 'rgba(26, 35, 126, 0.9)',
    paddingHorizontal: getSpacing(15),
    paddingVertical: getSpacing(8),
    borderRadius: getSpacing(20),
  },
  sliderButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
  },
  sliderContainer: {
    position: 'absolute',
    bottom: getSpacing(100),
    left: getSpacing(20),
    right: getSpacing(20),
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: getSpacing(15),
    padding: getSpacing(20),
    zIndex: 9999,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing(15),
  },
  sliderTitle: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
  closeSliderText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
  customSliderContainer: {
    marginVertical: getSpacing(15),
  },
  sliderTrack: {
    height: getSpacing(6),
    backgroundColor: '#E0E0E0',
    borderRadius: getSpacing(3),
    position: 'relative',
    marginBottom: getSpacing(20),
  },
  sliderProgress: {
    height: getSpacing(6),
    backgroundColor: '#1a237e',
    borderRadius: getSpacing(3),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sliderThumb: {
    position: 'absolute',
    top: -getSpacing(7),
    width: getSpacing(20),
    height: getSpacing(20),
    backgroundColor: '#1a237e',
    borderRadius: getSpacing(10),
    marginLeft: -getSpacing(10),
  },
  sliderText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    textAlign: 'center',
    marginTop: getSpacing(10),
  },
  bookmarkModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    direction: 'rtl',
  },
  bookmarkModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(15),
    padding: getSpacing(20),
    width: screenWidth * 0.8,
    maxWidth: 400,
  },
  bookmarkModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing(15),
  },
  bookmarkModalTitle: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    color: '#1a237e',
  },
  closeButtonText: {
    fontSize: getFontSize(20),
    color: '#666',
    fontWeight: 'bold',
  },
  bookmarkModalSubtitle: {
    fontSize: getFontSize(14),
    color: '#666',
    marginBottom: getSpacing(15),
  },
  bookmarkInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: getSpacing(8),
    padding: getSpacing(12),
    fontSize: getFontSize(14),
    marginBottom: getSpacing(20),
    minHeight: getSpacing(80),
    textAlignVertical: 'top',
    textAlign: 'right', // RTL text alignment
    writingDirection: 'rtl', // RTL writing direction
  },
  bookmarkModalButtons: {
    flexDirection: 'row-reverse', // RTL button order
    justifyContent: 'flex-start', // RTL alignment
    gap: getSpacing(10),
  },
  cancelButton: {
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(10),
    borderRadius: getSpacing(8),
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(10),
    borderRadius: getSpacing(8),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
});

export default QuranReaderScreen;