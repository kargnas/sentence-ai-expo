/**
 * Saved last search result. Data would be JSON.
 */

import * as SecureStore from 'expo-secure-store';

class SavedSearchStore {
    static STORAGE_KEY = 'saved_search';
    static STORAGE_KEY_KEYWORD = 'saved_search_keyword';

    async getSavedSearch() {
        const existingSavedSearchString = await SecureStore.getItemAsync(SavedSearchStore.STORAGE_KEY);
        return existingSavedSearchString ? JSON.parse(existingSavedSearchString) : {};
    }

    async setSavedSearch(savedSearch) {
        await SecureStore.setItemAsync(SavedSearchStore.STORAGE_KEY, JSON.stringify(savedSearch));
    }

    async clearSavedSearch() {
        await SecureStore.deleteItemAsync(SavedSearchStore.STORAGE_KEY);
    }

    async getSavedSearchKeyword() {
        const existingSavedSearchKeyword = await SecureStore.getItemAsync(SavedSearchStore.STORAGE_KEY_KEYWORD);
        return existingSavedSearchKeyword ? JSON.parse(existingSavedSearchKeyword) : '';
    }

    async setSavedSearchKeyword(savedSearchKeyword) {
        await SecureStore.setItemAsync(SavedSearchStore.STORAGE_KEY_KEYWORD, JSON.stringify(savedSearchKeyword));
    }

    async clearSavedSearchKeyword() {
        await SecureStore.deleteItemAsync(SavedSearchStore.STORAGE_KEY_KEYWORD);
    }
}

export default new SavedSearchStore();