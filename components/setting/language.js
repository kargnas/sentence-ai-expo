import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List} from "react-native-paper";
import SettingStore from "../../util/SettingStore";
import {Checkbox} from 'react-native-paper';
import {getLocales} from 'expo-localization';
import {i18n, loadLocale} from "../../util/i18n";

export default function LearningLanguage() {
    const [selectedLanguage, setSelectedLanguage] = React.useState(null);
    const [initialized, setInitialized] = React.useState(true);

    // List of languages
    const LANGUAGES = [
        { key: 1, value: null, text: getLocales()[0].languageTag, description: 'Default' },
        { key: 2, value: 'English', text: 'English', description: 'For more accuracy, we recommend English for app language.' },
        { key: 3, value: 'Simplified Chinese', text: 'Simplified Chinese' },
        { key: 4, value: 'Traditional Chinese', text: 'Traditional Chinese' },
        { key: 5, value: 'Japanese', text: 'Japanese' },
        { key: 6, value: 'Korean', text: 'Korean' },
    ];

    async function loadSetting() {
        const language = await SettingStore.getLanguage();
        console.log(language)
        setSelectedLanguage(language);
    }

    React.useEffect(() => {
        console.log('Save', selectedLanguage)
        SettingStore.setLanguage(selectedLanguage)
        setTimeout(() => {
            loadLocale();
        }, 300);
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
                        description={item.description}
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