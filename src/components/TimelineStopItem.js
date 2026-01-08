import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const TimelineStopItem = ({ stop, isActive, isCompleted, isLast }) => {
  const getIconName = () => {
    if (isCompleted) return 'checkmark-circle';
    if (isActive) return 'radio-button-on';
    return 'ellipse-outline';
  };

  const getIconColor = () => {
    if (isCompleted) return colors.success;
    if (isActive) return colors.primary;
    return colors.textLight;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={getIconName()}
          size={24}
          color={getIconColor()}
        />
        {!isLast && (
          <View
            style={[
              styles.line,
              isCompleted && { backgroundColor: colors.success },
              isActive && { backgroundColor: colors.primary },
            ]}
          />
        )}
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.stopName,
            isActive && styles.activeStopName,
          ]}
        >
          {stop.name}
        </Text>
        <Text style={styles.stopTime}>{stop.time}</Text>
        {stop.distance !== undefined && (
          <Text style={styles.stopDistance}>
            {stop.distance === 0 ? 'Start Point' : `${stop.distance} km from start`}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.textLight,
    marginTop: spacing.xs,
    minHeight: 40,
  },
  content: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  activeStopName: {
    color: colors.primary,
    fontWeight: '700',
  },
  stopTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stopDistance: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default TimelineStopItem;

