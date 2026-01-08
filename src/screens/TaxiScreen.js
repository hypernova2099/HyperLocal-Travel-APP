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
import { taxiService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const TaxiScreen = ({ navigation }) => {
  const [taxis, setTaxis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaxis();
  }, []);

  const loadTaxis = async () => {
    setLoading(true);
    try {
      const data = await taxiService.getTaxis();
      setTaxis(data);
    } catch (error) {
      console.error('Error loading taxis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (taxi) => {
    Alert.alert('Call Driver', `Calling ${taxi.driverName} at ${taxi.phone}...`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verified Taxis</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading taxis...</Text>
          </View>
        ) : (
          <>
            {taxis.map((taxi) => (
              <View key={taxi.id} style={styles.taxiCard}>
                <View style={styles.taxiInfo}>
                  <Text style={styles.driverName}>{taxi.driverName}</Text>
                  <Text style={styles.vehicle}>{taxi.vehicle}</Text>
                  <Text style={styles.vehicleNumber}>{taxi.vehicleNumber}</Text>
                  <View style={styles.detailsRow}>
                    <View style={styles.areaContainer}>
                      <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.area}>{taxi.area}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color={colors.warning} />
                      <Text style={styles.rating}>{taxi.rating}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(taxi)}
                >
                  <Ionicons name="call" size={20} color={colors.white} />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            ))}
            {taxis.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No taxis available</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  taxiCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taxiInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  vehicle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  vehicleNumber: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  area: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  callButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  callButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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

export default TaxiScreen;

