import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  Dimensions, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuranReaderScreen = ({ navigation, route }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(604); // Total pages in Quran
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const pdfRef = useRef(null);

  // Get chapter and verse info from route params with validation
  const chapterName = route?.params?.chapterName || 'البقرة';
  const verseNumber = route?.params?.verseNumber || '٢';
  const pageNumber = route?.params?.pageNumber || '6';
  const sectionNumber = route?.params?.sectionNumber || '1';
  const juzNumber = route?.params?.juzNumber || 'الجزء';
  const manzilNumber = route?.params?.manzilNumber || 'منزل ١';
  
  // Validate navigation object
  const safeNavigation = navigation || { goBack: () => console.log('Navigation not available') };

  useEffect(() => {
    // Set status bar style for full screen
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('#8B7355', true);
    } else {
      StatusBar.setBarStyle('light-content', true);
    }
    
    return () => {
      // Cleanup status bar on unmount
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent', true);
      }
    };
  }, []);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleError = (error) => {
    console.log('PDF Error:', error);
    setHasError(true);
    setIsLoading(false);
    Alert.alert('Error', 'Failed to load Quran PDF. Please check if the file exists.');
  };

  const handleLoadComplete = (numberOfPages) => {
    setTotalPages(numberOfPages);
    setIsLoading(false);
    setHasError(false);
  };

  const handlePageChanged = (page, numberOfPages) => {
    setCurrentPage(page);
    setTotalPages(numberOfPages);
  };

  // Swipe gesture handlers for PDF navigation
  const panGesture = Gesture.Pan()
    .minDistance(20)
    .onEnd((event) => {
      if (hasError || isLoading) return;
      
      const { translationX, translationY } = event;
      const swipeThreshold = 50;
      const horizontalSwipe = Math.abs(translationX) > Math.abs(translationY);
      
      if (horizontalSwipe && Math.abs(translationX) > swipeThreshold) {
        if (translationX > 0) {
          goToPreviousPage();
        } else {
          goToNextPage();
        }
      }
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="#8B7355" 
          translucent={false}
        />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.chapterText}>{chapterName} {verseNumber}</Text>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.pageText}>{pageNumber}/{sectionNumber}</Text>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.juzText}>{juzNumber}</Text>
        </View>
      </View>

      {/* Decorative Border */}
      <View style={styles.decorativeBorder} />

      {/* PDF Reader with Swipe Gestures */}
      <View style={styles.pdfContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Quran...</Text>
          </View>
        )}
        
        {hasError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load PDF</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setHasError(false);
                setIsLoading(true);
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!hasError && (
          <GestureDetector gesture={panGesture}>
            <Pdf
              ref={pdfRef}
              source={require('../assets/quran_sharif.pdf')}
              style={styles.pdf}
              page={currentPage}
              scale={1.0}
              minScale={0.5}
              maxScale={3.0}
              horizontal={false}
              spacing={0}
              password=""
              onLoadComplete={handleLoadComplete}
              onPageChanged={handlePageChanged}
              onError={handleError}
              onPress={() => toggleControls()}
              enablePaging={true}
              enableRTL={true}
              enableAntialiasing={true}
              enableAnnotationRendering={true}
              fitPolicy={0}
              singlePage={false}
            />
          </GestureDetector>
        )}
      </View>

      {/* Decorative Border */}
      <View style={styles.decorativeBorder} />

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.manzilText}>{manzilNumber}</Text>
        </View>
        
        <View style={styles.footerRight}>
          <TouchableOpacity 
            style={styles.bookIcon}
            onPress={toggleFullScreen}
            activeOpacity={0.7}
          >
            <Text style={styles.bookIconText}>📖</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Controls (when not full screen) */}
      {!isFullScreen && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={goToPreviousPage}
            disabled={currentPage <= 1}
          >
            <Text style={styles.controlText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.pageIndicator}>
            {currentPage} / {totalPages}
          </Text>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={goToNextPage}
            disabled={currentPage >= totalPages}
          >
            <Text style={styles.controlText}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => safeNavigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8B7355', // Olive green background
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(15),
    paddingTop: Platform.OS === 'ios' ? getSpacing(10) : getSpacing(15),
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  chapterText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  pageText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  juzText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
    textAlign: 'right',
  },
  decorativeBorder: {
    height: 2,
    backgroundColor: '#A68B5B', // Light green/gold border
    marginHorizontal: getSpacing(10),
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: getFontSize(16),
    color: '#8B7355',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: getSpacing(20),
  },
  errorText: {
    fontSize: getFontSize(16),
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: getSpacing(20),
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8B7355',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(10),
    borderRadius: getSpacing(5),
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(10),
    borderTopWidth: 1,
    borderTopColor: '#A68B5B',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  manzilText: {
    color: '#333333',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  bookIcon: {
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: '#D2B48C', // Light brown/beige
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bookIconText: {
    fontSize: getFontSize(20),
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8B7355',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(15),
  },
  controlButton: {
    width: getSpacing(50),
    height: getSpacing(50),
    borderRadius: getSpacing(25),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: getFontSize(20),
    fontWeight: 'bold',
  },
  pageIndicator: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? getSpacing(50) : getSpacing(30),
    left: getSpacing(20),
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: 'rgba(139, 115, 85, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
});

export default QuranReaderScreen;