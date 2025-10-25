import React from 'react';
import { View, Image, StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';
import { getImageDimensions, screenData, getSpacing } from '../utils/ResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1a237e"
        translucent={true}
        hidden={true}
      />
      <Image 
        source={require('../assets/splash-icon.png')} 
        style={styles.splashImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splashImage: {
    width: screenWidth,
    height: screenHeight,
  },
});

export default CustomSplashScreen;
