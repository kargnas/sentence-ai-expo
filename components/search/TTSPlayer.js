import React, {useEffect} from "react";
import {StyleSheet, View, Text, FlatList, ScrollView, RefreshControl} from 'react-native';
import ApiService from "../../api/apiService";
import {Button} from "react-native-paper";
import * as Haptics from "expo-haptics";
import {Audio} from "expo-av";

export default ({ text }) => {
    const [loading, setLoading] = React.useState(false)
    const [sound, setSound] = React.useState();

    const playSound = async (query) => {
        setLoading(true)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        // Logic
        const apiService = new ApiService();
        const sound = await apiService.getSound(query);
        console.log(query, '사운드를 다운받았습니다.')

        setSound(sound);
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        sound.playAsync();
        console.log(query, '재생합니다.')

        // Finish
        setLoading(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }

    useEffect(() => {
        return sound ? () => {
            console.log('사운드를 제거합니다.');
            sound.unloadAsync();
        } : undefined
    }, [sound]);

    return (
        <>
            {loading ?
                <Button mode="text" loading={true}
                        style={styles.button}></Button>
                :
                <Button onPress={(e) => {
                    playSound(text, e)
                }} mode="text" icon="play" style={styles.button}></Button>
            }
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        marginRight: -15,
    }
});