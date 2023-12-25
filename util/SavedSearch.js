/**
 * Saved last search result. Data would be JSON.
 */

import * as SecureStore from 'expo-secure-store';

class SavedSearch {
    static STORAGE_KEY = 'saved_search';

    async getSavedSearch() {
        const existingSavedSearchString = await SecureStore.getItemAsync(SavedSearch.STORAGE_KEY);
        return existingSavedSearchString ? JSON.parse(existingSavedSearchString) : {};
    }

    async setSavedSearch(savedSearch) {
        await SecureStore.setItemAsync(SavedSearch.STORAGE_KEY, JSON.stringify(savedSearch));
    }

    async clearSavedSearch() {
        await SecureStore.deleteItemAsync(SavedSearch.STORAGE_KEY);
    }
}

export default new SavedSearch();