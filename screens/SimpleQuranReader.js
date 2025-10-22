import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SimpleQuranReader = ({ navigation, route }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Get chapter and verse info from route params
  const chapterName = route?.params?.chapterName || 'البقرة';
  const verseNumber = route?.params?.verseNumber || '٢';
  const pageNumber = route?.params?.pageNumber || '6';
  const sectionNumber = route?.params?.sectionNumber || '1';
  const juzNumber = route?.params?.juzNumber || 'الجزء';
  const manzilNumber = route?.params?.manzilNumber || 'منزل ١';
  
  // Sample Quran verses for display
  const sampleVerses = [
    {
      number: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    },
    {
      number: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "Praise be to Allah, Lord of the worlds."
    },
    {
      number: 3,
      arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "The Entirely Merciful, the Especially Merciful."
    },
    {
      number: 4,
      arabic: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Sovereign of the Day of Recompense."
    },
    {
      number: 5,
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation: "It is You we worship and You we ask for help."
    }
  ];

  useEffect(() => {
    // Set status bar style
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('#8B7355', true);
    } else {
      StatusBar.setBarStyle('light-content', true);
    }
    
    return () => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent', true);
      }
    };
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const goToNextPage = () => {
    if (currentPage < 10) { // Assuming 10 pages for demo
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const safeNavigation = navigation || { goBack: () => console.log('Navigation not available') };

  return (
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

      {/* Quran Content */}
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onPress={() => toggleControls()}
      >
        <View style={styles.quranPage}>
          <View style={styles.decorativeBorderLeft} />
          <View style={styles.decorativeBorderRight} />
          
          <View style={styles.versesContainer}>
            {sampleVerses.map((verse, index) => (
              <View key={index} style={styles.verseContainer}>
                <View style={styles.verseNumberContainer}>
                  <Text style={styles.verseNumber}>{verse.number}</Text>
                </View>
                <Text style={styles.arabicText}>{verse.arabic}</Text>
                <Text style={styles.translationText}>{verse.translation}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

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
            {currentPage} / 10
          </Text>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={goToNextPage}
            disabled={currentPage >= 10}
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
    backgroundColor: '#8B7355',
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
    backgroundColor: '#A68B5B',
    marginHorizontal: getSpacing(10),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  quranPage: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: getSpacing(10),
    borderWidth: 2,
    borderColor: '#A68B5B',
    position: 'relative',
    minHeight: screenHeight * 0.6,
  },
  decorativeBorderLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 8,
    height: '100%',
    backgroundColor: '#A68B5B',
  },
  decorativeBorderRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 8,
    height: '100%',
    backgroundColor: '#A68B5B',
  },
  versesContainer: {
    padding: getSpacing(20),
    paddingLeft: getSpacing(30),
    paddingRight: getSpacing(30),
  },
  verseContainer: {
    marginBottom: getSpacing(20),
  },
  verseNumberContainer: {
    alignSelf: 'flex-start',
    marginBottom: getSpacing(10),
  },
  verseNumber: {
    backgroundColor: '#90EE90',
    borderWidth: 2,
    borderColor: '#228B22',
    borderRadius: 15,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 26,
    fontSize: getFontSize(12),
    fontWeight: 'bold',
    color: '#000000',
  },
  arabicText: {
    fontSize: getFontSize(20),
    lineHeight: getFontSize(35),
    textAlign: 'right',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
    marginBottom: getSpacing(10),
  },
  translationText: {
    fontSize: getFontSize(14),
    lineHeight: getFontSize(20),
    textAlign: 'left',
    color: '#666666',
    fontStyle: 'italic',
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
    backgroundColor: '#D2B48C',
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

export default SimpleQuranReader;
