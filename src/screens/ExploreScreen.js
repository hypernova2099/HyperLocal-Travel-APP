import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { placesService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import PlaceCard from '../components/PlaceCard';

const ExploreScreen = ({ route, navigation }) => {
  const type = route.params?.type || 'attraction';
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('openNow');

  useEffect(() => {
    loadPlaces();
  }, [type]);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const data = await placesService.getPlaces({ type });
      setPlaces(data || []);
    } catch (error) {
      console.error('Error loading places:', error);
      const errorMessage = error.userMessage || error.response?.data?.message || 'Unable to fetch places. Please try again.';
      Alert.alert('Error', errorMessage);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const getScreenTitle = () => {
    if (type === 'food') return 'Food Spots Near You';
    if (type === 'activity') return 'Activities Near You';
    return 'Attractions Near You';
  };

  const filters = [
    { id: 'openNow', label: 'Open Now' },
    { id: 'nearest', label: 'Nearest (Walk)' },
    { id: 'onRoute', label: 'On Route' },
  ];

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>{getScreenTitle()}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          {filters.map((filterItem) => (
            <TouchableOpacity
              key={filterItem.id}
              style={[
                styles.filterChip,
                filter === filterItem.id && styles.filterChipActive,
              ]}
              onPress={() => setFilter(filterItem.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === filterItem.id && styles.filterChipTextActive,
                ]}
              >
                {filterItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Places List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading places...</Text>
          </View>
        ) : (
          <>
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
            {places.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No places found</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appBar: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default ExploreScreen;

