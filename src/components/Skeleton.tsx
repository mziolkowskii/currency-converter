import { theme } from '@styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { type DimensionValue, type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SHIMMER_DURATION_MS = 1200;
const SHIMMER_WIDTH_RATIO = 0.6;

type SkeletonProps = {
  height: number;
  backgroundColor?: string;
  borderRadius?: number;
  highlightColor?: string;
  width?: DimensionValue;
};

export const Skeleton = memo(
  ({
    width,
    height,
    borderRadius = 8,
    backgroundColor = theme.colors.white,
    highlightColor = theme.colors.lightGray,
  }: SkeletonProps) => {
    const containerWidth = useSharedValue(0);
    const progress = useSharedValue(0);

    useEffect(() => {
      progress.value = withRepeat(
        withTiming(1, {
          duration: SHIMMER_DURATION_MS,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        false,
      );
      return () => {
        cancelAnimation(progress);
      };
    }, [progress]);

    const skeletonStyles = useMemo(
      () => [styles.container, { width: width ?? '100%', height, borderRadius, backgroundColor }],
      [width, height, borderRadius, backgroundColor],
    );

    const shimmerStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: containerWidth.value * (-SHIMMER_WIDTH_RATIO + progress.value * (1 + SHIMMER_WIDTH_RATIO)),
        },
      ],
    }));

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        containerWidth.set(e.nativeEvent.layout.width);
      },
      [containerWidth],
    );

    return (
      <View style={skeletonStyles} onLayout={onLayout} testID="skeleton-container">
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={[backgroundColor, highlightColor, backgroundColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  shimmer: {
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: `${SHIMMER_WIDTH_RATIO * 100}%`,
  },
});

Skeleton.displayName = 'Skeleton';
