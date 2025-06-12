import * as React from 'react';
import {StatusBar, Platform, useColorScheme} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SearchNavigationScreen from "./screens/SearchNavigationScreen";
import SavedWordNavigationScreen from "./screens/SavedWordNavigationScreen";
import {NavigationContainer, DarkTheme, DefaultTheme} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SettingNavigationScreen from "./screens/SettingNavigationScreen";
import {useCallback, useEffect, useState} from "react";
import {default as I18n, i18n, loadLocale} from "./util/i18n";

const iOSDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#007AFF',      // iOS blue
        background: '#000000',   // iOS dark background
        card: '#1C1C1E',        // iOS card background
        text: '#FFFFFF',        // Primary text
        border: '#38383A',      // iOS border color
        notification: '#FF453A', // iOS red
        surface: '#1C1C1E',     // Surface color
        onSurface: '#FFFFFF',   // Text on surface
        placeholder: '#8E8E93', // iOS placeholder gray
        secondaryText: '#8E8E93', // Secondary text color
        accent: '#30D158',      // iOS green
        warning: '#FF9500',     // iOS orange
    },
};

const iOSLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#007AFF',      // iOS blue
        background: '#FFFFFF',   // iOS light background
        card: '#F2F2F7',        // iOS light card background
        text: '#000000',        // Primary text
        border: '#C6C6C8',      // iOS light border color
        notification: '#FF3B30', // iOS red
        surface: '#FFFFFF',     // Surface color
        onSurface: '#000000',   // Text on surface
        placeholder: '#8E8E93', // iOS placeholder gray
        secondaryText: '#8E8E93', // Secondary text color
        accent: '#34C759',      // iOS green
        warning: '#FF9500',     // iOS orange
    },
};

const Tab = createBottomTabNavigator();

export default function App() {
    const [initialized, setInitialized] = React.useState(true);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const colorScheme = useColorScheme();
    
    // Choose theme based on system color scheme
    const theme = colorScheme === 'dark' ? iOSDarkTheme : iOSLightTheme;

    useEffect(() => {
        // Load locale
        if (initialized) {
            setInitialized(false);
            loadLocale();

            i18n.onChange(async () => {
                console.log('언어 변경: ', i18n.locale)
                forceUpdate();
            });
        }
    }, [initialized]);

    return (
        <>
            <StatusBar 
                barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"}
                backgroundColor={theme.colors.background}
                translucent={false}
            />
            <NavigationContainer theme={theme}>
                <Tab.Navigator 
                    initialRouteName="Search" 
                    screenOptions={{
                        tabBarStyle: {
                            backgroundColor: theme.colors.card,
                            borderTopColor: theme.colors.border,
                            borderTopWidth: 0.5,
                            height: Platform.OS === 'ios' ? 88 : 60,
                            paddingBottom: Platform.OS === 'ios' ? 25 : 8,
                            paddingTop: 8,
                        },
                        tabBarActiveTintColor: theme.colors.primary,
                        tabBarInactiveTintColor: theme.colors.secondaryText,
                        headerShown: false,
                        tabBarLabelStyle: {
                            fontSize: 10,
                            fontWeight: '500',
                        },
                    }}>
                    <Tab.Screen name="Search" component={SearchNavigationScreen}
                                options={{
                                    tabBarLabel: 'Analysis',
                                    tabBarIcon: ({ focused, color, size }) => (
                                        <FontAwesome5 
                                            name={'magic'} 
                                            size={focused ? 26 : 24} 
                                            color={color}
                                            style={{ opacity: focused ? 1 : 0.8 }}
                                        />
                                    ),
                                }}/>
                    <Tab.Screen name="SavedWords" component={SavedWordNavigationScreen}
                                options={{
                                    tabBarLabel: 'Saved',
                                    tabBarIcon: ({ focused, color, size }) => (
                                        <FontAwesome5 
                                            name={focused ? 'star' : 'star'} 
                                            size={focused ? 26 : 24} 
                                            color={color}
                                            style={{ opacity: focused ? 1 : 0.8 }}
                                        />
                                    ),
                                }}/>
                    <Tab.Screen name="Setting" component={SettingNavigationScreen}
                                options={{
                                    tabBarLabel: 'Settings',
                                    tabBarIcon: ({ focused, color, size }) => (
                                        <FontAwesome5 
                                            name={'cog'} 
                                            size={focused ? 26 : 24} 
                                            color={color}
                                            style={{ opacity: focused ? 1 : 0.8 }}
                                        />
                                    ),
                                }}/>
                </Tab.Navigator>
            </NavigationContainer>
        </>
    );
}

