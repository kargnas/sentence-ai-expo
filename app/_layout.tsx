import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { loadLocale, i18n } from '../util/i18n';
import * as Linking from 'expo-linking';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const iOSDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#007AFF',      // iOS blue
    background: '#000000',   // iOS dark background
    card: '#1C1C1E',        // iOS card background
    text: '#FFFFFF',        // Primary text
    border: '#38383A',      // iOS border color
    notification: '#FF453A', // iOS red
    surface: '#1C1C1E',     // Surface color
    onSurface: '#FFFFFF',   // Text on surface
    placeholder: '#8E8E93', // iOS placeholder gray
    secondaryText: '#8E8E93', // Secondary text color
    accent: '#30D158',      // iOS green
    warning: '#FF9500',     // iOS orange
  },
};

const iOSLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',      // iOS blue
    background: '#FFFFFF',   // iOS light background
    card: '#F2F2F7',        // iOS light card background
    text: '#000000',        // Primary text
    border: '#C6C6C8',      // iOS light border color
    notification: '#FF3B30', // iOS red
    surface: '#FFFFFF',     // Surface color
    onSurface: '#000000',   // Text on surface
    placeholder: '#8E8E93', // iOS placeholder gray
    secondaryText: '#8E8E93', // Secondary text color
    accent: '#34C759',      // iOS green
    warning: '#FF9500',     // iOS orange
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? iOSDarkTheme : iOSLightTheme;
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('RootLayout: Starting initialization...');
    
    const initializeApp = async () => {
      try {
        // Load localization
        await loadLocale();
        console.log('RootLayout: Localization loaded successfully');
        
        setInitialized(true);
        await SplashScreen.hideAsync();
        console.log('RootLayout: Initialization completed');
      } catch (error) {
        console.error('RootLayout: Error during initialization:', error);
        // Initialize anyway to prevent black screen
        setInitialized(true);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
    
    // Setup i18n change listener
    const unsubscribe = i18n.onChange(() => {
      console.log('Language changed: ', i18n.locale);
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  console.log('RootLayout: Rendering, initialized:', initialized);

  // Always render - don't block on initialization
  // if (!initialized) {
  //   console.log('RootLayout: Still initializing, showing null');
  //   return null;
  // }

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}