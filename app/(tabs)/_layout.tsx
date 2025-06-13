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
    <Tabs>
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