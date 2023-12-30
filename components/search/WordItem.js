import * as React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {List, Button, PaperProvider, TextInput, ActivityIndicator, useTheme} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import FavoriteButton from "../word/favoriteButton";

let cancelToken;
let loadingStack = 0;

export default function WordItem(props) {
    const { component } = props;
    const navigation = useNavigation();
    const theme = useTheme()

    return (
        <List.Item
            title={component.word}
            description={component.phonetic}
            left={props =>
                <FavoriteButton word={component.word} style={{
                    marginLeft: 15
                }}/>
            }
            right={props =>
                <View style={styles.wordRightContainer}>
                    <Text style={{
                        ...styles.meaning,
                        color: theme.colors.outline,
                    }}>{component.meaning}</Text>
                    <List.Icon icon="chevron-right"/>
                </View>
            }
            onPress={() =>
                navigation.push('Word', {
                    title: `${component.word} ${component.phonetic}`,
                    component
                })
            }
        />
    )
}

const styles = StyleSheet.create({
    wordRightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    meaning: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'right',
        marginRight: 15,
    }
});