import React from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView 
} from 'react-native';
import { 
  getSpacing, 
  getFontSize, 
  getBorderRadius, 
  getShadowStyle, 
  screenData 
} from '../utils/ResponsiveDesign';
import ResponsiveText from './ResponsiveText';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ResponsiveModal = ({ 
  visible, 
  onClose, 
  children, 
  title,
  showCloseButton = true,
  animationType = 'slide',
  transparent = true,
  style,
  ...props 
}) => {
  const getModalSize = () => {
    if (screenData.isTablet) {
      return {
        width: screenWidth * 0.8,
        height: screenHeight * 0.8,
        maxWidth: 600,
        maxHeight: 800,
      };
    } else if (screenData.isLarge) {
      return {
        width: screenWidth * 0.9,
        height: screenHeight * 0.85,
      };
    } else {
      return {
        width: screenWidth * 0.95,
        height: screenHeight * 0.9,
      };
    }
  };

  const modalSize = getModalSize();

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modalContainer,
          {
            width: modalSize.width,
            height: modalSize.height,
            maxWidth: modalSize.maxWidth,
            maxHeight: modalSize.maxHeight,
          },
          style
        ]}>
          <SafeAreaView style={styles.modalContent}>
            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <ResponsiveText 
                    size="large" 
                    weight="bold" 
                    style={styles.title}
                  >
                    {title}
                  </ResponsiveText>
                )}
                {showCloseButton && (
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <ResponsiveText size="large" color="#666">×</ResponsiveText>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Content */}
            <View style={styles.content}>
              {children}
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing(20),
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: getBorderRadius(12),
    ...getShadowStyle(8),
  },
  modalContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSpacing(20),
    paddingVertical: getSpacing(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    flex: 1,
    textAlign: 'left',
  },
  closeButton: {
    width: getSpacing(30),
    height: getSpacing(30),
    borderRadius: getSpacing(15),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: getSpacing(20),
  },
});

export default ResponsiveModal;







