import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bookingService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { busName, busId, routeId, fromStop, toStop } = route.params || {};
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!busId || !routeId || !fromStop || !toStop) {
      Alert.alert('Error', 'Missing booking details. Please go back and try again.');
      return;
    }

    setSubmitting(true);
    try {
      const booking = await bookingService.createBooking({
        busId,
        routeId,
        fromStop,
        toStop,
      });

      Alert.alert('Success', 'Your ticket has been booked!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      console.log('Booking created:', booking?._id);
    } catch (error) {
      console.error('Error creating booking:', error);
      const message =
        error.userMessage ||
        error.response?.data?.message ||
        'Unable to create booking. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Bus</Text>
          <Text style={styles.value}>{busName || busId}</Text>

          <Text style={styles.label}>From</Text>
          <Text style={styles.value}>{fromStop}</Text>

          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>{toStop}</Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
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
    gap: spacing.lg,
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
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  value: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BookingConfirmationScreen;

