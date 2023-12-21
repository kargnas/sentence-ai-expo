import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {Button, List} from "react-native-paper";
import {StyleSheet, View} from "react-native";

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result;
    } else {
        return null;
    }
}

async function getStarredList() {
    let result = await SecureStore.getItemAsync('starred');
    if (result) {
        return JSON.parse(result);
    } else {
        return [];
    }
}

async function addStarred(word, pinyin) {
    // add the word to the list
    // don't add if it's already there
    // use the function defined above
    let list = await getStarredList();
    console.log(list)
    if (!list.some(item => item.word === word)) {
        list.push({
            word,
            pinyin,
            count: 1,
            created_at: new Date().getTime(),
        });

        // order the list by word
        list.sort((a, b) => a.word.localeCompare(b.word));
        await SecureStore.setItemAsync('starred', JSON.stringify(list));
    }
}

async function removeStarred(word) {
    // remove the word from the list
    // use the function defined above
    let list = await getStarredList();
    console.log(list)
    list = list.filter(item => item.word !== word);
    await SecureStore.setItemAsync('starred', JSON.stringify(list));
}

async function isStarred(word) {
    // using the function defined above
    let list = await getStarredList();
    console.log(list)
    return list.some(item => item.word == word);
}

export default function FavoriteButton(props) {
    const { word, pinyin } = props;
    const [starred, setStarred] = useState(false);

    useEffect(() => {
        async function loadStarred() {
            const _starred = await isStarred(word);
            setStarred(_starred);
        }

        loadStarred();
    }, [word]);

    if (starred) {
        return (
            <View
                style={{
                    padding: 10,
                }}>
                <Button
                    mode="outlined"
                    icon="check"
                    onPress={() => {
                        removeStarred(word);
                        setStarred(false);
                    }}
                >
                    Favorited
                </Button>
            </View>
        );
    } else {
        return (
            <View
                style={{
                    padding: 11,
                }}>
                <Button
                    mode="contained-tonal"
                    icon="star"
                    onPress={() => {
                        addStarred(word, pinyin);
                        setStarred(true);
                    }}
                >
                    Favorite
                </Button>
            </View>
        );
    }
}

