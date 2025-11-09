import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Image,
  Animated,
  BackHandler,
  FlatList
} from 'react-native';
import { 
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  State
} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ZoomableImage component for pinch zoom and double tap reset
const ZoomableImage = ({ source, style, onError, onLoad, onLoadStart, fadeDuration }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  
  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  
  const doubleTapRef = useRef(null);
  const pinchRef = useRef(null);
  const panRef = useRef(null);
  
  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  
  // Reset to normal state
  const resetZoom = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start(() => {
      lastScale.current = 1;
      lastTranslateX.current = 0;
      lastTranslateY.current = 0;
    });
  };
  
  // Pinch gesture handler
  const onPinchGestureEvent = (event) => {
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, lastScale.current * event.nativeEvent.scale));
    scale.setValue(newScale);
  };
  
  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, lastScale.current * event.nativeEvent.scale));
      lastScale.current = newScale;
      scale.setValue(newScale);
      
      // Reset translation if scale is back to 1
      if (newScale === 1) {
        translateX.setValue(0);
        translateY.setValue(0);
        lastTranslateX.current = 0;
        lastTranslateY.current = 0;
      }
    } else if (event.nativeEvent.state === State.BEGAN) {
      // Reset the scale value to last scale when gesture begins
      scale.setValue(lastScale.current);
    }
  };
  
  // Pan gesture handler - only allow panning when zoomed
  const onPanGestureEvent = (event) => {
    if (lastScale.current > 1) {
      const newTranslateX = lastTranslateX.current + event.nativeEvent.translationX;
      const newTranslateY = lastTranslateY.current + event.nativeEvent.translationY;
      
      // Clamp translation based on scale
      const maxTranslateX = (screenWidth * (lastScale.current - 1)) / 2;
      const maxTranslateY = (screenHeight * (lastScale.current - 1)) / 2;
      
      translateX.setValue(Math.max(-maxTranslateX, Math.min(maxTranslateX, newTranslateX)));
      translateY.setValue(Math.max(-maxTranslateY, Math.min(maxTranslateY, newTranslateY)));
    }
  };
  
  const onPanHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (lastScale.current > 1) {
        lastTranslateX.current += event.nativeEvent.translationX;
        lastTranslateY.current += event.nativeEvent.translationY;
        
        // Clamp translation based on scale
        const maxTranslateX = (screenWidth * (lastScale.current - 1)) / 2;
        const maxTranslateY = (screenHeight * (lastScale.current - 1)) / 2;
        
        lastTranslateX.current = Math.max(-maxTranslateX, Math.min(maxTranslateX, lastTranslateX.current));
        lastTranslateY.current = Math.max(-maxTranslateY, Math.min(maxTranslateY, lastTranslateY.current));
        
        translateX.setValue(lastTranslateX.current);
        translateY.setValue(lastTranslateY.current);
      }
    } else if (event.nativeEvent.state === State.BEGAN) {
      // Reset translation values to last position when gesture begins
      translateX.setValue(lastTranslateX.current);
      translateY.setValue(lastTranslateY.current);
    }
  };
  
  // Double tap handler
  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      resetZoom();
    }
  };
  
  // Single tap handler (to prevent conflicts)
  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Do nothing on single tap, just prevent it from interfering
    }
  };
  
  return (
    <TapGestureHandler
      ref={doubleTapRef}
      numberOfTaps={2}
      onHandlerStateChange={onDoubleTap}
    >
      <Animated.View style={{ flex: 1 }}>
        <TapGestureHandler
          numberOfTaps={1}
          waitFor={doubleTapRef}
          onHandlerStateChange={onSingleTap}
        >
          <Animated.View style={{ flex: 1 }}>
            <PinchGestureHandler
              ref={pinchRef}
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchHandlerStateChange}
            >
              <Animated.View style={{ flex: 1 }}>
                <PanGestureHandler
                  ref={panRef}
                  onGestureEvent={onPanGestureEvent}
                  onHandlerStateChange={onPanHandlerStateChange}
                  minPointers={1}
                  maxPointers={1}
                  simultaneousHandlers={pinchRef}
                  activeOffsetX={[-5, 5]}
                  activeOffsetY={[-20, 20]}
                  failOffsetX={[-100, 100]}
                  failOffsetY={[-100, 100]}
                  avgTouches
                >
                  <Animated.View
                    style={[
                      style,
                      {
                        transform: [
                          { translateX },
                          { translateY },
                          { scale },
                        ],
                      },
                    ]}
                  >
                    <Image
                      source={source}
                      style={[style, { width: '100%', height: '100%' }]}
                      resizeMode="stretch"
                      onError={onError}
                      onLoad={onLoad}
                      onLoadStart={onLoadStart}
                      fadeDuration={fadeDuration}
                    />
                  </Animated.View>
                </PanGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

