import { TextVariants, theme } from '@styles/theme';
// eslint-disable-next-line no-restricted-imports
import { Text as RNText, StyleProp, TextStyle } from 'react-native';
import { memo, useMemo } from 'react';

type TextProps = {
  children: React.ReactNode;
  variant: TextVariants;
  style?: StyleProp<TextStyle>;
};

export const Text = memo(({ children, variant, style }: TextProps) => {
  const textStyle = useMemo(() => [theme.typography[variant], style], [variant, style]);

  return <RNText style={textStyle}>{children}</RNText>;
});

Text.displayName = 'Text';
