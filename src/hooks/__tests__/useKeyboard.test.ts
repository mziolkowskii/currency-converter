import { BOTTOM_OFFSET } from '@constants/style';
import { useKeyboard } from '@hooks/useKeyboard';
import { renderHook } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

describe('useKeyboard', () => {
  let dismissSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseSafeAreaInsets.mockReturnValue({ bottom: 0, top: 0, left: 0, right: 0 });
    dismissSpy = jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});
  });

  afterEach(() => {
    dismissSpy.mockRestore();
  });

  describe('offset', () => {
    it('returns BOTTOM_OFFSET when safe area bottom inset is 0', () => {
      const { result } = renderHook(() => useKeyboard());
      expect(result.current.offset).toBe(BOTTOM_OFFSET);
    });

    it('subtracts safe area bottom inset from BOTTOM_OFFSET', () => {
      mockUseSafeAreaInsets.mockReturnValue({ bottom: 34, top: 0, left: 0, right: 0 });
      const { result } = renderHook(() => useKeyboard());
      expect(result.current.offset).toBe(BOTTOM_OFFSET - 34);
    });
  });

  describe('handleStartShouldSetResponder', () => {
    it('always returns true to capture touch events', () => {
      const { result } = renderHook(() => useKeyboard());
      expect(result.current.handleStartShouldSetResponder()).toBe(true);
    });
  });

  describe('handleResponderRelease', () => {
    it('dismisses the keyboard on release', () => {
      const { result } = renderHook(() => useKeyboard());
      result.current.handleResponderRelease();
      expect(dismissSpy).toHaveBeenCalledTimes(1);
    });
  });
});
