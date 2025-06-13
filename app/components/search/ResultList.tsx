import {useTheme} from "@react-navigation/native";
import {StyleSheet, Text, View} from "react-native";
import TTSPlayer from "./TTSPlayer";
import WordItem from "./WordItem";

export default ({ sentences }) => {
    const theme = useTheme()

    return (
        <>
            {sentences?.map((item, key) => (
                <View key={key} style={[styles.sentenceContainer, { backgroundColor: theme.colors.card }]}>
                    <View style={styles.sentenceHeader}>
                        <View style={styles.sentenceContent}>
                            <Text style={[styles.sentence, { color: theme.colors.text }]}>
                                {item.sentence}
                            </Text>
                            <Text style={[styles.sentenceMeaning, { color: theme.colors.secondaryText }]}>
                                {item.meaning}
                            </Text>
                            {item.explain_structure && (
                                <Text style={[styles.sentenceStructure, { color: theme.colors.secondaryText }]}>
                                    {item.explain_structure}
                                </Text>
                            )}
                        </View>
                        <View style={styles.ttsContainer}>
                            <TTSPlayer text={item.sentence}/>
                        </View>
                    </View>
                    
                    <View style={styles.wordsContainer}>
                        {item.components.map((component, idx) => (
                            <WordItem key={idx} component={component}/>
                        ))}
                    </View>
                </View>
            ))}
        </>
    )
}
const styles = StyleSheet.create({
    sentenceContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sentenceHeader: {
        flexDirection: 'row',
        padding: 16,
    },
    sentenceContent: {
        flex: 1,
        paddingRight: 12,
    },
    sentence: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 8,
    },
    sentenceMeaning: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 22,
        marginBottom: 6,
    },
    sentenceStructure: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    ttsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },
    wordsContainer: {
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
});