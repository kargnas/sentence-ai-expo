import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {Snackbar} from "react-native-paper";
import {useTheme} from '@react-navigation/native';
import {RefreshControl, ScrollView, SectionList, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import FavoriteButton from "./favoriteButton";
import ApiService from "../../api/apiService";
import axios from "axios";
import * as Haptics from "expo-haptics";
import ResultList from "../search/ResultList";
import Clipboard from "@react-native-clipboard/clipboard";
import {trans} from "../../util/i18n";

export default function Word(props) {
    const { component } = props?.route?.params;
    const [results, setResults] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [showCopy, setShowCopy] = React.useState(false);
    const theme = useTheme()

    const copyClipboard = async (text) => {
        Clipboard.setString(text);
        setShowCopy(true);
    }

    const handleQuery = async () => {
        const apiService = new ApiService();
        setLoading(true);
        setError(null);

        try {
            apiService.prepareForRequest();
            const response = await apiService.word(component.word);
            console.log(response.data);
            setResults(response.data);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Cancelled previous request");
            } else {
                console.error(error);
            }
            setResults(null)
            setError(error.message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        } finally {
            setLoading(false);
        }
    }

    const onRefresh = React.useCallback(() => {
        setResults(null);
        handleQuery();
    });

    useEffect(() => {
        handleQuery();
    }, [component.word]);

    let summary = '';
    if (results?.phonetics && results?.summary?.simplified) {
        if (results.summary.simplified === results.summary.traditional || !results.summary.traditional) {
            if (results?.phonetics.join(', ') === results?.summary?.simplified) {
                summary = `${results?.summary?.simplified}`
            } else {
                summary = `${results?.summary?.simplified} / ${results?.phonetics.join(', ')}`
            }
        } else {
            summary = `${results?.summary?.simplified} / ${results?.summary?.traditional} / ${results?.phonetics.join(' ')}`
        }
    }

    const sectionListData = [
        {
            title: '',
            data: [{
                styles: {
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: theme.colors.primary,
                    lineHeight: 23 * 1.5,
                    fontSize: 23,
                },
                // phonetics is an array of strings
                // text: `${implode of results?.summary?.phonetics}, ${results?.summary?.simplified}, ${results?.summary?.traditional}`
                text: summary
            }]
        },
        {
            title: 'Meaning & Concept',
            data: [{
                text: results?.summary_meaning_concept,
            }]
        },
        {
            title: 'Example',
            data: [{
                text: results?.examples,
            }]
        },
        {
            title: 'Structure',
            data: [{
                text: results?.summary_structure,
            }]
        },
        {
            title: 'Historical Meaning',
            data: [{
                text: results?.historical_meaning_changes,
            }]
        },
    ]

    if (loading && !results) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                    Loading word details...
                </Text>
            </View>
        );
    }

    if (results && results?.summary) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
                <SectionList sections={sectionListData}
                             keyExtractor={(item, index) => item + index}
                             refreshControl={<RefreshControl refreshing={loading}
                                                             colors={[theme.colors.primary]}
                                                             tintColor={theme.colors.primary}
                                                             onRefresh={handleQuery}/>}
                             renderSectionHeader={({ section: { title } }) => (
                                 <Text style={{
                                           ...styles.sectionHeader,
                                           color: theme.colors.secondaryText,
                                           backgroundColor: theme.colors.background,
                                       }}
                                 >{title}</Text>
                             )}
                             renderItem={({ item }) => <TouchableOpacity onPress={() => copyClipboard(item.text)}>
                                 <Text style={{
                                           ...styles.sectionItem,
                                           color: theme.colors.text,
                                           ...item.styles
                                       }}>{item.text}</Text>
                             </TouchableOpacity>}
                             style={styles.scrollView}
                />
                <ResultList sentences={results?.sentences}/>
                <Snackbar
                    visible={showCopy}
                    onDismiss={() => setShowCopy(false)}
                    action={{
                        label: 'Close',
                    }}>
                    {trans('toast_successful_copied')}
                </Snackbar>
            </SafeAreaView>
        );
    } else {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={loading}
                                                        colors={[theme.colors.primary]}
                                                        tintColor={theme.colors.primary}
                                                        onRefresh={handleQuery}/>}
                        style={styles.scrollView}>
                {!results && !loading && error &&
                    <Text style={{
                        textAlign: 'center',
                        color: theme.colors.notification,
                        fontSize: 14,
                        margin: 14,
                    }}>
                        {error}
                    </Text>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        margin: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
    },
    scrollView: {},
    card: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
    },
    sectionTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        marginBottom: 5,
    },
    sectionHeader: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
    },
    sectionItem: {
        lineHeight: 20,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
    },
});