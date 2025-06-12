import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {List} from "react-native-paper";
import SettingStore from "../../util/SettingStore";
import {Checkbox} from 'react-native-paper';
import {loadLocale} from "../../util/i18n";
import {useTheme} from '@react-navigation/native';

// List of languages
const LANGUAGES = [
    // { key: 1, value: null, text: 'Automatic' },
    { key: 2, value: 'Mandarin', text: 'Mandarin (Mainland China)' },
    { key: 3, value: 'Cantonese', text: 'Cantonese (Guangdong, Hong Kong)' },
    { key: 4, value: 'Japanese', text: 'Japanese' },
    { key: 5, value: 'Korean', text: 'Korean' },
    { key: 6, value: 'English', text: 'English - Beta' },
];

export default function LearningLanguage() {
    const theme = useTheme();
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