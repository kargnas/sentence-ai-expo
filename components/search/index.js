import * as React from 'react';
import {StyleSheet, View, Text, FlatList, ScrollView, RefreshControl} from 'react-native';
import {List, Button, PaperProvider, TextInput, ActivityIndicator, useTheme} from "react-native-paper";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";
import ApiService from "../../api/apiService";
import WordItem from "./WordItem";
import SavedSearchStore from "../../util/SavedSearchStore";
import {useEffect} from "react";
import * as Haptics from "expo-haptics";
import SettingStore from "../../util/SettingStore";
import {trans} from "../../util/i18n";

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

    const Example = () => {
        // Click to copy example sentence
        const copyToClipboard = async () => {
            const learningLanguage = await SettingStore.getLearningLanguage();
            let copyText = '';
            switch (learningLanguage) {
                case 'Japanese':
                    copyText = '家から図書館までどのくらいかかりますか？';
                    break;

                case 'Korean':
                    copyText = '도서관에서 학교까지 얼마나 걸리나요? 저 지금 빨리 가야되는데...';
                    break;

                case 'Mandarin':
                    copyText = '我可以得到一杯冰美式咖啡吗';
                    break;

                case 'Cantonese':
                    copyText = '佢睇呢場戲';
                    break;
            }

            setQuery(copyText);
            // handleSearch after 0.5 seconds
            setTimeout(() => {
                handleSearch(copyText);
            }, 300);
        }

        return (
            <View style={{
                textAlign: 'center'
            }}>
                <Button icon="copy"
                        mode="elevated"
                        style={{
                            marginTop: 3,
                            marginBottom: 3,
                            marginLeft: 4,
                            marginRight: 4,
                        }}
                        onPress={copyToClipboard}>
                    {trans('btn_see_demo')}
                </Button>
            </View>
        );
    };

    const handleSearch = async (customQuery) => {
        const apiService = new ApiService();
        const realQuery = customQuery?.length > 0 ? customQuery : query;
        loadingStack++;
        setLoading(loadingStack)

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
            {!query &&
                <Example/>
            }
            <ScrollView refreshControl={<RefreshControl refreshing={loading > 0}
                                                        colors={[theme.colors.onSurface]}
                                                        tintColor={theme.colors.onSurface}
                                                        onRefresh={handleSearch}/>}>
                {error &&
                    <Text style={{
                        textAlign: 'center',
                        color: theme.colors.error,
                        fontSize: 14,
                        margin: 14,
                    }}>
                        {error}
                    </Text>
                }
                {results?.sentences?.map((item, key) => (
                    <List.Section key={key}>
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
                ))}
                {learningLanguage &&
                    <Text style={{
                        textAlign: 'center',
                        color: theme.colors.outline,
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginBottom: 14,
                    }}>
                        You are studying {learningLanguage}.
                    </Text>
                }
                {results?.sentences &&
                    <Button icon="trash-alt"
                            mode="text"
                            textColor={theme.colors.error}
                            onPress={() => {
                                setResults([]);
                                setQuery('')
                                setLearningLanguage(null)
                                SavedSearchStore.clearSavedSearch();
                                SavedSearchStore.clearSavedSearchKeyword();
                            }}>
                        Clear Latest Search
                    </Button>
                }
            </ScrollView>
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
    componentList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10
    }
});