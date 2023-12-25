import * as React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {List, Button, PaperProvider, TextInput, ActivityIndicator, useTheme} from "react-native-paper";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";
import ApiService from "../../api/apiService";
import WordItem from "./WordItem";
import SavedSearchStore from "../../util/SavedSearchStore";
import {useEffect} from "react";

let loadingStack = 0;

export default function Search() {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(0);
    const navigation = useNavigation();
    const theme = useTheme()
    const [initialized, setInitialized] = React.useState(true);

    const handleSearch = async () => {
        const apiService = new ApiService();
        loadingStack++;
        setLoading(loadingStack)

        try {
            apiService.prepareForRequest();
            const response = await apiService.analysis(query);
            setResults(response.data);

            await SavedSearchStore.setSavedSearch(response.data);
            await SavedSearchStore.setSavedSearchKeyword(query);
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

    useEffect(() => {
        console.log('INIT')
        const init = async () => {
            const savedSearch = await SavedSearchStore.getSavedSearch();
            setResults(savedSearch);
            const savedSearchKeyword = await SavedSearchStore.getSavedSearchKeyword();
            setQuery(savedSearchKeyword);
        }
        init();
    }, [initialized]);

    return (
        <View style={styles.container}>
            <TextInput
                mode="outlined"
                label="Sentences"
                value={query}
                onChangeText={text => setQuery(text)}
                onSubmitEditing={handleSearch}
                style={styles.searchBar}
            />
            {loading === 0 && results?.sentences &&
                <Button icon="trash-alt"
                        mode="text"
                        textColor={theme.colors.error}
                        onPress={() => {
                            setResults([]);
                            SavedSearchStore.clearSavedSearch();
                            SavedSearchStore.clearSavedSearchKeyword();
                        }}>
                    Clear Latest Search
                </Button>
            }

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
    }
});