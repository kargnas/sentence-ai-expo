import * as React from 'react';
import {StatusBar, Platform, useColorScheme} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SearchNavigationScreen from "./screens/SearchNavigationScreen";
import SavedWordNavigationScreen from "./screens/SavedWordNavigationScreen";
import {NavigationContainer, DarkTheme, DefaultTheme} from "@react-navigation/native";
import SettingNavigationScreen from "./screens/SettingNavigationScreen";
import {useCallback, useEffect, useState} from "react";
import {default as I18n, i18n, loadLocale} from "./util/i18n";

// Try to import native bottom tabs, fallback to regular tabs if not available
let Tab;
let isNativeTabsAvailable = false;

try {
    // Try direct import first
    const RNCTabView = require('react-native-bottom-tabs').default;
    console.log('✅ Native bottom tabs core library loaded');
    
    // Fallback to adapter
    const { createNativeBottomTabNavigator } = require('@bottom-tabs/react-navigation');
    Tab = createNativeBottomTabNavigator();
    isNativeTabsAvailable = true;
    console.log('✅ Native bottom tabs adapter loaded successfully');
} catch (error) {
    console.log('❌ Native bottom tabs not available, using regular tabs:', error.message);
    const { createBottomTabNavigator } = require("@react-navigation/bottom-tabs");
    Tab = createBottomTabNavigator();
}

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


export default function App() {
    const [initialized, setInitialized] = React.useState(true);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const colorScheme = useColorScheme();
    
    // Choose theme based on system color scheme
    const theme = colorScheme === 'dark' ? iOSDarkTheme : iOSLightTheme;
    
    // Check if we're using native tabs
    const isNativeTabs = isNativeTabsAvailable;
    
    console.log('Using native bottom tabs:', isNativeTabs);

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
                    screenOptions={isNativeTabs ? {
                        headerShown: false,
                    } : {
                        tabBarStyle: {
                            backgroundColor: theme.colors.card,
                            borderTopColor: 'transparent',
                            borderTopWidth: 0,
                            height: Platform.OS === 'ios' ? 88 : 60,
                            paddingBottom: Platform.OS === 'ios' ? 25 : 8,
                            paddingTop: 8,
                            position: 'absolute',
                            elevation: 0,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: -2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                        },
                        tabBarActiveTintColor: theme.colors.primary,
                        tabBarInactiveTintColor: theme.colors.secondaryText,
                        headerShown: false,
                        tabBarLabelStyle: {
                            fontSize: 10,
                            fontWeight: '600',
                        },
                        tabBarItemStyle: {
                            paddingVertical: 5,
                        },
                    }}>
                    <Tab.Screen name="Search" component={SearchNavigationScreen}
                                options={isNativeTabs ? {
                                    title: 'Analysis',
                                    tabBarIcon: ({ focused }) => ({ 
                                        sfSymbol: focused ? 'wand.and.stars.inverse' : 'wand.and.stars'
                                    }),
                                } : {
                                    tabBarLabel: 'Analysis',
                                    tabBarIcon: ({ focused, color, size }) => (
                                        <FontAwesome5 
                                            name={'magic'} 
                                            size={focused ? 28 : 24} 
                                            color={color}
                                            style={{ 
                                                opacity: focused ? 1 : 0.6,
                                                transform: [{ scale: focused ? 1.1 : 1 }]
                                            }}
                                        />
                                    ),
                                }}/>
                    <Tab.Screen name="SavedWords" component={SavedWordNavigationScreen}
                                options={isNativeTabs ? {
                                    title: 'Saved',
                                    tabBarIcon: ({ focused }) => ({ 
                                        sfSymbol: focused ? 'star.fill' : 'star'
                                    }),
                                } : {
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
                                options={isNativeTabs ? {
                                    title: 'Settings',
                                    tabBarIcon: ({ focused }) => ({ 
                                        sfSymbol: focused ? 'gearshape.fill' : 'gearshape'
                                    }),
                                } : {
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

