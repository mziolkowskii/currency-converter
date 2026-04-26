import { BOTTOM_OFFSET } from '@constants/style';
import { useBottomOffset } from '@hooks/useBottomOffset';
import { renderHook } from '@testing-library/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

beforeEach(() => {
  mockUseSafeAreaInsets.mockReturnValue({ bottom: 0, top: 0, left: 0, right: 0 });
});

describe('useBottomOffset', () => {
  it('returns bottom inset plus default BOTTOM_OFFSET when no offset provided', () => {
    const { result } = renderHook(() => useBottomOffset());
    expect(result.current).toBe(BOTTOM_OFFSET);
  });

  it('adds safe area bottom inset to the default offset', () => {
    mockUseSafeAreaInsets.mockReturnValue({ bottom: 34, top: 0, left: 0, right: 0 });
    const { result } = renderHook(() => useBottomOffset());
    expect(result.current).toBe(34 + BOTTOM_OFFSET);
  });

  it('uses custom offset instead of default when provided', () => {
    const { result } = renderHook(() => useBottomOffset(16));
    expect(result.current).toBe(16);
  });

  it('adds safe area bottom inset to custom offset', () => {
    mockUseSafeAreaInsets.mockReturnValue({ bottom: 34, top: 0, left: 0, right: 0 });
    const { result } = renderHook(() => useBottomOffset(16));
    expect(result.current).toBe(50);
  });

  it('uses 0 as offset when explicitly passed (not falling back to default)', () => {
    mockUseSafeAreaInsets.mockReturnValue({ bottom: 34, top: 0, left: 0, right: 0 });
    const { result } = renderHook(() => useBottomOffset(0));
    expect(result.current).toBe(34);
  });
});
