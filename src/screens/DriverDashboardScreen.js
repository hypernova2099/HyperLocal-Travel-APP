import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { liveService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const DriverDashboardScreen = () => {
  const { user } = useContext(AuthContext);
  const trackingRef = useRef(null);
  const hasShownSendErrorRef = useRef(false);

  const [isLive, setIsLive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const assignedBus = user?.assignedBus || null;

  const stopTrip = async () => {
    try {
      if (trackingRef.current) {
        trackingRef.current.remove();
        trackingRef.current = null;
      }
    } finally {
      setIsLive(false);
      setStarting(false);
      hasShownSendErrorRef.current = false;
    }
  };

  const startTrip = async () => {
    if (!assignedBus) {
      Alert.alert('No bus assigned', 'No bus assigned. Contact admin.');
      return;
    }

    setStarting(true);

    // 1) Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setStarting(false);
      Alert.alert('Permission Required', 'Location permission is required to start live tracking.');
      return;
    }

    try {
      // 2) Start location tracking (no setInterval; watchPositionAsync only)
      trackingRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (location) => {
          try {
            const { latitude, longitude, speed, heading } = location.coords || {};

            // 3) Post to backend live update (NO busId in body; server uses assignedBus)
            await liveService.updateLiveLocation({
              lat: latitude,
              lng: longitude,
              speed: speed || 0,
              heading: heading || 0,
            });

            setLastUpdatedAt(new Date());
            hasShownSendErrorRef.current = false;
          } catch (error) {
            // Avoid alert spam every 5 seconds
            if (!hasShownSendErrorRef.current) {
              hasShownSendErrorRef.current = true;
              Alert.alert('Unable to fetch data. Please try again.');
            }

            // Stop tracking if updates are failing
            stopTrip();
          }
        }
      );

      setIsLive(true);
    } catch (error) {
      console.error('Start trip error:', error);
      Alert.alert('Unable to fetch data. Please try again.');
      stopTrip();
    } finally {
      setStarting(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTrip();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusColor = isLive ? colors.success : colors.textLight;
  const statusText = isLive ? 'LIVE' : 'OFFLINE';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="bus" size={22} color={colors.primary} />
            <Text style={styles.label}>Assigned Bus</Text>
          </View>
          <Text style={styles.value}>
            {assignedBus ? String(assignedBus) : 'No bus assigned. Contact admin.'}
          </Text>

          <View style={[styles.row, { marginTop: spacing.md }]}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>

          {lastUpdatedAt && (
            <Text style={styles.lastUpdated}>
              Last update: {lastUpdatedAt.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.startButton,
              (isLive || starting || !assignedBus) && styles.disabledButton,
            ]}
            onPress={startTrip}
            disabled={isLive || starting || !assignedBus}
            activeOpacity={0.8}
          >
            {starting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.actionText}>START TRIP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.stopButton,
              (!isLive || starting) && styles.disabledButton,
            ]}
            onPress={stopTrip}
            disabled={!isLive || starting}
            activeOpacity={0.8}
          >
            <Text style={styles.actionText}>STOP TRIP</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helperText}>
          Live tracking posts your GPS coordinates to the server every ~5 seconds while moving.
        </Text>
      </View>
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
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  value: {
    marginTop: spacing.sm,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusText: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lastUpdated: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.textLight,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: colors.primary,
  },
  stopButton: {
    backgroundColor: colors.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  helperText: {
    marginTop: spacing.lg,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default DriverDashboardScreen;

