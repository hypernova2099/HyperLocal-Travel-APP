import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dayPlanService } from '../api/services';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import TimelineStopItem from '../components/TimelineStopItem';

const DayPlanScreen = ({ navigation }) => {
  const [duration, setDuration] = useState('halfDay');
  const [interests, setInterests] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const interestOptions = [
    { id: 'beach', label: 'Beach' },
    { id: 'backwaters', label: 'Backwaters' },
    { id: 'food', label: 'Food' },
    { id: 'culture', label: 'Culture' },
    { id: 'shopping', label: 'Shopping' },
  ];

  const toggleInterest = (interestId) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter((id) => id !== interestId));
    } else {
      setInterests([...interests, interestId]);
    }
  };

  const handleGeneratePlan = async () => {
    if (interests.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const data = await dayPlanService.generatePlan({ duration, interests });
      setPlan(data);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>Day Planner</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Duration Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationContainer}>
            <TouchableOpacity
              style={[
                styles.durationButton,
                duration === 'halfDay' && styles.durationButtonActive,
              ]}
              onPress={() => setDuration('halfDay')}
            >
              <Text
                style={[
                  styles.durationButtonText,
                  duration === 'halfDay' && styles.durationButtonTextActive,
                ]}
              >
                Half-day
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.durationButton,
                duration === 'fullDay' && styles.durationButtonActive,
              ]}
              onPress={() => setDuration('fullDay')}
            >
              <Text
                style={[
                  styles.durationButtonText,
                  duration === 'fullDay' && styles.durationButtonTextActive,
                ]}
              >
                Full-day
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {interestOptions.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestChip,
                  interests.includes(interest.id) && styles.interestChipActive,
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Text
                  style={[
                    styles.interestChipText,
                    interests.includes(interest.id) && styles.interestChipTextActive,
                  ]}
                >
                  {interest.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            (interests.length === 0 || loading) && styles.generateButtonDisabled,
          ]}
          onPress={handleGeneratePlan}
          disabled={interests.length === 0 || loading}
        >
          <Text style={styles.generateButtonText}>
            {loading ? 'Generating Plan...' : 'Generate Plan'}
          </Text>
        </TouchableOpacity>

        {/* Generated Plan */}
        {plan && plan.length > 0 && (
          <View style={styles.planContainer}>
            <Text style={styles.planTitle}>Your Day Plan</Text>
            {plan.map((item, index) => (
              <TimelineStopItem
                key={item.id}
                stop={{
                  name: item.name,
                  time: item.time,
                  distance: undefined,
                }}
                isActive={false}
                isCompleted={false}
                isLast={index === plan.length - 1}
              />
            ))}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  durationButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  durationButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  durationButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  durationButtonTextActive: {
    color: colors.white,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  interestChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  interestChipTextActive: {
    color: colors.white,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  planContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});

export default DayPlanScreen;

