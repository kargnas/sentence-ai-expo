import React from 'react';
import { View, Text } from 'react-native';
import SearchScreen from '../../components/search';

console.log('Search index: Loading search screen');

// Fallback component in case SearchScreen fails
function FallbackSearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search & Analysis</Text>
    </View>
  );
}

export default function SearchScreenWrapper() {
  try {
    return <SearchScreen />;
  } catch (error) {
    console.error('Error loading SearchScreen:', error);
    return <FallbackSearchScreen />;
  }
}