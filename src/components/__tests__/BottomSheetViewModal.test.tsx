import {
  BlurredModalBackdrop,
  BottomSheetViewModal,
  useBottomSheetModalHandlers,
} from '@components/BottomSheetViewModal';
import { BOTTOM_OFFSET } from '@constants/style';
import type { BottomSheetModal as GorhomBottomSheetModal } from '@gorhom/bottom-sheet';
import { act, render, renderHook, screen } from '@testing-library/react-native';
import { ComponentProps, ComponentType, ReactNode, RefObject, createRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: { createAnimatedComponent: (Component: ComponentType) => Component },
  interpolate: () => 0,
  useAnimatedProps: (fn: () => unknown) => fn(),
}));

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: View };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const { forwardRef } = require('react') as typeof import('react');
  const { View } = require('react-native') as typeof import('react-native');
  return {
    BottomSheetModal: forwardRef<GorhomBottomSheetModal, { children: ReactNode }>(({ children }, ref) => (
      <View ref={ref as unknown as RefObject<View>}>{children}</View>
    )),
    BottomSheetView: ({ children, style, ...props }: ComponentProps<typeof View>) => (
      <View testID="bottom-sheet-view" style={style} {...props}>
        {children}
      </View>
    ),
  };
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
  const animatedIndex = { value: 0 } as unknown as SharedValue<number>;
  const animatedPosition = { value: 0 } as unknown as SharedValue<number>;

  it('calls dismiss() when pressBehavior is "close" and backdrop is pressed', () => {
    const mockDismiss = jest.fn();
    const ref = { current: { dismiss: mockDismiss } } as unknown as RefObject<GorhomBottomSheetModal>;
    render(
      <BlurredModalBackdrop
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        ref={ref}
        pressBehavior="close"
      />,
    );
    const touchable = screen.UNSAFE_getByType(TouchableWithoutFeedback);
    act(() => touchable.props.onPress?.());
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls dismiss() when pressBehavior is "collapse" and backdrop is pressed', () => {
    const mockDismiss = jest.fn();
    const ref = { current: { dismiss: mockDismiss } } as unknown as RefObject<GorhomBottomSheetModal>;
    render(
      <BlurredModalBackdrop
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        ref={ref}
        pressBehavior="collapse"
      />,
    );
    const touchable = screen.UNSAFE_getByType(TouchableWithoutFeedback);
    act(() => touchable.props.onPress?.());
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call dismiss() when pressBehavior is "none" and backdrop is pressed', () => {
    const mockDismiss = jest.fn();
    const ref = { current: { dismiss: mockDismiss } } as unknown as RefObject<GorhomBottomSheetModal>;
    render(
      <BlurredModalBackdrop
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        ref={ref}
        pressBehavior="none"
      />,
    );
    const touchable = screen.UNSAFE_getByType(TouchableWithoutFeedback);
    act(() => touchable.props.onPress?.());
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
});
