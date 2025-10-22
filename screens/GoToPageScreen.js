import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CommonHeader from '../components/CommonHeader';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const GoToPageScreen = ({ navigation }) => {
  const [pageNumber, setPageNumber] = useState('');
  
  console.log('GoToPageScreen rendered');

  const handleGoToPage = () => {
    const page = parseInt(pageNumber);
    
    if (!pageNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الصفحة');
      return;
    }
    
    if (isNaN(page) || page < 1 || page > 604) {
      Alert.alert('خطأ', 'رقم الصفحة يجب أن يكون بين 1 و 604');
      return;
    }
    
    // Navigate to QuranReaderScreen with the specified page
    navigation.navigate('quran-reader', { 
      page: page,
      title: `الصفحة ${page}`
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CommonHeader
        title="انتقل إلى الصفحة"
        onMenuPress={handleBackPress}
        showMenu={false}
        backgroundColor="#083569"
      />
      
      <View style={styles.content}>
        <Text style={{ fontSize: 24, color: '#083569', textAlign: 'center', marginTop: 50 }}>
          Go To Page Screen is Working!
        </Text>
        
        {/* Go To Page Component - Matching the design */}
        <View style={styles.goToPageContainer}>
          <View style={styles.goToPageInner}>
            {/* Left side - Document icon */}
            <Image
              source={require('../assets/icons/ic_home_go_to_page.png')}
              style={styles.documentIcon}
              resizeMode="contain"
            />
            
            {/* Center - Text labels */}
            <View style={styles.textLabelsContainer}>
              <Text style={styles.arabicLabel}>انتقل إلى الصفحة</Text>
              <Text style={styles.englishLabel}>GO TO PAGE</Text>
            </View>
            
            {/* Input field */}
            <TextInput
              style={styles.pageInput}
              value={pageNumber}
              onChangeText={setPageNumber}
              placeholder=""
              keyboardType="numeric"
              maxLength={3}
              autoFocus={true}
            />
            
            {/* Right side - Go button */}
            <TouchableOpacity
              style={styles.goButton}
              onPress={handleGoToPage}
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/icons/ic_home_goto_page_right_side_icon.png')}
                style={styles.goButtonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Disclaimer message */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Screen par maujood Qur'an ki aayaat ko baghair wuzu chhoona durust nahin hai.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBECFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: getSpacing(20),
    paddingTop: getSpacing(40),
    alignItems: 'center',
  },
  // Go To Page Container - Matching the ornate design
  goToPageContainer: {
    width: '100%',
    maxWidth: getSpacing(400),
    marginBottom: getSpacing(40),
  },
  goToPageInner: {
    backgroundColor: '#F0F8FF',
    borderWidth: 3,
    borderColor: '#083569',
    borderRadius: getSpacing(15),
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  documentIcon: {
    width: getSpacing(30),
    height: getSpacing(30),
    marginRight: getSpacing(15),
  },
  textLabelsContainer: {
    flex: 1,
    marginRight: getSpacing(15),
  },
  arabicLabel: {
    fontSize: getFontSize(16),
    color: '#083569',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: getSpacing(2),
  },
  englishLabel: {
    fontSize: getFontSize(12),
    color: '#083569',
    fontWeight: '600',
    textAlign: 'right',
  },
  pageInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: getSpacing(8),
    paddingHorizontal: getSpacing(12),
    paddingVertical: getSpacing(8),
    fontSize: getFontSize(16),
    color: '#083569',
    textAlign: 'center',
    width: getSpacing(80),
    marginRight: getSpacing(15),
  },
  goButton: {
    backgroundColor: '#083569',
    borderRadius: getSpacing(20),
    width: getSpacing(40),
    height: getSpacing(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goButtonIcon: {
    width: getSpacing(20),
    height: getSpacing(20),
  },
  disclaimerContainer: {
    alignItems: 'center',
    paddingHorizontal: getSpacing(20),
  },
  disclaimerText: {
    fontSize: getFontSize(14),
    color: '#083569',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: getFontSize(20),
  },
});

export default GoToPageScreen;
