import {useState} from "react";
import {useNavigation, useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform} from 'react-native';

import SearchScreen from '../components/search';
import WordScreen from '../components/word';
import StarredListScreen from '../components/savedWords';
import FavoriteButton from "../components/word/favoriteButton";


const Stack = createStackNavigator();

export default function SearchNavigationScreen() {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <Stack.Navigator 
            initialRouteName="Search"
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.card,
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme.colors.border,
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTitleStyle: {
                    fontSize: 17,
                    fontWeight: '600',
                    color: theme.colors.text,
                },
                headerTintColor: theme.colors.primary,
                headerBackTitleVisible: false,
                headerLeftContainerStyle: {
                    paddingLeft: 16,
                },
                headerRightContainerStyle: {
                    paddingRight: 16,
                },
            }}
        >
            <Stack.Screen 
                name="Search"
                component={SearchScreen}
                options={{
                    title: 'Analysis',
                }}
            />
            <Stack.Screen 
                name="Word"
                component={WordScreen}
                options={({ route }) => ({
                    title: route.params?.title || 'Word Details',
                    headerRight: () => (
                        <FavoriteButton 
                            word={route.params?.component?.word} 
                            style={{
                                backgroundColor: 'transparent'
                            }}
                        />
                    ),
                })}
            />
        </Stack.Navigator>
    );
}

