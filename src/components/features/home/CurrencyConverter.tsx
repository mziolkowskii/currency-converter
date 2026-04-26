import { ChevronDownIcon } from '@assets/ChevronDownIcon';
import { BottomSheetViewModal, useBottomSheetModalHandlers } from '@components/BottomSheetViewModal';
import { Button } from '@components/Button';
import { FormField } from '@components/form/FormField';
import { Text } from '@components/typography/Text';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBottomOffset } from '@hooks/useBottomOffset';
import { theme } from '@styles/theme';
import { memo, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import z from 'zod';

type DropdownProps = {
  onPress: () => void;
  label?: string;
};

const Dropdown = memo(({ label, onPress }: DropdownProps) => (
  <Pressable style={styles.dropdown} onPress={onPress}>
    {label ? <Text variant="text">{label}</Text> : null}
    <ChevronDownIcon />
  </Pressable>
));

Dropdown.displayName = 'Dropdown';

export const CurrencyConverter = () => {
  const { t } = useTranslation(['home', 'common']);
  const bottomOffset = useBottomOffset();
  const { bottomSheetModalRef, handleOpenBottomSheetModal, handleCloseBottomSheetModal } =
    useBottomSheetModalHandlers();

  const footerStyle = useMemo(() => [{ paddingBottom: bottomOffset }], [bottomOffset]);

  const schema = useMemo(
    () =>
      z.object({
        valueFrom: z
          .string()
          .transform(val => val.trim().replace(/,/g, '.'))
          .pipe(
            z
              .string()
              .min(1, { message: t('form.validation.value') })
              .regex(/^\d+(\.\d+)?$/, { message: t('form.validation.invalidValue') }),
          ),
        currencyFrom: z.string().min(1, { message: t('form.validation.currency') }),
        valueTo: z
          .string()
          .transform(val => val.trim().replace(/,/g, '.'))
          .pipe(
            z
              .string()
              .min(1, { message: t('form.validation.value') })
              .regex(/^\d+(\.\d+)?$/, { message: t('form.validation.invalidValue') }),
          ),
        currencyTo: z.string().min(1, { message: t('form.validation.currency') }),
      }),
    [t],
  );

  type CurrencyConverterFormValues = z.infer<typeof schema>;
  const { control, reset } = useForm<CurrencyConverterFormValues>({
    resolver: zodResolver(schema),
  });

  const handleResetForm = useCallback(() => reset({ valueFrom: '', valueTo: '' }), [reset]);

  const handleMapTextInputChange = useCallback((text: string) => {
    return text.replace(/,/g, '.');
  }, []);

  const handleOpenCurrencyFromBottomSheetModal = useCallback(() => {
    handleOpenBottomSheetModal();
  }, [handleOpenBottomSheetModal]);

  const handleOpenCurrencyToBottomSheetModal = useCallback(() => {
    handleOpenBottomSheetModal();
  }, [handleOpenBottomSheetModal]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <FormField
            control={control}
            name="valueFrom"
            variant="textWithDropdown"
            placeholder={t('form.valuePlaceholder')}
            keyboardType="numeric"
            mapTextInputChange={handleMapTextInputChange}
            right={<Dropdown label="PLN" onPress={handleOpenCurrencyFromBottomSheetModal} />}
          />
          <FormField
            control={control}
            name="valueTo"
            variant="textWithDropdown"
            placeholder={t('form.valuePlaceholder')}
            keyboardType="numeric"
            mapTextInputChange={handleMapTextInputChange}
            right={<Dropdown onPress={handleOpenCurrencyToBottomSheetModal} />}
          />
        </View>
        <View style={footerStyle}>
          <Button label={t('resetForm')} onPress={handleResetForm} variant="primary" />
        </View>
      </View>
      <BottomSheetViewModal ref={bottomSheetModalRef} pressBehavior="close">
        <View>
          <Button label={t('common:confirm')} onPress={handleCloseBottomSheetModal} variant="primary" />
        </View>
      </BottomSheetViewModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
  },
  formContainer: {
    flex: 1,
    gap: 16,
  },
  dropdown: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 8,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
