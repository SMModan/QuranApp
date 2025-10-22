import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  Dimensions, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuranReaderWebView = ({ navigation, route }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [totalPages, setTotalPages] = useState(604); // Total pages in Quran
  const webViewRef = useRef(null);
  const panRef = useRef(null);

  // Get chapter and verse info from route params
  const chapterName = route?.params?.chapterName || 'البقرة';
  const verseNumber = route?.params?.verseNumber || '٢';
  const pageNumber = route?.params?.pageNumber || '6';
  const sectionNumber = route?.params?.sectionNumber || '1';
  const juzNumber = route?.params?.juzNumber || 'الجزء';
  const manzilNumber = route?.params?.manzilNumber || 'منزل ١';

  useEffect(() => {
    // Set status bar style for full screen
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#8B7355', true);
    }
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleError = (error) => {
    console.log('WebView Error:', error);
    Alert.alert('Error', 'Failed to load Quran PDF. Please check if the file exists.');
  };

  const handleLoadEnd = () => {
    console.log('PDF loaded successfully');
  };

  // Swipe gesture handlers
  const onSwipeGesture = (event) => {
    const { translationX, translationY, state } = event.nativeEvent;
    
    if (state === State.END) {
      const swipeThreshold = 50; // Minimum swipe distance
      const horizontalSwipe = Math.abs(translationX) > Math.abs(translationY);
      
      if (horizontalSwipe && Math.abs(translationX) > swipeThreshold) {
        if (translationX > 0) {
          // Swipe right - go to previous page
          goToPreviousPage();
        } else {
          // Swipe left - go to next page
          goToNextPage();
        }
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      console.log(`Navigating to page ${currentPage + 1}`);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      console.log(`Navigating to page ${currentPage - 1}`);
    }
  };

  // HTML content for PDF display
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #FFFFFF;
          font-family: 'Amiri', 'Times New Roman', serif;
          direction: rtl;
          text-align: right;
        }
        .quran-page {
          width: 100%;
          height: 100vh;
          background-color: #FFFFFF;
          border: 2px solid #A68B5B;
          box-sizing: border-box;
          padding: 20px;
          overflow: hidden;
        }
        .verse {
          margin-bottom: 15px;
          line-height: 2.5;
          font-size: 18px;
          color: #000000;
        }
        .verse-number {
          display: inline-block;
          width: 25px;
          height: 25px;
          background-color: #90EE90;
          border: 2px solid #228B22;
          border-radius: 50%;
          text-align: center;
          line-height: 21px;
          font-size: 12px;
          font-weight: bold;
          margin-left: 10px;
          color: #000000;
        }
        .arabic-text {
          font-size: 20px;
          line-height: 2.8;
          text-align: justify;
          color: #000000;
        }
        .decorative-border {
          position: absolute;
          left: 0;
          top: 0;
          width: 8px;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            #A68B5B 0px,
            #A68B5B 4px,
            #D4AF37 4px,
            #D4AF37 8px
          );
        }
        .decorative-border-right {
          position: absolute;
          right: 0;
          top: 0;
          width: 8px;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            #A68B5B 0px,
            #A68B5B 4px,
            #D4AF37 4px,
            #D4AF37 8px
          );
        }
      </style>
    </head>
    <body>
      <div class="quran-page">
        <div class="decorative-border"></div>
        <div class="decorative-border-right"></div>
        
        <div class="arabic-text">
          <div class="verse">
            <span class="verse-number">23</span>
            وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ يَا قَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِاتِّخَاذِكُمُ الْعِجْلَ فَتُوبُوا إِلَىٰ بَارِئِكُمْ فَاقْتُلُوا أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ
          </div>
          
          <div class="verse">
            <span class="verse-number">24</span>
            وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ يَا قَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِاتِّخَاذِكُمُ الْعِجْلَ فَتُوبُوا إِلَىٰ بَارِئِكُمْ فَاقْتُلُوا أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ
          </div>
          
          <div class="verse">
            <span class="verse-number">25</span>
            وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ يَا قَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِاتِّخَاذِكُمُ الْعِجْلَ فَتُوبُوا إِلَىٰ بَارِئِكُمْ فَاقْتُلُوا أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ
          </div>
          
          <div class="verse">
            <span class="verse-number">26</span>
            وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ يَا قَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِاتِّخَاذِكُمُ الْعِجْلَ فَتُوبُوا إِلَىٰ بَارِئِكُمْ فَاقْتُلُوا أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ
          </div>
          
          <div class="verse">
            <span class="verse-number">27</span>
            وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ يَا قَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِاتِّخَاذِكُمُ الْعِجْلَ فَتُوبُوا إِلَىٰ بَارِئِكُمْ فَاقْتُلُوا أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ
          </div>
          
          <div class="verse">
            <span class="verse-number">28</span>
            وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ يَا قَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِاتِّخَاذِكُمُ الْعِجْلَ فَتُوبُوا إِلَىٰ بَارِئِكُمْ فَاقْتُلُوا أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ
          </div>
          
          <div class="verse">
            <span class="verse-number">29</span>
            وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ يَا قَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِاتِّخَاذِكُمُ الْعِجْلَ فَتُوبُوا إِلَىٰ بَارِئِكُمْ فَاقْتُلُوا أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

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

      {/* WebView PDF Reader with Swipe Gestures */}
      <PanGestureHandler
        ref={panRef}
        onHandlerStateChange={onSwipeGesture}
        minDist={10}
        avgTouches={true}
      >
        <View style={styles.pdfContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={styles.webview}
            onError={handleError}
            onLoadEnd={handleLoadEnd}
            onPress={() => toggleControls()}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            bounces={false}
          />
        </View>
      </PanGestureHandler>

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

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
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
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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

export default QuranReaderWebView;
