import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFontSize, getSpacing } from '../utils/ResponsiveDesign';
import CommonHeader from '../components/CommonHeader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BookmarkScreen = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    try {
      setIsLoading(true);
      const savedBookmarks = await AsyncStorage.getItem('quran_bookmarks');
      if (savedBookmarks) {
        const bookmarksList = JSON.parse(savedBookmarks);
        setBookmarks(bookmarksList);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete bookmark
  const deleteBookmark = useCallback(async (bookmarkId) => {
    try {
      setBookmarks(prevBookmarks => {
        const updatedBookmarks = prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
        AsyncStorage.setItem('quran_bookmarks', JSON.stringify(updatedBookmarks));
        return updatedBookmarks;
      });
      Alert.alert('Success', 'Bookmark deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete bookmark');
    }
  }, []);

  // Navigate to bookmarked page
  const navigateToPage = useCallback((pageNumber) => {
    navigation.navigate('quran-reader', { pageNumber: pageNumber });
  }, [navigation]);

  // Clear all bookmarks
  const clearAllBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to delete all bookmarks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('quran_bookmarks');
              setBookmarks([]);
              Alert.alert('Success', 'All bookmarks cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear bookmarks');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const renderBookmarkItem = useCallback(({ item: bookmark }) => (
    <View style={styles.bookmarkItem}>
      <TouchableOpacity
        style={styles.bookmarkContent}
        onPress={() => navigateToPage(bookmark.page)}
        activeOpacity={0.7}
      >
        <View style={styles.bookmarkInfo}>
          <Text style={styles.bookmarkPage}>Page {bookmark.page}</Text>
          <Text style={styles.bookmarkComment}>{bookmark.comment}</Text>
          <Text style={styles.bookmarkDate}>
            {new Date(bookmark.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.bookmarkActions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Bookmark',
                'Are you sure you want to delete this bookmark?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteBookmark(bookmark.id) },
                ]
              );
            }}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  ), [navigateToPage, deleteBookmark]);

  const keyExtractor = useCallback((item, index) => `bookmark-${item.id}-${index}`, []);

  const ListHeaderComponent = useCallback(() => (
    <View style={styles.headerActions}>
      <Text style={styles.bookmarkCount}>{bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}</Text>
      <TouchableOpacity
        style={styles.clearAllButton}
        onPress={clearAllBookmarks}
      >
        <Text style={styles.clearAllButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  ), [bookmarks.length]);

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Bookmarks"
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
        showMenu={false}
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading bookmarks...</Text>
          </View>
        ) : bookmarks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No Bookmarks</Text>
            <Text style={styles.emptySubtitle}>
              You haven't saved any bookmarks yet.{'\n'}
              Go to the Quran reader and tap the bookmark button to save pages.
            </Text>
          </View>
        ) : (
          <FlatList
            data={bookmarks}
            renderItem={renderBookmarkItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.bookmarkList}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            updateCellsBatchingPeriod={50}
          />
        )}
      </View>
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
    paddingHorizontal: getSpacing(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: getFontSize(16),
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getSpacing(40),
  },
  emptyIcon: {
    fontSize: getFontSize(64),
    marginBottom: getSpacing(20),
  },
  emptyTitle: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: getSpacing(10),
  },
  emptySubtitle: {
    fontSize: getFontSize(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: getFontSize(20),
  },
  bookmarkList: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getSpacing(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: getSpacing(10),
  },
  bookmarkCount: {
    fontSize: getFontSize(14),
    color: '#666666',
    fontWeight: '600',
  },
  clearAllButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: getSpacing(15),
    paddingVertical: getSpacing(8),
    borderRadius: getSpacing(15),
  },
  clearAllButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  bookmarkItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: getSpacing(10),
    marginBottom: getSpacing(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(15),
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkPage: {
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: getSpacing(5),
  },
  bookmarkComment: {
    fontSize: getFontSize(14),
    color: '#666666',
    marginBottom: getSpacing(5),
    lineHeight: getFontSize(18),
  },
  bookmarkDate: {
    fontSize: getFontSize(12),
    color: '#999999',
  },
  bookmarkActions: {
    marginLeft: getSpacing(10),
  },
  deleteButton: {
    width: getSpacing(35),
    height: getSpacing(35),
    borderRadius: getSpacing(17.5),
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: getFontSize(16),
  },
});

export default BookmarkScreen;
