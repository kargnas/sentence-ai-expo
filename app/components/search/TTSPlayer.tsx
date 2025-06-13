import React, {useEffect} from "react";
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useTheme} from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ApiService from "../../api/apiService";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-audio";

export default ({ text }) => {
    const [loading, setLoading] = React.useState(false)
    const [sound, setSound] = React.useState();
    const theme = useTheme();

    const playSound = async (query) => {
        setLoading(true)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        try {
            // Logic
            const apiService = new ApiService();
            const sound = await apiService.getSound(query);
            console.log(query, '사운드를 다운받았습니다.')

            setSound(sound);
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            await sound.playAsync();
            console.log(query, '재생합니다.')

            // Finish
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        } catch (error) {
            console.error('Sound play error:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return sound ? () => {
            console.log('사운드를 제거합니다.');
            sound.unloadAsync();
        } : undefined
    }, [sound]);

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => playSound(text)}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <FontAwesome5 name="play" size={14} color="#FFFFFF" />
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});