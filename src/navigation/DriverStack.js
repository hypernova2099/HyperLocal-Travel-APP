import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverDashboardScreen from '../screens/DriverDashboardScreen';

const Stack = createNativeStackNavigator();

const DriverStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
    </Stack.Navigator>
  );
};

export default DriverStack;

