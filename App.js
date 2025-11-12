import React, { useState, useEffect, createContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import HomeScreen from './screens/HomeScreen';
import MenuItemProgressScreen from './screens/MenuItemProgressScreen'; // Updated from ProgressScreen
import OrderItemScreen from './screens/OrderItemScreen'; // New Order Item Screen
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen'; // New Splash Screen
import SettingsScreen from './screens/SettingsScreen';

// Create Tab navigator
const Tab = createBottomTabNavigator();

// Create a Theme Context so screens can toggle dark/light mode easily
export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export default function App() {
  // Load theme preference from AsyncStorage
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('@theme');
        if (t) setTheme(t);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Toggle function saves preference
  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try { await AsyncStorage.setItem('@theme', next); } catch(e) {}
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <NavigationContainer theme={theme === 'light' ? DefaultTheme : DarkTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') iconName = 'home';
              else if (route.name === 'Menu Progress') iconName = 'stats-chart'; // Updated
              else if (route.name === 'Orders') iconName = 'cart'; // New icon for Orders
              else if (route.name === 'Profile') iconName = 'person';
              else if (route.name === 'Settings') iconName = 'settings';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1565C0',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Menu Progress" component={MenuItemProgressScreen} /> {/* Updated */}
          <Tab.Screen name="Orders" component={OrderItemScreen} /> {/* New */}
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}