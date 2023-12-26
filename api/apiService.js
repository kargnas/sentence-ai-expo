import axios from 'axios';
import {getLocales} from 'expo-localization';
import SettingStore from "../util/SettingStore";

class ApiService {
    constructor() {
        this.BASE_URL = 'https://translate.sh'
        this.axiosInstance = axios.create({
            baseURL: this.BASE_URL,
            timeout: 180 * 1000,
        });
        this.cancelToken = null;
    }

    async language() {
        const language = await SettingStore.getLanguage();
        return language ? language : getLocales()[0].languageCode;
    }

    prepareForRequest() {
        // cancel the previous request
        if (this.cancelToken) {
            this.cancelToken.cancel();
        }
        // create a new cancel token
        this.cancelToken = axios.CancelToken.source();
    }

    async analysis(text) {
        const lan = await this.language();
        const learningLanguage = await SettingStore.getLearningLanguage();
        const gptVersion = await SettingStore.getGPTVersion();

        console.log(`Requesting analysis with text: ${text}, with language ${lan}`);
        return this.axiosInstance.post('/api/analysis', {
            text,
            learningLanguage: learningLanguage,
            gptVersion: gptVersion,
        }, {
            cancelToken: this.cancelToken.token,
            headers: {
                'Accept-Language': lan,
            }
        });
    }

    async word(text) {
        const lan = await this.language();
        const learningLanguage = await SettingStore.getLearningLanguage();
        const gptVersion = await SettingStore.getGPTVersion();

        console.log(`Requesting word with text: ${text}, with language ${lan}`);
        return this.axiosInstance.post('/api/word', {
            text,
            learningLanguage: learningLanguage,
            gptVersion: gptVersion,
        }, {
            cancelToken: this.cancelToken.token,
            headers: {
                'Accept-Language': lan,
            }
        });
    }
}

export default ApiService;