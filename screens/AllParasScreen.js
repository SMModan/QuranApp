import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const AllParasScreen = ({ navigation }) => {
  const parasData = [
    { id: '01', arabic: 'الم', english: 'Alif Lam Meem' },
    { id: '02', arabic: 'سَيَقُولُ', english: 'Sayaqool' },
    { id: '03', arabic: 'تِلْكَ الرُّسُلُ', english: 'Tilka ar-Rusul' },
    { id: '04', arabic: 'لَنْ تَنَالُوا', english: 'Lantanalu' },
    { id: '05', arabic: 'وَالْمُحْصَنَاتُ', english: 'Wal-Mohsanat' },
    { id: '06', arabic: 'لَا يُحِبُّ اللَّهُ', english: 'La Yuhibbullah' },
    { id: '07', arabic: 'وَإِذَا سَمِعُوا', english: 'Wa Iza Samiu' },
    { id: '08', arabic: 'وَلَوْ أَنَّنَا', english: 'Wa Lau Annana' },
    { id: '09', arabic: 'قَدْ أَفْلَحَ', english: 'Qad Aflaha' },
    { id: '10', arabic: 'وَمَا أَدْرَاكَ', english: 'Wa Ma Adraka' },
    { id: '11', arabic: 'يَعْتَذِرُونَ', english: 'Ya\'taridun' },
    { id: '12', arabic: 'وَمَا مِنْ دَابَّةٍ', english: 'Wa Ma Min Dabbatin' },
    { id: '13', arabic: 'وَمَا أُبَرِّئُ', english: 'Wa Ma Ubarri\'u' },
    { id: '14', arabic: 'رُبَمَا', english: 'Rubama' },
    { id: '15', arabic: 'سُبْحَانَ', english: 'Subhana' },
    { id: '16', arabic: 'قَالَ', english: 'Qala' },
    { id: '17', arabic: 'اقْتَرَبَ', english: 'Iqtaraba' },
    { id: '18', arabic: 'قَدْ أَفْلَحَ', english: 'Qad Aflaha' },
    { id: '19', arabic: 'وَقَالَ الَّذِينَ', english: 'Wa Qala Alladhina' },
    { id: '20', arabic: 'أَمَّنْ خَلَقَ', english: 'Amman Khalaqa' },
    { id: '21', arabic: 'أُتْلُو', english: 'Utlu' },
    { id: '22', arabic: 'وَمَنْ يَقْنُتْ', english: 'Wa Man Yaqnut' },
    { id: '23', arabic: 'وَمَا لِيَ', english: 'Wa Ma Liya' },
    { id: '24', arabic: 'فَمَنْ أَظْلَمُ', english: 'Fa Man Azlam' },
    { id: '25', arabic: 'إِلَيْهِ يُرَدُّ', english: 'Ilayhi Yuraddu' },
    { id: '26', arabic: 'حَمْ', english: 'Ha Mim' },
    { id: '27', arabic: 'قَالَ فَمَا خَطْبُكُمْ', english: 'Qala Fa Ma Khatbukum' },
    { id: '28', arabic: 'قَدْ سَمِعَ', english: 'Qad Sami\'a' },
    { id: '29', arabic: 'تَبَارَكَ', english: 'Tabaraka' },
    { id: '30', arabic: 'عَمَّ', english: 'Amma' },
  ];

  const handleMenuPress = () => {
    // Handle menu press - could open side menu or go back
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleParaPress = (para) => {
    console.log(`Para ${para.id} pressed: ${para.arabic}`);
    // Navigate to Quran reader with para info
    if (navigation) {
      navigation.navigate('quran-reader', {
        chapterName: para.arabic,
        verseNumber: para.id,
        pageNumber: para.id,
        sectionNumber: '1',
        juzNumber: 'الجزء',
        manzilNumber: 'منزل ١'
      });
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
          <ResponsiveText 
            size="large" 
            weight="bold" 
            color="#333333"
            style={styles.paraNumberText}
          >
            {item.id}
          </ResponsiveText>
        </View>
        
        <View style={styles.paraText}>
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

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="All Para's"
        onMenuPress={handleMenuPress}
        showMenu={true}
      />
      
      <View style={styles.content}>
        <FlatList
          data={parasData}
          renderItem={renderParaItem}
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
  paraItem: {
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  paraContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paraNumber: {
    width: getSpacing(50),
    alignItems: 'center',
  },
  paraText: {
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
  paraNumberText: {
    fontFamily: 'Philosopher',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default AllParasScreen;
