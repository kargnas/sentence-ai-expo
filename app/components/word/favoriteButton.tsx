import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {Snackbar} from "react-native-paper";
import {StyleSheet, View, TouchableOpacity, Text} from "react-native";
import {useTheme} from '@react-navigation/native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";
import StarStore from "../../utils/StarStore";
import {useNavigation} from "@react-navigation/native";

export default function FavoriteButton(props) {
    const { word, pinyin } = props;
    const [starred, setStarred] = useState(false);
    const [error, setError] = useState(null);
    const [iconLoaded, setIconLoaded] = useState(true);
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
                {iconLoaded ? (
                    <FontAwesome5 
                        name={starred ? "check" : "star"} 
                        size={14} 
                        color={starred ? "#FFFFFF" : theme.colors.text}
                        solid={starred}
                        suppressHighlighting={true}
                        onError={() => setIconLoaded(false)}
                    />
                ) : (
                    <Text style={{
                        fontSize: 14,
                        color: starred ? "#FFFFFF" : theme.colors.text,
                        fontWeight: 'bold'
                    }}>
                        {starred ? "✓" : "★"}
                    </Text>
                )}
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
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
    },
});