const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
    extraNodeModules: {
      ...config.resolver.extraNodeModules,
      'events': require.resolve('events'),
      'stream': require.resolve('stream-browserify'),
    },
  },
};