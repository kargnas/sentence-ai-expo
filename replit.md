# Mandarin AI - Chinese Learning App

## Overview
A React Native/Expo app for learning Mandarin Chinese with AI-powered text analysis. The app runs on web (port 5000) and mobile platforms.

## Project Structure
```
app/
├── (tabs)/              # Tab-based navigation
│   ├── _layout.tsx      # Tab layout (platform-specific: Expo tabs for web, native tabs for mobile)
│   ├── search.tsx       # AI text analysis screen
│   ├── saved.tsx        # Saved words screen
│   └── settings.tsx     # Settings screen
├── components/          # Reusable components
│   ├── search/          # Search/analysis components
│   ├── saved/           # Saved words components
│   └── settings/        # Settings components
├── utils/               # Utility modules
│   ├── storage.ts       # Cross-platform storage (localStorage for web, expo-secure-store for native)
│   ├── SettingStore.ts  # User settings persistence
│   ├── SavedSearchStore.ts # Search history persistence
│   └── StarStore.ts     # Starred words persistence
├── i18n/                # Internationalization
└── _layout.tsx          # Root layout
```

## Key Configuration

### Web Platform
- Port: 5000
- Uses Expo tabs for web navigation
- Storage: localStorage wrapper

### Mobile Platform  
- Uses native bottom tabs (@bottom-tabs/react-navigation)
- Storage: expo-secure-store

## Technical Details

### SDK Version
- Expo SDK 52 (downgraded from 53 for react-native-web compatibility)
- React Native 0.76.9
- react-native-web 0.19.13

### Metro Configuration
Custom resolver in `metro.config.js` maps React Native internal paths to react-native-web equivalents for web bundling.

### Platform-Specific Code
- Tab navigation: Web uses Expo Router tabs, native uses @bottom-tabs/react-navigation
- Storage: Web uses localStorage, native uses expo-secure-store

## Running the App

### Development (Web)
```bash
npm run web
```
Opens at http://localhost:5000

### Features
1. **Analysis Tab**: Enter text for AI-powered Chinese language analysis
2. **Saved Tab**: View and manage saved words
3. **Settings Tab**: Configure language preferences, GPT version, voice settings

## Recent Changes (2026-01-02)
- Configured Expo web to run on port 5000
- Downgraded from Expo SDK 53 to SDK 52 for react-native-web compatibility
- Created cross-platform storage utility for web/native
- Implemented platform-specific tab navigation
- Fixed dependency issues (removed cld package, downgraded make-plural)
