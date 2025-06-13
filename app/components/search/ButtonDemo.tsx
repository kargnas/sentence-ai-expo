import SettingStore from "../../utils/SettingStore";
import {View} from "react-native";
import {Button} from "react-native-paper";
import {trans} from "../../utils/i18n";

export default ({ onPress }) => {
    // Click to copy example sentence
    const searchDemo = async () => {
        const learningLanguage = await SettingStore.getLearningLanguage();
        let copyText = '';
        switch (learningLanguage) {
            case 'Japanese':
                copyText = '家から図書館までどのくらいかかりますか？';
                break;

            case 'Korean':
                copyText = '도서관에서 학교까지 얼마나 걸리나요? 저 지금 빨리 가야되는데...';
                break;

            case 'Korean (Polite)':
                copyText = '도서관에서 학교까지 얼마나 걸리나요? 저 지금 빨리 가야되는데...';
                break;

            case 'Korean (Casual, Inpolite)':
                copyText = '도서관에서 학교까지 얼마나 걸려? 나 지금 빨리 가야되는데...';
                break;

            case 'Mandarin':
                copyText = '我可以得到一杯冰美式咖啡吗';
                break;

            case 'Cantonese':
                copyText = '佢睇呢場戲';
                break;

            case 'English':
                copyText = 'Where are you from? What kind of country do you want to travel?';
                break;
        }

        onPress(copyText);
    }

    return (
        <View style={{
            textAlign: 'center',
            alignItems: 'center',
        }}>
            <Button icon="question-circle"
                    mode="elevated"
                    style={{
                        marginTop: 3,
                        marginBottom: 3,
                        marginLeft: 4,
                        marginRight: 4,
                    }}
                    onPress={searchDemo}>
                {trans('btn_see_demo')}
            </Button>
        </View>
    );
}