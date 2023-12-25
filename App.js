import {
    adaptNavigationTheme,
    MD3DarkTheme as DefaultTheme,
    PaperProvider,
} from 'react-native-paper';

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import SearchNavigationScreen from "./screens/SearchNavigationScreen";
import SavedWordNavigationScreen from "./screens/SavedWordNavigationScreen";
import Search from "./components/search";
import {NavigationContainer} from "@react-navigation/native";
import SavedWords from "./components/savedWords";
import {createMaterialBottomTabNavigator} from "react-native-paper/react-navigation";

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

const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function App() {
    return (
        <PaperProvider theme={theme}
                       settings={{
                           icon: props => <FontAwesome5 {...props} />,
                       }}>
            <NavigationContainer theme={DarkTheme}>
                <Tab.Navigator initialRouteName="DrawerSearch">
                    <Tab.Screen name="DrawerSearch" component={SearchNavigationScreen}
                                   options={{
                                       tabBarLabel: 'Search',
                                       tabBarIcon: ({ focused, color }) => (
                                           <FontAwesome5 name={'search'} size={23} color={color}/>
                                       ),
                                       headerShown: false,
                                   }}/>
                    <Tab.Screen name="DrawerSavedWords" component={SavedWordNavigationScreen}
                                   options={{
                                       tabBarLabel: 'Saved Words',
                                       tabBarIcon: ({ focused, color }) => (
                                           <FontAwesome5 name={'star'} size={23} color={color}/>
                                       ),
                                       headerShown: false,
                                   }}/>
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

