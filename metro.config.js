const { getDefaultConfig } = require('expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs', 'cjs'],
    extraNodeModules: {
      ...defaultConfig.resolver.extraNodeModules,
      'events': require.resolve('events'),
      'stream': require.resolve('stream-browserify'),
      'net': require.resolve('react-native-tcp'),
      'tls': require.resolve('react-native-tcp'),
    },
  },
};