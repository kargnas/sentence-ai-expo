import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List} from "react-native-paper";
import SettingStore from "../../util/SettingStore";
import {Checkbox} from 'react-native-paper';
import {getLocales} from 'expo-localization';
import {i18n, loadLocale} from "../../util/i18n";

export default function Voice() {
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [initialized, setInitialized] = React.useState(true);

    // List of languages
    const ITEMS = [
        { key: 1, value: null, text: 'Default' },
        { key: 2, value: 'alloy', text: 'Alloy' },
        { key: 3, value: 'echo', text: 'Echo' },
        { key: 4, value: 'fable', text: 'Fable' },
        { key: 5, value: 'onyx', text: 'Onyx' },
        { key: 6, value: 'nova', text: 'Nova' },
        { key: 7, value: 'shimmer', text: 'Shimmer' },
    ];

    async function loadSetting() {
        const value = await SettingStore.getVoice()
        setSelectedValue(value);
    }

    React.useEffect(() => {
        console.log('Save', selectedValue)
        SettingStore.setVoice(selectedValue)
    }, [selectedValue]);

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
                                status={item.value === selectedValue ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setSelectedValue(item.value)
                                }}/>
                        }
                        onPress={() => {
                            setSelectedValue(item.value)
                        }}
                    />
                ))}
            </List.Section>
        </>
    )
        ;
}

const styles = StyleSheet.create({});