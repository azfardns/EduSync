export default {
  expo: {
    name: 'DiplomaTrack',
    slug: 'diplomatrack',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'diplomatrack',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    }
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.diplomatrack'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.diplomatrack'
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser'
    ],
    experiments: {
      typedRoutes: true
    },
    newArchEnabled: true
  }
};