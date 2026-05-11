import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SavedPropertiesProvider } from '@/context/SavedPropertiesContext';
import { InterestProvider } from '@/context/InterestContext';
import { VisitProvider } from '@/context/VisitContext';
import { useColorScheme } from '@/hooks/useColorScheme';

import { PropertyProvider } from '@/context/PropertyContext';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, hasPreferences, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inPreferences = segments[0] === 'preferences';

    if (!user) {
      // if (inAuthGroup || inPreferences) {
      //   // Not logged in, redirect away from protected routes to login
      //   router.replace('/login');
      // }
    } else {
      if (!hasPreferences) {
        if (!inPreferences) {
          // Logged in but no preferences set, redirect to preferences
          router.replace('/preferences');
        }
      } else {
        if (!inAuthGroup) {
          // Logged in with preferences, redirect to main app
          router.replace('/(tabs)');
        }
      }
    }
  }, [user, hasPreferences, isLoading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="property/[id]" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="interested-properties" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="schedule-visit" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <SavedPropertiesProvider>
          <InterestProvider>
            <VisitProvider>
              <RootLayoutNav />
            </VisitProvider>
          </InterestProvider>
        </SavedPropertiesProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}
