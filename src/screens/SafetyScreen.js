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
import { safetyService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import EmergencyCard from '../components/EmergencyCard';

const SafetyScreen = ({ navigation }) => {
  const [emergencyPoints, setEmergencyPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmergencyPoints();
  }, []);

  const loadEmergencyPoints = async () => {
    setLoading(true);
    try {
      const data = await safetyService.getEmergencyPoints();
      setEmergencyPoints(data);
    } catch (error) {
      console.error('Error loading emergency points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = () => {
    Alert.alert(
      'SOS Emergency',
      'This will alert nearby emergency services. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Emergency',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Emergency Alert', 'Emergency services have been notified');
          },
        },
      ]
    );
  };

  const handleCall = (phone) => {
    Alert.alert('Call', `Calling ${phone}...`);
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Safety</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Numbers Banner */}
        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyBannerTitle}>Emergency Numbers</Text>
          <Text style={styles.emergencyBannerText}>
            Police: 100 • Ambulance: 108 • Fire: 101
          </Text>
        </View>

        {/* Nearby Emergency Points */}
        <Text style={styles.sectionTitle}>Nearby Emergency Points</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading emergency points...</Text>
          </View>
        ) : (
          <>
            {emergencyPoints?.hospitals?.map((hospital) => (
              <EmergencyCard
                key={hospital.id}
                emergency={hospital}
                onCall={handleCall}
              />
            ))}
            {emergencyPoints?.police?.map((police) => (
              <EmergencyCard
                key={police.id}
                emergency={police}
                onCall={handleCall}
              />
            ))}
            {emergencyPoints?.fire?.map((fire) => (
              <EmergencyCard
                key={fire.id}
                emergency={fire}
                onCall={handleCall}
              />
            ))}
          </>
        )}

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Ionicons name="alert-circle" size={24} color={colors.white} />
          <Text style={styles.sosButtonText}>SOS – Emergency Help</Text>
        </TouchableOpacity>
        <Text style={styles.sosSubtitle}>
          Tap to alert nearby emergency services
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
  appBar: {
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
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  emergencyBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  emergencyBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  emergencyBannerText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sosButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sosButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  sosSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default SafetyScreen;

