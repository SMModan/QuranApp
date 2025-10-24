import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';
import ResponsiveText from '../components/ResponsiveText';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';
import { getFavorites, removeFavorite } from '../utils/FavoritesStorage';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    // Add back button listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    loadFavorites();
    return () => backHandler.remove();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId, itemName) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${itemName}" from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const result = await removeFavorite(favoriteId);
            if (result.success) {
              loadFavorites(); // Reload the list
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const handleFavoritePress = (favorite) => {
    // Navigate to Quran reader with the specific page
    navigation.navigate('quran-reader', {
      pageNumber: favorite.pageNumber,
      title: favorite.arabic,
      type: favorite.type,
      itemId: favorite.itemId
    });
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={() => handleFavoritePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.typeSection}>
          <View style={[styles.typeBadge, item.type === 'surah' ? styles.surahBadge : styles.paraBadge]}>
            <Text style={styles.typeText}>
              {item.type === 'surah' ? 'SURAH' : 'PARA'}
            </Text>
          </View>
        </View>
        
        <View style={styles.pageContainer}>
          <Text style={styles.pageText}>Page {item.pageNumber}</Text>
        </View>
        
        <View style={styles.contentSection}>
          <Text style={styles.arabicText}>{item.arabic}</Text>
          <Text style={styles.englishText}>{item.english}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveFavorite(item.id, item.arabic)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteIcon}>−</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>⭐</Text>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the star icon on any Surah or Para to add it to your favorites
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonHeader 
        title="My Favorites"
        onBackPress={handleBackPress}
        showBackButton={true}
        showMenu={false}
      />
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading favorites...</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: getSpacing(12),
  },
  favoriteItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: getSpacing(10),
    borderRadius: getSpacing(12),
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeSection: {
    marginRight: getSpacing(12),
  },
  typeBadge: {
    paddingHorizontal: getSpacing(12),
    paddingVertical: getSpacing(6),
    borderRadius: getSpacing(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahBadge: {
    backgroundColor: '#F3F4F6',
  },
  paraBadge: {
    backgroundColor: '#F3F4F6',
  },
  typeText: {
    fontSize: getFontSize(11),
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  contentSection: {
    flex: 1,
  },
  arabicText: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
    marginBottom: getSpacing(3),
  },
  englishText: {
    fontSize: getFontSize(15),
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: getSpacing(2),
    fontStyle: 'italic',
  },
  pageContainer: {
    marginRight: getSpacing(12),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  pageText: {
    fontSize: getFontSize(12),
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: getSpacing(8),
    paddingVertical: getSpacing(3),
    borderRadius: getSpacing(12),
    fontWeight: '500',
  },
  deleteButton: {
    width: getSpacing(36),
    height: getSpacing(36),
    borderRadius: getSpacing(18),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: getSpacing(24),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  deleteIcon: {
    fontSize: getFontSize(16),
    color: '#FF4444',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen;
