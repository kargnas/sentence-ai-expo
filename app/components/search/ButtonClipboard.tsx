import * as React from 'react';
// Conditional clipboard import for Expo Go compatibility
let Clipboard;
try {
    Clipboard = require("@react-native-clipboard/clipboard").default;
} catch (error) {
    // Fallback to expo-clipboard for Expo Go
    Clipboard = require("expo-clipboard");
}
import SettingStore from "../../utils/SettingStore";
import GuessLanguage from "../../utils/guessLanguage";
import {Text, View} from "react-native";
import {Button, useTheme} from "react-native-paper";
import {trans} from "../../utils/i18n";

export default ({ onPress, onClipboard, style }) => {
    const [clipboardContent, setClipboardContent] = React.useState('');
    const [initialized, setInitialized] = React.useState(true);
    const theme = useTheme()

    const decideShowClipboard = async () => {
        // if (!initialized) return;
        // setInitialized(false);
        // setTimeout(() => {
        //     setInitialized(true);
        // }, 5000);

        // const clipboardText = await Clipboard.getString();
        // const learningLanguage = await SettingStore.getLearningLanguage();
        // console.log('Clipboard: ' + clipboardText);
        // GuessLanguage.detect(clipboardText, function (language) {
        //     console.log('Language: ' + language + ' / ' + learningLanguage);
        //     if ((learningLanguage === 'Mandarin' && language === 'zh')
        //         || (learningLanguage === 'Cantonese' && language === 'zh')
        //         || (learningLanguage === 'Japanese' && language === 'ja')
        //         || (learningLanguage === 'Korean' && language === 'ko')
        //     ) {
        //         setClipboardContent(clipboardText);
        //         onClipboard(clipboardText);
        //     } else {
        //         setClipboardContent('');
        //     }
        // });
    }

    const onPressClipboard = async () => {
        const clipboardText = await Clipboard.getString();
        setClipboardContent(clipboardText)
        onPress(clipboardText);
    }

    return (
        <Button icon="copy"
                mode="text"
                rippleColor={"transparent"}
                onPress={onPressClipboard}>
            {trans('btn_paste_from_clipboard')}
        </Button>
    )
}
