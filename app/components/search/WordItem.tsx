import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useTheme} from "@react-navigation/native";
import { useRouter } from 'expo-router';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FavoriteButton from "../word/favoriteButton";

export default function WordItem(props) {
    const { component } = props;
    const router = useRouter();
    const theme = useTheme()

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() =>
                router.push({
                    pathname: '/search/word',
                    params: {
                        title: `${component.word} ${component.phonetic}`,
                        component: JSON.stringify(component)
                    }
                })
            }
        >
            <View style={styles.leftSection}>
                <FavoriteButton word={component.word} style={styles.favoriteButton}/>
                <View style={styles.wordInfo}>
                    <Text style={[styles.word, { color: theme.colors.text }]}>{component.word}</Text>
                    <Text style={[styles.phonetic, { color: theme.colors.secondaryText }]}>{component.phonetic}</Text>
                </View>
            </View>
            
            <View style={styles.rightSection}>
                <Text style={[styles.meaning, { color: theme.colors.secondaryText }]} numberOfLines={2}>
                    {component.meaning}
                </Text>
                <FontAwesome5 name="chevron-right" size={14} color={theme.colors.secondaryText} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 0.5,
        minHeight: 60,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    favoriteButton: {
        marginRight: 8,
    },
    wordInfo: {
        flex: 1,
    },
    word: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 2,
    },
    phonetic: {
        fontSize: 14,
        fontWeight: '400',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '40%',
        gap: 8,
    },
    meaning: {
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'right',
        flex: 1,
    },
});