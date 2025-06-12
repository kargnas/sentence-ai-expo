import {useState} from "react";
import {useNavigation, useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform, TouchableOpacity, Text} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import SearchScreen from '../components/search';
import WordScreen from '../components/word';
import StarredListScreen from '../components/savedWords';
import FavoriteButton from "../components/word/favoriteButton";
import SavedWords from "../components/savedWords";


const Stack = createStackNavigator();

export default function SavedWordNavigationScreen() {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <Stack.Navigator 
            initialRouteName="SavedWords"
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
                name="SavedWords"
                component={SavedWords}
                options={{
                    title: 'Saved Words',
                    headerRight: () => {
                        const navigation = useNavigation();
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.setParams({ refresh: Date.now() })
                                }}
                                style={{ padding: 4 }}
                            >
                                <FontAwesome5 
                                    name="sync-alt" 
                                    size={18} 
                                    color={theme.colors.primary} 
                                />
                            </TouchableOpacity>
                        )
                    },
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

