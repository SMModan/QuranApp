import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveText from '../components/ResponsiveText';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ResponsiveImage from '../components/ResponsiveImage';
import ResponsiveModal from '../components/ResponsiveModal';
import { 
  getSpacing, 
  getFontSize, 
  getBorderRadius, 
  getShadowStyle, 
  screenData 
} from '../utils/ResponsiveDesign';

const ResponsiveExampleScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const demoCards = [
    { id: 1, title: 'Card 1', color: '#FF6B6B' },
    { id: 2, title: 'Card 2', color: '#4ECDC4' },
    { id: 3, title: 'Card 3', color: '#45B7D1' },
    { id: 4, title: 'Card 4', color: '#96CEB4' },
    { id: 5, title: 'Card 5', color: '#FFEAA7' },
    { id: 6, title: 'Card 6', color: '#DDA0DD' },
  ];

  const renderCard = (card) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.card,
        { backgroundColor: card.color },
        getShadowStyle(3)
      ]}
      activeOpacity={0.8}
    >
      <ResponsiveText 
        size="large" 
        weight="bold" 
        color="#FFFFFF"
        align="center"
      >
        {card.title}
      </ResponsiveText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="Responsive Design Demo"
        onMenuPress={() => navigation.openDrawer()}
        showMenu={true}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ResponsiveContainer padding={20}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <ResponsiveText 
              size="hero" 
              weight="bold" 
              color="#1a237e"
              align="center"
              style={styles.heroTitle}
            >
              Responsive Design System
            </ResponsiveText>
            <ResponsiveText 
              size="large" 
              color="#666666"
              align="center"
              style={styles.heroSubtitle}
            >
              Adapts perfectly to all screen sizes
            </ResponsiveText>
          </View>

          {/* Device Info */}
          <View style={styles.infoSection}>
            <ResponsiveText size="title" weight="bold" color="#1a237e">
              Current Device Info
            </ResponsiveText>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <ResponsiveText size="medium" weight="bold">Screen Size:</ResponsiveText>
                <ResponsiveText size="medium">{screenData.category}</ResponsiveText>
              </View>
              <View style={styles.infoItem}>
                <ResponsiveText size="medium" weight="bold">Device Type:</ResponsiveText>
                <ResponsiveText size="medium">{screenData.deviceType}</ResponsiveText>
              </View>
              <View style={styles.infoItem}>
                <ResponsiveText size="medium" weight="bold">Grid Columns:</ResponsiveText>
                <ResponsiveText size="medium">{screenData.gridColumns}</ResponsiveText>
              </View>
              <View style={styles.infoItem}>
                <ResponsiveText size="medium" weight="bold">Orientation:</ResponsiveText>
                <ResponsiveText size="medium">
                  {screenData.isLandscape ? 'Landscape' : 'Portrait'}
                </ResponsiveText>
              </View>
            </View>
          </View>

          {/* Responsive Grid Demo */}
          <View style={styles.section}>
            <ResponsiveText size="title" weight="bold" color="#1a237e">
              Responsive Grid Layout
            </ResponsiveText>
            <ResponsiveText size="medium" color="#666666" style={styles.sectionDescription}>
              Cards automatically adjust to screen size
            </ResponsiveText>
            
            <ResponsiveGrid spacing={15} style={styles.gridContainer}>
              {demoCards.map(renderCard)}
            </ResponsiveGrid>
          </View>

          {/* Responsive Components Demo */}
          <View style={styles.section}>
            <ResponsiveText size="title" weight="bold" color="#1a237e">
              Responsive Components
            </ResponsiveText>
            
            <View style={styles.componentsDemo}>
              <TouchableOpacity 
                style={[styles.demoButton, getShadowStyle(2)]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
              >
                <ResponsiveText size="large" weight="bold" color="#FFFFFF">
                  Open Responsive Modal
                </ResponsiveText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Responsive Text Sizes Demo */}
          <View style={styles.section}>
            <ResponsiveText size="title" weight="bold" color="#1a237e">
              Responsive Text Sizes
            </ResponsiveText>
            
            <View style={styles.textDemo}>
              <ResponsiveText size="xs" color="#666">Extra Small Text</ResponsiveText>
              <ResponsiveText size="small" color="#666">Small Text</ResponsiveText>
              <ResponsiveText size="medium" color="#666">Medium Text</ResponsiveText>
              <ResponsiveText size="large" color="#666">Large Text</ResponsiveText>
              <ResponsiveText size="xlarge" color="#666">Extra Large Text</ResponsiveText>
              <ResponsiveText size="title" color="#1a237e">Title Text</ResponsiveText>
            </View>
          </View>
        </ResponsiveContainer>
      </ScrollView>

      {/* Responsive Modal */}
      <ResponsiveModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Responsive Modal"
      >
        <ResponsiveText size="large" color="#1a237e" align="center">
          This modal adapts to different screen sizes!
        </ResponsiveText>
        <ResponsiveText size="medium" color="#666666" align="center" style={styles.modalText}>
          On tablets, it's wider and taller. On phones, it takes up most of the screen.
        </ResponsiveText>
        
        <TouchableOpacity 
          style={[styles.modalButton, getShadowStyle(2)]}
          onPress={() => setModalVisible(false)}
          activeOpacity={0.8}
        >
          <ResponsiveText size="large" weight="bold" color="#FFFFFF">
            Close Modal
          </ResponsiveText>
        </TouchableOpacity>
      </ResponsiveModal>
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
  heroSection: {
    alignItems: 'center',
    marginBottom: getSpacing(30),
    paddingVertical: getSpacing(20),
  },
  heroTitle: {
    marginBottom: getSpacing(10),
  },
  heroSubtitle: {
    fontStyle: 'italic',
  },
  infoSection: {
    marginBottom: getSpacing(30),
    padding: getSpacing(20),
    backgroundColor: '#FFFFFF',
    borderRadius: getBorderRadius(12),
    ...getShadowStyle(2),
  },
  infoGrid: {
    marginTop: getSpacing(15),
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getSpacing(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  section: {
    marginBottom: getSpacing(30),
  },
  sectionDescription: {
    marginTop: getSpacing(10),
    marginBottom: getSpacing(20),
  },
  gridContainer: {
    marginTop: getSpacing(15),
  },
  card: {
    height: getSpacing(100),
    borderRadius: getBorderRadius(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getSpacing(10),
  },
  componentsDemo: {
    marginTop: getSpacing(20),
  },
  demoButton: {
    backgroundColor: '#1a237e',
    paddingVertical: getSpacing(15),
    paddingHorizontal: getSpacing(30),
    borderRadius: getBorderRadius(8),
    alignItems: 'center',
  },
  textDemo: {
    marginTop: getSpacing(15),
    padding: getSpacing(20),
    backgroundColor: '#FFFFFF',
    borderRadius: getBorderRadius(12),
    ...getShadowStyle(1),
  },
  modalText: {
    marginTop: getSpacing(15),
    marginBottom: getSpacing(25),
  },
  modalButton: {
    backgroundColor: '#1a237e',
    paddingVertical: getSpacing(12),
    paddingHorizontal: getSpacing(25),
    borderRadius: getBorderRadius(8),
    alignItems: 'center',
  },
});

export default ResponsiveExampleScreen;
















