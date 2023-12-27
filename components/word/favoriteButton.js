import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {Button, FAB, List, Snackbar} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import * as Haptics from "expo-haptics";
import StarStore from "../../util/StarStore";
import {useNavigation} from "@react-navigation/native";

export default function FavoriteButton(props) {
    const { word, pinyin } = props;
    const [starred, setStarred] = useState(false);
    const [error, setError] = useState(null);
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
            <>
                <FAB
                    icon={'star'}
                    size={'small'}
                    mode={'flat'}
                    style={{
                        ...styles.fab,
                        ...props.style,
                    }}
                    onPress={() => {
                        setStarred(true);
                        StarStore.addStar(word, pinyin).then(() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                        }).catch(e => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                            setError(e.message)
                        })
                    }}
                />
                <Snackbar
                    visible={error !== null}
                    onDismiss={() => setError(null)}
                    action={{
                        label: 'Close',
                    }}>
                    {error}
                </Snackbar>
            </>
        );
    }
}

const styles = StyleSheet.create({
    fab: {},
});