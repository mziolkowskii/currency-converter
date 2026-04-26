import { isDevelopment } from '@utils/common/isDevelopment';
import { validateEnvs } from '@utils/validation/validateEnvs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, ReactNode, use, useCallback, useEffect, useMemo, useState } from 'react';

type SetupContextValue = {
  appReady: boolean;
  onLayoutRootView: () => Promise<void> | undefined;
};

const SetupContext = createContext<SetupContextValue | null>(null);

type SetupProviderProps = {
  children: ReactNode;
};

const SetupProvider = ({ children }: SetupProviderProps) => {
  const [loaded, error] = useFonts({
    'RethinkSans-Regular': require('@appAssets/fonts/RethinkSans-Regular.ttf'),
    'RethinkSans-Bold': require('@appAssets/fonts/RethinkSans-Bold.ttf'),
    'RethinkSans-SemiBold': require('@appAssets/fonts/RethinkSans-SemiBold.ttf'),
    'RethinkSans-Medium': require('@appAssets/fonts/RethinkSans-Medium.ttf'),
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!loaded && !error) return;

    if (error) throw error;

    const initializeApp = async () => {
      try {
        validateEnvs();
      } catch (err) {
        if (isDevelopment) {
          console.error('Error during app initialization', err);
        }
      } finally {
        setAppReady(true);
      }
    };

    initializeApp();
  }, [loaded, error]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  const contextValue: SetupContextValue = useMemo(() => ({ appReady, onLayoutRootView }), [appReady, onLayoutRootView]);

  if (!appReady) {
    return null;
  }

  return <SetupContext value={contextValue}>{children}</SetupContext>;
};

const useSetupContext = () => {
  const context = use(SetupContext);
  if (context === null) {
    throw new Error('useSetupContext must be used within SetupProvider');
  }

  return context;
};

export { SetupProvider, useSetupContext };
