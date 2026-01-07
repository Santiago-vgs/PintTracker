import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';

// Screens - we'll create these next
import HomeScreen from '../screens/HomeScreen';
import LogScreen from '../screens/LogScreen';
import HistoryScreen from '../screens/HistoryScreen';
import RecapScreen from '../screens/RecapScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.card,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
          },
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.text,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            headerTitle: 'Pint Tracker',
          }}
        />
        <Tab.Screen
          name="Log"
          component={LogScreen}
          options={{
            tabBarLabel: 'Log',
            headerTitle: 'Log Drinks',
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
            headerTitle: 'Session History',
          }}
        />
        <Tab.Screen
          name="Recap"
          component={RecapScreen}
          options={{
            tabBarLabel: 'Recap',
            headerTitle: '2026 Recap',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Settings',
            headerTitle: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
