import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const AdminDashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/driver-requests');
      setRequests(res.data || []);
    } catch (error) {
      console.error('Error loading driver requests:', error);
      Alert.alert('Error', 'Unable to load driver requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    setActionLoadingId(requestId);
    try {
      const endpoint =
        action === 'approve' ? '/admin/approve-driver' : '/admin/reject-driver';
      await apiClient.post(endpoint, { requestId });
      await loadRequests();
    } catch (error) {
      console.error(`Failed to ${action} driver:`, error);
      Alert.alert('Error', `Unable to ${action} driver`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            {user?.name} ({user?.email})
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Pending Driver Requests</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>No pending driver requests</Text>
          </View>
        ) : (
          requests.map((req, index) => (
            <View
              key={req._id || index}
              style={styles.requestCard}
            >
              <Text style={styles.requestTitle}>{req.operatorName}</Text>
              <Text style={styles.requestLine}>Bus: {req.busNumber}</Text>
              <Text style={styles.requestLine}>License: {req.licenseNumber}</Text>
              <Text style={styles.requestLine}>
                User: {req.userId?.name} ({req.userId?.email})
              </Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleAction(req._id, 'approve')}
                  disabled={actionLoadingId === req._id}
                >
                  {actionLoadingId === req._id ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.actionText}>Approve</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleAction(req._id, 'reject')}
                  disabled={actionLoadingId === req._id}
                >
                  <Text style={styles.actionText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  logoutButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  requestCard: {
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
  requestTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  requestLine: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  approveBtn: {
    backgroundColor: colors.success,
  },
  rejectBtn: {
    backgroundColor: colors.error,
  },
  actionText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default AdminDashboardScreen;

