import {List, useTheme} from "react-native-paper";
import {StyleSheet, Text, View} from "react-native";
import TTSPlayer from "./TTSPlayer";
import WordItem from "./WordItem";

export default ({ sentences }) => {
    const theme = useTheme()

    return (
        <>
            {sentences?.map((item, key) => (
                <List.Section key={key}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between' }}>
                        <View style={{ display: 'block', flex: 1, alignSelf: 'center' }}>
                            <Text style={{ ...styles.sentence, color: theme.colors.onSurfaceDisabled }}>
                                {item.sentence}
                            </Text>
                            <Text style={{ ...styles.sentenceMeaning, color: theme.colors.onSurface }}>
                                {item.meaning}
                            </Text>
                            {item.explain_structure &&
                                <Text style={{ ...styles.sentenceStructure, color: theme.colors.onSurfaceVariant }}>
                                    {item.explain_structure}
                                </Text>
                            }
                        </View>
                        <View style={{ display: 'block', flex: 0, flexBasis: 80, alignSelf: 'center', alignItems: 'center' }}>
                            <TTSPlayer text={item.sentence}/>
                        </View>
                    </View>
                    {item.components.map((component, idx) => (
                        <WordItem key={idx} component={component}/>
                    ))}
                </List.Section>
            ))}
        </>
    )
}
const styles = StyleSheet.create({
    sentence: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    sentenceMeaning: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
        lineHeight: 20,
    },
    sentenceStructure: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
        lineHeight: 20,
    },
});