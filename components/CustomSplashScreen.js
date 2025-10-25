import React from 'react';
import { View, Image, StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';
import { getImageDimensions, screenData, getSpacing } from '../utils/ResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomSplashScreen = () => {
  // Get responsive image dimensions - make it larger for better visibility
  const imageDimensions = getImageDimensions(200, 200);
  
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
        style={[
          styles.splashImage,
          {
            width: imageDimensions.width,
            height: imageDimensions.height,
          }
        ]}
        resizeMode="contain"
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
    // Dimensions will be set dynamically based on screen size
    maxWidth: screenWidth * 0.6,
    maxHeight: screenHeight * 0.4,
  },
});

export default CustomSplashScreen;
