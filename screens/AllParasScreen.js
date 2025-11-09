import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, BackHandler, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';
import { saveFavorite, isFavorite } from '../utils/FavoritesStorage';

const AllParasScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(new Set());
  const isMounted = useRef(true);
  const appState = useRef(AppState.currentState);
  
  const parasData = [
    { id: '01', arabic: 'الم', english: 'Alif Lam Meem', pageNumber: 2 },
    { id: '02', arabic: 'سَيَقُولُ', english: 'Sayaqool', pageNumber: 3 },
    { id: '03', arabic: 'تِلْكَ الرُّسُلُ', english: 'Tilka ar-Rusul', pageNumber: 12 },
    { id: '04', arabic: 'لَنْ تَنَالُوا', english: 'Lantanalu', pageNumber: 16 },
    { id: '05', arabic: 'وَالْمُحْصَنَاتُ', english: 'Wal-Mohsanat', pageNumber: 20 },
    { id: '06', arabic: 'لَا يُحِبُّ اللَّهُ', english: 'La Yuhibbullah', pageNumber: 24 },
    { id: '07', arabic: 'وَإِذَا سَمِعُوا', english: 'Wa Iza Samiu', pageNumber: 28 },
    { id: '08', arabic: 'وَلَوْ أَنَّنَا', english: 'Wa Lau Annana', pageNumber: 32 },
    { id: '09', arabic: 'قَدْ أَفْلَحَ', english: 'Qad Aflaha', pageNumber: 36 },
    { id: '10', arabic: 'وَمَا أَدْرَاكَ', english: 'Wa Ma Adraka', pageNumber: 40 },
    { id: '11', arabic: 'يَعْتَذِرُونَ', english: 'Ya\'taridun', pageNumber: 44 },
    { id: '12', arabic: 'وَمَا مِنْ دَابَّةٍ', english: 'Wa Ma Min Dabbatin', pageNumber: 48 },
    { id: '13', arabic: 'وَمَا أُبَرِّئُ', english: 'Wa Ma Ubarri\'u', pageNumber: 52 },
    { id: '14', arabic: 'رُبَمَا', english: 'Rubama', pageNumber: 56 },
    { id: '15', arabic: 'سُبْحَانَ', english: 'Subhana', pageNumber: 60 },
    { id: '16', arabic: 'قَالَ', english: 'Qala', pageNumber: 64 },
    { id: '17', arabic: 'اقْتَرَبَ', english: 'Iqtaraba', pageNumber: 68 },
    { id: '18', arabic: 'قَدْ أَفْلَحَ', english: 'Qad Aflaha', pageNumber: 72 },
    { id: '19', arabic: 'وَقَالَ الَّذِينَ', english: 'Wa Qala Alladhina', pageNumber: 76 },
    { id: '20', arabic: 'أَمَّنْ خَلَقَ', english: 'Amman Khalaqa', pageNumber: 80 },
    { id: '21', arabic: 'أُتْلُو', english: 'Utlu', pageNumber: 84 },
    { id: '22', arabic: 'وَمَنْ يَقْنُتْ', english: 'Wa Man Yaqnut', pageNumber: 88 },
    { id: '23', arabic: 'وَمَا لِيَ', english: 'Wa Ma Liya', pageNumber: 92 },
    { id: '24', arabic: 'فَمَنْ أَظْلَمُ', english: 'Fa Man Azlam', pageNumber: 96 },
    { id: '25', arabic: 'إِلَيْهِ يُرَدُّ', english: 'Ilayhi Yuraddu', pageNumber: 100 },
    { id: '26', arabic: 'حَمْ', english: 'Ha Mim', pageNumber: 104 },
    { id: '27', arabic: 'قَالَ فَمَا خَطْبُكُمْ', english: 'Qala Fa Ma Khatbukum', pageNumber: 108 },
    { id: '28', arabic: 'قَدْ سَمِعَ', english: 'Qad Sami\'a', pageNumber: 112 },
    { id: '29', arabic: 'تَبَارَكَ', english: 'Tabaraka', pageNumber: 116 },
    { id: '30', arabic: 'عَمَّ', english: 'Amma', pageNumber: 120 },
  ];

  const handleBackPress = () => {
    // Handle back press - go back to previous screen
    navigation.goBack();
    return true; // Prevent default behavior
  };

  useEffect(() => {
    // Add back button listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
    };
  }, []);

  // Load favorites from storage on component mount and when screen comes into focus
  useEffect(() => {
    loadFavorites();
    
    // Reload favorites when app comes to foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        loadFavorites();
      }
      appState.current = nextAppState;
    });
    
    // Reload favorites when navigation focus changes
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadFavorites();
    });
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      subscription?.remove();
      unsubscribe?.();
    };
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('quran_favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        const favoriteIds = parsedFavorites
          .filter(fav => fav.type === 'para')
          .map(fav => fav.id);
        setFavorites(new Set(favoriteIds));
      }
    } catch (error) {
      // Error loading para favorites
    }
  };

  const handleParaPress = useCallback((para) => {
    // Navigate to Quran reader with the specific para
    const navigationParams = { 
      pageNumber: para.pageNumber,
      paraId: para.id,
      paraName: para.arabic
    };
    navigation.navigate('quran-reader', navigationParams);
  }, [navigation]);

  const handleFavoritePress = async (para) => {
    try {
      const isCurrentlyFavorite = favorites.has(para.id);
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        try {
          const savedFavorites = await AsyncStorage.getItem('quran_favorites');
          if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            const updatedFavorites = parsedFavorites.filter(fav => !(fav.type === 'para' && fav.id === para.id));
            await AsyncStorage.setItem('quran_favorites', JSON.stringify(updatedFavorites));
            
            // Update local state
            setFavorites(prev => {
              const newFavorites = new Set(prev);
              newFavorites.delete(para.id);
              return newFavorites;
            });
            if (isMounted.current && navigation) {
              Alert.alert('Success', 'Removed from favorites');
            }
          }
        } catch (error) {
          if (isMounted.current && navigation) {
            Alert.alert('Error', 'Failed to remove favorite');
          }
        }
      } else {
        // Add to favorites
        const result = await saveFavorite({
          type: 'para',
          id: para.id,
          arabic: para.arabic,
          english: para.english,
          pageNumber: para.pageNumber
        });

        if (result.success) {
          setFavorites(prev => new Set([...prev, para.id]));
          if (isMounted.current && navigation) {
            Alert.alert('Success', result.message);
          }
        } else {
          if (isMounted.current && navigation) {
            Alert.alert('Info', result.message);
          }
        }
      }
    } catch (error) {
      if (isMounted.current && navigation) {
        Alert.alert('Error', 'Failed to toggle favorite');
      }
    }
  };

  const renderParaItem = useCallback(({ item }) => {
    const isFavorite = favorites.has(item.id);
    
    return (
      <TouchableOpacity
        style={styles.paraItem}
        onPress={() => handleParaPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.paraContent}>
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => handleFavoritePress(item)}
            activeOpacity={0.7}
          >
            <View style={{
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 24,
                lineHeight: 28,
                textAlign: 'center',
              }}>
                {isFavorite ? '⭐' : '☆'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.pageText}>Page {item.pageNumber}</Text>
          
          <View style={styles.paraText}>
            <Text style={styles.arabicText}>{item.arabic}</Text>
            <Text style={styles.englishText}>{item.english}</Text>
          </View>
          
          <View style={styles.paraNumber}>
            <Text style={styles.numberBadge}>{item.id}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [favorites, handleParaPress, handleFavoritePress]);

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="All Paras (Juz)"
        onBackPress={handleBackPress}
        showBackButton={true}
        showMenu={false}
      />
      
      <View style={styles.content}>
        <FlatList
          data={parasData}
          renderItem={renderParaItem}
          keyExtractor={(item, index) => `para-${item.id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          updateCellsBatchingPeriod={50}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: getSpacing(8),
  },
  paraItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: getSpacing(8),
    borderRadius: getSpacing(4),
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paraContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paraNumber: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadge: {
    backgroundColor: '#1976D2',
    borderRadius: getSpacing(20),
    width: getSpacing(40),
    height: getSpacing(40),
    textAlign: 'center',
    lineHeight: getSpacing(40),
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  starButton: {
    width: getSpacing(40),
    alignItems: 'center',
    marginLeft: getSpacing(10),
  },
  paraText: {
    flex: 1,
    marginLeft: getSpacing(12),
    marginRight: getSpacing(12),
  },
  paraId: {
    fontSize: getFontSize(16),
    fontWeight: '500',
    color: '#1976D2',
  },
  arabicText: {
    fontSize: getFontSize(18),
    fontWeight: '400',
    color: '#212121',
    marginBottom: getSpacing(4),
    textAlign: 'right',
    lineHeight: getFontSize(24),
  },
  englishText: {
    fontSize: getFontSize(14),
    color: '#757575',
    marginBottom: getSpacing(2),
    textAlign: 'right',
    fontWeight: '400',
  },
  pageText: {
    fontSize: getFontSize(12),
    color: '#1976D2',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: getSpacing(8),
    paddingVertical: getSpacing(4),
    borderRadius: getSpacing(16),
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: getSpacing(8),
    marginRight: getSpacing(12),
  },
});

export default AllParasScreen;