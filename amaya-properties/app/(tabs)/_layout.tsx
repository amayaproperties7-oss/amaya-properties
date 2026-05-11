import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false, // Clean look by hiding individual tab headers
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
          marginBottom: 4,
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: theme.background,
            borderTopWidth: 0,
            height: 90,
            paddingTop: 10,
          },
          default: {
            backgroundColor: theme.card,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            height: 70,
            paddingBottom: 12,
            paddingTop: 8,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <IconSymbol size={24} name="house.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'PROPERTIES',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <IconSymbol size={24} name="building.2.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'SAVED',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <IconSymbol size={24} name="heart.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <IconSymbol size={24} name="person.fill" color={color} />
            </View>
          ),
        }}
      />
      {/* Hide screens that shouldn't be in the bottom tab */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="projects" options={{ href: null }} />
      <Tabs.Screen name="contact" options={{ href: null }} />
    </Tabs>
  );
}

const styles = {
  activeIcon: {
    paddingBottom: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  }
};
