// metro.config.js - see https://docs.expo.dev/guides/customizing-metro/#customizing
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watcher.additionalExts.push('mjs', 'cjs');
module.exports = config;
