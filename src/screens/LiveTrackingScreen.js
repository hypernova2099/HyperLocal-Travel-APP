import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { busService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import TimelineStopItem from '../components/TimelineStopItem';

const OFFLINE_THRESHOLD_MS = 120000; // 2 minutes
const POLL_INTERVAL_MS = 5000;

const LiveTrackingScreen = ({ route, navigation }) => {
  // Passenger live tracking params
  const busId = route?.params?.busId;
  const busName = route?.params?.busName;

  // Optional: if we arrived here from the older "route timeline" flow, keep it working.
  const selectedRoute = route?.params?.route;
  const from = route?.params?.from;
  const to = route?.params?.to;

  const isPassengerMode = !!busId;

  // -----------------------------
  // Passenger Live Tracking State
  // -----------------------------
  const mapRef = useRef(null);
  const intervalRef = useRef(null);
  const inFlightRef = useRef(false);

  const [liveLocation, setLiveLocation] = useState(null);
  const [status, setStatus] = useState('OFFLINE');
  const [loading, setLoading] = useState(isPassengerMode);
  const [errorText, setErrorText] = useState('');

  // -----------------------------
  // Legacy Timeline Tracking State
  // -----------------------------
  const [routeDetails, setRouteDetails] = useState(null);
  const [activeStopIndex] = useState(1); // Demo active stop
  const [legacyLoading, setLegacyLoading] = useState(!isPassengerMode);

  const fetchLive = async () => {
    if (!busId || inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const data = await busService.getLiveLocation(busId);
      if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
        setLiveLocation(data);
        setErrorText('');
      } else {
        // Backend may return 404 or unexpected response; keep UI stable
        setErrorText('Unable to fetch live location');
      }
    } catch (error) {
      console.error('Live location fetch error:', error);
      setErrorText('Unable to fetch live location');
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    if (!isPassengerMode) return;

    // Initial fetch + polling
    setLoading(true);
    fetchLive();

    intervalRef.current = setInterval(() => {
      fetchLive();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPassengerMode, busId]);

  // Update LIVE/OFFLINE based on lastUpdated
  useEffect(() => {
    if (!isPassengerMode) return;
    if (!liveLocation?.lastUpdated) {
      setStatus('OFFLINE');
      return;
    }
    const last = new Date(liveLocation.lastUpdated).getTime();
    if (!Number.isFinite(last)) {
      setStatus('OFFLINE');
      return;
    }
    const isOffline = Date.now() - last > OFFLINE_THRESHOLD_MS;
    setStatus(isOffline ? 'OFFLINE' : 'LIVE');
  }, [isPassengerMode, liveLocation?.lastUpdated]);

  // Animate map to new marker position
  useEffect(() => {
    if (!isPassengerMode) return;
    if (!liveLocation?.lat || !liveLocation?.lng) return;
    if (!mapRef.current) return;
    try {
      mapRef.current.animateToRegion(
        {
          latitude: liveLocation.lat,
          longitude: liveLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        400
      );
    } catch (e) {
      // ignore map animation errors
    }
  }, [isPassengerMode, liveLocation?.lat, liveLocation?.lng]);

  const speedKmh = useMemo(() => {
    const s = Number(liveLocation?.speed || 0);
    // Driver app posts expo-location speed (m/s). Convert to km/h.
    return Math.max(0, Math.round(s * 3.6));
  }, [liveLocation?.speed]);

  const lastUpdatedSecAgo = useMemo(() => {
    const last = liveLocation?.lastUpdated ? new Date(liveLocation.lastUpdated).getTime() : null;
    if (!last || !Number.isFinite(last)) return null;
    return Math.max(0, Math.round((Date.now() - last) / 1000));
  }, [liveLocation?.lastUpdated, status]);

  // -----------------------------
  // Legacy timeline flow (kept)
  // -----------------------------
  const loadRouteDetails = async () => {
    if (!selectedRoute?.routeId) {
      Alert.alert('Error', 'No route selected');
      setLegacyLoading(false);
      return;
    }

    setLegacyLoading(true);
    try {
      const data = await busService.getRouteDetails(selectedRoute.routeId);
      setRouteDetails(data);
    } catch (error) {
      console.error('Error loading route details:', error);
      const errorMessage =
        error.userMessage ||
        error.response?.data?.message ||
        'Unable to fetch route details. Please try again.';
      Alert.alert('Error', errorMessage, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } finally {
      setLegacyLoading(false);
    }
  };

  useEffect(() => {
    if (isPassengerMode) return;
    loadRouteDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPassengerMode]);

  // -----------------------------
  // Passenger UI
  // -----------------------------
  if (isPassengerMode) {
    const isLive = status === 'LIVE';
    const statusColor = isLive ? colors.success : colors.error;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Live Bus Tracking</Text>
            <Text style={styles.headerSubtitle}>Bus: {busName || busId}</Text>
          </View>
          <View style={styles.backButton} />
        </View>

        <View style={styles.passengerContent}>
          <View style={styles.mapCard}>
            {loading && !liveLocation ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Fetching live location...</Text>
              </View>
            ) : liveLocation ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                region={{
                  latitude: liveLocation.lat,
                  longitude: liveLocation.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: liveLocation.lat,
                    longitude: liveLocation.lng,
                  }}
                  title="Bus Location"
                  rotation={liveLocation.heading || 0}
                  anchor={{ x: 0.5, y: 0.5 }}
                />
              </MapView>
            ) : (
              <View style={styles.center}>
                <Text style={styles.loadingText}>Unable to fetch live location</Text>
              </View>
            )}
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Speed</Text>
              <Text style={styles.statsValue}>{speedKmh} km/h</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Last Updated</Text>
              <Text style={styles.statsValue}>
                {lastUpdatedSecAgo === null ? '—' : `${lastUpdatedSecAgo} sec ago`}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Status</Text>
              <View style={styles.statusPill}>
                <View style={[styles.dot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
              </View>
            </View>

            {!!errorText && (
              <Text style={styles.errorText}>{errorText}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  // -----------------------------
  // Legacy timeline UI (unchanged)
  // -----------------------------
  if (legacyLoading || !routeDetails) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.headerSubtitle}>
            {selectedRoute?.lineName || 'Private Bus'} • towards {to}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% completed</Text>
        </View>

        <View style={styles.timelineContainer}>
          {routeDetails.stops.map((stop, index) => (
            <TimelineStopItem
              key={stop.id || `${stop.name}-${index}`}
              stop={stop}
              isActive={index === activeStopIndex}
              isCompleted={index < activeStopIndex}
              isLast={index === routeDetails.stops.length - 1}
            />
          ))}
        </View>

        {nextStop && (
          <View style={styles.nextStopCard}>
            <View style={styles.nextStopHeader}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.nextStopTitle}>Next Stop</Text>
            </View>
            <Text style={styles.nextStopName}>{nextStop.name}</Text>
            <Text style={styles.nextStopTime}>In 10 mins</Text>
            <Text style={styles.nextStopInstruction}>Get ready to get off in 10 minutes</Text>
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
  passengerContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
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
  mapCard: {
    flex: 1,
    minHeight: 260,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  statsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  errorText: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
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

