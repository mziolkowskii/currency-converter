import { SetupProvider } from '@context/SetupContext';
import { ScreenProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

const STACK_SCREEN_OPTIONS: ScreenProps['options'] = {
  headerShown: false,
  animation: 'fade',
};

const RootLayout = () => (
  <SetupProvider>
    <Stack screenOptions={STACK_SCREEN_OPTIONS}>
      <Stack.Screen name="index" />
    </Stack>
  </SetupProvider>
);

export default RootLayout;
