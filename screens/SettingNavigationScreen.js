import {useState} from "react";
import {useNavigation, useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform} from 'react-native';

import SearchScreen from '../components/search';
import WordScreen from '../components/word';
import StarredListScreen from '../components/savedWords';
import FavoriteButton from "../components/word/favoriteButton";
import Setting from "../components/setting";
import LearningLanguage from "../components/setting/learningLanguage";
import Language from "../components/setting/language";
import GptVersion from "../components/setting/gptVersion";
import Voice from "../components/setting/voice";


const Stack = createStackNavigator();

export default function SettingNavigationScreen() {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <Stack.Navigator 
            initialRouteName="Setting"
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
                name="Setting"
                component={Setting}
                options={{
                    title: 'Settings',
                }}
            />
            <Stack.Screen 
                name="LearningLanguage"
                component={LearningLanguage}
                options={{
                    title: 'Studying Language',
                }}
            />
            <Stack.Screen 
                name="Language"
                component={Language}
                options={{
                    title: 'App Language',
                }}
            />
            <Stack.Screen 
                name="GptVersion"
                component={GptVersion}
                options={{
                    title: 'AI Version',
                }}
            />
            <Stack.Screen 
                name="Voice"
                component={Voice}
                options={{
                    title: 'Voice',
                }}
            />
        </Stack.Navigator>
    );
}

