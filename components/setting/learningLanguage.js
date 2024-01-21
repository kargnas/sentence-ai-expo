import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List} from "react-native-paper";
import SettingStore from "../../util/SettingStore";
import {Checkbox} from 'react-native-paper';
import {loadLocale} from "../../util/i18n";

// List of languages
const LANGUAGES = [
    // { key: 1, value: null, text: 'Automatic' },
    { key: 2, value: 'Mandarin', text: 'Mandarin (Mainland China)' },
    { key: 3, value: 'Cantonese', text: 'Cantonese (Guangdong, Hong Kong)' },
    { key: 4, value: 'Japanese', text: 'Japanese' },
    { key: 5, value: 'Korean (Polite)', text: 'Korean (Polite)' },
    { key: 5, value: 'Korean (Casual, Inpolite)', text: 'Korean (Casual, Inpolite) - Beta', description: 'Consider using the Advanced AI.' },
    { key: 6, value: 'English', text: 'English - Beta' },
];

export default function LearningLanguage() {
    const [selectedLanguage, setSelectedLanguage] = React.useState(null);
    const [initialized, setInitialized] = React.useState(true);

    async function loadSetting() {
        const learningLanguage = await SettingStore.getLearningLanguage();
        console.log(learningLanguage)
        setSelectedLanguage(learningLanguage);
    }

    React.useEffect(() => {
        console.log('Save', selectedLanguage)
        SettingStore.setLearningLanguage(selectedLanguage)
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