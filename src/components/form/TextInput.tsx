import { theme } from '@styles/theme';
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

export const TextInput = ({ error, right, ...props }: TextInputProps) => {
  const containerStyle = [styles.inputContainer, error && styles.errorContainer, props.containerStyle];
  const inputStyle = [styles.input, theme.typography.text, props.style];

  return (
    <View style={containerStyle}>
      <RNTextInput {...props} style={inputStyle} />
      {right}
    </View>
  );
};

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
