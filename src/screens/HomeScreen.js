import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import IconTileButton from '../components/IconTileButton';
import SectionHeader from '../components/SectionHeader';
import PlaceCard from '../components/PlaceCard';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const currentCity = 'Kollam'; // Hardcoded for now

  const tiles = [
    { icon: 'map-outline', label: 'Plan Trip', screen: 'PlanTrip' },
    { icon: 'time-outline', label: 'Bus Schedules', screen: 'BusSearch' },
    { icon: 'restaurant-outline', label: 'Food Spots', screen: 'Explore', params: { type: 'food' } },
    { icon: 'bicycle-outline', label: 'Activities', screen: 'Explore', params: { type: 'activity' } },
    { icon: 'camera-outline', label: 'Attractions', screen: 'Explore', params: { type: 'attraction' } },
    { icon: 'shield-outline', label: 'Safety', screen: 'Safety' },
    { icon: 'car-outline', label: 'Taxi', screen: 'Taxis' },
    { icon: 'calendar-outline', label: 'Day Planner', screen: 'DayPlan' },
  ];

  const recommendedPlaces = [
    {
      id: 'rec_1',
      name: 'Fort Kochi Beach',
      area: 'Fort Kochi',
      rating: 4.5,
      distance: 800,
      distanceMode: 'Walk',
    },
    {
      id: 'rec_2',
      name: 'Chinese Fishing Nets',
      area: 'Fort Kochi',
      rating: 4.7,
      distance: 1200,
      distanceMode: 'Walk',
    },
    {
      id: 'rec_3',
      name: 'Marine Drive',
      area: 'Ernakulam',
      rating: 4.6,
      distance: 1500,
      distanceMode: 'Walk',
    },
  ];

  const handleTilePress = (tile) => {
    if (tile.params) {
      navigation.navigate(tile.screen, tile.params);
    } else {
      navigation.navigate(tile.screen);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color={colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.white} />
              <Text style={styles.locationText}>{currentCity}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Explore Section */}
      <View style={styles.content}>
        <SectionHeader title="Explore" />

        {/* Grid of Tiles */}
        <View style={styles.grid}>
          {tiles.map((tile, index) => (
            <View key={index} style={styles.gridItem}>
              <IconTileButton
                icon={tile.icon}
                label={tile.label}
                onPress={() => handleTilePress(tile)}
              />
            </View>
          ))}
        </View>

        {/* Recommended for You */}
        <SectionHeader title="Recommended for you" />
        {recommendedPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerCard: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    padding: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  },
  gridItem: {
    width: '50%',
    padding: spacing.xs,
  },
});

export default HomeScreen;

