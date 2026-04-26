import { SetupProvider, useSetupContext } from '@context/SetupContext';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

const mockUseFonts = jest.fn();
const mockHideAsync = jest.fn();
const mockValidateEnvs = jest.fn();

jest.mock('expo-font', () => ({
  useFonts: (...args: unknown[]) => mockUseFonts(...args),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: (...args: unknown[]) => mockHideAsync(...args),
}));

jest.mock('@utils/validation/validateEnvs', () => ({
  validateEnvs: (...args: unknown[]) => mockValidateEnvs(...args),
}));

jest.mock('@utils/common/isDevelopment', () => ({ isDevelopment: false }));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

beforeEach(() => {
  mockUseFonts.mockReturnValue([true, null]);
  mockHideAsync.mockResolvedValue(undefined);
  mockValidateEnvs.mockReturnValue(undefined);
});

describe('SetupProvider', () => {
  it('renders null while fonts are loading', () => {
    mockUseFonts.mockReturnValue([false, null]);
    const { toJSON } = render(
      <SetupProvider>
        <Text>child</Text>
      </SetupProvider>,
    );
    expect(toJSON()).toBeNull();
  });

  it('renders children once fonts are loaded', async () => {
    render(
      <SetupProvider>
        <Text>child</Text>
      </SetupProvider>,
    );
    expect(await screen.findByText('child')).toBeTruthy();
  });

  it('calls validateEnvs during initialization', async () => {
    render(
      <SetupProvider>
        <Text>child</Text>
      </SetupProvider>,
    );
    await screen.findByText('child');
    expect(mockValidateEnvs).toHaveBeenCalled();
  });

  it('still renders children when validateEnvs throws', async () => {
    mockValidateEnvs.mockImplementation(() => {
      throw new Error('Env validation failed');
    });
    render(
      <SetupProvider>
        <Text>child</Text>
      </SetupProvider>,
    );
    expect(await screen.findByText('child')).toBeTruthy();
  });

  it('calls SplashScreen.hideAsync when onLayoutRootView is called', async () => {
    let capturedOnLayout: (() => Promise<void> | undefined) | undefined;

    const TestChild = () => {
      const { onLayoutRootView } = useSetupContext();
      capturedOnLayout = onLayoutRootView;
      return <Text>child</Text>;
    };

    render(
      <SetupProvider>
        <TestChild />
      </SetupProvider>,
    );

    await screen.findByText('child');

    await act(async () => {
      await capturedOnLayout!();
    });

    expect(mockHideAsync).toHaveBeenCalledTimes(1);
  });
});

describe('useSetupContext', () => {
  it('provides appReady as true once setup is complete', async () => {
    const TestChild = () => {
      const { appReady } = useSetupContext();
      return <Text>{appReady ? 'ready' : 'not ready'}</Text>;
    };

    render(
      <SetupProvider>
        <TestChild />
      </SetupProvider>,
    );

    expect(await screen.findByText('ready')).toBeTruthy();
  });

  it('throws when used outside SetupProvider', () => {
    const TestComponent = () => {
      useSetupContext();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow('useSetupContext must be used within SetupProvider');
  });
});
