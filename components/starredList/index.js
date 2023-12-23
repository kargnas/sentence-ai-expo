import * as React from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, FlatList, ScrollView, RefreshControl} from 'react-native';
import {List, Button, PaperProvider, Text, ActivityIndicator, useTheme} from "react-native-paper";
import axios from "axios";
import {SafeAreaView, SafeAreaProvider, SafeAreaInsetsContext, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import FavoriteButton from "../word/favoriteButton";
import StarStore from "../../util/StarStore";
import ApiService from "../../api/apiService";

export default function StarredList() {
    const theme = useTheme()
    const navigation = useNavigation();
    const [starredList, setStarredList] = React.useState({})
    const [loading, setLoading] = React.useState(false);

    const refreshStarredList = async () => {
        const result = await StarStore.getStars()
        console.log('StarredList', result)
        setStarredList(result)
    }

    useEffect(() => {
        refreshStarredList();
    }, []);

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading}
                                                    colors={[theme.colors.onSurface]}
                                                    tintColor={theme.colors.onSurface}
                                                    onRefresh={refreshStarredList}/>}>
            <List.Section>
                <List.Item key={'go_search'} title='Analysis New Sentences'
                           right={props =>
                               <List.Icon icon="chevron-right"/>
                           }
                           onPress={() =>
                               navigation.navigate('Search')
                           }/>
                {Object.keys(starredList).map(key => {
                    const component = starredList[key];
                    return (
                        <List.Item
                            key={key}
                            title={key}
                            left={props =>
                                <FavoriteButton word={key} style={{
                                    marginLeft: 15
                                }}/>
                            }
                            right={props =>
                                <View style={styles.wordRightContainer}>
                                    <Text style={{
                                        ...styles.meaning,
                                        color: theme.colors.outline,
                                    }}>{component?.meaning}</Text>
                                    <List.Icon icon="chevron-right"/>
                                </View>
                            }
                            onPress={() =>
                                navigation.navigate('Word', {
                                    title: `${component.word}`,
                                    component
                                })
                            }
                        />
                    )
                })}
                {/* Clear Saved Words buttons but only when the item exists at least one */}
                {Object.keys(starredList).length > 0 &&
                    <Button icon="delete"
                            mode="text"
                            textColor={theme.colors.error}
                            onPress={() => {
                                StarStore.clearStars()
                                refreshStarredList()
                            }}>
                        Clear Saved Words
                    </Button>
                }

            </List.Section>
        </ScrollView>
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