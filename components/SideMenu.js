import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const { width: screenWidth } = Dimensions.get('window');

const SideMenu = ({ 
  visible, 
  onClose, 
  onMenuItemPress,
  backgroundColor = '#1a237e',
  textColor = '#FFFFFF'
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
      id: 'resume',
      title: 'سيرة ذاتية',
      subtitle: 'RESUME',
      icon: '📖',
    },
    {
      id: 'bookmarks',
      title: 'العلامات المرجعية',
      subtitle: 'BOOKMARKS',
      icon: '🔖',
    },
    {
      id: 'favourites',
      title: 'المفضلة',
      subtitle: 'FAVOURITES',
      icon: '⭐',
    },
    {
      id: 'surah_index',
      title: 'فهرس السور',
      subtitle: 'SURAH INDEX',
      icon: '📋',
    },
    {
      id: 'juz_index',
      title: 'فهرس الأجزاء / الفقرات',
      subtitle: 'JUZ/PARA INDEX',
      icon: '📚',
    },
    {
      id: 'go_to_page',
      title: 'انتقل إلى الصفحة',
      subtitle: 'GO TO PAGE',
      icon: '📄',
    },
    {
      id: 'change_reading_mode',
      title: 'Change reading Mode',
      subtitle: 'READING MODE',
      icon: '⭐',
    },
    {
      id: 'backup_restore',
      title: 'Backup & Restore',
      subtitle: 'BACKUP & RESTORE',
      icon: '☁️',
    },
    {
      id: 'our_apps',
      title: 'Our Apps',
      subtitle: 'OUR APPS',
      icon: '📱',
    },
    {
      id: 'visit_website',
      title: 'Visit Website',
      subtitle: 'VISIT WEBSITE',
      icon: '🌐',
    },
    {
      id: 'contact_us',
      title: 'Contact Us',
      subtitle: 'CONTACT US',
      icon: '👤',
    },
    {
      id: 'share_app',
      title: 'Share this App',
      subtitle: 'SHARE APP',
      icon: '📤',
    },
    {
      id: 'rate_app',
      title: 'Rate this App',
      subtitle: 'RATE APP',
      icon: '⭐',
    },
    {
      id: 'faqs',
      title: 'FAQ\'s',
      subtitle: 'FAQ\'s',
      icon: '❓',
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
              backgroundColor,
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <ScrollView style={styles.menuContent}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <View style={styles.logoContainer}>
                <View style={styles.mosqueIcon}>
                  <Text style={styles.mosqueEmoji}>🕌</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={[styles.menuTitle, { color: textColor }]}>
                    القرآن الكريم
                  </Text>
                  <Text style={[styles.menuSubtitle, { color: textColor }]}>
                    Al-Quran Al-Kareem
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemIcon}>{item.icon}</Text>
                    <View style={styles.menuItemText}>
                      <Text style={[styles.menuItemTitle, { color: textColor }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.menuItemSubtitle, { color: textColor }]}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer Message */}
            <View style={styles.menuFooter}>
              <Text style={[styles.footerText, { color: textColor }]}>
                Screen par maujood Qur'an ki aayaat ko baghair wuzu chhoona durust nahin hai.
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.8,
    maxWidth: 320,
  },
  menuContent: {
    flex: 1,
    paddingTop: getSpacing(60), // Account for status bar
  },
  menuHeader: {
    padding: getSpacing(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: getSpacing(20),
    backgroundColor: '#1a237e',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mosqueIcon: {
    width: getSpacing(50),
    height: getSpacing(50),
    borderRadius: getSpacing(25),
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getSpacing(15),
  },
  mosqueEmoji: {
    fontSize: getFontSize(24),
  },
  titleContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    marginBottom: getSpacing(2),
    color: '#FFD700',
  },
  menuSubtitle: {
    fontSize: getFontSize(12),
    opacity: 0.9,
    color: '#FFD700',
  },
  menuItems: {
    paddingHorizontal: getSpacing(10),
  },
  menuItem: {
    marginBottom: getSpacing(10),
    borderRadius: getSpacing(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(15),
  },
  menuItemIcon: {
    fontSize: getFontSize(24),
    marginRight: getSpacing(15),
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: getSpacing(2),
  },
  menuItemSubtitle: {
    fontSize: getFontSize(12),
    opacity: 0.8,
  },
  menuFooter: {
    padding: getSpacing(20),
    marginTop: getSpacing(20),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: getFontSize(12),
    textAlign: 'center',
    lineHeight: getFontSize(16),
    opacity: 0.8,
  },
});

export default SideMenu;
