import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const EmergencyCard = ({ emergency, onCall }) => {
  const getIconName = () => {
    if (emergency.type === 'police') return 'shield';
    if (emergency.type === 'hospital') return 'medical';
    return 'flame';
  };

  const getIconColor = () => {
    if (emergency.type === 'police') return colors.policeBlue;
    if (emergency.type === 'hospital') return colors.hospitalRed;
    return colors.fireOrange;
  };

  const handleCall = () => {
    if (onCall) {
      onCall(emergency.phone);
    } else {
      Linking.openURL(`tel:${emergency.phone}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <Ionicons
          name={getIconName()}
          size={24}
          color={getIconColor()}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{emergency.name}</Text>
        <Text style={styles.distance}>
          {emergency.distance < 1000
            ? `${emergency.distance}m ${emergency.distanceMode || 'Walk'}`
            : `${(emergency.distance / 1000).toFixed(1)}km ${emergency.distanceMode || 'Walk'}`}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.callButton}
        onPress={handleCall}
        activeOpacity={0.7}
      >
        <Ionicons name="call-outline" size={16} color={getIconColor()} />
        <Text style={[styles.callText, { color: getIconColor() }]}>
          Call {emergency.phone}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  distance: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  callText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmergencyCard;

