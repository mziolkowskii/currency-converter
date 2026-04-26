import { GenericErrorScreen } from '@components/errors/GenericErrorScreen';
import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
  };
});

describe('GenericErrorScreen', () => {
  it('renders error title', () => {
    render(<GenericErrorScreen />);
    expect(screen.getByText('error')).toBeTruthy();
  });

  it('renders generic message when no error prop is provided', () => {
    render(<GenericErrorScreen />);
    expect(screen.getByText('generic')).toBeTruthy();
  });

  it('renders the provided error message', () => {
    render(<GenericErrorScreen error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('renders reset button when onReset is provided', () => {
    render(<GenericErrorScreen onReset={jest.fn()} />);
    expect(screen.getByText('common:reset')).toBeTruthy();
  });

  it('does not render reset button when onReset is not provided', () => {
    render(<GenericErrorScreen />);
    expect(screen.queryByText('common:reset')).toBeNull();
  });

  it('calls onReset when the reset button is pressed', () => {
    const onReset = jest.fn();
    render(<GenericErrorScreen onReset={onReset} />);
    fireEvent.press(screen.getByText('common:reset'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
