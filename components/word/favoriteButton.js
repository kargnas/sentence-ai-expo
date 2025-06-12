import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {Snackbar} from "react-native-paper";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import {useTheme} from '@react-navigation/native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";
import StarStore from "../../util/StarStore";
import {useNavigation} from "@react-navigation/native";

export default function FavoriteButton(props) {
    const { word, pinyin } = props;
    const [starred, setStarred] = useState(false);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const theme = useTheme();

    async function loadStarred() {
        const _starred = await StarStore.isStar(word);
        setStarred(_starred);
    }

    navigation.addListener('focus', () => {
        loadStarred();
    });

    loadStarred();

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.starButton,
                    { backgroundColor: starred ? theme.colors.primary : 'transparent' },
                    props.style
                ]}
                onPress={() => {
                    if (starred) {
                        StarStore.removeStar(word)
                        setStarred(false);
                        Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Error
                        )
                    } else {
                        setStarred(true);
                        StarStore.addStar(word, pinyin).then(() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                        }).catch(e => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                            setError(e.message)
                        })
                    }
                }}
                activeOpacity={0.7}
            >
                <FontAwesome5 
                    name={starred ? "check" : "star"} 
                    size={16} 
                    color={starred ? "#FFFFFF" : theme.colors.text}
                    solid={starred}
                />
            </TouchableOpacity>
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

const styles = StyleSheet.create({
    starButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
});