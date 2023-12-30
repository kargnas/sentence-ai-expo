import * as React from 'react';
import Clipboard from "@react-native-clipboard/clipboard";
import SettingStore from "../../util/SettingStore";
import GuessLanguage from "../../util/guessLanguage.js";
import {Text, View} from "react-native";
import {Button, useTheme} from "react-native-paper";
import {trans} from "../../util/i18n";

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
        <View style={{ textAlign: 'center', alignItems: 'center', ...style }}>
            <Button icon="copy"
                    mode="elevated"
                    onPress={onPressClipboard}
                    style={{ margin: 3, marginLeft: 4, marginRight: 4 }}>
                {trans('btn_clipboard')}
            </Button>
        </View>
    )
}
