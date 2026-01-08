import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const PaymentScreen = ({ route, navigation }) => {
  const { bus, fare, from, to } = route.params || {};

  // Handle UPI payment
  const handleUPIPayment = () => {
    if (!fare) {
      Alert.alert('Error', 'Invalid fare amount');
      return;
    }

    // UPI deep link format: upi://pay?pa=<upi-id>&pn=<payee-name>&am=<amount>&cu=<currency>&tn=<transaction-note>
    const upiId = 'yourupiid@oksbi'; // Replace with actual UPI ID
    const payeeName = 'SmartDistrictTravel';
    const amount = fare.toString();
    const currency = 'INR';
    const transactionNote = 'Bus Ticket';

    // Encode the transaction note for URL
    const encodedNote = encodeURIComponent(transactionNote);

    const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=${currency}&tn=${encodedNote}`;

    // Try to open UPI app
    Linking.canOpenURL(upiUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(upiUrl);
        } else {
          Alert.alert(
            'UPI Not Available',
            'No UPI app found. Please install a UPI app like PhonePe, Google Pay, or Paytm.'
          );
        }
      })
      .catch((err) => {
        console.error('Error opening UPI:', err);
        Alert.alert('Error', 'Failed to open UPI app');
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
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>From</Text>
                <Text style={styles.summaryValue}>{from || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-down" size={20} color={colors.textSecondary} />
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>To</Text>
                <Text style={styles.summaryValue}>{to || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bus Details */}
        {bus && (
          <View style={styles.busCard}>
            <View style={styles.busCardHeader}>
              <View style={styles.busIconContainer}>
                <Ionicons name="bus" size={24} color={colors.primary} />
              </View>
              <View style={styles.busInfo}>
                <Text style={styles.busName}>{bus.name || 'Bus'}</Text>
                <Text style={styles.busOperator}>
                  {bus.operatorType === 'private' ? 'Private Operator' : 'Public Operator'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Fare Details */}
        <View style={styles.fareCard}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Fare</Text>
            <Text style={styles.fareAmount}>₹{fare || 0}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodTitle}>Payment Method</Text>
          <View style={styles.upiOption}>
            <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
            <Text style={styles.upiText}>UPI</Text>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleUPIPayment}
          activeOpacity={0.7}
        >
          <Ionicons name="wallet-outline" size={24} color={colors.white} />
          <Text style={styles.payButtonText}>Pay with UPI</Text>
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          You will be redirected to your UPI app to complete the payment
        </Text>
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
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    marginBottom: spacing.xs,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: spacing.xs,
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
  fareCard: {
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
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentMethodCard: {
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
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  upiOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
  },
  upiText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  payButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default PaymentScreen;

