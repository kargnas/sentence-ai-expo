import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List} from "react-native-paper";
import SettingStore from "../../util/SettingStore";
import {Checkbox} from 'react-native-paper';

const ITEMS = [
    { key: 1, value: null, text: 'Normal AI (Default)', description: 'Faster. But idiot.'},
    // { key: 2, value: '3.5', text: '3.5', description: 'Faster' },
    { key: 3, value: '4', text: 'Advanced AI (Beta)', description: 'Slower. But much more smart.' },
];

export default function GptVersion() {
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
        <>
            <List.Section>
                {ITEMS.map((item) => (
                    <List.Item
                        key={item.key}
                        title={item.text}
                        description={item.description}
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
        </>
    )
        ;
}

const styles = StyleSheet.create({});