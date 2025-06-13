import React from 'react';
import { View, Text } from 'react-native';
import SettingScreen from '../../components/setting';

console.log('Settings index: Loading settings screen');

// Fallback component in case SettingScreen fails
function FallbackSettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings</Text>
    </View>
  );
}

export default function SettingsScreen() {
  try {
    return <SettingScreen />;
  } catch (error) {
    console.error('Error loading SettingScreen:', error);
    return <FallbackSettingsScreen />;
  }
}