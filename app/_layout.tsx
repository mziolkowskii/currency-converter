import { ErrorBoundary } from '@components/errors/ErrorBoundary';
import { SetupProvider } from '@context/SetupContext';
import { ScreenProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import '../src/i18n/config';

SplashScreen.preventAutoHideAsync();

const STACK_SCREEN_OPTIONS: ScreenProps['options'] = {
  headerShown: false,
  animation: 'fade',
};

const RootLayout = () => (
  <ErrorBoundary>
    <SetupProvider>
      <Stack screenOptions={STACK_SCREEN_OPTIONS}>
        <Stack.Screen name="index" />
      </Stack>
    </SetupProvider>
  </ErrorBoundary>
);

export default RootLayout;
