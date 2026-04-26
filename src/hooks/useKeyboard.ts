import { BOTTOM_OFFSET } from '@constants/style';
import { useCallback, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useKeyboard = () => {
  const { bottom } = useSafeAreaInsets();

  const handleStartShouldSetResponder = useCallback(() => {
    return true;
  }, []);

  const handleResponderRelease = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return useMemo(
    () => ({
      offset: -bottom + BOTTOM_OFFSET,
      handleStartShouldSetResponder,
      handleResponderRelease,
    }),
    [bottom, handleStartShouldSetResponder, handleResponderRelease],
  );
};
