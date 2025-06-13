import React, {useEffect} from "react";
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useTheme} from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ApiService from "../../api/apiService";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";

export default ({ text }) => {
    const [loading, setLoading] = React.useState(false);
    const [audioSource, setAudioSource] = React.useState(null);
    const player = useAudioPlayer(audioSource);
    const theme = useTheme();

    const playSound = async (query) => {
        setLoading(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            // Logic
            const apiService = new ApiService();
            const sound = await apiService.getSound(query);
            console.log(query, '사운드를 다운받았습니다.');

            // Set the audio source and play
            if (sound.uri) {
                // If same audio source, just replay
                if (audioSource === sound.uri && player) {
                    player.seekTo(0);
                    player.play();
                    console.log(query, '같은 오디오 재생.');
                } else {
                    setAudioSource(sound.uri);
                    console.log(query, '새 오디오 소스 설정 완료.');
                }
            }

            // Finish
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Sound play error:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setLoading(false);
        }
    };

    // Play when audioSource changes
    useEffect(() => {
        if (audioSource && player) {
            try {
                player.seekTo(0); // Reset to beginning
                player.play();
                console.log('재생 시작:', audioSource);
            } catch (error) {
                console.error('재생 오류:', error);
            }
        }
    }, [audioSource, player]);

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