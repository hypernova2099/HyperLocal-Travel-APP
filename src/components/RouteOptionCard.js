import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const RouteOptionCard = ({ route, onPress }) => {
  const getCardColor = () => {
    if (route.mode === 'bus') return colors.busCard;
    if (route.mode === 'metro') return colors.metroCard;
    return colors.taxiCard;
  };

  const getModeIcon = () => {
    if (route.mode === 'bus') return 'bus';
    if (route.mode === 'metro') return 'train';
    return 'car';
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: getCardColor() }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.modeContainer}>
          <Ionicons
            name={getModeIcon()}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.modeLabel}>
            {route.mode === 'bus' ? 'Bus' : route.mode === 'metro' ? 'Metro' : 'Auto/Taxi'}
          </Text>
        </View>
        {route.frequency && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{route.frequency}</Text>
          </View>
        )}
      </View>

      <Text style={styles.lineName}>{route.lineName}</Text>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{route.duration} min</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>₹{route.fare}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'capitalize',
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
  lineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  details: {
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
  },
});

export default RouteOptionCard;

