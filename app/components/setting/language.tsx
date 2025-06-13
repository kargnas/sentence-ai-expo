import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List} from "react-native-paper";
import SettingStore from "../../utils/SettingStore";
import {Checkbox} from 'react-native-paper';
import {getLocales} from 'expo-localization';
import {i18n, loadLocale} from "../../utils/i18n";
import {useTheme} from '@react-navigation/native';

export default function LearningLanguage() {
    const theme = useTheme();
    const [selectedLanguage, setSelectedLanguage] = React.useState(null);
    const [initialized, setInitialized] = React.useState(true);

    // List of languages
    const LANGUAGES = [
        { key: 1, value: null, text: getLocales()[0].languageTag, description: 'Default' },
        {
            key: 2,
            value: 'en-us',
            text: 'English',
            description: 'For more accuracy, we recommend English for app language.'
        },
        { key: 3, value: 'zh-cn', text: 'Simplified Chinese' },
        { key: 4, value: 'ja-jp', text: 'Japanese' },
        { key: 5, value: 'ko-kr', text: 'Korean' },
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <List.Section>
                {LANGUAGES.map((item) => (
                    <List.Item
                        key={item.key}
                        title={item.text}
                        description={item.description}
                        titleStyle={{ color: theme.colors.text }}
                        descriptionStyle={{ color: theme.colors.secondaryText }}
                        style={{ backgroundColor: theme.colors.card }}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});