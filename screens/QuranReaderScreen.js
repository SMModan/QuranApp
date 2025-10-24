import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';
import RNFS from 'react-native-blob-util';

// Utility function to get PDF source configuration
const getPdfSource = () => {
  // For React Native/Expo, use require() directly as it's the most reliable method
  // This avoids the trust manager issues completely
  return require('../assets/quran_sharif.pdf');
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuranReaderScreen = ({ navigation, route }) => {
  // Get initial page from route params, default to 1
  const initialPage = route?.params?.pageNumber || route?.params?.page || 1;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0); // Will be set when PDF loads
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [pdfKey, setPdfKey] = useState(0); // Force re-render key
  const pdfRef = useRef(null);

  // Update currentPage when route params change
  useEffect(() => {
    console.log('Route params:', route?.params);
    console.log('pageNumber from route:', route?.params?.pageNumber);
    console.log('page from route:', route?.params?.page);
    const newPage = route?.params?.pageNumber || route?.params?.page || 1;
    console.log('Received page number:', newPage);
    setCurrentPage(newPage);
    setPdfKey(prev => prev + 1); // Force PDF re-render
  }, [route?.params?.pageNumber, route?.params?.page]);

  // Navigate to specific page when currentPage changes and PDF is loaded
  useEffect(() => {
    if (pdfRef.current && !isLoading && !hasError && currentPage > 1) {
      navigateToPage(currentPage);
    }
  }, [currentPage, isLoading, hasError]);

  
  // Validate navigation object
  const safeNavigation = navigation || { goBack: () => console.log('Navigation not available') };

  useEffect(() => {
    // Initialize PDF source
    initializePdfSource();
    
    // Set a timeout to stop loading if PDF doesn't load within 10 seconds
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 10000);
    
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Debug totalPages changes
  useEffect(() => {
  }, [totalPages]);

  const initializePdfSource = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // Use require() directly - this is the most reliable method for local PDF files
      // and avoids the trust manager issues completely
      const sourceConfig = getPdfSource();
      setPdfSource(sourceConfig);
      
      // Add a fallback timeout in case handleLoadComplete never fires
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      setHasError(true);
      setIsLoading(false);
    }
  };


  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleError = (error) => {
    console.log('PDF Error occurred:', error);
    console.log('PDF Source at error:', pdfSource);
    console.log('Setting hasError to true and isLoading to false');
    setHasError(true);
    setIsLoading(false);
    Alert.alert('Error', 'Failed to load Quran PDF. Please check if the file exists.');
  };

  const navigateToPage = (pageNumber) => {
    console.log('Attempting to navigate to page:', pageNumber);
    
    if (pdfRef.current && pageNumber > 1) {
      try {
        pdfRef.current.setPage(pageNumber);
        
        // Try again after a short delay
        setTimeout(() => {
          pdfRef.current.setPage(pageNumber);
        }, 500);
        
        // Try one more time after longer delay
        setTimeout(() => {
          pdfRef.current.setPage(pageNumber);
        }, 1000);
      } catch (error) {
        // Silent error handling
      }
    }
  };

  const handleLoadComplete = (numberOfPages) => {
    setTotalPages(numberOfPages);
    setIsLoading(false);
    setHasError(false);
    
    // Navigate to the specific page after PDF loads
    if (currentPage > 1) {
      navigateToPage(currentPage);
    }
  };

  const handlePageChanged = (page, numberOfPages) => {
    setCurrentPage(page);
    // Always update totalPages if numberOfPages is provided and valid
    if (numberOfPages > 0) {
      setTotalPages(numberOfPages);
    }
  };


  return (
    <View style={styles.container}>
      

      {/* PDF Reader with Swipe Gestures */}
      <View style={styles.pdfContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading Quran...</Text>
            <TouchableOpacity 
              style={styles.forceLoadButton}
              onPress={() => {
                console.log('Force loading to false');
                setIsLoading(false);
              }}
            >
              <Text style={styles.forceLoadText}>Force Load</Text>
            </TouchableOpacity>
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
                initializePdfSource();
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!hasError && pdfSource && (
            <Pdf
              key={`pdf-${pdfKey}-${currentPage}`}
              ref={pdfRef}
              source={pdfSource}
              style={styles.pdf}
              page={currentPage}
              scale={1.0}
              minScale={1.0}
              maxScale={3.0}
              horizontal={false}
              spacing={0}
              password=""
              onLoadComplete={handleLoadComplete}
              onPageChanged={handlePageChanged}
              onError={handleError}
              onPress={() => toggleControls()}
              enablePaging={true}
              enableRTL={false}
              enableAntialiasing={true}
              enableAnnotationRendering={true}
              fitPolicy={0}
              singlePage={false}
              trustAllCerts={false}
              enableDebug={true}
              enableDoubleTapZoom={true}
              enableFling={true}
              activityIndicator={
                <View style={styles.loaderContainer}>
                  <Text style={styles.loadingText}>Loading Quran...</Text>
                </View>
              }
            />
        )}
      </View>


      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => safeNavigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeBorder: {
    height: 2,
    backgroundColor: '#A68B5B', // Light green/gold border
    marginHorizontal: getSpacing(10),
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pdf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
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
    marginBottom: getSpacing(10),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  forceLoadButton: {
    backgroundColor: '#8B7355',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(10),
    borderRadius: getSpacing(5),
  },
  forceLoadText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
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