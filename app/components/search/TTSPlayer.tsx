import React, {useEffect, useRef} from "react";
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Animated} from 'react-native';
import {useTheme} from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ApiService from "../../api/apiService";
import * as Haptics from "expo-haptics";
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio";

export default ({ text }) => {
    const [loading, setLoading] = React.useState(false);
    const [audioSource, setAudioSource] = React.useState(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const player = useAudioPlayer(audioSource);
    const status = useAudioPlayerStatus(player);
    const theme = useTheme();
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Initialize audio mode on component mount
    useEffect(() => {
        const initAudioMode = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                });
                console.log('Audio mode initialized');
            } catch (error) {
                console.error('Failed to initialize audio mode:', error);
            }
        };
        initAudioMode();
    }, []);

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
            setLoading(false);
        }
        // Loading will be stopped when audio actually starts playing
    };

    // Play when audioSource changes
    useEffect(() => {
        if (audioSource && player) {
            const playAudio = async () => {
                try {
                    console.log('Trying to play audio:', audioSource);
                    
                    // Ensure audio mode is set before playing
                    await setAudioModeAsync({
                        playsInSilentMode: true,
                    });
                    
                    // First load the audio
                    console.log('Loading audio...');
                    
                    // Add a small delay to ensure proper loading
                    setTimeout(() => {
                        player.seekTo(0); // Reset to beginning
                        player.play();
                        console.log('재생 시작:', audioSource);
                    }, 100);
                } catch (error) {
                    console.error('재생 오류:', error);
                    setLoading(false);
                    setIsPlaying(false);
                }
            };
            playAudio();
        }
    }, [audioSource, player]);

    // Monitor audio status
    useEffect(() => {
        console.log('Audio status changed:', {
            playing: status?.playing,
            didJustFinish: status?.didJustFinish,
            isLoaded: status?.isLoaded,
            currentTime: status?.currentTime,
            duration: status?.duration,
            isPlaying
        });

        if (status?.playing && !status?.didJustFinish && !isPlaying) {
            console.log('오디오 실제 재생 시작!');
            setLoading(false);
            setIsPlaying(true);
        } else if (status?.didJustFinish && isPlaying) {
            console.log('오디오 재생 완료!');
            setIsPlaying(false);
            setLoading(false);
        } else if (status?.isLoaded && !status?.playing && loading && !status?.didJustFinish) {
            console.log('오디오 로드됨, 재생 상태:', status);
        }
    }, [status?.playing, status?.didJustFinish, status?.isLoaded, loading]);

    // Handle animations based on isPlaying state
    useEffect(() => {
        if (isPlaying) {
            console.log('Starting rotation animation');
            progressAnim.setValue(0);
            Animated.loop(
                Animated.timing(progressAnim, {
                    toValue: 1,
                    duration: 1500, // 1.5 seconds per rotation
                    useNativeDriver: false,
                })
            ).start();
        } else {
            console.log('Stopping animation');
            progressAnim.stopAnimation(() => {
                progressAnim.setValue(0);
            });
        }
    }, [isPlaying]);


    return (
        <View style={styles.container}>
            {/* Progress ring when playing */}
            {isPlaying && (
                <Animated.View 
                    style={[
                        styles.progressRing,
                        {
                            transform: [
                                {
                                    rotate: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                    })
                                }
                            ]
                        }
                    ]} 
                />
            )}
            <View 
                style={[
                    styles.button, 
                    { 
                        backgroundColor: theme.colors.primary
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => playSound(text)}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <FontAwesome5 
                            name="play"
                            size={14} 
                            color="#FFFFFF" 
                            style={styles.icon}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    touchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 2,
        marginTop: 2,
    },
    progressRing: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderTopColor: '#4CAF50',
        borderRightColor: 'rgba(76, 175, 80, 0.3)',
        borderBottomColor: 'rgba(76, 175, 80, 0.1)',
        borderLeftColor: 'rgba(76, 175, 80, 0.2)',
        backgroundColor: 'transparent',
    },
});