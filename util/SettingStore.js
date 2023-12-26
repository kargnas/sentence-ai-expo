/**
 * Setting for these options
 * 1. A language user wanted which can override the system language.
 * 2. A language user want to learn
 */
import * as SecureStore from 'expo-secure-store';

class SettingStore {
    static STORAGE_KEY = 'setting';

    async getSetting() {
        const existingSettingString = await SecureStore.getItemAsync(SettingStore.STORAGE_KEY);
        return existingSettingString ? JSON.parse(existingSettingString) : {};
    }

    async setSetting(setting) {
        await SecureStore.setItemAsync(SettingStore.STORAGE_KEY, JSON.stringify(setting));
    }

    async clearSetting() {
        await SecureStore.deleteItemAsync(SettingStore.STORAGE_KEY);
    }

    async getLanguage() {
        const setting = await this.getSetting();
        return setting.language || null;
    }

    async setLanguage(language) {
        const setting = await this.getSetting();
        if (language === null) {
            delete setting.language;
            await this.setSetting(setting);
        } else {
            setting.language = language;
            await this.setSetting(setting);
        }
    }

    async getLearningLanguage() {
        const setting = await this.getSetting();
        return setting.learningLanguage || 'Mandarin';
    }

    async setLearningLanguage(language) {
        const setting = await this.getSetting();
        if (language === null) {
            delete setting.learningLanguage;
            await this.setSetting(setting);
        } else {
            setting.learningLanguage = language;
            await this.setSetting(setting);
        }
    }

    async getGPTVersion() {
        const setting = await this.getSetting();
        return setting.gptVersion || null;
    }

    async setGPTVersion(version) {
        const setting = await this.getSetting();
        if (version === null) {
            delete setting.gptVersion;
            await this.setSetting(setting);
        } else {
            setting.gptVersion = version;
            await this.setSetting(setting);
        }
    }


}

export default new SettingStore();