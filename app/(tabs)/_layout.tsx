import { Platform } from 'react-native';
import { Tabs as ExpoTabs } from 'expo-router';
import { withLayoutContext } from 'expo-router';

let Tabs: any;

if (Platform.OS === 'web') {
  Tabs = ExpoTabs;
} else {
  const { createNativeBottomTabNavigator } = require('@bottom-tabs/react-navigation');
  const { Navigator } = createNativeBottomTabNavigator();
  Tabs = withLayoutContext(Navigator);
}

export default function TabLayout() {
  console.log('TabLayout: Rendering tabs layout');
  
  if (Platform.OS === 'web') {
    return (
      <ExpoTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'rgba(28, 28, 30, 0.9)',
          },
          tabBarActiveTintColor: '#007AFF',
          headerShown: false,
        }}
      >
        <ExpoTabs.Screen
          name="search"
          options={{
            title: 'Analysis',
          }}
        />
        <ExpoTabs.Screen
          name="saved"
          options={{
            title: 'Saved',
          }}
        />
        <ExpoTabs.Screen
          name="settings"
          options={{
            title: 'Settings',
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
          tabBarIcon: () => ({ 
            sfSymbol: 'wand.and.stars.inverse'
          }),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: () => ({ 
            sfSymbol: 'star.fill'
          }),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => ({ 
            sfSymbol: 'gearshape.fill'
          }),
        }}
      />
    </Tabs>
  );
}
