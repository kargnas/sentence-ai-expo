import {
    adaptNavigationTheme,
    MD3DarkTheme as DefaultTheme,
    PaperProvider,
} from 'react-native-paper';

import * as React from 'react';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SearchNavigationScreen from "./screens/SearchNavigationScreen";
import SavedWordNavigationScreen from "./screens/SavedWordNavigationScreen";
import {NavigationContainer} from "@react-navigation/native";
import {createMaterialBottomTabNavigator} from "react-native-paper/react-navigation";
import SettingNavigationScreen from "./screens/SettingNavigationScreen";
import {useCallback, useEffect, useState} from "react";
import {default as I18n, i18n, loadLocale} from "./util/i18n";

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        primary: "rgb(165, 200, 255)",
        onPrimary: "rgb(0, 49, 95)",
        primaryContainer: "rgb(0, 71, 134)",
        onPrimaryContainer: "rgb(212, 227, 255)",
        secondary: "rgb(188, 199, 220)",
        onSecondary: "rgb(39, 49, 65)",
        secondaryContainer: "rgb(61, 71, 88)",
        onSecondaryContainer: "rgb(216, 227, 248)",
        tertiary: "rgb(99, 211, 255)",
        onTertiary: "rgb(0, 53, 69)",
        tertiaryContainer: "rgb(0, 77, 99)",
        onTertiaryContainer: "rgb(188, 233, 255)",
        error: "rgb(255, 180, 171)",
        onError: "rgb(105, 0, 5)",
        errorContainer: "rgb(147, 0, 10)",
        onErrorContainer: "rgb(255, 180, 171)",
        background: "rgb(26, 28, 30)",
        onBackground: "rgb(227, 226, 230)",
        surface: "rgb(26, 28, 30)",
        onSurface: "rgb(227, 226, 230)",
        surfaceVariant: "rgb(67, 71, 78)",
        onSurfaceVariant: "rgb(195, 198, 207)",
        outline: "rgb(141, 145, 153)",
        outlineVariant: "rgb(67, 71, 78)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(227, 226, 230)",
        inverseOnSurface: "rgb(47, 48, 51)",
        inversePrimary: "rgb(0, 95, 175)",
        elevation: {
            level0: "transparent",
            level1: "rgb(33, 37, 41)",
            level2: "rgb(37, 42, 48)",
            level3: "rgb(41, 47, 55)",
            level4: "rgb(43, 49, 57)",
            level5: "rgb(46, 52, 62)"
        },
        surfaceDisabled: "rgba(227, 226, 230, 0.12)",
        onSurfaceDisabled: "rgba(227, 226, 230, 0.38)",
        backdrop: "rgba(45, 49, 56, 0.4)"
    }
};
const { DarkTheme } = adaptNavigationTheme({ reactNavigationDark: theme });

const Tab = createMaterialBottomTabNavigator();

export default function App() {
    const [initialized, setInitialized] = React.useState(true);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

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
        <PaperProvider theme={theme}
                       settings={{
                           icon: props => <FontAwesome5 {...props} />,
                       }}>
            <NavigationContainer theme={DarkTheme}>
                <Tab.Navigator initialRouteName="Search" theme={DarkTheme}>
                    <Tab.Screen name="Search" component={SearchNavigationScreen}
                                options={{
                                    tabBarLabel: 'Analysis',
                                    tabBarIcon: ({ focused, color }) => (
                                        <FontAwesome5 name={'magic'} size={23} color={color}/>
                                    ),
                                    headerShown: false,
                                }}/>
                    <Tab.Screen name="SavedWords" component={SavedWordNavigationScreen}
                                options={{
                                    tabBarLabel: 'Saved Words',
                                    tabBarIcon: ({ focused, color }) => (
                                        <FontAwesome5 name={'star'} size={23} color={color}/>
                                    ),
                                    headerShown: false,
                                }}/>
                    <Tab.Screen name="Setting" component={SettingNavigationScreen}
                                options={{
                                    tabBarLabel: 'Setting',
                                    tabBarIcon: ({ focused, color }) => (
                                        <FontAwesome5 name={'cog'} size={23} color={color}/>
                                    ),
                                    headerShown: false,
                                }}/>
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

