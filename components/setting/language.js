import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List} from "react-native-paper";
import SettingStore from "../../util/SettingStore";
import {Checkbox} from 'react-native-paper';

// List of languages
const LANGUAGES = [
    { key: 1, value: null, text: 'System' },
    { key: 2, value: 'English', text: 'English' },
    { key: 3, value: 'Simplified Chinese', text: 'Simplified Chinese' },
    { key: 4, value: 'Traditional Chinese', text: 'Traditional Chinese' },
    { key: 5, value: 'Japanese', text: 'Japanese' },
    { key: 6, value: 'Korean', text: 'Korean' },
];

export default function LearningLanguage() {
    const [selectedLanguage, setSelectedLanguage] = React.useState(null);
    const [initialized, setInitialized] = React.useState(true);

    async function loadSetting() {
        const language = await SettingStore.getLanguage();
        console.log(language)
        setSelectedLanguage(language);
    }

    React.useEffect(() => {
        console.log('Save', selectedLanguage)
        SettingStore.setLanguage(selectedLanguage)
    }, [selectedLanguage]);

    React.useEffect(() => {
        console.log('INIT')
        loadSetting();
    }, [initialized]);

    return (
        <>
            <List.Section>
                {LANGUAGES.map((item) => (
                    <List.Item
                        key={item.key}
                        title={item.text}
                        right={props =>
                            <Checkbox
                                status={item.value === selectedLanguage ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setSelectedLanguage(item.value)
                                }}/>
                        }
                        onPress={() => {
                            setSelectedLanguage(item.value)
                        }}
                    />
                ))}
            </List.Section>
        </>
    )
        ;
}

const styles = StyleSheet.create({});