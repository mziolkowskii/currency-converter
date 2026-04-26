import { BOTTOM_OFFSET } from '@constants/style';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useBottomOffset = (offset?: number) => {
  const { bottom } = useSafeAreaInsets();
  return useMemo(() => bottom + (offset ?? BOTTOM_OFFSET), [bottom, offset]);
};
