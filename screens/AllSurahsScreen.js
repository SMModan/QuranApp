import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const AllSurahsScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(new Set(['07'])); // Item 07 is favorited by default
  const starAnimations = useRef({});

  const surahsData = [
    { id: '01', arabic: 'الم', english: 'Alif Lam Meem', isFavorite: false },
    { id: '02', arabic: 'سَيَقُولُ', english: 'Sayaqool', isFavorite: false },
    { id: '03', arabic: 'تِلْكَ الرُّسُلُ', english: 'Tilka ar-Rusul', isFavorite: false },
    { id: '04', arabic: 'لَنْ تَنَالُوا', english: 'Lantanalu', isFavorite: false },
    { id: '05', arabic: 'وَالْمُحْصَنَاتُ', english: 'Wal-Mohsanat', isFavorite: false },
    { id: '06', arabic: 'لَا يُحِبُّ اللَّهُ', english: 'La Yuhibbullah', isFavorite: false },
    { id: '07', arabic: 'وَإِذَا سَمِعُوا', english: 'Wa Iza Samiu', isFavorite: true },
    { id: '08', arabic: 'وَلَوْ أَنَّنَا', english: 'Wa Lau Annana', isFavorite: false },
    { id: '09', arabic: 'قَدْ أَفْلَحَ', english: 'Qad Aflaha', isFavorite: false },
    { id: '10', arabic: 'وَمَا أَدْرَاكَ', english: 'Wa Ma Adraka', isFavorite: false },
    { id: '11', arabic: 'يَعْتَذِرُونَ', english: 'Ya\'taridun', isFavorite: false },
    { id: '12', arabic: 'وَمَا مِنْ دَابَّةٍ', english: 'Wa Ma Min Dabbatin', isFavorite: false },
    { id: '13', arabic: 'وَمَا أُبَرِّئُ', english: 'Wa Ma Ubarri\'u', isFavorite: false },
    { id: '14', arabic: 'رُبَمَا', english: 'Rubama', isFavorite: false },
    { id: '15', arabic: 'سُبْحَانَ', english: 'Subhana', isFavorite: false },
    { id: '16', arabic: 'قَالَ', english: 'Qala', isFavorite: false },
    { id: '17', arabic: 'اقْتَرَبَ', english: 'Iqtaraba', isFavorite: false },
    { id: '18', arabic: 'قَدْ أَفْلَحَ', english: 'Qad Aflaha', isFavorite: false },
    { id: '19', arabic: 'وَقَالَ الَّذِينَ', english: 'Wa Qala Alladhina', isFavorite: false },
    { id: '20', arabic: 'أَمَّنْ خَلَقَ', english: 'Amman Khalaqa', isFavorite: false },
    { id: '21', arabic: 'أُتْلُو', english: 'Utlu', isFavorite: false },
    { id: '22', arabic: 'وَمَنْ يَقْنُتْ', english: 'Wa Man Yaqnut', isFavorite: false },
    { id: '23', arabic: 'وَمَا لِيَ', english: 'Wa Ma Liya', isFavorite: false },
    { id: '24', arabic: 'فَمَنْ أَظْلَمُ', english: 'Fa Man Azlam', isFavorite: false },
    { id: '25', arabic: 'إِلَيْهِ يُرَدُّ', english: 'Ilayhi Yuraddu', isFavorite: false },
    { id: '26', arabic: 'حَمْ', english: 'Ha Mim', isFavorite: false },
    { id: '27', arabic: 'قَالَ فَمَا خَطْبُكُمْ', english: 'Qala Fa Ma Khatbukum', isFavorite: false },
    { id: '28', arabic: 'قَدْ سَمِعَ', english: 'Qad Sami\'a', isFavorite: false },
    { id: '29', arabic: 'تَبَارَكَ', english: 'Tabaraka', isFavorite: false },
    { id: '30', arabic: 'عَمَّ', english: 'Amma', isFavorite: false },
  ];

  const handleMenuPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleSurahPress = (surah) => {
    console.log(`Surah ${surah.id} pressed: ${surah.arabic}`);
    // Navigate to Quran reader with surah info
    if (navigation) {
      navigation.navigate('quran-reader', {
        chapterName: surah.arabic,
        verseNumber: surah.id,
        pageNumber: surah.id,
        sectionNumber: '1',
        juzNumber: 'الجزء',
        manzilNumber: 'منزل ١'
      });
    }
  };

  const toggleFavorite = (surahId) => {
    // Create animation if it doesn't exist
    if (!starAnimations.current[surahId]) {
      starAnimations.current[surahId] = {
        scale: new Animated.Value(1),
        rotate: new Animated.Value(0),
      };
    }
    
    const anim = starAnimations.current[surahId];
    const isCurrentlyFavorite = favorites.has(surahId);
    
    // Animate star interaction
    Animated.sequence([
      Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(surahId)) {
        newFavorites.delete(surahId);
      } else {
        newFavorites.add(surahId);
      }
      return newFavorites;
    });
  };

  const renderSurahItem = ({ item }) => {
    const isFavorite = favorites.has(item.id);
    
    return (
      <TouchableOpacity
        style={styles.surahItem}
        onPress={() => handleSurahPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.surahContent}>
          <View style={styles.surahNumber}>
            <ResponsiveText size="large" weight="bold" color="#333333">
              {item.id}
            </ResponsiveText>
          </View>
          
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.7}
          >
            <Animated.Text 
              style={[
                styles.starIcon, 
                isFavorite && styles.starFilled,
                {
                  transform: [
                    { scale: starAnimations.current[item.id]?.scale || 1 },
                    { rotate: starAnimations.current[item.id]?.rotate?.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    }) || '0deg' }
                  ]
                }
              ]}
            >
              {isFavorite ? '⭐' : '☆'}
            </Animated.Text>
          </TouchableOpacity>
          
          <View style={styles.surahText}>
            <ResponsiveText 
              size="large" 
              weight="bold" 
              color="#333333"
              style={styles.arabicText}
            >
              {item.arabic}
            </ResponsiveText>
            <ResponsiveText 
              size="medium" 
              color="#666666"
              style={styles.englishText}
            >
              {item.english}
            </ResponsiveText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="All Surahs"
        onMenuPress={handleMenuPress}
        showMenu={true}
      />
      
      <View style={styles.content}>
        <FlatList
          data={surahsData}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: getSpacing(10),
  },
  surahItem: {
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  surahContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumber: {
    width: getSpacing(50),
    alignItems: 'center',
  },
  starButton: {
    width: getSpacing(30),
    alignItems: 'center',
    marginLeft: getSpacing(10),
  },
  starIcon: {
    fontSize: getFontSize(20),
    color: '#CCCCCC',
  },
  starFilled: {
    color: '#FFD700',
  },
  surahText: {
    flex: 1,
    marginLeft: getSpacing(15),
  },
  arabicText: {
    marginBottom: getSpacing(2),
    textAlign: 'right',
  },
  englishText: {
    textAlign: 'right',
  },
});

export default AllSurahsScreen;