// Image map moved outside component for better performance - only created once
const IMAGE_MAP = {
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

const QuranReaderScreen = ({ navigation, route }) => {
  // Get initial page from route params, default to 1
  const initialPage = route?.params?.pageNumber || route?.params?.page || 1;
  
  console.log('QuranReaderScreen - Route params:', route?.params);
  console.log('QuranReaderScreen - Initial page:', initialPage);
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(134);
  const [showControls, setShowControls] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [bookmarkComment, setBookmarkComment] = useState('');
  const [showSlider, setShowSlider] = useState(false);
  const [hideTimer, setHideTimer] = useState(null);
  
  // FlatList refs and state
  const flatListRef = useRef(null);
  const hasScrolledToInitialPage = useRef(false);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  });
  
  // Validate navigation object
  const safeNavigation = navigation || { goBack: () => console.log('Navigation not available') };
  
  // Generate array of page numbers for FlatList
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Get image source for page - optimized
  const getImageSource = useCallback((pageNumber) => {
    const validPage = Math.max(1, Math.min(134, pageNumber || 1));
    return IMAGE_MAP[validPage] || IMAGE_MAP[1]; // Fallback to page 1 if not found
  }, []);

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

  // Keep StatusBar hidden at all times
  useEffect(() => {
    StatusBar.setHidden(true, 'none');
    return () => {
      // Keep it hidden even on unmount
      StatusBar.setHidden(true, 'none');
    };
  }, []);

  // Ensure StatusBar stays hidden when bookmark dialog opens/closes
  useEffect(() => {
    StatusBar.setHidden(true, 'none');
  }, [showBookmarkDialog]);

  // Consolidated useEffect hooks for better performance
  useEffect(() => {
    loadBookmarks();
    logMemoryUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Load saved page on component mount and when route params change
  useEffect(() => {
    loadCurrentPage();
  }, [route?.params]);

  // Scroll to initial page when component mounts or route params change
  useEffect(() => {
    // Reset scroll flag when route params change
    hasScrolledToInitialPage.current = false;
    
    const scrollToPage = () => {
      if (flatListRef.current) {
        const targetPage = route?.params?.pageNumber || route?.params?.page || initialPage;
        const pageIndex = Math.max(0, Math.min(totalPages - 1, targetPage - 1));
        
        console.log('Scrolling to page:', targetPage, 'index:', pageIndex);
        
        // Use scrollToOffset for vertical scroll - fix: use exact page index
        const offset = pageIndex * screenHeight;
        flatListRef.current.scrollToOffset({
          offset: offset,
          animated: false,
        });
        
        // Also try scrollToIndex as backup
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: pageIndex,
            animated: false,
            viewPosition: 0,
          });
          setCurrentPage(targetPage);
          hasScrolledToInitialPage.current = true;
        }, 100);
      }
    };
    
    // Delay to ensure FlatList is fully mounted
    const timer = setTimeout(scrollToPage, 500);
    
    return () => clearTimeout(timer);
  }, [route?.params?.pageNumber, route?.params?.page, initialPage, totalPages, screenHeight]);

  // Handle back press - navigate to home screen
  const handleBackPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('home');
    } else if (safeNavigation.goBack) {
      safeNavigation.goBack();
    }
    return true;
  };

  // Start auto-hide timer when component mounts and cleanup
  useEffect(() => {
    startHideTimer();
    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, []);

  // Handle back button press - navigate to home screen
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress();
      return true; // Prevent default back behavior
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Save current page to local storage for resume functionality
  const saveCurrentPage = async (page) => {
    try {
      const resumeData = {
        page: page,
        timestamp: new Date().toISOString()
      };
      console.log('Saving current page:', page, 'Data:', resumeData);
      await AsyncStorage.setItem('quran_resume_data', JSON.stringify(resumeData));
      console.log('Page saved successfully');
    } catch (error) {
      console.log('Error saving current page:', error);
    }
  };

  // Load current page from local storage
  const loadCurrentPage = async () => {
    try {
      // Only load from AsyncStorage if no specific page was passed in route params
      const hasSpecificPage = route?.params?.pageNumber || route?.params?.page;
      
      if (hasSpecificPage) {
        console.log('Specific page requested, using route params:', initialPage);
        setCurrentPage(initialPage);
        return;
      }
      
      const savedData = await AsyncStorage.getItem('quran_resume_data');
      if (savedData) {
        const resumeData = JSON.parse(savedData);
        const savedPage = resumeData.page || initialPage;
        // Fix: Ensure savedPage is valid and not off by one
        const validPage = Math.max(1, Math.min(totalPages, savedPage));
        console.log('Loading saved page:', validPage, 'Initial page:', initialPage);
        setCurrentPage(validPage);
      } else {
        console.log('No saved data, using initial page:', initialPage);
        setCurrentPage(initialPage);
      }
    } catch (error) {
      console.log('Error loading current page:', error);
      setCurrentPage(initialPage);
    }
  };

  // Handle viewable items change to track current page - Vertical scroll
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // Get the most visible item (highest visibility percentage)
      const mostVisible = viewableItems.reduce((prev, current) => 
        (current.isViewable && (current.percentVisible || 0) > (prev.percentVisible || 0)) ? current : prev
      );
      
      if (mostVisible && mostVisible.index !== null && mostVisible.index !== undefined) {
        const newPage = mostVisible.index + 1; // index is 0-based, page is 1-based
        if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          saveCurrentPage(newPage);
        }
      }
    }
  }, [currentPage, totalPages]);

  // Get item layout for FlatList performance - Vertical
  const getItemLayoutVertical = useCallback(
    (data, index) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    []
  );

  // Render each page item
  const renderPageItem = useCallback(({ item, index }) => {
    const pageNumber = item; // item is the page number from pagesArray
    const imageSource = getImageSource(pageNumber);
    
    // Debug logging
    console.log('=== renderPageItem DEBUG ===');
    console.log('item:', item);
    console.log('index:', index);
    console.log('pageNumber:', pageNumber);
    console.log('imageSource:', imageSource);
    console.log('imageSource type:', typeof imageSource);
    console.log('imageSource value:', JSON.stringify(imageSource));
    console.log('===========================');
    
    return (
      <View style={styles.pageItemContainer}>
        <ZoomableImage
          source={imageSource}
          style={styles.quranImage}
          onError={(error) => {
            console.error('Image load error for page', pageNumber, error);
          }}
          onLoad={() => {
            console.log('Image loaded successfully for page', pageNumber);
          }}
          onLoadStart={() => {
            console.log('Image loading started for page', pageNumber);
          }}
          fadeDuration={200}
        />
      </View>
    );
  }, [getImageSource]);




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
    StatusBar.setHidden(true, 'none');
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

  // Toggle full screen mode - hide status bar and controls
  const toggleFullScreen = () => {
    setShowControls(false);
    // Controls will auto-hide after timer
    startHideTimer();
  };

  // Close bookmark dialog
  const closeBookmarkDialog = () => {
    StatusBar.setHidden(true, 'none');
    setShowBookmarkDialog(false);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    StatusBar.setHidden(true, 'none');
    if (isBookmarked) {
      removeBookmark();
    } else {
      setShowBookmarkDialog(true);
    }
  };

  // Add bookmark
  const addBookmark = async () => {
    StatusBar.setHidden(true, 'none');
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
      setBookmarkComment('');
      closeBookmarkDialog();
      
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
    if (!showSlider) {
      // Show controls when opening slider
      setShowControls(true);
      startHideTimer();
    }
  };

  // Handle slider track press - scroll to specific page (vertical)
  const handleSliderTrackPress = (event) => {
    const { locationX } = event.nativeEvent;
    const sliderContainerWidth = screenWidth - (getSpacing(20) * 2); // Left and right padding
    const trackWidth = sliderContainerWidth - (getSpacing(20) * 2); // Container inner padding
    const percentage = Math.max(0, Math.min(1, locationX / trackWidth));
    const newPage = Math.round(1 + (percentage * (totalPages - 1)));
    
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages && flatListRef.current) {
      const pageIndex = newPage - 1; // Convert to 0-based index
      const offset = pageIndex * screenHeight;
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: true,
      });
      setCurrentPage(newPage);
      saveCurrentPage(newPage);
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
    <GestureHandlerRootView style={styles.container}>
      <StatusBar 
        hidden={true} 
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      {/* Continuous Reading FlatList - Vertical Scroll */}
      <View style={styles.pageContainer}>
        <FlatList
          ref={flatListRef}
          data={pagesArray}
          renderItem={renderPageItem}
          keyExtractor={(item) => `page-${item}`}
          horizontal={false}
          pagingEnabled={false}
          showsVerticalScrollIndicator={false}
          getItemLayout={getItemLayoutVertical}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig.current}
          onScrollToIndexFailed={(info) => {
            // Handle scroll to index failure
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            });
          }}
          onScroll={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            // Fix: Use Math.round instead of Math.floor to get correct page
            const pageIndex = Math.round(offsetY / screenHeight);
            const newPage = Math.max(1, Math.min(totalPages, pageIndex + 1));
            if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
              setCurrentPage(newPage);
              saveCurrentPage(newPage);
            }
          }}
          onScrollBeginDrag={() => {
            // Show controls when user starts scrolling
            setShowControls(true);
            startHideTimer();
          }}
          onTouchStart={toggleControls}
          inverted={false}
          directionalLockEnabled={true}
          scrollEnabled={true}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={21}
          initialNumToRender={10}
          updateCellsBatchingPeriod={50}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          nestedScrollEnabled={false}
        />
      </View>

      {/* Floating Back Button */}
      {/* {showControls && (
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
      )} */}

      {/* Floating Bookmark Button - Top Right Corner */}
      <TouchableOpacity 
        style={styles.floatingBookmarkButtonTopRight}
        onPress={toggleBookmark}
        activeOpacity={0.7}
      >
        <Image 
          source={isBookmarked 
            ? require('../assets/icons/ic_bookmark_already_done.png')
            : require('../assets/icons/ic_bookmark_quran_reading.png')
          }
          style={styles.bookmarkIconImageTopRight}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Floating Slider Button */}
      {/* {showControls && (
        <TouchableOpacity 
          style={styles.floatingSliderButton}
          onPress={toggleSlider}
          activeOpacity={0.7}
        >
          <Text style={styles.sliderButtonIcon}>📄</Text>
        </TouchableOpacity>
      )} */}




      {/* Page Info - Removed header as requested */}

      {/* Bookmark Input Dialog */}
      {showBookmarkDialog && (
        <View style={styles.bookmarkModal}>
          <View style={styles.bookmarkModalContent}>
            <View style={styles.bookmarkModalHeader}>
              <Text style={styles.bookmarkModalTitle}>Add Bookmark</Text>
              <TouchableOpacity onPress={closeBookmarkDialog}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.bookmarkModalSubtitle}>Page {currentPage}</Text>
            
            <TextInput
              style={styles.bookmarkInput}
              placeholder="Add a comment (optional)"
              value={bookmarkComment}
              onChangeText={setBookmarkComment}
              onFocus={() => StatusBar.setHidden(true, 'none')}
              onBlur={() => StatusBar.setHidden(true, 'none')}
              multiline
              maxLength={100}
              textAlign="left" // RTL text alignment
              
            />
            
            <View style={styles.bookmarkModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={closeBookmarkDialog}
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
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    direction: 'rtl',
  },
  pageContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    margin: 0,
    padding: 0,
    backgroundColor: '#000000',
    direction: 'rtl',
  },
  flatList: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000000',
  },
  flatListContent: {
    width: screenWidth,
  },
  pageItemContainer: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  quranImage: {
    width: screenWidth,
    height: screenHeight,
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  floatingBookmarkButtonTopRight: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? getSpacing(10) : getSpacing(10),
    right: 0,
    width: getSpacing(48),
    height: getSpacing(48),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingSliderButton: {
    position: 'absolute',
    bottom: getSpacing(80),
    right: getSpacing(15),
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
  sliderButtonIcon: {
    fontSize: getFontSize(18),
    color: '#FFFFFF',
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
  bookmarkIconImageTopRight: {
    width: getSpacing(40),
    height: getSpacing(40),
  },
  bookmarkedIcon: {
    tintColor: '#FFD700', // Gold color when bookmarked
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
    marginBottom: getSpacing(10),
    width: '100%',
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