import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tripService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const PrivateBusOptionsScreen = ({ route, navigation }) => {
  const { routeId, from, to } = route.params || {};
  const [busOptions, setBusOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusOptions();
  }, []);

  const loadBusOptions = async () => {
    if (!routeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await tripService.getPrivateBusOptions({
        routeId,
        fromStop: from,
        toStop: to,
      });
      setBusOptions(data);
    } catch (error) {
      console.error('Error loading bus options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = (bus) => {
    // Navigate to PaymentScreen with bus details
    navigation.navigate('Payment', {
      bus,
      fare: bus.fare,
      from,
      to,
    });
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
          <Text style={styles.headerTitle}>Private Bus Options</Text>
          <Text style={styles.headerSubtitle}>
            {from} → {to}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading buses...</Text>
          </View>
        ) : busOptions && busOptions.buses ? (
          <>
            {busOptions.buses.map((bus) => (
              <TouchableOpacity
                key={bus._id}
                style={styles.busCard}
                onPress={() => handleBusSelect(bus)}
                activeOpacity={0.7}
              >
                <View style={styles.busCardHeader}>
                  <View style={styles.busIconContainer}>
                    <Ionicons name="bus" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.busInfo}>
                    <Text style={styles.busName}>{bus.name}</Text>
                    <Text style={styles.busOperator}>
                      {bus.operatorType === 'private' ? 'Private Operator' : 'Public Operator'}
                    </Text>
                  </View>
                </View>

                <View style={styles.busDetails}>
                  <View style={styles.busDetailItem}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.busDetailText}>
                      Every {bus.frequencyMinutes} min
                    </Text>
                  </View>
                  <View style={styles.busDetailItem}>
                    <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.busFare}>₹{bus.fare}</Text>
                  </View>
                </View>

                <View style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Select Bus</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No buses available</Text>
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
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  busCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  busCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  busIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.busCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  busInfo: {
    flex: 1,
  },
  busName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  busOperator: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  busDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  busDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  busDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  busFare: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
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

export default PrivateBusOptionsScreen;

