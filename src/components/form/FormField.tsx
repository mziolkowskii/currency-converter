import { Text } from '@components/typography/Text';
import { theme } from '@styles/theme';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TextInput as TextInputComponent, TextInputProps as TextInputComponentProps } from './TextInput';

export type Option<TValue extends string = string> = {
  label: string;
  value: TValue;
};

type FormFieldBaseProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  defaultValue?: string;
  errorLabel?: string;
  label?: string;
  placeholder?: string;
  viewStyle?: StyleProp<ViewStyle>;
};

type TextInputProps<TFieldValues extends FieldValues = FieldValues> = FormFieldBaseProps<TFieldValues> &
  TextInputComponentProps & {
    mapTextInputChange?: (text: string) => string;
  };

type FormFieldPropsText<TFieldValues extends FieldValues = FieldValues> = TextInputProps<TFieldValues> & {
  variant: 'textWithDropdown';
};

type FormFieldProps<TFieldValues extends FieldValues = FieldValues> = FormFieldPropsText<TFieldValues>;

const TextInputWithDropdown = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  errorLabel,
  label,
  mapTextInputChange,
  ...props
}: FormFieldPropsText<TFieldValues>) => (
  <View style={styles.container}>
    {label ? <Text variant="label">{label}</Text> : null}
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <TextInputComponent
          {...field}
          {...props}
          onChangeText={mapTextInputChange ? (text: string) => onChange(mapTextInputChange(text)) : onChange}
          error={!!errorLabel}
        />
      )}
    />
    {errorLabel ? (
      <Text variant="textSmall" style={styles.errorLabel}>
        {errorLabel}
      </Text>
    ) : null}
  </View>
);

export function FormField<TFieldValues extends FieldValues = FieldValues>(props: FormFieldProps<TFieldValues>) {
  switch (props.variant) {
    case 'textWithDropdown':
      return <TextInputWithDropdown {...props} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  errorLabel: {
    color: theme.colors.error,
  },
});
