import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useEffect, useState} from 'react'; // new import
import {Button, List} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import FavoriteButton from "./favoriteButton";


export default function Word(props) {
    const { component } = props?.route?.params;
    return (
        <>
            <FavoriteButton word={component.word} pinyin={component.pinyin}/>

            <List.Section>
                <List.Subheader>{component.word}</List.Subheader>
                <List.Item title={component.pinyin}/>
            </List.Section>
        </>
    );
}

