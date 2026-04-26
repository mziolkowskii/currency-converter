import { ErrorBoundary } from '@components/errors/ErrorBoundary';
import { SetupProvider } from '@context/SetupContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScreenProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import '../i18n/config';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const STACK_SCREEN_OPTIONS: ScreenProps['options'] = {
  headerShown: false,
  animation: 'fade',
};

const RootLayout = () => (
  <GestureHandlerRootView>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SetupProvider>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <Stack screenOptions={STACK_SCREEN_OPTIONS}>
                <Stack.Screen name="index" />
              </Stack>
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </SetupProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </GestureHandlerRootView>
);

export default RootLayout;
