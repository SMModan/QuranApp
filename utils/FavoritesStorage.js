import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'quran_favorites';

// Save a favorite item
export const saveFavorite = async (item) => {
  try {
    const existingFavorites = await getFavorites();
    const newFavorite = {
      id: `${item.type}_${item.id}_${Date.now()}`, // Unique ID
      type: item.type, // 'surah' or 'para'
      itemId: item.id,
      arabic: item.arabic,
      english: item.english,
      pageNumber: item.pageNumber,
      dateAdded: new Date().toISOString(),
      ...item
    };
    
    // Check if already exists
    const exists = existingFavorites.find(fav => 
      fav.type === item.type && fav.itemId === item.id
    );
    
    if (!exists) {
      const updatedFavorites = [...existingFavorites, newFavorite];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return { success: true, message: 'Added to favorites' };
    } else {
      return { success: false, message: 'Already in favorites' };
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
    return { success: false, message: 'Failed to save favorite' };
  }
};

// Get all favorites
export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Remove a favorite item
export const removeFavorite = async (favoriteId) => {
  try {
    const existingFavorites = await getFavorites();
    const updatedFavorites = existingFavorites.filter(fav => fav.id !== favoriteId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return { success: true, message: 'Removed from favorites' };
  } catch (error) {
    console.error('Error removing favorite:', error);
    return { success: false, message: 'Failed to remove favorite' };
  }
};

// Check if an item is favorited
export const isFavorite = async (type, itemId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.type === type && fav.itemId === itemId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Clear all favorites
export const clearAllFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return { success: true, message: 'All favorites cleared' };
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return { success: false, message: 'Failed to clear favorites' };
  }
};
