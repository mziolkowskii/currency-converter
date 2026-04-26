import { ButtonVariants, theme } from '@styles/theme';
import { memo } from 'react';
import { Pressable } from 'react-native';
import { Text } from './typography/Text';

type ButtonProps = {
  onPress: () => void;
  label: string;
  variant: ButtonVariants;
};

export const Button = memo(({ label, onPress, variant }: ButtonProps) => (
  <Pressable style={theme.buttons[variant]} onPress={onPress}>
    <Text variant="button">{label}</Text>
  </Pressable>
));

Button.displayName = 'Button';
