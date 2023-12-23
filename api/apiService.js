import axios from 'axios';
import {getLocales} from 'expo-localization';

class ApiService {
    constructor() {
        this.BASE_URL = 'https://translate.sh'
        this.axiosInstance = axios.create({
            baseURL: this.BASE_URL,
            timeout: 180 * 1000,
            headers: {
                'Accept-Language': this.language(),
            },
        });
        this.cancelToken = null;
    }

    language() {
        return getLocales()[0].languageTag;
    }

    prepareForRequest() {
        // cancel the previous request
        if (this.cancelToken) {
            this.cancelToken.cancel();
        }
        // create a new cancel token
        this.cancelToken = axios.CancelToken.source();
    }

    analysis(text) {
        console.log(`Requesting analysis with text: ${text}`);
        return this.axiosInstance.post('/api/analysis', { text }, { cancelToken: this.cancelToken.token });
    }

    word(text) {
        console.log(`Requesting word with text: ${text}`);
        return this.axiosInstance.post('/api/word', { text }, { cancelToken: this.cancelToken.token });
    }
}

export default ApiService;