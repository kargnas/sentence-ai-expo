import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native';
import {
    Card,
    Title,
    Paragraph,
    List,
    PaperProvider,
} from 'react-native-paper';

import SearchScreen from './components/search';
import WordScreen from './components/word';

const Stack = createStackNavigator();

export default function App() {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home"
                                  component={SearchScreen}
                                  options={{
                                      title: 'Chinese Sentences Analysis',
                                  }}
                    />
                    <Stack.Screen name="Word"
                                  component={WordScreen}
                                  options={({ route }) =>
                                      ({ title: route.params.title })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

