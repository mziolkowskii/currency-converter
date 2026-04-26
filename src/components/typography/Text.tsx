import { TextVariants, theme } from '@styles/theme';
// eslint-disable-next-line no-restricted-imports
import { Text as RNText, StyleProp, TextStyle } from 'react-native';

type TextProps = {
  children: React.ReactNode;
  variant: TextVariants;
  style?: StyleProp<TextStyle>;
};

export const Text = ({ children, variant, style }: TextProps) => {
  const textStyle = [theme.typography[variant], style];

  return <RNText style={textStyle}>{children}</RNText>;
};
