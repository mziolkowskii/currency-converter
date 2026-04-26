import { HomeScreen } from '@screens/HomeScreen';
import { fireEvent, render, screen } from '@testing-library/react-native';

const mockOnLayoutRootView = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        title: 'Currency Converter',
        description: 'Convert currencies and get the latest exchange rates',
      };
      return translations[key] ?? key;
    },
  }),
}));

jest.mock('@context/SetupContext', () => ({
  useSetupContext: () => ({ onLayoutRootView: mockOnLayoutRootView }),
}));

jest.mock('@hooks/useKeyboard', () => ({
  useKeyboard: () => ({ offset: 0 }),
}));

jest.mock('react-native-keyboard-controller', () => {
  const { View } = require('react-native');
  return {
    KeyboardAwareScrollView: ({ children, ...props }: React.ComponentProps<typeof View>) => (
      <View {...props}>{children}</View>
    ),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style, onLayout }: React.ComponentProps<typeof View>) => (
      <View testID="safe-area-view" style={style} onLayout={onLayout}>
        {children}
      </View>
    ),
  };
});

jest.mock('@components/features/home/CurrencyConverter', () => {
  const { View } = require('react-native');
  return {
    CurrencyConverter: () => <View testID="currency-converter" />,
  };
});

describe('HomeScreen', () => {
  it('renders the title', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Currency Converter')).toBeTruthy();
  });

  it('renders the description', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Convert currencies and get the latest exchange rates')).toBeTruthy();
  });

  it('renders the CurrencyConverter', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('currency-converter')).toBeTruthy();
  });

  it('calls onLayoutRootView when the root view fires a layout event', () => {
    render(<HomeScreen />);
    fireEvent(screen.getByTestId('safe-area-view'), 'layout');
    expect(mockOnLayoutRootView).toHaveBeenCalledTimes(1);
  });
});
