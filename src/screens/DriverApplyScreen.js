import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { driverService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const DriverApplyScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [busNumber, setBusNumber] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [routeId, setRouteId] = useState('');

  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const pendingKey = user?._id ? `driverApplyPending:${user._id}` : null;

  useEffect(() => {
    const loadPending = async () => {
      try {
        if (!pendingKey) return;
        const value = await AsyncStorage.getItem(pendingKey);
        setIsPending(value === 'true');
      } catch (e) {
        // ignore
      }
    };
    loadPending();
  }, [pendingKey]);

  const handleSubmit = async () => {
    if (!busNumber || !operatorName || !licenseNumber || !routeId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await driverService.apply({
        busNumber,
        operatorName,
        licenseNumber,
        routeId,
      });

      if (pendingKey) {
        await AsyncStorage.setItem(pendingKey, 'true');
      }
      setIsPending(true);

      Alert.alert('Success', 'Application submitted. Await admin approval.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.userMessage ||
        'Unable to fetch data. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply to Become Driver</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.note}>
            Fill the details below to submit your driver verification request.
          </Text>

          {isPending && (
            <View style={styles.pendingBanner}>
              <Ionicons name="time-outline" size={18} color={colors.warning} />
              <Text style={styles.pendingText}>
                Your request is pending approval. You can’t submit again right now.
              </Text>
            </View>
          )}

          <Text style={styles.label}>Bus Number</Text>
          <TextInput
            style={styles.input}
            value={busNumber}
            onChangeText={setBusNumber}
            placeholder="e.g., KL-07-AB-1234"
            placeholderTextColor={colors.textLight}
            editable={!isPending && !loading}
          />

          <Text style={styles.label}>Operator Name</Text>
          <TextInput
            style={styles.input}
            value={operatorName}
            onChangeText={setOperatorName}
            placeholder="e.g., Shalom Bus Services"
            placeholderTextColor={colors.textLight}
            editable={!isPending && !loading}
          />

          <Text style={styles.label}>License Number</Text>
          <TextInput
            style={styles.input}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="e.g., LIC123456"
            placeholderTextColor={colors.textLight}
            editable={!isPending && !loading}
          />

          <Text style={styles.label}>Route ID</Text>
          <TextInput
            style={styles.input}
            value={routeId}
            onChangeText={setRouteId}
            placeholder="Paste routeId from admin/DB"
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
            editable={!isPending && !loading}
          />

          <TouchableOpacity
            style={[styles.button, (isPending || loading) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isPending || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Submit Application</Text>
            )}
          </TouchableOpacity>
        </View>
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
    fontSize: 18,
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
  },
  note: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  pendingBanner: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.taxiCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  pendingText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DriverApplyScreen;

