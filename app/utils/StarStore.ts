import * as SecureStore from 'expo-secure-store';

class StarStore {
    static STORAGE_KEY = 'starred';

    async addStar(word, pinyin) {
        if (await this.isStar(word)) {
            // The word is already starred, so don't add it again
            return;
        }

        const existingStars = await this.getStars();
        if (JSON.stringify(existingStars).length > 2000) {
            throw new Error('Too many starred words. Please delete some.');
        }

        existingStars[word] = {
            word: word,
        };

        await SecureStore.setItemAsync(StarStore.STORAGE_KEY, JSON.stringify(existingStars));
    }

    async removeStar(word) {
        const existingStars = await this.getStars();
        delete existingStars[word];
        await SecureStore.setItemAsync(StarStore.STORAGE_KEY, JSON.stringify(existingStars));
    }

    async isStar(word) {
        const existingStars = await this.getStars();
        return existingStars.hasOwnProperty(word);
    }

    async getStars() {
        const existingStarsString = await SecureStore.getItemAsync(StarStore.STORAGE_KEY);
        console.log('List', existingStarsString)
        return existingStarsString ? JSON.parse(existingStarsString) : {};
    }

    async clearStars() {
        await SecureStore.deleteItemAsync(StarStore.STORAGE_KEY);
    }
}

export default new StarStore();