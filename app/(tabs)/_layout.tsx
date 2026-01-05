import { Platform } from 'react-native';
import { Tabs as ExpoTabs } from 'expo-router';
import { withLayoutContext } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let Tabs: any;

if (Platform.OS === 'web' || Platform.OS === 'android') {
  Tabs = ExpoTabs;
} else {
  const { createNativeBottomTabNavigator } = require('@bottom-tabs/react-navigation');
  const { Navigator } = createNativeBottomTabNavigator();
  Tabs = withLayoutContext(Navigator);
}

const ANDROID_TABBAR_GESTURE_INSET_FALLBACK = 24;
const ANDROID_TABBAR_BASE_PADDING_BOTTOM = 14;
const ANDROID_TABBAR_MIN_HEIGHT = 64;

export default function TabLayout() {
  console.log('TabLayout: Rendering tabs layout');
  const insets = useSafeAreaInsets();

  const androidBottomInset =
    Platform.OS === 'android'
      ? Math.max(insets.bottom, ANDROID_TABBAR_GESTURE_INSET_FALLBACK)
      : insets.bottom;
  
  if (Platform.OS === 'web' || Platform.OS === 'android') {
    return (
      <ExpoTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'rgba(28, 28, 30, 0.95)',
            borderTopColor: '#38383A',
            paddingTop: 8,
            paddingBottom:
              Platform.OS === 'android'
                ? ANDROID_TABBAR_BASE_PADDING_BOTTOM + androidBottomInset
                : 0,
            minHeight: Platform.OS === 'android' ? ANDROID_TABBAR_MIN_HEIGHT : undefined,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            marginBottom: Platform.OS === 'android' ? 4 : 0,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: false,
        }}
      >
        <ExpoTabs.Screen
          name="search"
          options={{
            title: 'Analysis',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sparkles" size={size} color={color} />
            ),
          }}
        />
        <ExpoTabs.Screen
          name="saved"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star" size={size} color={color} />
            ),
          }}
        />
        <ExpoTabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </ExpoTabs>
    );
  }
  
  return (
    <Tabs
      screenOptions={{
        translucent: true,
        scrollEdgeAppearance: 'transparent',
        tabBarStyle: {
          backgroundColor: 'rgba(28, 28, 30, 0.7)',
        },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'Analysis',
          tabBarIcon: () => ({ sfSymbol: 'wand.and.stars.inverse' }),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: () => ({ sfSymbol: 'star.fill' }),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => ({ sfSymbol: 'gearshape.fill' }),
        }}
      />
    </Tabs>
  );
}
