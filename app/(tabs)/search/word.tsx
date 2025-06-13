import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import WordScreen from '../../components/word';

export default function WordScreenWrapper() {
  const params = useLocalSearchParams();
  
  // Parse the component string back to object
  let parsedComponent = params.component;
  if (typeof parsedComponent === 'string') {
    try {
      parsedComponent = JSON.parse(parsedComponent);
    } catch (error) {
      console.error('Error parsing component:', error);
    }
  }
  
  // Convert expo-router params to React Navigation format
  const routeProps = {
    route: {
      params: {
        ...params,
        component: parsedComponent
      }
    }
  };
  
  return <WordScreen {...routeProps} />;
}