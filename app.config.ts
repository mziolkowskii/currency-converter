import { ExpoConfig } from 'expo/config';

const PACKAGE_NAME = 'com.tds.currencyconverter';

const config: ExpoConfig = {
  name: 'Currency Converter',
  slug: 'currency-converter',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'currencyconverter',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: PACKAGE_NAME,
    icon: {
      dark: './assets/images/ios-dark.png',
      light: './assets/images/ios-light.png',
      tinted: './assets/images/ios-tinted.png',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/images/adaptive-icon.png',
      monochromeImage: './assets/images/adaptive-icon.png',
    },
    package: PACKAGE_NAME,
    softwareKeyboardLayoutMode: 'pan',
    predictiveBackGestureEnabled: false,
  },
  owner: 'mziolkowskii',
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon-dark.png',
        backgroundColor: '#FFFFFF',
        imageWidth: 200,
        resizeMode: 'contain',
        dark: {
          image: './assets/images/splash-icon-light.png',
          backgroundColor: '#000000',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
