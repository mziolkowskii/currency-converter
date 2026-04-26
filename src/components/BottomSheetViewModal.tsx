import { BOTTOM_OFFSET } from '@constants/style';
import {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
  BottomSheetView,
  BottomSheetModal as GorhomBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BackdropPressBehavior } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useKeyboard } from '@hooks/useKeyboard';
import { theme } from '@styles/theme';
import { BlurView } from 'expo-blur';
import { memo, RefObject, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { interpolate, useAnimatedProps } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetViewModalProps = BottomSheetModalProps & {
  onBackdropPress?: () => void;
  children: React.ReactNode;
  ref: RefObject<GorhomBottomSheetModal | null>;
  bottomOffset?: number;
  pressBehavior?: BackdropPressBehavior;
  isScrollable?: boolean;
};

type BottomSheetCustomBackdropProps = BottomSheetBackdropProps & {
  ref: RefObject<GorhomBottomSheetModal | null>;
  pressBehavior: BackdropPressBehavior;
  testID?: string;
  onBackdropPress?: () => void;
};

export const useBottomSheetModalHandlers = () => {
  const bottomSheetModalRef = useRef<GorhomBottomSheetModal>(null);

  const handleOpenBottomSheetModal = useCallback(() => bottomSheetModalRef.current?.present(), []);
  const handleCloseBottomSheetModal = useCallback(() => bottomSheetModalRef.current?.dismiss(), []);

  return useMemo(
    () => ({ bottomSheetModalRef, handleOpenBottomSheetModal, handleCloseBottomSheetModal }),
    [handleOpenBottomSheetModal, handleCloseBottomSheetModal],
  );
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const BlurredModalBackdrop = memo(
  ({ animatedIndex, pressBehavior = 'none', ref, testID }: BottomSheetCustomBackdropProps) => {
    const animatedProps = useAnimatedProps(() => {
      const intensity = interpolate(animatedIndex.value, [-1, 0], [0, 30], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });

      return {
        intensity: Math.floor(intensity),
      };
    });

    const handlePress = useCallback(() => {
      if (pressBehavior === 'close' || pressBehavior === 'collapse') {
        ref.current?.dismiss();
      }
    }, [pressBehavior, ref]);

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <AnimatedBlurView style={StyleSheet.absoluteFill} animatedProps={animatedProps} tint="dark" testID={testID} />
      </TouchableWithoutFeedback>
    );
  },
);

BlurredModalBackdrop.displayName = 'BlurredModalBackdrop';

export const BottomSheetViewModal = ({
  children,
  ref,
  pressBehavior = 'none',
  bottomOffset,
  isScrollable,
  ...props
}: BottomSheetViewModalProps) => {
  const { bottom } = useSafeAreaInsets();
  const { handleStartShouldSetResponder, handleResponderRelease } = useKeyboard();

  const defaultBottomOffset = bottom > BOTTOM_OFFSET ? bottom : BOTTOM_OFFSET;
  const containerStyle = [styles.container, { paddingBottom: bottomOffset ?? defaultBottomOffset }];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BlurredModalBackdrop {...props} ref={ref} pressBehavior={pressBehavior} />,
    [pressBehavior, ref],
  );

  return (
    <GorhomBottomSheetModal
      {...props}
      ref={ref}
      backdropComponent={renderBackdrop}
      handleComponent={null}
      backgroundStyle={styles.background}
    >
      {isScrollable ? (
        <BottomSheetView
          style={containerStyle}
          onStartShouldSetResponder={handleStartShouldSetResponder}
          onResponderRelease={handleResponderRelease}
        >
          {children}
        </BottomSheetView>
      ) : (
        children
      )}
    </GorhomBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  container: {
    gap: 24,
    paddingHorizontal: 24,
  },
});
