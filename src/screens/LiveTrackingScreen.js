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
import { busService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import TimelineStopItem from '../components/TimelineStopItem';

const LiveTrackingScreen = ({ route, navigation }) => {
  const { route: selectedRoute, from, to } = route.params || {};
  const [routeDetails, setRouteDetails] = useState(null);
  const [activeStopIndex, setActiveStopIndex] = useState(1); // Mock active stop
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRouteDetails();
  }, []);

  const loadRouteDetails = async () => {
    if (!selectedRoute?.routeId) {
      Alert.alert('Error', 'No route selected');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await busService.getRouteDetails(selectedRoute.routeId);
      setRouteDetails(data);
    } catch (error) {
      console.error('Error loading route details:', error);
      const errorMessage = error.userMessage || error.response?.data?.message || 'Unable to fetch route details. Please try again.';
      Alert.alert('Error', errorMessage, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !routeDetails) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Live Tracking</Text>
          </View>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading route details...</Text>
        </View>
      </View>
    );
  }

  const activeStop = routeDetails.stops[activeStopIndex];
  const nextStop = routeDetails.stops[activeStopIndex + 1];
  const progress = ((activeStopIndex + 1) / routeDetails.stops.length) * 100;

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
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.headerSubtitle}>
            {selectedRoute?.lineName || 'Private Bus (Red/Blue)'} • towards {to}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress)}% completed
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {routeDetails.stops.map((stop, index) => (
            <TimelineStopItem
              key={stop.id}
              stop={stop}
              isActive={index === activeStopIndex}
              isCompleted={index < activeStopIndex}
              isLast={index === routeDetails.stops.length - 1}
            />
          ))}
        </View>

        {/* Next Stop Info */}
        {nextStop && (
          <View style={styles.nextStopCard}>
            <View style={styles.nextStopHeader}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.nextStopTitle}>Next Stop</Text>
            </View>
            <Text style={styles.nextStopName}>{nextStop.name}</Text>
            <Text style={styles.nextStopTime}>In 10 mins</Text>
            <Text style={styles.nextStopInstruction}>
              Get ready to get off in 10 minutes
            </Text>
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
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  progressContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timelineContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextStopCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nextStopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  nextStopTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  nextStopName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  nextStopTime: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  nextStopInstruction: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default LiveTrackingScreen;

