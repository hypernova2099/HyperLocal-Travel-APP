import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PlanTripScreen from '../screens/PlanTripScreen';
import RouteOptionsScreen from '../screens/RouteOptionsScreen';
import PrivateBusOptionsScreen from '../screens/PrivateBusOptionsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import BusSearchScreen from '../screens/BusSearchScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SafetyScreen from '../screens/SafetyScreen';
import TaxiScreen from '../screens/TaxiScreen';
import DayPlanScreen from '../screens/DayPlanScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack (includes Plan Trip flow)
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PlanTrip" 
        component={PlanTripScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="RouteOptions" 
        component={RouteOptionsScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="PrivateBusOptions" 
        component={PrivateBusOptionsScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="LiveTracking" 
        component={LiveTrackingScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="BusSearch" 
        component={BusSearchScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="Safety" 
        component={SafetyScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="Taxis" 
        component={TaxiScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="DayPlan" 
        component={DayPlanScreen}
        options={{ 
          headerShown: false,
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
};

// Explore Stack
const ExploreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ExploreMain" 
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Safety Stack
const SafetyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SafetyMain" 
        component={SafetyScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Taxi Stack
const TaxiStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TaxiMain" 
        component={TaxiScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Day Plan Stack
const DayPlanStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DayPlanMain" 
        component={DayPlanScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Safety') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Taxis') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'DayPlan') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.cardBorder,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Explore" component={ExploreStack} />
      <Tab.Screen name="Safety" component={SafetyStack} />
      <Tab.Screen name="Taxis" component={TaxiStack} />
      <Tab.Screen name="DayPlan" component={DayPlanStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator;

