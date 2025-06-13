import React from 'react';
import { View, Text } from 'react-native';
import SavedWordsScreen from '../../../components/savedWords';

console.log('Saved index: Loading saved words screen');

// Fallback component in case SavedWordsScreen fails
function FallbackSavedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Saved Words</Text>
    </View>
  );
}

export default function SavedScreen() {
  try {
    return <SavedWordsScreen />;
  } catch (error) {
    console.error('Error loading SavedWordsScreen:', error);
    return <FallbackSavedScreen />;
  }
}