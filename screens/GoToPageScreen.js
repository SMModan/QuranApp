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
    
    if (isNaN(page) || page < 1 || page > 604) {
      Alert.alert('خطأ', 'رقم الصفحة يجب أن يكون بين 1 و 604');
      return;
    }
    
    // Navigate to QuranReaderScreen with the specified page
    navigation.navigate('QuranReader', { 
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
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/icons/ic_goto_page_input.png')}
            style={styles.inputIcon}
            resizeMode="contain"
          />
          
          <TextInput
            style={styles.textInput}
            value={pageNumber}
            onChangeText={setPageNumber}
            placeholder="أدخل رقم الصفحة (1-604)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={3}
            autoFocus={true}
          />
        </View>
        
        <TouchableOpacity
          style={styles.goButton}
          onPress={handleGoToPage}
          activeOpacity={0.8}
        >
          <Text style={styles.goButtonText}>انتقل</Text>
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            القرآن الكريم يحتوي على 604 صفحة
          </Text>
          <Text style={styles.infoSubtext}>
            أدخل رقم الصفحة التي تريد الانتقال إليها
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    paddingHorizontal: getSpacing(16),
    paddingVertical: getSpacing(12),
    marginBottom: getSpacing(30),
    width: '100%',
    maxWidth: getSpacing(300),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    width: getSpacing(24),
    height: getSpacing(24),
    marginRight: getSpacing(12),
  },
  textInput: {
    flex: 1,
    fontSize: getFontSize(18),
    color: '#083569',
    textAlign: 'right',
  },
  goButton: {
    backgroundColor: '#083569',
    paddingHorizontal: getSpacing(40),
    paddingVertical: getSpacing(15),
    borderRadius: getSpacing(25),
    marginBottom: getSpacing(40),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: getSpacing(20),
  },
  infoText: {
    fontSize: getFontSize(16),
    color: '#083569',
    textAlign: 'center',
    marginBottom: getSpacing(8),
    fontWeight: '600',
  },
  infoSubtext: {
    fontSize: getFontSize(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: getFontSize(20),
  },
});

export default GoToPageScreen;
