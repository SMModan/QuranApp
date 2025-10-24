import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, Alert } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';
import { saveFavorite, isFavorite } from '../utils/FavoritesStorage';

const AllSurahsScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(new Set(['07'])); // Item 07 is favorited by default
  const starAnimations = useRef({});

  const surahsData = [
    { id: '01', arabic: 'الفاتحة', english: 'Al-Fatihah', pageNumber: 1, isFavorite: false },
    { id: '02', arabic: 'البقرة', english: 'Al-Baqarah', pageNumber: 2, isFavorite: false },
    { id: '03', arabic: 'آل عمران', english: 'Ali Imran', pageNumber: 13, isFavorite: false },
    { id: '04', arabic: 'النساء', english: 'An-Nisa', pageNumber: 19, isFavorite: false },
    { id: '05', arabic: 'المائدة', english: 'Al-Maidah', pageNumber: 24, isFavorite: false },
    { id: '06', arabic: 'الأنعام', english: 'Al-Anam', pageNumber: 29, isFavorite: false },
    { id: '07', arabic: 'الأعراف', english: 'Al-Araf', pageNumber: 33, isFavorite: true },
    { id: '08', arabic: 'الأنفال', english: 'Al-Anfal', pageNumber: 39, isFavorite: false },
    { id: '09', arabic: 'التوبة', english: 'At-Tawbah', pageNumber: 41, isFavorite: false },
    { id: '10', arabic: 'يونس', english: 'Yunus', pageNumber: 45, isFavorite: false },
    { id: '11', arabic: 'هود', english: 'Hud', pageNumber: 47, isFavorite: false },
    { id: '12', arabic: 'يوسف', english: 'Yusuf', pageNumber: 50, isFavorite: false },
    { id: '13', arabic: 'الرعد', english: 'Ar-Rad', pageNumber: 53, isFavorite: false },
    { id: '14', arabic: 'إبراهيم', english: 'Ibrahim', pageNumber: 54, isFavorite: false },
    { id: '15', arabic: 'الحجر', english: 'Al-Hijr', pageNumber: 55, isFavorite: false },
    { id: '16', arabic: 'النحل', english: 'An-Nahl', pageNumber: 57, isFavorite: false },
    { id: '17', arabic: 'الإسراء', english: 'Al-Isra', pageNumber: 60, isFavorite: false },
    { id: '18', arabic: 'الكهف', english: 'Al-Kahf', pageNumber: 62, isFavorite: false },
    { id: '19', arabic: 'مريم', english: 'Maryam', pageNumber: 64, isFavorite: false },
    { id: '20', arabic: 'طه', english: 'Taha', pageNumber: 66, isFavorite: false },
    { id: '21', arabic: 'الأنبياء', english: 'Al-Anbiya', pageNumber: 68, isFavorite: false },
    { id: '22', arabic: 'الحج', english: 'Al-Hajj', pageNumber: 70, isFavorite: false },
    { id: '23', arabic: 'المؤمنون', english: 'Al-Muminun', pageNumber: 72, isFavorite: false },
    { id: '24', arabic: 'النور', english: 'An-Nur', pageNumber: 73, isFavorite: false },
    { id: '25', arabic: 'الفرقان', english: 'Al-Furqan', pageNumber: 75, isFavorite: false },
    { id: '26', arabic: 'الشعراء', english: 'Ash-Shuara', pageNumber: 76, isFavorite: false },
    { id: '27', arabic: 'النمل', english: 'An-Naml', pageNumber: 78, isFavorite: false },
    { id: '28', arabic: 'القصص', english: 'Al-Qasas', pageNumber: 80, isFavorite: false },
    { id: '29', arabic: 'العنكبوت', english: 'Al-Ankabut', pageNumber: 82, isFavorite: false },
    { id: '30', arabic: 'الروم', english: 'Ar-Rum', pageNumber: 84, isFavorite: false },
    { id: '31', arabic: 'لقمان', english: 'Luqman', pageNumber: 85, isFavorite: false },
    { id: '32', arabic: 'السجدة', english: 'As-Sajdah', pageNumber: 86, isFavorite: false },
    { id: '33', arabic: 'الأحزاب', english: 'Al-Ahzab', pageNumber: 87, isFavorite: false },
    { id: '34', arabic: 'سبأ', english: 'Saba', pageNumber: 89, isFavorite: false },
    { id: '35', arabic: 'فاطر', english: 'Fatir', pageNumber: 90, isFavorite: false },
    { id: '36', arabic: 'يس', english: 'Ya-Sin', pageNumber: 91, isFavorite: false },
    { id: '37', arabic: 'الصافات', english: 'As-Saffat', pageNumber: 92, isFavorite: false },
    { id: '38', arabic: 'ص', english: 'Sad', pageNumber: 94, isFavorite: false },
    { id: '39', arabic: 'الزمر', english: 'Az-Zumar', pageNumber: 95, isFavorite: false },
    { id: '40', arabic: 'غافر', english: 'Ghafir', pageNumber: 97, isFavorite: false },
    { id: '41', arabic: 'فصلت', english: 'Fussilat', pageNumber: 98, isFavorite: false },
    { id: '42', arabic: 'الشورى', english: 'Ash-Shura', pageNumber: 100, isFavorite: false },
    { id: '43', arabic: 'الزخرف', english: 'Az-Zukhruf', pageNumber: 101, isFavorite: false },
    { id: '44', arabic: 'الدخان', english: 'Ad-Dukhan', pageNumber: 102, isFavorite: false },
    { id: '45', arabic: 'الجاثية', english: 'Al-Jathiyah', pageNumber: 103, isFavorite: false },
    { id: '46', arabic: 'الأحقاف', english: 'Al-Ahqaf', pageNumber: 104, isFavorite: false },
    { id: '47', arabic: 'محمد', english: 'Muhammad', pageNumber: 104, isFavorite: false },
    { id: '48', arabic: 'الفتح', english: 'Al-Fath', pageNumber: 105, isFavorite: false },
    { id: '49', arabic: 'الحجرات', english: 'Al-Hujurat', pageNumber: 106, isFavorite: false },
    { id: '50', arabic: 'ق', english: 'Qaf', pageNumber: 107, isFavorite: false },
    { id: '51', arabic: 'الذاريات', english: 'Adh-Dhariyat', pageNumber: 107, isFavorite: false },
    { id: '52', arabic: 'الطور', english: 'At-Tur', pageNumber: 108, isFavorite: false },
    { id: '53', arabic: 'النجم', english: 'An-Najm', pageNumber: 108, isFavorite: false },
    { id: '54', arabic: 'القمر', english: 'Al-Qamar', pageNumber: 109, isFavorite: false },
    { id: '55', arabic: 'الرحمن', english: 'Ar-Rahman', pageNumber: 109, isFavorite: false },
    { id: '56', arabic: 'الواقعة', english: 'Al-Waqiah', pageNumber: 110, isFavorite: false },
    { id: '57', arabic: 'الحديد', english: 'Al-Hadid', pageNumber: 111, isFavorite: false },
    { id: '58', arabic: 'المجادلة', english: 'Al-Mujadilah', pageNumber: 112, isFavorite: false },
    { id: '59', arabic: 'الحشر', english: 'Al-Hashr', pageNumber: 112, isFavorite: false },
    { id: '60', arabic: 'الممتحنة', english: 'Al-Mumtahanah', pageNumber: 113, isFavorite: false },
    { id: '61', arabic: 'الصف', english: 'As-Saff', pageNumber: 113, isFavorite: false },
    { id: '62', arabic: 'الجمعة', english: 'Al-Jumuah', pageNumber: 114, isFavorite: false },
    { id: '63', arabic: 'المنافقون', english: 'Al-Munafiqun', pageNumber: 114, isFavorite: false },
    { id: '64', arabic: 'التغابن', english: 'At-Taghabun', pageNumber: 114, isFavorite: false },
    { id: '65', arabic: 'الطلاق', english: 'At-Talaq', pageNumber: 115, isFavorite: false },
    { id: '66', arabic: 'التحريم', english: 'At-Tahrim', pageNumber: 115, isFavorite: false },
    { id: '67', arabic: 'الملك', english: 'Al-Mulk', pageNumber: 116, isFavorite: false },
    { id: '68', arabic: 'القلم', english: 'Al-Qalam', pageNumber: 116, isFavorite: false },
    { id: '69', arabic: 'الحاقة', english: 'Al-Haqqah', pageNumber: 116, isFavorite: false },
    { id: '70', arabic: 'المعارج', english: 'Al-Maarij', pageNumber: 117, isFavorite: false },
    { id: '71', arabic: 'نوح', english: 'Nuh', pageNumber: 117, isFavorite: false },
    { id: '72', arabic: 'الجن', english: 'Al-Jinn', pageNumber: 118, isFavorite: false },
    { id: '73', arabic: 'المزمل', english: 'Al-Muzzammil', pageNumber: 118, isFavorite: false },
    { id: '74', arabic: 'المدثر', english: 'Al-Muddaththir', pageNumber: 118, isFavorite: false },
    { id: '75', arabic: 'القيامة', english: 'Al-Qiyamah', pageNumber: 119, isFavorite: false },
    { id: '76', arabic: 'الإنسان', english: 'Al-Insan', pageNumber: 119, isFavorite: false },
    { id: '77', arabic: 'المرسلات', english: 'Al-Mursalat', pageNumber: 119, isFavorite: false },
    { id: '78', arabic: 'النبأ', english: 'An-Naba', pageNumber: 120, isFavorite: false },
    { id: '79', arabic: 'النازعات', english: 'An-Naziat', pageNumber: 120, isFavorite: false },
    { id: '80', arabic: 'عبس', english: 'Abasa', pageNumber: 120, isFavorite: false },
    { id: '81', arabic: 'التكوير', english: 'At-Takwir', pageNumber: 121, isFavorite: false },
    { id: '82', arabic: 'الانفطار', english: 'Al-Infitar', pageNumber: 121, isFavorite: false },
    { id: '83', arabic: 'المطففين', english: 'Al-Mutaffifin', pageNumber: 121, isFavorite: false },
    { id: '84', arabic: 'الانشقاق', english: 'Al-Inshiqaq', pageNumber: 121, isFavorite: false },
    { id: '85', arabic: 'البروج', english: 'Al-Buruj', pageNumber: 122, isFavorite: false },
    { id: '86', arabic: 'الطارق', english: 'At-Tariq', pageNumber: 122, isFavorite: false },
    { id: '87', arabic: 'الأعلى', english: 'Al-Ala', pageNumber: 122, isFavorite: false },
    { id: '88', arabic: 'الغاشية', english: 'Al-Ghashiyah', pageNumber: 122, isFavorite: false },
    { id: '89', arabic: 'الفجر', english: 'Al-Fajr', pageNumber: 122, isFavorite: false },
    { id: '90', arabic: 'البلد', english: 'Al-Balad', pageNumber: 123, isFavorite: false },
    { id: '91', arabic: 'الشمس', english: 'Ash-Shams', pageNumber: 123, isFavorite: false },
    { id: '92', arabic: 'الليل', english: 'Al-Layl', pageNumber: 123, isFavorite: false },
    { id: '93', arabic: 'الضحى', english: 'Ad-Duha', pageNumber: 123, isFavorite: false },
    { id: '94', arabic: 'الشرح', english: 'Ash-Sharh', pageNumber: 123, isFavorite: false },
    { id: '95', arabic: 'التين', english: 'At-Tin', pageNumber: 123, isFavorite: false },
    { id: '96', arabic: 'العلق', english: 'Al-Alaq', pageNumber: 123, isFavorite: false },
    { id: '97', arabic: 'القدر', english: 'Al-Qadr', pageNumber: 124, isFavorite: false },
    { id: '98', arabic: 'البينة', english: 'Al-Bayyinah', pageNumber: 124, isFavorite: false },
    { id: '99', arabic: 'الزلزلة', english: 'Az-Zalzalah', pageNumber: 124, isFavorite: false },
    { id: '100', arabic: 'العاديات', english: 'Al-Adiyat', pageNumber: 124, isFavorite: false },
    { id: '101', arabic: 'القارعة', english: 'Al-Qariah', pageNumber: 124, isFavorite: false },
    { id: '102', arabic: 'التكاثر', english: 'At-Takathur', pageNumber: 124, isFavorite: false },
    { id: '103', arabic: 'العصر', english: 'Al-Asr', pageNumber: 124, isFavorite: false },
    { id: '104', arabic: 'الهمزة', english: 'Al-Humazah', pageNumber: 125, isFavorite: false },
    { id: '105', arabic: 'الفيل', english: 'Al-Fil', pageNumber: 125, isFavorite: false },
    { id: '106', arabic: 'قريش', english: 'Quraysh', pageNumber: 125, isFavorite: false },
    { id: '107', arabic: 'الماعون', english: 'Al-Maun', pageNumber: 125, isFavorite: false },
    { id: '108', arabic: 'الكوثر', english: 'Al-Kawthar', pageNumber: 125, isFavorite: false },
    { id: '109', arabic: 'الكافرون', english: 'Al-Kafirun', pageNumber: 125, isFavorite: false },
    { id: '110', arabic: 'النصر', english: 'An-Nasr', pageNumber: 125, isFavorite: false },
    { id: '111', arabic: 'المسد', english: 'Al-Masad', pageNumber: 125, isFavorite: false },
    { id: '112', arabic: 'الإخلاص', english: 'Al-Ikhlas', pageNumber: 125, isFavorite: false },
    { id: '113', arabic: 'الفلق', english: 'Al-Falaq', pageNumber: 125, isFavorite: false },
    { id: '114', arabic: 'الناس', english: 'An-Nas', pageNumber: 125, isFavorite: false },
  ];

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleSurahPress = (surah) => {
    console.log('Sending page number:', surah.pageNumber);
    // Navigate to Quran reader with surah info
    if (navigation) {
      const navigationParams = {
        chapterName: surah.arabic,
        verseNumber: surah.id,
        pageNumber: surah.pageNumber,
        sectionNumber: '1',
        juzNumber: 'الجزء'
      };
      console.log('Navigation params:', navigationParams);
      navigation.navigate('quran-reader', navigationParams);
    }
  };

  const toggleFavorite = async (surah) => {
    try {
      // Create animation if it doesn't exist
      if (!starAnimations.current[surah.id]) {
        starAnimations.current[surah.id] = {
          scale: new Animated.Value(1),
          rotate: new Animated.Value(0),
        };
      }
      
      const anim = starAnimations.current[surah.id];
      
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

      const result = await saveFavorite({
        type: 'surah',
        id: surah.id,
        arabic: surah.arabic,
        english: surah.english,
        pageNumber: surah.pageNumber
      });

      if (result.success) {
        // Update local state
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.add(surah.id);
          return newFavorites;
        });
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Info', result.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to save favorite');
    }
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
            onPress={() => toggleFavorite(item)}
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
            <ResponsiveText 
              size="small" 
              color="#8B7355"
              style={styles.pageText}
            >
              Page {item.pageNumber}
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
        onBackPress={handleBackPress}
        showBackButton={true}
        showMenu={false}
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
    width: getSpacing(40),
    alignItems: 'center',
    marginLeft: getSpacing(10),
  },
  starIcon: {
    fontSize: getFontSize(32),
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
  pageText: {
    textAlign: 'right',
    marginTop: getSpacing(2),
    fontStyle: 'italic',
  },
});

export default AllSurahsScreen;
