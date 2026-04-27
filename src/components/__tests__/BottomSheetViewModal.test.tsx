import {
  BlurredModalBackdrop,
  BottomSheetViewModal,
  useBottomSheetModalHandlers,
} from '@components/BottomSheetViewModal';
import { BOTTOM_OFFSET } from '@constants/style';
import type { BottomSheetModal as GorhomBottomSheetModal } from '@gorhom/bottom-sheet';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: View };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@hooks/useKeyboard', () => ({
  useKeyboard: () => ({
    handleStartShouldSetResponder: jest.fn().mockReturnValue(true),
    handleResponderRelease: jest.fn(),
    offset: 0,
  }),
}));

const mockUseSafeAreaInsets = useSafeAreaInsets as jest.Mock;

beforeEach(() => {
  mockUseSafeAreaInsets.mockReturnValue({ bottom: 0, top: 0, left: 0, right: 0 });
});

describe('useBottomSheetModalHandlers', () => {
  it('calls present() on the ref when handleOpenBottomSheetModal is called', () => {
    const { result } = renderHook(() => useBottomSheetModalHandlers());
    const mockPresent = jest.fn();
    result.current.bottomSheetModalRef.current = {
      present: mockPresent,
      dismiss: jest.fn(),
    } as unknown as GorhomBottomSheetModal;
    act(() => result.current.handleOpenBottomSheetModal());
    expect(mockPresent).toHaveBeenCalledTimes(1);
  });

  it('calls dismiss() on the ref when handleCloseBottomSheetModal is called', () => {
    const { result } = renderHook(() => useBottomSheetModalHandlers());
    const mockDismiss = jest.fn();
    result.current.bottomSheetModalRef.current = {
      present: jest.fn(),
      dismiss: mockDismiss,
    } as unknown as GorhomBottomSheetModal;
    act(() => result.current.handleCloseBottomSheetModal());
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });
});

describe('BlurredModalBackdrop', () => {
  const animatedIndex = { value: 0 } as unknown as import('react-native-reanimated').SharedValue<number>;
  const animatedPosition = { value: 0 } as unknown as import('react-native-reanimated').SharedValue<number>;

  const setup = (pressBehavior: 'close' | 'collapse' | 'none' = 'close') => {
    const mockDismiss = jest.fn();
    const ref = {
      current: { dismiss: mockDismiss },
    } as unknown as React.RefObject<GorhomBottomSheetModal>;

    render(
      <BlurredModalBackdrop
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        ref={ref}
        pressBehavior={pressBehavior}
        testID="backdrop-touchable"
      />,
    );

    return { mockDismiss };
  };

  it('calls dismiss() when pressBehavior is "close" and backdrop is pressed', () => {
    const { mockDismiss } = setup('close');

    const backdrop = screen.getByTestId('backdrop-touchable');

    fireEvent.press(backdrop);

    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls dismiss() when pressBehavior is "collapse" and backdrop is pressed', () => {
    const { mockDismiss } = setup('collapse');

    const backdrop = screen.getByTestId('backdrop-touchable');
    fireEvent.press(backdrop);

    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call dismiss() when pressBehavior is "none" and backdrop is pressed', () => {
    const { mockDismiss } = setup('none');

    const backdrop = screen.getByTestId('backdrop-touchable');
    fireEvent.press(backdrop);

    expect(mockDismiss).not.toHaveBeenCalled();
  });
});

describe('BottomSheetViewModal', () => {
  it('renders children', () => {
    const ref = createRef<GorhomBottomSheetModal>();
    render(
      <BottomSheetViewModal ref={ref}>
        <View testID="child" />
      </BottomSheetViewModal>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('applies the bottomOffset prop as paddingBottom', () => {
    const ref = createRef<GorhomBottomSheetModal>();
    render(
      <BottomSheetViewModal ref={ref} bottomOffset={40}>
        <View />
      </BottomSheetViewModal>,
    );
    const flatStyle = StyleSheet.flatten(screen.getByTestId('bottom-sheet-view').props.style);
    expect(flatStyle).toMatchObject({ paddingBottom: 40 });
  });

  it('uses BOTTOM_OFFSET as paddingBottom when bottom inset is less than BOTTOM_OFFSET', () => {
    mockUseSafeAreaInsets.mockReturnValue({ bottom: 0, top: 0, left: 0, right: 0 });
    const ref = createRef<GorhomBottomSheetModal>();
    render(
      <BottomSheetViewModal ref={ref}>
        <View />
      </BottomSheetViewModal>,
    );
    const flatStyle = StyleSheet.flatten(screen.getByTestId('bottom-sheet-view').props.style);
    expect(flatStyle).toMatchObject({ paddingBottom: BOTTOM_OFFSET });
  });

  it('uses bottom inset as paddingBottom when it exceeds BOTTOM_OFFSET', () => {
    mockUseSafeAreaInsets.mockReturnValue({ bottom: 50, top: 0, left: 0, right: 0 });
    const ref = createRef<GorhomBottomSheetModal>();
    render(
      <BottomSheetViewModal ref={ref}>
        <View />
      </BottomSheetViewModal>,
    );
    const flatStyle = StyleSheet.flatten(screen.getByTestId('bottom-sheet-view').props.style);
    expect(flatStyle).toMatchObject({ paddingBottom: 50 });
  });

  it('wraps children in BottomSheetView when isScrollable is not provided', () => {
    const ref = createRef<GorhomBottomSheetModal>();
    render(
      <BottomSheetViewModal ref={ref}>
        <View testID="child" />
      </BottomSheetViewModal>,
    );
    expect(screen.getByTestId('bottom-sheet-view')).toBeTruthy();
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('wraps children in BottomSheetView when isScrollable is false', () => {
    const ref = createRef<GorhomBottomSheetModal>();
    render(
      <BottomSheetViewModal ref={ref} isScrollable={false}>
        <View testID="child" />
      </BottomSheetViewModal>,
    );
    expect(screen.getByTestId('bottom-sheet-view')).toBeTruthy();
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('renders children directly without BottomSheetView when isScrollable is true', () => {
    const ref = createRef<GorhomBottomSheetModal>();
    render(
      <BottomSheetViewModal ref={ref} isScrollable>
        <View testID="child" />
      </BottomSheetViewModal>,
    );
    expect(screen.queryByTestId('bottom-sheet-view')).toBeNull();
    expect(screen.getByTestId('child')).toBeTruthy();
  });
});
