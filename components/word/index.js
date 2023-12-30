import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {ActivityIndicator, Button, Card, List, Text, useTheme} from "react-native-paper";
import {RefreshControl, ScrollView, SectionList, StyleSheet, View} from "react-native";
import FavoriteButton from "./favoriteButton";
import ApiService from "../../api/apiService";
import axios from "axios";
import * as Haptics from "expo-haptics";

export default function Word(props) {
    const { component } = props?.route?.params;
    const [results, setResults] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const theme = useTheme()

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
            summary = `${results?.summary?.simplified} / ${results?.phonetics.join(', ')}`
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
                    lineHeight: 30,
                    fontSize: 25,
                },
                // phonetics is an array of strings
                // text: `${implode of results?.summary?.phonetics}, ${results?.summary?.simplified}, ${results?.summary?.traditional}`
                text: summary
            }]
        },
        {
            title: 'Structure',
            data: [{
                text: results?.summary_structure,
            }]
        },
        {
            title: 'Meaning & Concept',
            data: [{
                text: results?.summary_meaning_concept,
            }]
        },
        {
            title: 'Historical Meaning',
            data: [{
                text: results?.historical_meaning_changes,
            }]
        },
    ]

    if (results && results?.summary) {
        return (
            <>
                <SectionList sections={sectionListData}
                             keyExtractor={(item, index) => item + index}
                             refreshControl={<RefreshControl refreshing={loading}
                                                             colors={[theme.colors.onSurface]}
                                                             tintColor={theme.colors.onSurface}
                                                             onRefresh={handleQuery}/>}
                             renderSectionHeader={({ section: { title } }) => (
                                 <Text variant="titleSmall"
                                       style={{
                                           ...styles.sectionHeader,
                                           color: theme.colors.outline
                                       }}
                                 >{title}</Text>
                             )}
                             renderItem={({ item }) => <Text variant="bodyMedium"
                                                             style={{
                                                                 ...styles.sectionItem,
                                                                 ...item.styles
                                                             }}>{item.text}</Text>}
                             style={styles.sectionList}
                />
            </>
        );
    } else {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={loading}
                                                        colors={[theme.colors.onSurface]}
                                                        tintColor={theme.colors.onSurface}
                                                        onRefresh={handleQuery}/>}
                        style={styles.scrollView}>
                {!results && !loading && error &&
                    <Text style={{
                        textAlign: 'center',
                        color: theme.colors.error,
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