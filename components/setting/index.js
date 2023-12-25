import * as React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {List, MD3Colors, useTheme} from 'react-native-paper';
import SettingStore from "../../util/SettingStore";
import {useNavigation} from "@react-navigation/native";

export default function Setting() {
    const theme = useTheme()
    const navigation = useNavigation();
    const [settingLearningLanguage, setSettingLearningLanguage] = React.useState(null)
    const [settingLanguage, setSettingLanguage] = React.useState(null)
    const [initialized, setInitialized] = React.useState(true);

    async function loadSetting() {
        setSettingLearningLanguage(await SettingStore.getLearningLanguage())
        setSettingLanguage(await SettingStore.getLanguage())
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
            <List.Subheader>Languages</List.Subheader>
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
                                   {settingLanguage ? settingLanguage : 'System'}
                               </Text>
                               <List.Icon icon="chevron-right"/>
                           </View>
                       }
                       onPress={() => {
                           navigation.navigate('Language')
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