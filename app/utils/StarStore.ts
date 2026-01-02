import { getItemAsync, setItemAsync, deleteItemAsync } from './storage';

class StarStore {
    static STORAGE_KEY = 'starred';

    async addStar(word, pinyin) {
        if (await this.isStar(word)) {
            return;
        }

        const existingStars = await this.getStars();
        if (JSON.stringify(existingStars).length > 2000) {
            throw new Error('Too many starred words. Please delete some.');
        }

        existingStars[word] = {
            word: word,
        };

        await setItemAsync(StarStore.STORAGE_KEY, JSON.stringify(existingStars));
    }

    async removeStar(word) {
        const existingStars = await this.getStars();
        delete existingStars[word];
        await setItemAsync(StarStore.STORAGE_KEY, JSON.stringify(existingStars));
    }

    async isStar(word) {
        const existingStars = await this.getStars();
        return existingStars.hasOwnProperty(word);
    }

    async getStars() {
        const existingStarsString = await getItemAsync(StarStore.STORAGE_KEY);
        console.log('List', existingStarsString)
        return existingStarsString ? JSON.parse(existingStarsString) : {};
    }

    async clearStars() {
        await deleteItemAsync(StarStore.STORAGE_KEY);
    }
}

export default new StarStore();
