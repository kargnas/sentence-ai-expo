import * as React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {List, MD3Colors, useTheme} from 'react-native-paper';
import SettingStore from "../../util/SettingStore";
import {useNavigation} from "@react-navigation/native";
import {getLocales} from "expo-localization";

export default function Setting() {
    const theme = useTheme()
    const navigation = useNavigation();
    const [settingLearningLanguage, setSettingLearningLanguage] = React.useState(null)
    const [settingLanguage, setSettingLanguage] = React.useState(null)
    const [settingGPTVersion, setSettingGPTVersion] = React.useState(null)
    const [initialized, setInitialized] = React.useState(true);

    async function loadSetting() {
        setSettingLearningLanguage(await SettingStore.getLearningLanguage())
        setSettingLanguage(await SettingStore.getLanguage())
        setSettingGPTVersion(await SettingStore.getGPTVersion())
    }

    React.useEffect(() => {
        console.log('INIT')
        loadSetting();
    }, [initialized]);

    navigation.addListener('focus', () => {
        console.log('Focus');
        loadSetting();
    });

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.outline }}>Language Options</List.Subheader>
            <List.Item title="Studying Language"
                       right={props =>
                           <View style={styles.itemRightContainer}>
                               <Text style={{
                                   ...styles.itemRightValue,
                                   color: theme.colors.outline,
                               }}>
                                   {settingLearningLanguage ? settingLearningLanguage : 'Automatic'}
                               </Text>
                               <List.Icon icon="chevron-right"/>
                           </View>
                       }
                       onPress={() => {
                           navigation.navigate('LearningLanguage')
                       }}/>
            <List.Item title="App Language"
                       right={props =>
                           <View style={styles.itemRightContainer}>
                               <Text style={{
                                   ...styles.itemRightValue,
                                   color: theme.colors.outline,
                               }}>
                                   {settingLanguage ? settingLanguage : `Default (${getLocales()[0].languageTag})`}
                               </Text>
                               <List.Icon icon="chevron-right"/>
                           </View>
                       }
                       onPress={() => {
                           navigation.navigate('Language')
                       }}/>

            <List.Subheader style={{ color: theme.colors.outline }}>AI Options</List.Subheader>
            <List.Item title="AI Version"
                       right={props =>
                           <View style={styles.itemRightContainer}>
                               <Text style={{
                                   ...styles.itemRightValue,
                                   color: theme.colors.outline,
                               }}>
                                   {settingGPTVersion === '4' ? 'Advanced AI' : ''}
                                   {settingGPTVersion === null ? 'Default (Normal AI)' : ''}
                               </Text>
                               <List.Icon icon="chevron-right"/>
                           </View>
                       }
                       onPress={() => {
                           navigation.navigate('GptVersion')
                       }}/>
        </List.Section>
    );
}

const styles = StyleSheet.create({
    itemRightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    itemRightValue: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'right',
        paddingTop: 2,
        marginRight: 15,
    }
});