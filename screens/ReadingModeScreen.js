import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';

const ReadingModeScreen = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState('normal');
  const cardAnimations = useRef({});

  const readingModes = [
    {
      id: 'normal',
      title: 'Normal Mode',
      description: 'Standard reading with default settings',
      icon: '📖',
    },
    {
      id: 'night',
      title: 'Night Mode',
      description: 'Dark theme for comfortable night reading',
      icon: '🌙',
    },
    {
      id: 'sepia',
      title: 'Sepia Mode',
      description: 'Warm sepia tones for reduced eye strain',
      icon: '📜',
    },
    {
      id: 'large_text',
      title: 'Large Text Mode',
      description: 'Increased font size for better readability',
      icon: '🔍',
    },
  ];

  const handleMenuPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleModeSelect = (modeId) => {
    // Create animation if it doesn't exist
    if (!cardAnimations.current[modeId]) {
      cardAnimations.current[modeId] = {
        scale: new Animated.Value(1),
        pulse: new Animated.Value(1),
      };
    }
    
    const anim = cardAnimations.current[modeId];
    
    // Animate selection
    Animated.sequence([
      Animated.timing(anim.scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim.scale, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim.scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setSelectedMode(modeId);
    console.log(`Reading mode changed to: ${modeId}`);
  };

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="Reading Mode"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showMenu={false}
      />
      
      <ScrollView style={styles.content}>
        <ResponsiveContainer style={styles.mainContent}>
          <ResponsiveText
            size="title"
            weight="bold"
            color="#1a237e"
            style={styles.title}
          >
            Choose Reading Mode
          </ResponsiveText>
          
          <ResponsiveText
            size="medium"
            color="#666666"
            style={styles.subtitle}
          >
            Select your preferred reading experience
          </ResponsiveText>

          <View style={styles.modesContainer}>
            {readingModes.map((mode) => (
              <Animated.View
                key={mode.id}
                style={[
                  styles.modeCard,
                  selectedMode === mode.id && styles.selectedCard,
                  {
                    transform: [{ scale: cardAnimations.current[mode.id]?.scale || 1 }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.modeTouchable}
                  onPress={() => handleModeSelect(mode.id)}
                  activeOpacity={0.7}
                >
                <View style={styles.modeContent}>
                  <View style={styles.modeIcon}>
                    <Text style={styles.iconText}>{mode.icon}</Text>
                  </View>
                  
                  <View style={styles.modeText}>
                    <ResponsiveText
                      size="large"
                      weight="600"
                      color={selectedMode === mode.id ? "#1a237e" : "#333333"}
                      style={styles.modeTitle}
                    >
                      {mode.title}
                    </ResponsiveText>
                    <ResponsiveText
                      size="small"
                      color="#666666"
                      style={styles.modeDescription}
                    >
                      {mode.description}
                    </ResponsiveText>
                  </View>

                  {selectedMode === mode.id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    paddingTop: getSpacing(20),
    paddingBottom: getSpacing(40),
  },
  title: {
    textAlign: 'center',
    marginBottom: getSpacing(10),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: getSpacing(30),
    fontStyle: 'italic',
  },
  modesContainer: {
    paddingHorizontal: getSpacing(10),
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getSpacing(12),
    marginBottom: getSpacing(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modeTouchable: {
    flex: 1,
  },
  selectedCard: {
    borderColor: '#1a237e',
    borderWidth: 2,
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(20),
  },
  modeIcon: {
    width: getSpacing(50),
    height: getSpacing(50),
    borderRadius: getSpacing(25),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getSpacing(15),
  },
  iconText: {
    fontSize: getFontSize(24),
  },
  modeText: {
    flex: 1,
  },
  modeTitle: {
    marginBottom: getSpacing(5),
  },
  modeDescription: {
    fontStyle: 'italic',
  },
  selectedIndicator: {
    width: getSpacing(30),
    height: getSpacing(30),
    borderRadius: getSpacing(15),
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: 'bold',
  },
});

export default ReadingModeScreen;
