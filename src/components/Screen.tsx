import { SCREEN_PADDING_HORIZONTAL } from '@constants/style';
import { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: React.ReactNode;
  onLayout?: () => void;
  edges?: Edges;
  style?: StyleProp<ViewStyle>;
};

export const Screen = memo(({ children, onLayout, edges = ['top'], style }: ScreenProps) => {
  const containerStyle = [styles.container, style];

  return (
    <SafeAreaView edges={edges} style={containerStyle} onLayout={onLayout}>
      {children}
    </SafeAreaView>
  );
});

Screen.displayName = 'Screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
