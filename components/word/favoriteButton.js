import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {Button, FAB, List} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import * as Haptics from "expo-haptics";
import StarStore from "../../util/StarStore";
import {useNavigation} from "@react-navigation/native";

export default function FavoriteButton(props) {
    const { word, pinyin } = props;
    const [starred, setStarred] = useState(false);
    const navigation = useNavigation();

    async function loadStarred() {
        const _starred = await StarStore.isStar(word);
        setStarred(_starred);
    }

    navigation.addListener('focus', () => {
        loadStarred();
    });

    loadStarred();

    if (starred) {
        return (
            <FAB
                icon={'check'}
                size={'small'}
                mode={'flat'}
                variant={'surface'}
                style={{
                    ...styles.fab,
                    ...props.style,
                }}
                onPress={() => {
                    StarStore.removeStar(word)
                    setStarred(false);
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Error
                    )
                }}
            />
        );
    } else {
        return (
            <FAB
                icon={'star'}
                size={'small'}
                mode={'flat'}
                style={{
                    ...styles.fab,
                    ...props.style,
                }}
                onPress={() => {
                    StarStore.addStar(word, pinyin);
                    setStarred(true);
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    )
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    fab: {
    },
});