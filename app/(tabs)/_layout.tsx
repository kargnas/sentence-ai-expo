import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { withLayoutContext } from 'expo-router';

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