import * as React from 'react';
import {StyleSheet, View, FlatList, ScrollView, RefreshControl} from 'react-native';
import {List, Button, PaperProvider, Text, ActivityIndicator} from "react-native-paper";
import {useTheme} from '@react-navigation/native';
import {useEffect} from "react";
import { useRouter } from 'expo-router';
import FavoriteButton from "../word/favoriteButton";
import StarStore from "../../utils/StarStore";

let focus = 0;

export default function SavedWords({ route, navigation }) {
    const router = useRouter();
    const theme = useTheme()
    const [starredList, setStarredList] = React.useState({})
    const [loading, setLoading] = React.useState(false);
    const refresh = route?.params?.refresh;

    const refreshStarredList = async () => {
        const result = await StarStore.getStars()
        console.log('StarredList', result)
        setStarredList(result)
    }

    useEffect(() => {
        console.log('Refresh')
        refreshStarredList();
    }, [refresh]);

    return (
        <ScrollView 
            style={{ backgroundColor: theme.colors.background, marginBottom: -100 }} // 탭바 영역까지 확장
            contentContainerStyle={{ paddingBottom: 150 }} // 더 큰 패딩으로 조정
            refreshControl={<RefreshControl refreshing={loading}
                                                    colors={[theme.colors.text]}
                                                    tintColor={theme.colors.text}
                                                    onRefresh={refreshStarredList}/>}>
            <List.Section>
                {Object.keys(starredList).reverse().map(key => {
                    const component = starredList[key];
                    return (
                        <List.Item
                            key={key}
                            title={key}
                            titleStyle={{ color: theme.colors.text }}
                            left={props =>
                                <FavoriteButton word={key} {...props}/>
                            }
                            right={props =>
                                <View style={styles.wordRightContainer}>
                                    <Text style={{
                                        ...styles.meaning,
                                        color: theme.colors.secondaryText || theme.colors.text,
                                    }}>{component?.meaning}</Text>
                                    <List.Icon icon="chevron-right" color={theme.colors.secondaryText || theme.colors.text}/>
                                </View>
                            }
                            onPress={() =>
                                router.push({
                                    pathname: '/saved/word',
                                    params: {
                                        title: `${component.word}`,
                                        component: JSON.stringify(component)
                                    }
                                })
                            }
                        />
                    )
                })}
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
        marginRight: 3,
    }
});