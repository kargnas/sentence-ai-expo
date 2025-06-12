import * as React from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SettingStore from "../../util/SettingStore";
import {useNavigation} from "@react-navigation/native";
import {getLocales} from "expo-localization";

export default function Setting() {
    const theme = useTheme()
    const navigation = useNavigation();
    const [settingLearningLanguage, setSettingLearningLanguage] = React.useState(null)
    const [settingLanguage, setSettingLanguage] = React.useState(null)
    const [settingGPTVersion, setSettingGPTVersion] = React.useState(null)
    const [settingVoice, setSettingVoice] = React.useState(null)
    const [initialized, setInitialized] = React.useState(true);

    async function loadSetting() {
        setSettingLearningLanguage(await SettingStore.getLearningLanguage())
        setSettingLanguage(await SettingStore.getLanguage())
        setSettingGPTVersion(await SettingStore.getGPTVersion())
        setSettingVoice(await SettingStore.getVoice())
    }

    React.useEffect(() => {
        console.log('INIT')
        loadSetting();
    }, [initialized]);

    navigation.addListener('focus', () => {
        console.log('Focus');
        loadSetting();
    });

    const SettingRow = ({ title, value, onPress, isLast = false }) => (
        <TouchableOpacity 
            style={[
                styles.settingRow, 
                { 
                    backgroundColor: theme.colors.card, 
                    borderBottomColor: theme.colors.border,
                    borderBottomWidth: isLast ? 0 : 0.5 
                }
            ]}
            onPress={onPress}
        >
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
            <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: theme.colors.secondaryText }]}>{value}</Text>
                <FontAwesome5 name="chevron-right" size={14} color={theme.colors.secondaryText} />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Language Options Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>LANGUAGE OPTIONS</Text>
                <View style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}>
                    <SettingRow 
                        title="Studying Language"
                        value={settingLearningLanguage || 'Automatic'}
                        onPress={() => navigation.navigate('LearningLanguage')}
                    />
                    <SettingRow 
                        title="App Language"
                        value={settingLanguage || `Default (${getLocales()[0].languageTag})`}
                        onPress={() => navigation.navigate('Language')}
                        isLast={true}
                    />
                </View>
            </View>

            {/* AI Options Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>AI OPTIONS</Text>
                <View style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}>
                    <SettingRow 
                        title="Intelligence"
                        value={
                            settingGPTVersion === '4' ? 'Advanced AI' : 
                            settingGPTVersion === null ? 'Default (Normal AI)' : 'Normal AI'
                        }
                        onPress={() => navigation.navigate('GptVersion')}
                    />
                    <SettingRow 
                        title="Voice"
                        value={settingVoice || 'Default'}
                        onPress={() => navigation.navigate('Voice')}
                        isLast={true}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginTop: 32,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '400',
        marginLeft: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        borderRadius: 10,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
    },
    settingTitle: {
        fontSize: 17,
        fontWeight: '400',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        fontSize: 17,
        fontWeight: '400',
        textAlign: 'right',
    },
});