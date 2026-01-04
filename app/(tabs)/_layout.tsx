import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { withLayoutContext } from 'expo-router';
import { Platform } from 'react-native';

// Create the native tab navigator
const { Navigator } = createNativeBottomTabNavigator();

// Make it compatible with Expo Router's Layouts using withLayoutContext
// @ts-ignore - Expo Router withLayoutContext typing issue
const Tabs = withLayoutContext(Navigator);

export default function TabLayout() {
  console.log('TabLayout: Rendering tabs layout');
  
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
          tabBarIcon: () => Platform.select({
            ios: { sfSymbol: 'wand.and.stars.inverse' },
            android: { name: 'auto-fix', type: 'material-community' },
            default: { name: 'auto-fix', type: 'material-community' },
          }),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: () => Platform.select({
            ios: { sfSymbol: 'star.fill' },
            android: { name: 'star', type: 'material-community' },
            default: { name: 'star', type: 'material-community' },
          }),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => Platform.select({
            ios: { sfSymbol: 'gearshape.fill' },
            android: { name: 'cog', type: 'material-community' },
            default: { name: 'cog', type: 'material-community' },
          }),
        }}
      />
    </Tabs>
  );
}