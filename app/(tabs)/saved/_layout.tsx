import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function SavedLayout() {
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
          title: 'Saved Words',
        }}
      />
      <Stack.Screen 
        name="word"
        options={{
          title: 'Word',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}