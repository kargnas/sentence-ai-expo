import * as React from 'react';
import {useEffect} from "react";
import {StyleSheet, View, Text, FlatList, ScrollView, RefreshControl, Keyboard} from 'react-native';
import {List, Button, PaperProvider, TextInput, ActivityIndicator, useTheme} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";

import * as Haptics from "expo-haptics";
import axios from "axios";

import ApiService from "../../api/apiService";

import SavedSearchStore from "../../util/SavedSearchStore";
import SettingStore from "../../util/SettingStore";
import {trans} from "../../util/i18n";

import WordItem from "./WordItem";
import ButtonDemo from "./ButtonDemo";
import GuessLanguage from "../../util/guessLanguage.js";
import ButtonClipboard from "./ButtonClipboard";
import TTSPlayer from "./TTSPlayer";
import ResultList from "./ResultList";

let loadingStack = 0;

export default function Search() {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(0);
    const navigation = useNavigation();
    const theme = useTheme()
    const [initialized, setInitialized] = React.useState(true);
    const [learningLanguage, setLearningLanguage] = React.useState(null);
    const [error, setError] = React.useState(null);

    const handleClipboard = (myquery) => {
        if (query.length > 0) return;
        console.log('query: ' + myquery);
        setQuery(myquery);
    }

    const handleClipboardButton = (myquery) => {
        setQuery(myquery);
        Keyboard.dismiss();
        // handleSearch after 0.5 seconds
        setTimeout(() => {
            handleSearch(myquery);
        }, 300);
    }

    const handleDemoSearch = (demoString) => {
        setQuery(demoString);
        Keyboard.dismiss();
        // handleSearch after 0.5 seconds
        setTimeout(() => {
            handleSearch(demoString);
        }, 300);
    }

    const handleSearch = async (customQuery) => {
        const apiService = new ApiService();
        const realQuery = customQuery?.length > 0 ? customQuery : query;
        loadingStack++;
        setLoading(loadingStack)
        Keyboard.dismiss();

        try {
            apiService.prepareForRequest();
            const response = await apiService.analysis(realQuery);
            setError(null)
            setResults(response.data);
            console.log(response.data);

            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            )

            setLearningLanguage(await SettingStore.getLearningLanguage());

            await SavedSearchStore.setSavedSearchKeyword(realQuery);
            await SavedSearchStore.setSavedSearch(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Cancelled previous request");
            } else {
                // trace
                console.error(error);
                console.error(error, error.stack)

                setResults([])
                setLearningLanguage(null)
                setError(error.message)
            }
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )
        } finally {
            loadingStack--;
            setLoading(loadingStack)
        }
    };

    useEffect(() => {
        console.log('검색창 초기화')
        const init = async () => {
            const savedSearch = await SavedSearchStore.getSavedSearch();
            if (savedSearch.length > 0) {
                setResults(savedSearch);
                const savedSearchKeyword = await SavedSearchStore.getSavedSearchKeyword();
                setQuery(savedSearchKeyword);

                console.log('저장된 검색어가 있습니다: ' + savedSearchKeyword);
            } else {
                console.log('저장된 검색어가 없습니다.');
            }
        }
        init();
    }, [initialized]);

    return (
        <View style={styles.container}>
            <TextInput
                mode="outlined" label={trans('placeholder_input_text')}
                value={query}
                onChangeText={text => setQuery(text)}
                onSubmitEditing={handleSearch}
                style={styles.searchBar}
                contentStyle={{ marginRight: 65 }}
            />
            <View style={{
                position: 'absolute',
                right: 0,
                top: 14,
                margin: 3,
                marginLeft: 4,
                marginRight: 0
            }}>
                {query.length > 0 ?
                    <Button icon="times-circle"
                            mode="text"
                            textColor={theme.colors.outline}
                            rippleColor={"transparent"}
                            onPress={() => {
                                setQuery('')
                            }}>Clear</Button>
                    :
                    <ButtonClipboard onPress={handleClipboardButton}
                                     onClipboard={handleClipboard}/>}
            </View>
            {!query && <ButtonDemo onPress={handleDemoSearch}/>}
            <ScrollView refreshControl={<RefreshControl refreshing={loading > 0}
                                                        colors={[theme.colors.onSurface]}
                                                        tintColor={theme.colors.onSurface}
                                                        onRefresh={handleSearch}/>}>
                {error &&
                    <Text style={{ textAlign: 'center', color: theme.colors.error, fontSize: 14, margin: 14, }}>
                        {error}
                    </Text>}

                <ResultList sentences={results?.sentences}/>

                {learningLanguage &&
                    <Text style={{ ...styles.descriptionStudyingLanguage, color: theme.colors.outline }}>
                        You are studying {learningLanguage}.
                    </Text>}

                {results?.sentences &&
                    <Button icon="trash-alt" mode="text"
                            textColor={theme.colors.error}
                            style={{
                                margin: 10
                            }}
                            onPress={() => {
                                setResults([]);
                                setQuery('')
                                setLearningLanguage(null)
                                SavedSearchStore.clearSavedSearch();
                                SavedSearchStore.clearSavedSearchKeyword();
                            }}>
                        Clear Latest Search
                    </Button>}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
    },
    searchBar: {
        margin: 5,
    },
    componentList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10
    },
    descriptionStudyingLanguage: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        margin: 10,
        marginBottom: 0,
    }
});