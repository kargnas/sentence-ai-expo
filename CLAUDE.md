# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator  
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Start for web (Expo web support)

**Reference:** [Start developing](https://docs.expo.dev/get-started/start-developing)

### Building for Production
This project uses Expo Application Services (EAS):
- `eas build --platform ios --profile production` - Build iOS production app
- `eas build --platform android --profile production` - Build Android production app
- `eas build --platform all --profile preview` - Build preview versions for both platforms

**Reference:** [Build your project for app stores](https://docs.expo.dev/deploy/build-project)

Note: No lint, test, or format commands are configured in this project.

## Architecture Overview

### Tech Stack
- **Framework**: Expo SDK 53 with React Native 0.79.3
- **Navigation**: Expo Router (file-based routing) with @bottom-tabs/react-navigation
- **UI Components**: React Native Paper (Material Design)
- **State Management**: Custom store pattern with expo-secure-store
- **Internationalization**: i18n-js with expo-localization
- **Storage**: expo-secure-store (key-value) and expo-sqlite (database)
- **API Communication**: Axios with custom apiService layer

**References:**
- [Expo Router Introduction](https://docs.expo.dev/router/introduction)
- [File-based routing](https://docs.expo.dev/develop/file-based-routing)
- [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore)
- [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite)
- [Localization](https://docs.expo.dev/guides/localization)

### Core Architecture Patterns

#### State Management
The app uses a singleton store pattern with three main stores:
- `app/utils/SettingStore.ts` - User preferences (language, GPT version, voice settings)
- `app/utils/StarStore.ts` - Favorite words management (2000 char limit)
- `app/utils/SavedSearchStore.ts` - Search result caching

All stores follow the same pattern:
- Singleton instance exported
- Async methods due to expo-secure-store
- JSON serialization for complex data
- Consistent get/set/clear API

#### API Layer
- Centralized in `app/api/apiService.ts`
- Base URL: https://mandarin.study
- Supports request cancellation
- Adds user language preferences to headers
- Main endpoints: `/analyze`, `/pronounce`

#### Internationalization
- Configured in `app/utils/i18n.ts`
- Supports: English, Japanese, Korean, Simplified Chinese, Traditional Chinese
- Custom `trans()` function replaces `{learningLanguage}` placeholders
- Language preference persisted in SettingStore

#### Navigation Structure
Expo Router file-based routing with native bottom tabs using @bottom-tabs/react-navigation:
1. **Search/Analysis** (`app/(tabs)/search/`)
2. **Saved Words** (`app/(tabs)/saved/`)
3. **Settings** (`app/(tabs)/settings/`)

**References:**
- [Tabs layout in Expo Router](https://docs.expo.dev/router/advanced/tabs)
- [Custom tab layouts](https://docs.expo.dev/router/advanced/custom-tabs)
- [Navigation layouts](https://docs.expo.dev/router/basics/layout)

### Key Features Implementation

#### Text Analysis
- Clipboard integration for text input
- AI-powered analysis using GPT (version selectable in settings)
- Results displayed with pronunciation, explanations, examples

**References:**
- [Clipboard](https://docs.expo.dev/versions/latest/sdk/clipboard)
- [Using libraries](https://docs.expo.dev/workflow/using-libraries)

#### Audio/TTS
- Text-to-speech using expo-audio (updated from expo-av in SDK 53)
- Voice selection saved in settings
- Implemented in `app/components/search/TTSPlayer.tsx`

**References:**
- [Audio (expo-audio)](https://docs.expo.dev/versions/latest/sdk/audio)
- [Audio (expo-av)](https://docs.expo.dev/versions/latest/sdk/audio-av)

#### Data Persistence
- User settings: expo-secure-store
- Starred words: expo-secure-store with 2000 char limit
- Search cache: expo-secure-store
- Potential SQLite usage (expo-sqlite imported but implementation not visible)

**References:**
- [Store data](https://docs.expo.dev/develop/user-interface/store-data)
- [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore)
- [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite)

### Project Configuration
- **App Name**: Mandarin AI
- **Bundle ID**: iOS: `as.kargn.chineselearning`, Android: `as.kargn.chineselearning`
- **Version**: 1.2.6
- **Orientation**: Portrait only
- **Theme**: Dark mode
- **Updates**: OTA updates via expo-updates
- **New Architecture**: Disabled for compatibility

**References:**
- [Configure with app config](https://docs.expo.dev/workflow/configuration)
- [Color themes](https://docs.expo.dev/develop/user-interface/color-themes)
- [Send over-the-air updates](https://docs.expo.dev/deploy/send-over-the-air-updates)
- [React Native's New Architecture](https://docs.expo.dev/guides/new-architecture)

### File Structure (Post-Refactoring)
```
app/
├── (tabs)/           # Tab-based routes
├── components/       # All UI components (TSX)
├── utils/           # Utilities and stores (TS)
├── api/             # API services (TS)
└── _layout.tsx      # Root layout
```

All components have been converted to TypeScript (.tsx/.ts) and organized within the app/ directory for better maintainability and expo-router compatibility.

**References:**
- [Using TypeScript](https://docs.expo.dev/guides/typescript)
- [Top-level src directory](https://docs.expo.dev/router/reference/src-directory)

## Troubleshooting

### Common Issues
For debugging and error resolution, refer to:
- [Debugging runtime issues](https://docs.expo.dev/debugging/runtime-issues)
- [Troubleshooting overview](https://docs.expo.dev/troubleshooting/overview)
- [Common development errors](https://docs.expo.dev/workflow/common-development-errors)
- [Expo Router troubleshooting](https://docs.expo.dev/router/reference/troubleshooting)