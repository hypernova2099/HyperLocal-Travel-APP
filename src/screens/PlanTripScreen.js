import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tripService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const PlanTripScreen = ({ navigation }) => {
  const [toLocation, setToLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const currentLocation = 'Fort Kochi'; // Hardcoded for now

  const quickSelects = [
    { id: 'home', label: 'Home', icon: 'home-outline' },
    { id: 'work', label: 'Work', icon: 'briefcase-outline' },
    { id: 'airport', label: 'Airport', icon: 'airplane-outline' },
    { id: 'metro', label: 'Metro Stn', icon: 'train-outline' },
  ];

  const recentSearches = [
    { id: '1', name: 'Marine Drive', distance: '5km' },
    { id: '2', name: 'Vyttila Hub', distance: '8km' },
    { id: '3', name: 'Lulu Mall', distance: '12km' },
    { id: '4', name: 'Kakkanad', distance: '16km' },
  ];

  const handleQuickSelect = (item) => {
    setToLocation(item.label);
  };

  const handleRecentSearch = (search) => {
    setToLocation(search.name);
  };

  const handleSearchRoutes = async () => {
    if (!toLocation.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    setLoading(true);
    try {
      // Call planTrip API to get route options
      const tripPlan = await tripService.planTrip({
        from: currentLocation,
        to: toLocation,
      });

      // Navigate to RouteOptionsScreen with the options
      navigation.navigate('RouteOptions', {
        from: tripPlan.from,
        to: tripPlan.to,
        options: tripPlan.options,
      });
    } catch (error) {
      console.error('Error planning trip:', error);
      Alert.alert('Error', 'Failed to plan trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.appBarTitle}>Plan Local Trip</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* From Location */}
        <View style={styles.section}>
          <Text style={styles.label}>From</Text>
          <View style={styles.locationPill}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.locationText}>{currentLocation}</Text>
          </View>
        </View>

        {/* To Location */}
        <View style={styles.section}>
          <Text style={styles.label}>To</Text>
          <View style={styles.inputPill}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Marine Drive, Lulu Mall…"
              placeholderTextColor={colors.textLight}
              value={toLocation}
              onChangeText={setToLocation}
            />
          </View>
        </View>

        {/* Quick Select */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Select</Text>
          <View style={styles.quickSelectGrid}>
            {quickSelects.map((item) => (
              <View key={item.id} style={styles.quickSelectCard}>
                <TouchableOpacity
                  style={styles.quickSelectButton}
                  onPress={() => handleQuickSelect(item)}
                >
                  <Ionicons name={item.icon} size={24} color={colors.primary} />
                  <Text style={styles.quickSelectLabel}>{item.label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((search) => (
            <TouchableOpacity
              key={search.id}
              style={[
                styles.recentSearchItem,
                toLocation === search.name && styles.recentSearchItemActive,
              ]}
              onPress={() => handleRecentSearch(search)}
            >
              <View style={styles.recentSearchLeft}>
                <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                <Text
                  style={[
                    styles.recentSearchName,
                    toLocation === search.name && styles.recentSearchNameActive,
                  ]}
                >
                  {search.name}
                </Text>
              </View>
              <Text style={styles.recentSearchDistance}>{search.distance}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Routes Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            (!toLocation.trim() || loading) && styles.searchButtonDisabled,
          ]}
          onPress={handleSearchRoutes}
          disabled={!toLocation.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.searchButtonText}>Search Routes</Text>
          )}
        </TouchableOpacity>
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
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  inputPill: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  quickSelectCard: {
    width: '50%',
    padding: spacing.xs,
  },
  quickSelectButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: spacing.xs,
  },
  quickSelectLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentSearchItemActive: {
    backgroundColor: colors.primary + '10',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  recentSearchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  recentSearchName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  recentSearchNameActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  recentSearchDistance: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlanTripScreen;

