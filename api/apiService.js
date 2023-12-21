import axios from 'axios';

class ApiService {
    constructor() {
        this.BASE_URL = 'https://translate.sh'
        this.axiosInstance = axios.create({
            baseURL: this.BASE_URL,
            timeout: 180 * 1000,
        });
        this.cancelToken = null;
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