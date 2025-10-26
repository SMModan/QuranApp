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

  const handleGoToPage = () => {
    const page = parseInt(pageNumber);
    
    if (!pageNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الصفحة');
      return;
    }
    
    if (isNaN(page) || page < 1 || page > 134) {
      Alert.alert('خطأ', 'رقم الصفحة يجب أن يكون بين 1 و 134');
      return;
    }
    
    // Navigate to QuranReaderScreen with the specified page
    navigation.navigate('quran-reader', { 
      pageNumber: page,
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
        onBackPress={handleBackPress}
        showBackButton={true}
        showMenu={false}
        backgroundColor="#083569"
      />
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Main Go To Page Component - Exact design match */}
        <View style={styles.goToPageCard}>
          {/* Left side - Document icon */}
          <Image
            source={require('../assets/icons/ic_home_go_to_page.png')}
            style={styles.documentIcon}
            resizeMode="contain"
          />
          
          {/* Center - Text labels */}
          <View style={styles.textSection}>
            <Text style={styles.arabicText}>انتقل إلى الصفحة</Text>
            <Text style={styles.englishText}>GO TO PAGE</Text>
          </View>
          
          {/* Right side - Input field with icon and arrow button */}
          <View style={styles.inputSection}>
            {/* Input field with icon and placeholder text */}
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/icons/ic_goto_page_input.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderArabic}>أدخل رقم الصفحة</Text>
                <Text style={styles.placeholderEnglish}>ENTER PAGE NUMBER</Text>
              </View>
              <TextInput
                style={styles.pageInput}
                value={pageNumber}
                onChangeText={setPageNumber}
                placeholder=""
                keyboardType="numeric"
                maxLength={3}
                autoFocus={true}
              />
            </View>
            
            {/* Arrow button */}
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={handleGoToPage}
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/icons/ic_home_goto_page_right_side_icon.png')}
                style={styles.arrowIcon}
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
      </KeyboardAvoidingView>
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
  // Main card container - matching the ornate design
  goToPageCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#083569',
    borderRadius: getSpacing(20),
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: getSpacing(400),
    marginBottom: getSpacing(40),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  documentIcon: {
    width: getSpacing(35),
    height: getSpacing(35),
    marginRight: getSpacing(15),
  },
  textSection: {
    flex: 1,
    marginRight: getSpacing(15),
  },
  arabicText: {
    fontSize: getFontSize(18),
    color: '#083569',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: getSpacing(2),
  },
  englishText: {
    fontSize: getFontSize(14),
    color: '#083569',
    fontWeight: '600',
    textAlign: 'right',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: getSpacing(25), // Pill-shaped border radius
    paddingHorizontal: getSpacing(15),
    paddingVertical: getSpacing(12),
    marginRight: getSpacing(10),
    minWidth: getSpacing(150),
    position: 'relative',
  },
  inputIcon: {
    width: getSpacing(24),
    height: getSpacing(24),
    marginRight: getSpacing(10),
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: getSpacing(10),
  },
  placeholderArabic: {
    fontSize: getFontSize(14),
    color: '#999999',
    textAlign: 'right',
    marginBottom: getSpacing(2),
  },
  placeholderEnglish: {
    fontSize: getFontSize(12),
    color: '#999999',
    textAlign: 'right',
  },
  pageInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: getFontSize(16),
    color: '#083569',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: getSpacing(15),
  },
  arrowButton: {
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
  arrowIcon: {
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