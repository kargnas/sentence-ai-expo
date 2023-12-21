import * as React from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {List, Button, PaperProvider, TextInput, ActivityIndicator} from "react-native-paper";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider, SafeAreaInsetsContext, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import FavoriteButton from "../word/favoriteButton";

let cancelToken;
let loadingStack = 0;

export default function Search() {
    const [query, setQuery] = React.useState("从市政府到博物馆有多远？");
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(0);
    const navigation = useNavigation();

    const handleSearch = async () => {
        if (typeof cancelToken != typeof undefined) {
            cancelToken.cancel();
        }
        cancelToken = axios.CancelToken.source();
        loadingStack++;
        setLoading(loadingStack)

        try {
            const response = await axios.get(`https://merciful-winds-sd2i8lb9e6gr.vapor-farm-b1.com/api/analysis/input?text=${query}`, { cancelToken: cancelToken.token });
            setResults(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Cancelled previous request");
            } else {
                console.error(error);
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
                            <List.Subheader>{item.meaning}</List.Subheader>
                            <List.Item
                                title={item.sentence}
                                description={item.explain_structure}
                            />
                            {item.components.map((component, idx) => (
                                <List.Item
                                    key={idx}
                                    title={component.word}
                                    description={component.pinyin}
                                    right={props =>
                                        <View style={styles.wordRightContainer}>
                                            <Text style={styles.meaning}>{component.meaning}</Text>
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
        backgroundColor: '#FFF',
    },
    searchBar: {
        margin: 5,
        marginBottom: 10,
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