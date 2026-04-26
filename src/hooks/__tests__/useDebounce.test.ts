import { useDebounce } from '@hooks/useDebounce';
import { act, renderHook } from '@testing-library/react-native';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should update value only after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    );

    rerender({ value: 'updated', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset the timeout if value changes before delay finishes', () => {
    const { result, rerender } = renderHook(({ value }: { value: string }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: 'third' });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('third');
  });

  it('should clear timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('test', 500));

    expect(jest.getTimerCount()).toBe(1);

    unmount();

    expect(jest.getTimerCount()).toBe(0);
  });
});
