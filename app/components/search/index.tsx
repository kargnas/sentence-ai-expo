import * as React from 'react';
import {useEffect} from "react";
import {
    StyleSheet, 
    View, 
    Text, 
    FlatList, 
    ScrollView, 
    RefreshControl, 
    Keyboard, 
    TextInput, 
    TouchableOpacity, 
    ActivityIndicator,
    Platform,
    Pressable
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation, useTheme} from "@react-navigation/native";
// Conditional clipboard import for Expo Go compatibility
let Clipboard;
try {
    Clipboard = require("@react-native-clipboard/clipboard").default;
} catch (error) {
    // Fallback to expo-clipboard for Expo Go
    Clipboard = require("expo-clipboard");
}

import * as Haptics from "expo-haptics";
import axios from "axios";

import ApiService from "../../api/apiService";

import SavedSearchStore from "../../utils/SavedSearchStore";
import SettingStore from "../../utils/SettingStore";
import {trans} from "../../utils/i18n";

import WordItem from "./WordItem";
import GuessLanguage from "../../utils/guessLanguage";
import TTSPlayer from "./TTSPlayer";
import ResultList from "./ResultList";

let loadingStack = 0;

export default function Search() {
    console.log('Search component: Rendering');
    
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

    const handleClipboardButton = async () => {
        try {
            const clipboardContent = await Clipboard.getString();
            if (clipboardContent && clipboardContent.trim().length > 0) {
                setQuery(clipboardContent.trim());
                Keyboard.dismiss();
                setTimeout(() => {
                    handleSearch(clipboardContent.trim());
                }, 300);
            }
        } catch (error) {
            console.error('Failed to get clipboard content:', error);
        }
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Search Bar Container */}
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
                <View style={[styles.searchInputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.text }]}
                        placeholder={trans('placeholder_input_text')}
                        placeholderTextColor={theme.colors.placeholder}
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                    <TouchableOpacity 
                        style={[styles.clearButton, { opacity: query.length > 0 ? 1 : 0 }]}
                        onPress={() => {
                            if (query.length > 0) {
                                setQuery('');
                            }
                        }}
                        activeOpacity={0.7}
                        disabled={query.length === 0}
                    >
                        <Text style={[styles.clearButtonText, { color: theme.colors.primary }]}>
                            ✕
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Action Buttons */}
                {!query && (
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                            onPress={() => handleClipboardButton()}
                        >
                            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                                Paste & Analyze
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.demoButton, { borderColor: theme.colors.border }]}
                            onPress={async () => {
                                const learningLanguage = await SettingStore.getLearningLanguage();
                                let demoText = '';
                                switch (learningLanguage) {
                                    case 'Japanese':
                                        demoText = '家から図書館までどのくらいかかりますか？';
                                        break;
                                    case 'Korean':
                                        demoText = '도서관에서 학교까지 얼마나 걸리나요? 저 지금 빨리 가야되는데...';
                                        break;
                                    case 'Mandarin':
                                        demoText = '我可以得到一杯冰美式咖啡吗';
                                        break;
                                    case 'Cantonese':
                                        demoText = '佢睇呢場戲';
                                        break;
                                    case 'English':
                                        demoText = 'Where are you from? What kind of country do you want to travel?';
                                        break;
                                    default:
                                        demoText = '我今天很开心';
                                        break;
                                }
                                handleDemoSearch(demoText);
                            }}
                        >
                            <Text style={[styles.demoButtonText, { color: theme.colors.primary }]}>
                                {trans('btn_see_demo')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Content Area */}
            <ScrollView 
                style={styles.contentContainer}
                contentContainerStyle={{ paddingBottom: 100 }} // 탭바 여백 추가
                refreshControl={
                    <RefreshControl 
                        refreshing={loading > 0}
                        tintColor={theme.colors.primary}
                        onRefresh={handleSearch}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading > 0 && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
                            Analyzing...
                        </Text>
                    </View>
                )}
                
                {error && (
                    <View style={[styles.errorContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.notification }]}>
                        <Text style={[styles.errorText, { color: theme.colors.notification }]}>
                            {error}
                        </Text>
                    </View>
                )}

                <ResultList sentences={results?.sentences}/>

                {learningLanguage && (
                    <View style={[styles.languageIndicator, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.languageText, { color: theme.colors.secondaryText }]}>
                            You are studying {learningLanguage}
                        </Text>
                    </View>
                )}

                {results?.sentences && (
                    <TouchableOpacity 
                        style={[styles.clearSearchButton, { borderColor: theme.colors.notification }]}
                        onPress={() => {
                            setResults([]);
                            setQuery('');
                            setLearningLanguage(null);
                            SavedSearchStore.clearSavedSearch();
                            SavedSearchStore.clearSavedSearchKeyword();
                        }}
                    >
                        <Text style={[styles.clearSearchText, { color: theme.colors.notification }]}>
                            Clear Latest Search
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        fontWeight: '400',
        paddingVertical: 8,
    },
    clearButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 24,
        minHeight: 24,
    },
    clearButtonText: {
        fontSize: 18,
        fontWeight: '300',
        textAlign: 'center',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    demoButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    demoButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    contentContainer: {
        flex: 1,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
    },
    errorContainer: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    errorText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 22,
    },
    languageIndicator: {
        margin: 16,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    languageText: {
        fontSize: 14,
        fontWeight: '500',
    },
    clearSearchButton: {
        margin: 16,
        marginTop: 8,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    clearSearchText: {
        fontSize: 16,
        fontWeight: '500',
    },
});