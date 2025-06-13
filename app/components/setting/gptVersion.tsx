import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List, Checkbox} from "react-native-paper";
import SettingStore from "../../utils/SettingStore";
import {useTheme} from '@react-navigation/native';

const ITEMS = [
    { key: 1, value: null, text: 'Normal AI (Default)', description: 'Faster. But idiot.' },
    // { key: 2, value: '3.5', text: '3.5', description: 'Faster' },
    { key: 3, value: '4', text: 'Advanced AI (Beta)', description: 'Slower. But much more smart.' },
];

export default function GptVersion() {
    const theme = useTheme();
    const [selectedGptVersion, setSelectedGptVersion] = React.useState(null);
    const [initialized, setInitialized] = React.useState(true);

    async function loadSetting() {
        const gptVersion = await SettingStore.getGPTVersion()
        console.log(gptVersion)
        setSelectedGptVersion(gptVersion);
    }

    React.useEffect(() => {
        console.log('Save', selectedGptVersion)
        SettingStore.setGPTVersion(selectedGptVersion)
    }, [selectedGptVersion]);

    React.useEffect(() => {
        console.log('INIT')
        loadSetting();
    }, [initialized]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <List.Section>
                {ITEMS.map((item) => (
                    <List.Item
                        key={item.key}
                        title={item.text}
                        description={item.description}
                        titleStyle={{ color: theme.colors.text }}
                        descriptionStyle={{ color: theme.colors.secondaryText }}
                        style={{ backgroundColor: theme.colors.card }}
                        right={props =>
                            <Checkbox
                                status={item.value === selectedGptVersion ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setSelectedGptVersion(item.value)
                                }}/>
                        }
                        onPress={() => {
                            setSelectedGptVersion(item.value)
                        }}
                    />
                ))}
            </List.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});