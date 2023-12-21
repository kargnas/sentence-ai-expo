import * as React from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {List, Button, PaperProvider, TextInput, ActivityIndicator, useTheme} from "react-native-paper";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider, SafeAreaInsetsContext, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import FavoriteButton from "../word/favoriteButton";
import ApiService from "../../api/apiService";

let cancelToken;
let loadingStack = 0;

function WordItem(props) {
    const { component } = props;
    const navigation = useNavigation();
    const theme = useTheme()

    return (
        <List.Item
            title={component.word}
            description={component.pinyin}
            left={props =>
                <FavoriteButton word={component.word} style={{
                    marginLeft: 15
                }}/>
            }
            right={props =>
                <View style={styles.wordRightContainer}>
                    <Text style={{
                        ...styles.meaning,
                        fontColor: theme.colors.onSurface,
                        color: theme.colors.outline,
                    }}>{component.meaning}</Text>
                    <List.Icon icon="chevron-right"/>
                </View>
            }
            onPress={() =>
                navigation.navigate('Word', {
                    title: `${component.word} ${component.pinyin}`,
                    component
                })
            }
        />
    )
}

export default function Search() {
    const [query, setQuery] = React.useState("从市政府到博物馆有多远？");
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(0);
    const navigation = useNavigation();
    const theme = useTheme()

    const handleSearch = async () => {
        const apiService = new ApiService();
        loadingStack++;
        setLoading(loadingStack)

        try {
            apiService.prepareForRequest();
            const response = await apiService.analysis(query);
            setResults(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Cancelled previous request");
            } else {
                // trace
                console.error(error);
                console.error(error, error.stack)
            }
        } finally {
            loadingStack--;
            setLoading(loadingStack)
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                mode="outlined"
                label="Chinese Sentences"
                value={query}
                onChangeText={text => setQuery(text)}
                onSubmitEditing={handleSearch}
                style={styles.searchBar}
            />
            {loading > 0 ? (
                <ActivityIndicator animating={true} style={styles.loading}/>
            ) : (
                <FlatList
                    data={results.sentences}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <List.Section>
                            <Text style={{
                                marginLeft: 15,
                                marginRight: 15,
                                marginBottom: 5,
                                lineHeight: 20,
                                fontWeight: 'bold',
                                color: theme.colors.onSurfaceDisabled
                            }}>
                                {item.sentence}
                            </Text>
                            <Text style={{
                                marginLeft: 15,
                                marginRight: 15,
                                marginBottom: 5,
                                lineHeight: 20,
                                color: theme.colors.onSurface
                            }}>
                                {item.meaning}
                            </Text>
                            <Text style={{
                                marginLeft: 15,
                                marginRight: 15,
                                marginBottom: 5,
                                lineHeight: 20,
                                color: theme.colors.onSurfaceVariant
                            }}>
                                {item.explain_structure}
                            </Text>
                            {item.components.map((component, idx) => (
                                <WordItem key={idx} component={component}/>
                            ))}
                        </List.Section>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        margin: 5,
    },
    loading: {
        marginTop: 20,
    },
    componentList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10
    },
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
    }
});