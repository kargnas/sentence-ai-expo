import { getItemAsync, setItemAsync, deleteItemAsync } from './storage';

class SavedSearchStore {
    static STORAGE_KEY = 'saved_search';
    static STORAGE_KEY_KEYWORD = 'saved_search_keyword';

    async getSavedSearch() {
        const existingSavedSearchString = await getItemAsync(SavedSearchStore.STORAGE_KEY);
        return existingSavedSearchString ? JSON.parse(existingSavedSearchString) : {};
    }

    async setSavedSearch(savedSearch) {
        await setItemAsync(SavedSearchStore.STORAGE_KEY, JSON.stringify(savedSearch));
    }

    async clearSavedSearch() {
        await deleteItemAsync(SavedSearchStore.STORAGE_KEY);
    }

    async getSavedSearchKeyword() {
        const existingSavedSearchKeyword = await getItemAsync(SavedSearchStore.STORAGE_KEY_KEYWORD);
        return existingSavedSearchKeyword ? JSON.parse(existingSavedSearchKeyword) : '';
    }

    async setSavedSearchKeyword(savedSearchKeyword) {
        await setItemAsync(SavedSearchStore.STORAGE_KEY_KEYWORD, JSON.stringify(savedSearchKeyword));
    }

    async clearSavedSearchKeyword() {
        await deleteItemAsync(SavedSearchStore.STORAGE_KEY_KEYWORD);
    }
}

export default new SavedSearchStore();
