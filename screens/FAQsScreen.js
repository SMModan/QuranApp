import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Linking, Alert } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import SideMenu from '../components/SideMenu';
import ResponsiveText from '../components/ResponsiveText';
import BottomPlayerBar from '../components/BottomPlayerBar';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const FAQsScreen = ({ navigation }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const animations = React.useRef({});
  
  // Create animated values for each FAQ item
  const getAnimation = (id) => {
    if (!animations.current[id]) {
      animations.current[id] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
        rotate: new Animated.Value(0),
      };
    }
    return animations.current[id];
  };

  const faqData = [
    {
      id: 1,
      question: "How to resume to the last opened page?",
      answer: "To resume to your last opened page, simply tap the 'RESUME' button in the bottom player bar. This will take you directly to the page where you left off reading."
    },
    {
      id: 2,
      question: "How to directly go to a specific page?",
      answer: "You can navigate to a specific page by using the 'Go to Page' option from the main menu. Enter the page number you want to visit and tap 'Go'."
    },
    {
      id: 3,
      question: "How can i save a bookmark?",
      answer: "To save a bookmark, tap the bookmark icon (📖) while reading any page. The page will be automatically saved to your bookmarks list."
    },
    {
      id: 4,
      question: "How do i delete a bookmark?",
      answer: "To delete a bookmark, go to the 'Bookmarks' section from the main menu, find the bookmark you want to remove, and tap the delete icon next to it."
    },
    {
      id: 5,
      question: "How do i zoom in/zoom out?",
      answer: "You can zoom in and out by using pinch gestures on the screen. Pinch outward to zoom in and pinch inward to zoom out for better readability."
    },
    {
      id: 6,
      question: "How do i go to a specific para?",
      answer: "To go to a specific para, select 'Juz/Para Index' from the main menu, then choose the para you want to read from the list."
    },
    {
      id: 7,
      question: "How do i go to a specific surah?",
      answer: "To navigate to a specific surah, select 'Surah Index' from the main menu, then choose the surah you want to read from the alphabetical list."
    }
  ];

  const handleMenuPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const toggleExpanded = (id) => {
    const isExpanded = expandedItems[id];
    const anim = getAnimation(id);
    
    if (isExpanded) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(anim.height, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Expand animation
      Animated.parallel([
        Animated.timing(anim.height, {
          toValue: 100, // Approximate height for content
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderFAQItem = (item) => {
    const isExpanded = expandedItems[item.id];
    const anim = getAnimation(item.id);
    
    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => toggleExpanded(item.id)}
          activeOpacity={0.7}
        >
          <ResponsiveText 
            size="medium" 
            color="#333333"
            style={styles.questionText}
          >
            {item.question}
          </ResponsiveText>
          <View style={styles.arrowContainer}>
            <Animated.Text 
              style={[
                styles.arrow, 
                {
                  transform: [{
                    rotate: anim.rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg']
                    })
                  }]
                }
              ]}
            >
              ▼
            </Animated.Text>
          </View>
        </TouchableOpacity>
        
        <Animated.View 
          style={[
            styles.answerContainer,
            {
              height: anim.height,
              opacity: anim.opacity,
            }
          ]}
        >
          <ResponsiveText 
            size="small" 
            color="#666666"
            style={styles.answerText}
          >
            {item.answer}
          </ResponsiveText>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="FAQ's"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showMenu={false}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.faqList}>
          {faqData.map(renderFAQItem)}
        </View>
      </ScrollView>

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
  faqList: {
    paddingVertical: getSpacing(10),
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(15),
    justifyContent: 'space-between',
  },
  questionText: {
    flex: 1,
    marginRight: getSpacing(10),
  },
  arrowContainer: {
    width: getSpacing(20),
    alignItems: 'center',
  },
  arrow: {
    fontSize: getFontSize(12),
    color: '#666666',
    transform: [{ rotate: '0deg' }],
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  answerContainer: {
    paddingHorizontal: getSpacing(20),
    paddingBottom: getSpacing(15),
    backgroundColor: '#F8F9FA',
  },
  answerText: {
    lineHeight: getFontSize(18),
  },
});

export default FAQsScreen;
