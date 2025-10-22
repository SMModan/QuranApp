import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ResponsiveText from './ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const BottomPlayerBar = ({ 
  currentPage = "Page 6, Para 1",
  onResume,
  onFavorite,
  onBookmark,
  isPlaying = false
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left side - Play button and resume info */}
        <View style={styles.leftSection}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={onResume}
            activeOpacity={0.7}
          >
            <View style={styles.playIcon}>
              <Text style={styles.playIconText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.resumeInfo}>
            <ResponsiveText 
              size="small" 
              weight="bold" 
              color="#333333"
              style={styles.resumeText}
            >
              RESUME
            </ResponsiveText>
            <ResponsiveText 
              size="small" 
              color="#666666"
              style={styles.pageText}
            >
              {currentPage}
            </ResponsiveText>
          </View>
        </View>

        {/* Right side - Action buttons */}
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onFavorite}
            activeOpacity={0.7}
          >
            <Text style={styles.starIcon}>⭐</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onBookmark}
            activeOpacity={0.7}
          >
            <Text style={styles.bookmarkIcon}>🔖</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a237e',
    paddingVertical: getSpacing(12),
    paddingHorizontal: getSpacing(20),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playButton: {
    marginRight: getSpacing(15),
  },
  playIcon: {
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  playIconText: {
    fontSize: getFontSize(16),
    marginLeft: 2, // Slight adjustment for play icon centering
  },
  resumeInfo: {
    flex: 1,
  },
  resumeText: {
    marginBottom: getSpacing(2),
  },
  pageText: {
    fontSize: getFontSize(12),
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: getSpacing(40),
    height: getSpacing(40),
    borderRadius: getSpacing(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: getSpacing(10),
  },
  starIcon: {
    fontSize: getFontSize(20),
  },
  bookmarkIcon: {
    fontSize: getFontSize(18),
  },
});

export default BottomPlayerBar;

