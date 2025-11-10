import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform, Image } from 'react-native';
import { getFontSize, getSpacing, getScreenData } from '../utils/ResponsiveDesign';
import useOrientation from '../hooks/useOrientation';

const CommonHeader = ({ 
  title = "القرآن الكريم", 
  onMenuPress, 
  showMenu = true,
  showBackButton = false,
  onBackPress,
  backgroundColor = '#1a237e',
  textColor = '#FFFFFF'
}) => {
  const orientation = useOrientation();
  const screenData = getScreenData();
  const isLandscape = orientation.isLandscape;
  const styles = createStyles(isLandscape, screenData);
  
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={backgroundColor}
        translucent={true}
        hidden={true}
      />
      
      <View style={styles.headerContent}>
        {/* Left side - Menu button or Back button */}
        {showMenu && !showBackButton && (
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <View style={styles.hamburgerIcon}>
              <View style={[styles.hamburgerLine, { backgroundColor: textColor }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: textColor }]} />
              <View style={[styles.hamburgerLine, styles.hamburgerLineShort, { backgroundColor: textColor }]} />
            </View>
          </TouchableOpacity>
        )}
        
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Image 
              source={require('../assets/icons/ic_back.png')} 
              style={[styles.backIcon, { tintColor: textColor }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        
        {/* Center - Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>
            {title}
          </Text>
        </View>
        
        {/* Right side - Placeholder for future actions */}
        <View style={styles.rightContainer}>
          {/* You can add search, settings, or other action buttons here */}
        </View>
      </View>
    </View>
  );
};

const createStyles = (isLandscape, screenData) => StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' 
      ? (isLandscape ? getSpacing(30) : getSpacing(50))
      : (isLandscape ? getSpacing(15) : getSpacing(20)),
    paddingBottom: isLandscape ? getSpacing(10) : getSpacing(15),
    paddingHorizontal: getSpacing(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: getSpacing(50),
  },
  menuButton: {
    padding: getSpacing(8),
    borderRadius: getSpacing(4),
  },
  hamburgerIcon: {
    width: getSpacing(24),
    height: getSpacing(18),
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    borderRadius: 1,
  },
  hamburgerLineShort: {
    width: '66%',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: getSpacing(10),
  },
  title: {
    fontFamily: 'Philosopher',
    fontSize: screenData?.isTablet ? 20 : 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  rightContainer: {
    width: getSpacing(40), // Same width as menu button for balance
    alignItems: 'flex-end',
  },
  backButton: {
    padding: getSpacing(8),
    borderRadius: getSpacing(4),
  },
  backIcon: {
    width: getSpacing(24),
    height: getSpacing(24),
  },
});

export default CommonHeader;

