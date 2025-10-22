import React from 'react';
import { View, Image, StyleSheet, StatusBar, Platform } from 'react-native';
import { getImageDimensions, screenData, getSpacing } from '../utils/ResponsiveDesign';

const CustomSplashScreen = () => {
  // Get responsive image dimensions
  const imageDimensions = getImageDimensions(300, 400);
  
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1a237e"
        translucent={true}
        hidden={true}
      />
      <Image 
        source={require('../assets/splash.png')} 
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
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(40),
    paddingTop: Platform.OS === 'ios' ? getSpacing(60) : getSpacing(40),
  },
  splashImage: {
    // Dimensions will be set dynamically based on screen size
  },
});

export default CustomSplashScreen;
