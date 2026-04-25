import { ExpoConfig } from "expo/config";

const PACKAGE_NAME = "com.tds.currencyconverter";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? null;

if (!API_KEY) {
  throw new Error(
    "Unknown API key! Please set the EXPO_PUBLIC_API_KEY environment variable.",
  );
}

const config: ExpoConfig = {
  name: "Currency Converter",
  slug: "currency-converter",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "currencyconverter",
  userInterfaceStyle: "automatic",
  platforms: ["ios", "android"],
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: PACKAGE_NAME,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#FFFFFF",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    package: PACKAGE_NAME,
    softwareKeyboardLayoutMode: "pan",
    predictiveBackGestureEnabled: false,
  },
  owner: "mziolkowskii",
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
