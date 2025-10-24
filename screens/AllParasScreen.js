import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, BackHandler, StatusBar, Alert } from 'react-native';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';
import { saveFavorite } from '../utils/FavoritesStorage';

const AllParasScreen = ({ navigation }) => {
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

  const handleParaPress = (para) => {
    // Navigate to Quran reader with the specific para
    const navigationParams = { 
      pageNumber: para.pageNumber,
      paraId: para.id,
      paraName: para.arabic
    };
    navigation.navigate('quran-reader', navigationParams);
  };

  const handleFavoritePress = async (para) => {
    try {
      const result = await saveFavorite({
        type: 'para',
        id: para.id,
        arabic: para.arabic,
        english: para.english,
        pageNumber: para.pageNumber
      });

      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Info', result.message);
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
      Alert.alert('Error', 'Failed to save favorite');
    }
  };

  const renderParaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.paraItem}
      onPress={() => handleParaPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.paraContent}>
        <View style={styles.paraNumber}>
          <Text style={styles.paraId}>{item.id}</Text>
        </View>
        
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
              ⭐
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.paraText}>
          <Text style={styles.arabicText}>{item.arabic}</Text>
          <Text style={styles.englishText}>{item.english}</Text>
          <Text style={styles.pageText}>Page {item.pageNumber}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Paras (Juz)</Text>
      </View>

      {/* Paras List */}
      <FlatList
        data={parasData}
        renderItem={renderParaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: StatusBar.currentHeight || 0,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  listContainer: {
    padding: 15,
  },
  paraItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  paraContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  paraNumber: {
    width: 50,
    alignItems: 'center',
  },
  starButton: {
    width: 40,
    alignItems: 'center',
    marginLeft: 10,
  },
  paraText: {
    flex: 1,
    marginLeft: 15,
  },
  paraId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  arabicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
    textAlign: 'right',
  },
  englishText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'right',
  },
  pageText: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'right',
    fontStyle: 'italic',
  },
});

export default AllParasScreen;