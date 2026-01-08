import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import PlaceCard from '../components/PlaceCard';

const RouteOptionsScreen = ({ route, navigation }) => {
  // Get route params: from, to, and options array
  const { from, to, options = [] } = route.params || { 
    from: 'Fort Kochi', 
    to: 'Vyttila Hub',
    options: []
  };

  // Handle route option selection
  const handleRouteSelect = (option) => {
    if (option.mode === 'private-bus') {
      // Navigate to Private Bus Options screen
      navigation.navigate('PrivateBusOptions', {
        routeId: option.routeId,
        from,
        to,
      });
    } else {
      // For other modes (auto, metro), show info or navigate to appropriate screen
      // For now, we'll just show an alert
      navigation.navigate('LiveTracking', {
        route: option,
        from,
        to,
      });
    }
  };

  // Get card color based on mode
  const getCardColor = (mode) => {
    if (mode === 'private-bus') return colors.busCard;
    if (mode === 'metro') return colors.metroCard;
    return colors.taxiCard;
  };

  // Get icon based on mode
  const getModeIcon = (mode) => {
    if (mode === 'private-bus') return 'bus';
    if (mode === 'metro') return 'train';
    return 'car';
  };

  // Get tag text for the option
  const getTagText = (option) => {
    if (option.mode === 'private-bus' && option.summary?.frequencyMinutes) {
      return `Freq: Every ${option.summary.frequencyMinutes} min`;
    }
    if (option.mode === 'metro') {
      return 'Fastest ⚡';
    }
    if (option.mode === 'auto') {
      return 'Door-to-Door';
    }
    return '';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Route Options</Text>
          <Text style={styles.headerSubtitle}>
            {from} → {to}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Route Options */}
        {options.map((option, index) => (
          <View key={index}>
            {/* Route Option Card */}
            <TouchableOpacity
              style={[
                styles.routeCard,
                { backgroundColor: getCardColor(option.mode) },
              ]}
              onPress={() => handleRouteSelect(option)}
              activeOpacity={0.7}
            >
              <View style={styles.routeCardHeader}>
                <View style={styles.modeContainer}>
                  <Ionicons
                    name={getModeIcon(option.mode)}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.modeLabel}>{option.label}</Text>
                </View>
                {getTagText(option) && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{getTagText(option)}</Text>
                  </View>
                )}
              </View>

              <View style={styles.routeDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {option.summary?.durationMinutes || 0} min
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>
                    ₹{option.summary?.fareEstimate || 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Places Along Route Section */}
            {option.placesAlongRoute && (
              <View style={styles.placesSection}>
                <Text style={styles.placesSectionTitle}>Along this route</Text>
                
                {/* Food Spots */}
                {option.placesAlongRoute.food && option.placesAlongRoute.food.length > 0 && (
                  <View style={styles.placesCategory}>
                    <View style={styles.categoryHeader}>
                      <Ionicons name="restaurant-outline" size={18} color={colors.primary} />
                      <Text style={styles.categoryTitle}>Food Spots</Text>
                    </View>
                    {option.placesAlongRoute.food.map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))}
                  </View>
                )}

                {/* Activities */}
                {option.placesAlongRoute.activities && option.placesAlongRoute.activities.length > 0 && (
                  <View style={styles.placesCategory}>
                    <View style={styles.categoryHeader}>
                      <Ionicons name="bicycle-outline" size={18} color={colors.primary} />
                      <Text style={styles.categoryTitle}>Activities</Text>
                    </View>
                    {option.placesAlongRoute.activities.map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))}
                  </View>
                )}

                {/* Attractions */}
                {option.placesAlongRoute.attractions && option.placesAlongRoute.attractions.length > 0 && (
                  <View style={styles.placesCategory}>
                    <View style={styles.categoryHeader}>
                      <Ionicons name="camera-outline" size={18} color={colors.primary} />
                      <Text style={styles.categoryTitle}>Attractions</Text>
                    </View>
                    {option.placesAlongRoute.attractions.map((place) => (
                      <PlaceCard key={place.id} place={place} />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        {options.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No route options available</Text>
          </View>
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
  header: {
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  routeCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  placesSection: {
    marginBottom: spacing.lg,
  },
  placesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  placesCategory: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
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

export default RouteOptionsScreen;
