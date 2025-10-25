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
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';
import RNFS from 'react-native-blob-util';
import CommonHeader from '../components/CommonHeader';

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
  const [totalPages, setTotalPages] = useState(134); // Default Quran pages, will be updated when PDF loads
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [pdfKey, setPdfKey] = useState(0); // Force re-render key
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [headerTimeout, setHeaderTimeout] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [bookmarkComment, setBookmarkComment] = useState('');
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

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem('quran_bookmarks');
      if (savedBookmarks) {
        const bookmarksList = JSON.parse(savedBookmarks);
        setBookmarks(bookmarksList);
        
        // Check if current page is bookmarked
        const isCurrentPageBookmarked = bookmarksList.some(bookmark => bookmark.page === currentPage);
        setIsBookmarked(isCurrentPageBookmarked);
      }
    } catch (error) {
      console.log('Error loading bookmarks:', error);
    }
  };

  useEffect(() => {
    // Initialize PDF source
    initializePdfSource();
    
    // Load bookmarks
    loadBookmarks();
    
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
    console.log('totalPages updated to:', totalPages);
  }, [totalPages]);

  // Monitor PDF source changes
  useEffect(() => {
    if (pdfSource) {
      console.log('PDF source set:', pdfSource);
      // Reset total pages when source changes
      setTotalPages(134); // Reset to default
    }
  }, [pdfSource]);


  // Cleanup effect to prevent memory leaks and null reference issues
  useEffect(() => {
    return () => {
      // Save current page when component unmounts
      if (currentPage > 1) {
        saveCurrentPage(currentPage);
      }
      
      // Cleanup when component unmounts
      if (pdfRef.current) {
        pdfRef.current = null;
      }
      if (headerTimeout) {
        clearTimeout(headerTimeout);
      }
    };
  }, [currentPage]);

  const initializePdfSource = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // Try different approaches for local PDF loading
      let sourceConfig;
      
      try {
        // Method 1: Direct require
        sourceConfig = require('../assets/quran_sharif.pdf');
        console.log('PDF source loaded via require:', sourceConfig);
      } catch (requireError) {
        console.log('Require failed, trying alternative method:', requireError);
        
        // Method 2: Using file system path
        sourceConfig = {
          uri: 'file:///android_asset/quran_sharif.pdf',
          cache: true,
        };
        console.log('PDF source loaded via file path:', sourceConfig);
      }
      
      setPdfSource(sourceConfig);
      
      // Reduce timeout since we're loading from assets
      setTimeout(() => {
        if (isLoading) {
          console.log('PDF loading timeout, forcing completion');
        setIsLoading(false);
        }
      }, 5000);
    } catch (error) {
      console.log('Error initializing PDF source:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };


  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    // Toggle header visibility
    setShowHeader(!showHeader);
    
    // Clear any existing timeout since we're not auto-hiding
    if (headerTimeout) {
      clearTimeout(headerTimeout);
      setHeaderTimeout(null);
    }
  };

  // Handle tap events - toggle header visibility
  const handleTap = () => {
    console.log('Screen tapped, toggling header');
    setShowHeader(!showHeader);
    
    // Clear any existing timeout since we're not auto-hiding
    if (headerTimeout) {
      clearTimeout(headerTimeout);
      setHeaderTimeout(null);
    }
  };

  // Toggle header visibility
  const toggleHeader = () => {
    console.log('Toggling header visibility:', !showHeader);
    setShowHeader(!showHeader);
  };




  // Save bookmarks to AsyncStorage
  const saveBookmarks = async (bookmarksList) => {
    try {
      await AsyncStorage.setItem('quran_bookmarks', JSON.stringify(bookmarksList));
      setBookmarks(bookmarksList);
    } catch (error) {
      console.log('Error saving bookmarks:', error);
    }
  };

  // Save current page to local storage for resume functionality
  const saveCurrentPage = async (page) => {
    try {
      const resumeData = {
        page: page,
        timestamp: new Date().toISOString(),
        totalPages: totalPages
      };
      await AsyncStorage.setItem('quran_resume_page', JSON.stringify(resumeData));
      console.log('Saved resume page:', page);
    } catch (error) {
      console.log('Error saving current page:', error);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarked) {
      // Remove bookmark
      try {
        const updatedBookmarks = bookmarks.filter(bookmark => bookmark.page !== currentPage);
        await saveBookmarks(updatedBookmarks);
        setIsBookmarked(false);
        Alert.alert('Bookmark Removed', `Page ${currentPage} removed from bookmarks`);
      } catch (error) {
        console.log('Error removing bookmark:', error);
        Alert.alert('Error', 'Failed to remove bookmark');
      }
    } else {
      // Show input dialog for bookmark comment
      setShowBookmarkDialog(true);
    }
  };

  const saveBookmarkWithComment = async () => {
    try {
      const newBookmark = {
        id: Date.now(),
        page: currentPage,
        timestamp: new Date().toISOString(),
        title: `Page ${currentPage}`,
        comment: bookmarkComment.trim() || `Bookmark for Page ${currentPage}`,
        totalPages: totalPages
      };
      
      const updatedBookmarks = [...bookmarks, newBookmark];
      await saveBookmarks(updatedBookmarks);
      setIsBookmarked(true);
      setShowBookmarkDialog(false);
      setBookmarkComment('');
      Alert.alert('Bookmark Added', `Page ${currentPage} added to bookmarks`);
    } catch (error) {
      console.log('Error saving bookmark:', error);
      Alert.alert('Error', 'Failed to save bookmark');
    }
  };



  const handleError = (error) => {
    console.log('PDF Error occurred:', error);
    console.log('PDF Source at error:', pdfSource);
    
    // Handle specific error types
    if (error && error.message) {
      if (error.message.includes('setPage') || error.message.includes('null')) {
        console.log('PDF ref error, not showing alert');
        return;
      }
      if (error.message.includes('scroll') || error.message.includes('fling')) {
        console.log('Scroll/gesture error, not showing alert');
        return;
      }
      if (error.message.includes('DownloadFailed') || error.message.includes('localhost')) {
        console.log('PDF download error, trying alternative loading method');
        // Try alternative loading method
        setPdfSource({
          uri: 'file:///android_asset/quran_sharif.pdf',
          cache: true,
        });
        return;
      }
    }
    
    console.log('Setting hasError to true and isLoading to false');
    setHasError(true);
    setIsLoading(false);
    Alert.alert('Error', 'Failed to load Quran PDF. Please check if the file exists.');
  };

  const navigateToPage = (pageNumber) => {
    console.log('Attempting to navigate to page:', pageNumber);
    
    if (pageNumber > 1) {
      const attemptNavigation = () => {
        if (pdfRef.current && pdfRef.current.setPage) {
      try {
        pdfRef.current.setPage(pageNumber);
            console.log('Successfully navigated to page:', pageNumber);
          } catch (error) {
            console.log('Error calling setPage:', error);
          }
        } else {
          console.log('PDF ref not ready, retrying...');
        }
      };

      // Try immediately
      attemptNavigation();
        
        // Try again after a short delay
        setTimeout(() => {
        attemptNavigation();
        }, 500);
        
        // Try one more time after longer delay
        setTimeout(() => {
        attemptNavigation();
        }, 1000);
    }
  };

  const handleLoadComplete = (numberOfPages) => {
    console.log('PDF loaded completely with', numberOfPages, 'pages');
    console.log('Setting totalPages to:', numberOfPages);
    
    // Ensure we have a valid page count
    if (numberOfPages && numberOfPages > 0) {
    setTotalPages(numberOfPages);
      console.log('Total pages set successfully:', numberOfPages);
    } else {
      console.log('Invalid page count received:', numberOfPages);
      // Set a default value for Quran (typically 604 pages)
      setTotalPages(134);
    }
    
    setIsLoading(false);
    setHasError(false);
    
    // PDF is now fully loaded, navigate to the specific page if needed
    if (currentPage > 1 && pdfRef.current) {
      // Use a small delay to ensure PDF is fully rendered
      setTimeout(() => {
      navigateToPage(currentPage);
      }, 100);
    }
  };

  const handlePageChanged = (page, numberOfPages) => {
    console.log('Page changed to:', page, 'Total pages:', numberOfPages);
    setCurrentPage(page);
    
    // Save current page to local storage for resume functionality
    saveCurrentPage(page);
    
    // Always update totalPages if numberOfPages is provided and valid
    if (numberOfPages && numberOfPages > 0) {
      console.log('Updating totalPages from page change:', numberOfPages);
      setTotalPages(numberOfPages);
    } else if (totalPages === 0) {
      // If we don't have total pages yet, set a default for Quran
      console.log('Setting default totalPages to 134');
      setTotalPages(134);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar 
        hidden={true}
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Header with Auto-Hide */}
      {showHeader && (
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButtonHeader}
            onPress={() => safeNavigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>القرآن الكريم</Text>
            <Text style={styles.headerSubtitle}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={handleBookmark}
              activeOpacity={0.7}
            >
              <Text style={styles.bookmarkIcon}>
                {isBookmarked ? '🔖' : '📖'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PDF Reader with Swipe Gestures */}
      <TouchableOpacity 
        style={styles.pdfContainer}
        onPress={toggleHeader}
        activeOpacity={1}
      >
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
                initializePdfSource();
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!hasError && pdfSource && (
            <Pdf
            key={`pdf-${pdfKey}`}
              ref={pdfRef}
              source={pdfSource}
              style={styles.pdf}
              page={currentPage}
              scale={1.0}
              minScale={1.0}
            maxScale={2.5}
              horizontal={false}
              spacing={0}
              password=""
              onLoadComplete={handleLoadComplete}
              onPageChanged={handlePageChanged}
              onError={handleError}
            onPress={toggleHeader}
              enablePaging={true}
              enableRTL={false}
            enableAntialiasing={false}
            enableAnnotationRendering={false}
              fitPolicy={0}
              singlePage={false}
              trustAllCerts={false}
            enableDebug={false}
              enableDoubleTapZoom={true}
              enableFling={true}
              activityIndicator={
                <View style={styles.loaderContainer}>
                  <Text style={styles.loadingText}>Loading Quran...</Text>
                </View>
              }
            />
        )}
      </TouchableOpacity>

       {/* Bookmark Input Dialog */}
       {showBookmarkDialog && (
         <View style={styles.bookmarkModal}>
           <View style={styles.bookmarkModalContent}>
             <View style={styles.bookmarkModalHeader}>
               <Text style={styles.bookmarkModalTitle}>Add Bookmark</Text>
               <TouchableOpacity 
                 style={styles.closeButton}
                 onPress={() => {
                   setShowBookmarkDialog(false);
                   setBookmarkComment('');
                 }}
               >
                 <Text style={styles.closeButtonText}>✕</Text>
               </TouchableOpacity>
      </View>

             <View style={styles.bookmarkInputContainer}>
               <Text style={styles.bookmarkInputLabel}>Page {currentPage}</Text>
               <TextInput
                 style={styles.bookmarkInput}
                 placeholder="Add a comment for this bookmark..."
                 value={bookmarkComment}
                 onChangeText={setBookmarkComment}
                 multiline={true}
                 numberOfLines={3}
                 textAlignVertical="top"
               />
               
               <View style={styles.bookmarkButtonContainer}>
                 <TouchableOpacity 
                   style={styles.cancelButton}
                   onPress={() => {
                     setShowBookmarkDialog(false);
                     setBookmarkComment('');
                   }}
                 >
                   <Text style={styles.cancelButtonText}>Cancel</Text>
                 </TouchableOpacity>
                 
      <TouchableOpacity 
                   style={styles.saveButton}
                   onPress={saveBookmarkWithComment}
      >
                   <Text style={styles.saveButtonText}>Save Bookmark</Text>
      </TouchableOpacity>
               </View>
             </View>
           </View>
         </View>
       )}


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
    width: screenWidth,
    height: screenHeight,
    zIndex: 1000,
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
    width: screenWidth,
    height: screenHeight,
  },
  pdf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: screenWidth,
    height: screenHeight,
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? getSpacing(100) : getSpacing(80),
    backgroundColor: 'rgba(26, 35, 126, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getSpacing(20),
    paddingTop: Platform.OS === 'ios' ? getSpacing(40) : getSpacing(20),
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonHeader: {
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: getSpacing(20),
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: getFontSize(14),
    textAlign: 'center',
    marginTop: getSpacing(2),
  },
  bookmarkButton: {
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    fontSize: getFontSize(20),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    paddingHorizontal: getSpacing(20),
  },
  bookmarkModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(15),
    width: '100%',
    maxWidth: screenWidth * 0.85,
    maxHeight: screenHeight * 0.6,
    padding: getSpacing(25),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bookmarkModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing(20),
    paddingBottom: getSpacing(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bookmarkModalTitle: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    color: '#1a237e',
  },
  closeButton: {
    width: getSpacing(35),
    height: getSpacing(35),
    borderRadius: getSpacing(17.5),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: getFontSize(18),
    color: '#666666',
    fontWeight: 'bold',
  },
  bookmarkInputContainer: {
    paddingVertical: getSpacing(10),
  },
  bookmarkInputLabel: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: getSpacing(10),
  },
  bookmarkInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: getSpacing(12),
    padding: getSpacing(15),
    fontSize: getFontSize(16),
    backgroundColor: '#FAFAFA',
    minHeight: getSpacing(100),
    textAlignVertical: 'top',
    color: '#333333',
    lineHeight: getFontSize(22),
  },
  bookmarkButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getSpacing(20),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: getSpacing(15),
    paddingHorizontal: getSpacing(25),
    borderRadius: getSpacing(12),
    marginRight: getSpacing(15),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1a237e',
    paddingVertical: getSpacing(15),
    paddingHorizontal: getSpacing(25),
    borderRadius: getSpacing(12),
    marginLeft: getSpacing(15),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1a237e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  bookmarkItemContent: {
    flex: 1,
  },
  bookmarkItemComment: {
    fontSize: getFontSize(14),
    color: '#666666',
    marginTop: getSpacing(5),
    marginBottom: getSpacing(5),
  },
});

export default QuranReaderScreen;