import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import DriverStack from './DriverStack';
import AdminNavigator from './AdminNavigator';
import { colors } from '../theme/colors';

const RootNavigator = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        user?.role === 'admin'
          ? <AdminNavigator />
          : user?.role === 'driver'
          ? <DriverStack />
          : <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;

