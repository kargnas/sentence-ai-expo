import * as React from 'react';
import {StyleSheet, View, FlatList, ScrollView, RefreshControl} from 'react-native';
import {List, Button, PaperProvider, Text, ActivityIndicator, useTheme} from "react-native-paper";
import {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import FavoriteButton from "../word/favoriteButton";
import StarStore from "../../util/StarStore";

let focus = 0;

export default function SavedWords({ route, navigation }) {
    const theme = useTheme()
    const [starredList, setStarredList] = React.useState({})
    const [loading, setLoading] = React.useState(false);
    const refresh = route.params?.refresh;

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
        <ScrollView refreshControl={<RefreshControl refreshing={loading}
                                                    colors={[theme.colors.onSurface]}
                                                    tintColor={theme.colors.onSurface}
                                                    onRefresh={refreshStarredList}/>}>
            <List.Section>
                {Object.keys(starredList).map(key => {
                    const component = starredList[key];
                    return (
                        <List.Item
                            key={key}
                            title={key}
                            left={props =>
                                <FavoriteButton word={key} {...props}/>
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
                {Object.keys(starredList).length > 0 &&
                    <Button icon="trash-alt"
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