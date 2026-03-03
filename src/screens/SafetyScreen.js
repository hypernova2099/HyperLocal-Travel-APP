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
      // Backend returns an array of emergency Place documents
      // Group them into hospitals / police / fire based on subtype
      const grouped = {
        hospitals: [],
        police: [],
        fire: [],
      };

      (data || []).forEach((place) => {
        const subtype = (place.subtype || '').toLowerCase();
        if (subtype === 'police') {
          grouped.police.push(place);
        } else if (subtype === 'fire') {
          grouped.fire.push(place);
        } else {
          grouped.hospitals.push(place);
        }
      });

      setEmergencyPoints(grouped);
    } catch (error) {
      console.error('Error loading emergency points:', error);
      if (error.response?.status === 404) {
        Alert.alert('Info', 'No emergency data available');
      } else {
        const errorMessage =
          error.userMessage ||
          error.response?.data?.message ||
          'Unable to fetch emergency points. Please try again.';
        Alert.alert('Error', errorMessage);
      }
      setEmergencyPoints({ hospitals: [], police: [], fire: [] });
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
            {emergencyPoints?.hospitals?.map((hospital, index) => (
              <EmergencyCard
                key={hospital._id || hospital.id || index}
                emergency={hospital}
                onCall={handleCall}
              />
            ))}
            {emergencyPoints?.police?.map((police, index) => (
              <EmergencyCard
                key={police._id || police.id || index}
                emergency={police}
                onCall={handleCall}
              />
            ))}
            {emergencyPoints?.fire?.map((fire, index) => (
              <EmergencyCard
                key={fire._id || fire.id || index}
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

