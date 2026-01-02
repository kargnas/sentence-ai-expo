// metro.config.js - see https://docs.expo.dev/guides/customizing-metro/#customizing
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watcher.additionalExts.push('mjs', 'cjs');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'react-native') {
      return context.resolveRequest(context, 'react-native-web', platform);
    }

    if (moduleName.startsWith('react-native/')) {
      const path = moduleName.replace('react-native/', '');
      
      const webMappings = {
        'Libraries/StyleSheet/processColor': 'react-native-web/dist/exports/processColor',
        'Libraries/NativeComponent/ViewConfigIgnore': 'react-native-web/dist/exports/View',
        'Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
        'Libraries/Utilities/codegenNativeComponent': 'react-native-web/dist/exports/View',
        'Libraries/Components/View/ViewPropTypes': 'react-native-web/dist/exports/View',
      };
      
      if (webMappings[path]) {
        return context.resolveRequest(context, webMappings[path], platform);
      }
      
      try {
        return context.resolveRequest(context, `react-native-web/dist/${path}`, platform);
      } catch (e) {
        return context.resolveRequest(context, 'react-native-web', platform);
      }
    }
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
