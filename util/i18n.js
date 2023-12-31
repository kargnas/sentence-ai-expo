import * as Localization from 'expo-localization';
import {I18n} from 'i18n-js';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;
I18n.defaultLocale = 'en';
I18n.locale = 'en';

import en from '../assets/locales/en.json';
import ja from '../assets/locales/ja.json';
import ko from '../assets/locales/ko.json';
import zh_cn from '../assets/locales/zh_cn.json';
import zh_tw from '../assets/locales/zh_tw.json';
import SettingStore from "./SettingStore";

let learningLanguage = null;

export const i18n = new I18n({
    en,
    ja,
    ko,
    zh_cn,
    zh_tw,
});

// Setting the locale to be used on first render
export const loadLocale = async () => {
    const asyncSelectedLanguage = await SettingStore.getLanguage();
    learningLanguage = await SettingStore.getLearningLanguage();

    if (asyncSelectedLanguage !== null) {
        i18n.locale = asyncSelectedLanguage;
    } else {
        i18n.locale = Localization.locale;
    }

    switch (i18n.locale) {
        case 'Korean':
            i18n.locale = 'ko';
            break;

        case 'Japanese':
            i18n.locale = 'ja';
            break;

        case 'Simplified Chinese':
            i18n.locale = 'zh_cn';
            break;

        case 'Traditional Chinese':
            i18n.locale = 'zh_tw';
            break;

        case 'English':
            i18n.locale = 'en';
            break;

        default:
            switch (i18n.locale.replace('_', '-').toLowerCase()) {
                case 'zh-cn':
                    i18n.locale = 'zh_cn';
                    break;

                case 'zh-tw':
                case 'zh-hk':
                    i18n.locale = 'zh_tw';
                    break;

                default:
                    switch (i18n.locale.substring(0, 2)) {
                        case 'ko':
                        case 'ja':
                        case 'en':
                            i18n.locale = i18n.locale.substring(0, 2);
                            break;

                        case 'zh':
                            i18n.locale = 'zh_cn';
                            break;

                        default:
                            i18n.locale = 'en';
                    }
            }
    }


    i18n.enableFallback = true;

    console.log(`async language: ${asyncSelectedLanguage}, locale: ${i18n.locale}`)
}

export const trans = (string, options) => {
    let message = i18n.t(string, options);
    message = message.replace(/\{learningLanguage\}/g, learningLanguage);
    return message;
}

export const updateLocale = async (langcode) => {
    i18n.locale = langcode.toString();
}

export default I18n;