import { ErrorBoundary } from '@components/errors/ErrorBoundary';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

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

jest.mock('@utils/common/isDevelopment', () => ({ isDevelopment: false }));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const ThrowingChild = () => {
  throw new Error('Test render error');
};

const SafeChild = () => <Text>Child content</Text>;

describe('ErrorBoundary', () => {
  describe('render error handling', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <SafeChild />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Child content')).toBeTruthy();
    });

    it('shows GenericErrorScreen when a render error is thrown', () => {
      render(
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>,
      );
      expect(screen.getByText('error')).toBeTruthy();
    });

    it('resets to children after reset button is pressed', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>,
      );

      expect(screen.getByText('error')).toBeTruthy();

      rerender(
        <ErrorBoundary>
          <SafeChild />
        </ErrorBoundary>,
      );

      fireEvent.press(screen.getByText('common:reset'));

      expect(screen.getByText('Child content')).toBeTruthy();
    });
  });

  describe('ErrorUtils global handler', () => {
    let mockSetGlobalHandler: jest.Mock;
    let mockGetGlobalHandler: jest.Mock;

    beforeEach(() => {
      mockSetGlobalHandler = jest.fn();
      mockGetGlobalHandler = jest.fn().mockReturnValue(null);
      (globalThis as Record<string, unknown>).ErrorUtils = {
        getGlobalHandler: mockGetGlobalHandler,
        setGlobalHandler: mockSetGlobalHandler,
      };
    });

    afterEach(() => {
      delete (globalThis as Record<string, unknown>).ErrorUtils;
    });

    it('registers a global error handler on mount', () => {
      render(
        <ErrorBoundary>
          <SafeChild />
        </ErrorBoundary>,
      );
      expect(mockSetGlobalHandler).toHaveBeenCalledTimes(1);
    });

    it('restores the original handler on unmount', () => {
      const originalHandler = jest.fn();
      mockGetGlobalHandler.mockReturnValue(originalHandler);

      const { unmount } = render(
        <ErrorBoundary>
          <SafeChild />
        </ErrorBoundary>,
      );

      unmount();

      expect(mockSetGlobalHandler).toHaveBeenLastCalledWith(originalHandler);
    });

    it('shows error screen when the global handler reports an error', () => {
      let capturedHandler: ((error: Error) => void) | undefined;
      mockSetGlobalHandler.mockImplementation(handler => {
        capturedHandler = handler;
      });

      render(
        <ErrorBoundary>
          <SafeChild />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Child content')).toBeTruthy();

      act(() => {
        capturedHandler!(new Error('Async error'));
      });

      expect(screen.getByText('error')).toBeTruthy();
    });

    it('forwards the error to the original handler', () => {
      const originalHandler = jest.fn();
      mockGetGlobalHandler.mockReturnValue(originalHandler);

      let capturedHandler: ((error: Error, isFatal?: boolean) => void) | undefined;
      mockSetGlobalHandler.mockImplementation(handler => {
        capturedHandler = handler;
      });

      render(
        <ErrorBoundary>
          <SafeChild />
        </ErrorBoundary>,
      );

      const testError = new Error('Async error');

      act(() => {
        capturedHandler!(testError, false);
      });

      expect(originalHandler).toHaveBeenCalledWith(testError, false);
    });
  });
});
