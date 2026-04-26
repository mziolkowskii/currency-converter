import { theme } from '@styles/theme';
import { memo, useMemo } from 'react';
import {
  // eslint-disable-next-line no-restricted-imports
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type TextInputProps = RNTextInputProps & {
  error?: boolean;
  right?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TextInput = memo(({ error, right, ...props }: TextInputProps) => {
  const containerStyle = useMemo(
    () => [styles.inputContainer, error && styles.errorContainer, props.containerStyle],
    [error, props.containerStyle],
  );
  const inputStyle = useMemo(() => [styles.input, theme.typography.text, props.style], [props.style]);

  return (
    <View style={containerStyle}>
      <RNTextInput {...props} style={inputStyle} />
      {right}
    </View>
  );
});

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  input: {
    color: theme.colors.primary,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  inputContainer: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
  },
  errorContainer: {
    borderColor: theme.colors.error,
  },
});
