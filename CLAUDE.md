# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator  
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Start for web (Expo web support)

### Building for Production
This project uses Expo Application Services (EAS):
- `eas build --platform ios --profile production` - Build iOS production app
- `eas build --platform android --profile production` - Build Android production app
- `eas build --platform all --profile preview` - Build preview versions for both platforms

Note: No lint, test, or format commands are configured in this project.

## Architecture Overview

### Tech Stack
- **Framework**: Expo SDK 49 with React Native 0.72.6
- **Navigation**: React Navigation (drawer, stack, material bottom tabs)
- **UI Components**: React Native Paper (Material Design)
- **State Management**: Custom store pattern with expo-secure-store
- **Internationalization**: i18n-js with expo-localization
- **Storage**: expo-secure-store (key-value) and expo-sqlite (database)
- **API Communication**: Axios with custom apiService layer

### Core Architecture Patterns

#### State Management
The app uses a singleton store pattern with three main stores:
- `util/SettingStore.js` - User preferences (language, GPT version, voice settings)
- `util/StarStore.js` - Favorite words management (2000 char limit)
- `util/SavedSearchStore.js` - Search result caching

All stores follow the same pattern:
- Singleton instance exported
- Async methods due to expo-secure-store
- JSON serialization for complex data
- Consistent get/set/clear API

#### API Layer
- Centralized in `api/apiService.js`
- Base URL: https://mandarin.study
- Supports request cancellation
- Adds user language preferences to headers
- Main endpoints: `/analyze`, `/pronounce`

#### Internationalization
- Configured in `util/i18n.js`
- Supports: English, Japanese, Korean, Simplified Chinese, Traditional Chinese
- Custom `trans()` function replaces `{learningLanguage}` placeholders
- Language preference persisted in SettingStore

#### Navigation Structure
Material Bottom Tab Navigator with three tabs:
1. **Search/Analysis** (`screens/SearchScreen.js`)
2. **Saved Words** (`screens/SavedWordsScreen.js`)
3. **Settings** (`screens/SettingsScreen.js`)

### Key Features Implementation

#### Text Analysis
- Clipboard integration for text input
- AI-powered analysis using GPT (version selectable in settings)
- Results displayed with pronunciation, explanations, examples

#### Audio/TTS
- Text-to-speech using expo-av
- Voice selection saved in settings
- Implemented in `components/search/TTSPlayer.js`

#### Data Persistence
- User settings: expo-secure-store
- Starred words: expo-secure-store with 2000 char limit
- Search cache: expo-secure-store
- Potential SQLite usage (expo-sqlite imported but implementation not visible)

### Project Configuration
- **App Name**: Mandarin AI
- **Bundle ID**: iOS: `com.kargnas.chinese`, Android: `com.mandarin.ai`
- **Version**: 1.2.5
- **Orientation**: Portrait only
- **Theme**: Dark mode
- **Updates**: OTA updates via expo-updates