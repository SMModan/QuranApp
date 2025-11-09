import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Animated,
  Dimensions,
  ScrollView,
  Image
} from 'react-native';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const { width: screenWidth } = Dimensions.get('window');

const SideMenu = ({ 
  visible, 
  onClose, 
  onMenuItemPress,
  backgroundColor = '#1a237e',
  textColor = '#FFFFFF',
  excludedItems = []
}) => {
  const slideAnim = React.useRef(new Animated.Value(-screenWidth)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Enhanced slide-in animation with easing
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Enhanced slide-out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  const menuItems = [
    {
      id: 'bookmarks',
      title: 'Bookmarks',
      icon: require('../assets/icons/menu_icon/Book.png'),
    },
   
  
    {
      id: 'contact_us',
      title: 'Contact Us',
      icon: require('../assets/icons/menu_icon/Person Support.png'),
    },
    {
      id: 'share_app',
      title: 'Share this App',
      icon: require('../assets/icons/menu_icon/Share.png'),
    },
    {
      id: 'rate_app',
      title: 'Rate this App',
      icon: require('../assets/icons/menu_icon/Star Emphasis.png'),
    },
    {
      id: 'faqs',
      title: 'FAQ\'s',
      icon: require('../assets/icons/menu_icon/Chat Bubbles Question.png'),
    },
  ];

  const handleMenuItemPress = (itemId) => {
    onMenuItemPress(itemId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.menuContainer,
            { 
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <ScrollView style={styles.menuContent}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/icons/menu_icon/side_menu_top_icon.png')}
                  style={styles.mosqueIcon}
                  resizeMode="contain"
                />
             
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {menuItems
                .filter(item => !excludedItems.includes(item.id))
                .map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemContent}>
                      <Image 
                        source={item.icon}
                        style={styles.menuItemIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.menuItemTitle}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>

          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: getSpacing(40),
    bottom: 0,
    width: screenWidth * 0.8,
    maxWidth: 320,
    backgroundColor: '#DBECFF',
    borderTopRightRadius: getSpacing(20),
    borderBottomRightRadius: getSpacing(20),
  },
  menuContent: {
    flex: 1,
    paddingTop: 0,
  },
  menuHeader: {
    width: 320,
    height: 143,
    paddingHorizontal: getSpacing(20),
    paddingBottom: getSpacing(20),
    backgroundColor: '#083569',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mosqueIcon: {
    width: 200,
    height: 200,
    marginRight: getSpacing(15),
    marginBottom: getSpacing(30),
  },
  titleContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Philosopher',
  },
  menuItems: {
    paddingHorizontal: getSpacing(15),
    paddingTop: getSpacing(20),
  },
  menuItem: {
    marginBottom: getSpacing(8),
    borderRadius: getSpacing(8),
    backgroundColor: 'transparent',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getSpacing(12),
    paddingHorizontal: getSpacing(15),
  },
  menuItemIcon: {
    width: getSpacing(24),
    height: getSpacing(24),
    marginRight: getSpacing(15),
    tintColor: '#083569',
  },
  menuItemTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    color: '#083569',
    flex: 1,
  },
});

export default SideMenu;
