import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function SettingsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '600',
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen 
        name="learning-language"
        options={{
          title: 'Studying Language',
        }}
      />
      <Stack.Screen 
        name="language"
        options={{
          title: 'App Language',
        }}
      />
      <Stack.Screen 
        name="gpt-version"
        options={{
          title: 'AI Version',
        }}
      />
      <Stack.Screen 
        name="voice"
        options={{
          title: 'Voice Settings',
        }}
      />
    </Stack>
  );
}