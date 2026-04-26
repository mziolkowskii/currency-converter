import { ChevronDownIcon } from '@assets/ChevronDownIcon';
import { BottomSheetViewModal, useBottomSheetModalHandlers } from '@components/BottomSheetViewModal';
import { Button } from '@components/Button';
import { GenericErrorView } from '@components/errors/GenericErrorView';
import { FormField } from '@components/form/FormField';
import { Skeleton } from '@components/Skeleton';
import { Text } from '@components/typography/Text';
import { useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConvert } from '@hooks/api/converter/useConvert';
import { useGetCurrencies } from '@hooks/api/converter/useGetCurrencies';
import { useBottomOffset } from '@hooks/useBottomOffset';
import { useDebounce } from '@hooks/useDebounce';
import { CurrencyRecord } from '@services/api/converter/types';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { theme } from '@styles/theme';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import z from 'zod';

type DropdownProps = {
  onPress: () => void;
  label?: string;
  testID?: string;
};

const Dropdown = memo(({ label, onPress, testID }: DropdownProps) => (
  <Pressable style={styles.dropdown} onPress={onPress} testID={testID}>
    {label ? <Text variant="text">{label}</Text> : null}
    <ChevronDownIcon />
  </Pressable>
));

Dropdown.displayName = 'Dropdown';

const SKELETON_HEIGHT = 56;
const SNAP_POINTS = ['80%'];

export const CurrencyConverter = () => {
  const { t } = useTranslation('home');
  const bottomOffset = useBottomOffset();
  const { bottomSheetModalRef, handleOpenBottomSheetModal, handleCloseBottomSheetModal } =
    useBottomSheetModalHandlers();
  const BottomSheetFlashListScrollable = useBottomSheetScrollableCreator();
  const {
    data: currenciesData,
    isPending: isCurrenciesPending,
    error: currenciesError,
    refetch: refetchCurrencies,
  } = useGetCurrencies();

  const [dropdownMode, setDropdownMode] = useState<'from' | 'to'>('from');
  const [activeField, setActiveField] = useState<'from' | 'to'>('from');
  const [currencyFrom, setCurrencyFrom] = useState<string | null>(null);
  const [currencyTo, setCurrencyTo] = useState<string | null>(null);

  const flashListRef = useRef<FlashListRef<CurrencyRecord>>(null);

  const footerStyle = useMemo(() => [{ paddingBottom: bottomOffset }], [bottomOffset]);
  const listContentStyle = useMemo(() => [styles.listContent, { paddingBottom: bottomOffset }], [bottomOffset]);
  const currencies = useMemo(() => currenciesData?.response ?? [], [currenciesData]);

  const activeSelectedCode = dropdownMode === 'from' ? currencyFrom : currencyTo;

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
        valueTo: z
          .string()
          .transform(val => val.trim().replace(/,/g, '.'))
          .pipe(
            z
              .string()
              .min(1, { message: t('form.validation.value') })
              .regex(/^\d+(\.\d+)?$/, { message: t('form.validation.invalidValue') }),
          ),
      }),
    [t],
  );

  type CurrencyConverterFormValues = z.infer<typeof schema>;
  const {
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CurrencyConverterFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const watchedValueFrom = useWatch({ control, name: 'valueFrom' });
  const watchedValueTo = useWatch({ control, name: 'valueTo' });
  const debouncedValueFrom = useDebounce(watchedValueFrom, 500);
  const debouncedValueTo = useDebounce(watchedValueTo, 500);

  const convertParams =
    activeField === 'from'
      ? { from: currencyFrom, to: currencyTo, amount: Number(debouncedValueFrom) }
      : { from: currencyTo, to: currencyFrom, amount: Number(debouncedValueTo) };

  const { data: convertData } = useConvert(convertParams);

  useEffect(() => {
    if (!convertData) return;
    if (convertData.from === currencyFrom && convertData.to === currencyTo) {
      setValue('valueTo', String(convertData.value), { shouldValidate: false });
    } else if (convertData.from === currencyTo && convertData.to === currencyFrom) {
      setValue('valueFrom', String(convertData.value), { shouldValidate: false });
    }
  }, [convertData, currencyFrom, currencyTo, setValue]);

  const handleResetForm = useCallback(() => {
    setCurrencyFrom(null);
    setCurrencyTo(null);
    setActiveField('from');
    reset({ valueFrom: '', valueTo: '' });
  }, [reset]);

  const handleMapTextInputChange = useCallback((text: string) => {
    return text.replace(/,/g, '.');
  }, []);

  const handleFocusFrom = useCallback(() => setActiveField('from'), []);
  const handleFocusTo = useCallback(() => setActiveField('to'), []);

  const handleOpenCurrencyFromBottomSheetModal = useCallback(() => {
    setDropdownMode('from');
    handleOpenBottomSheetModal();
  }, [handleOpenBottomSheetModal]);

  const handleOpenCurrencyToBottomSheetModal = useCallback(() => {
    setDropdownMode('to');
    handleOpenBottomSheetModal();
  }, [handleOpenBottomSheetModal]);

  const handleAnimate = useCallback(
    (_fromIndex: number, toIndex: number) => {
      if (toIndex === 0 && activeSelectedCode) {
        const index = currencies.findIndex(c => c.short_code === activeSelectedCode);
        if (index !== -1) {
          flashListRef.current?.scrollToIndex({ index, animated: true });
        }
      }
    },
    [activeSelectedCode, currencies],
  );

  const keyExtractor = useCallback((item: CurrencyRecord) => item.short_code, []);

  const renderItem = useCallback(
    ({ item }: { item: CurrencyRecord }) => {
      const isSelected = item.short_code === activeSelectedCode;
      return (
        <Pressable
          testID={`currency-item-${item.short_code}`}
          style={[styles.item, isSelected && styles.itemSelected]}
          onPress={() => {
            if (dropdownMode === 'from') {
              setCurrencyFrom(item.short_code);
            } else {
              setCurrencyTo(item.short_code);
            }
            handleCloseBottomSheetModal();
          }}
        >
          <Text variant="text">{item.name}</Text>
        </Pressable>
      );
    },
    [activeSelectedCode, dropdownMode, handleCloseBottomSheetModal],
  );

  if (currenciesError) {
    return (
      <View style={styles.errorContainer}>
        <GenericErrorView refetch={refetchCurrencies} error={currenciesError.message} />
      </View>
    );
  }

  if (isCurrenciesPending) {
    return (
      <View style={styles.formContainer}>
        <Skeleton height={SKELETON_HEIGHT} />
        <Skeleton height={SKELETON_HEIGHT} />
      </View>
    );
  }

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
            onFocus={handleFocusFrom}
            errorLabel={errors.valueFrom?.message}
            right={
              <Dropdown
                testID="dropdown-from"
                label={currencyFrom ?? undefined}
                onPress={handleOpenCurrencyFromBottomSheetModal}
              />
            }
          />
          <FormField
            control={control}
            name="valueTo"
            variant="textWithDropdown"
            placeholder={t('form.valuePlaceholder')}
            keyboardType="numeric"
            mapTextInputChange={handleMapTextInputChange}
            onFocus={handleFocusTo}
            errorLabel={errors.valueTo?.message}
            right={
              <Dropdown
                testID="dropdown-to"
                label={currencyTo ?? undefined}
                onPress={handleOpenCurrencyToBottomSheetModal}
              />
            }
          />
        </View>
        <View style={footerStyle}>
          <Button label={t('resetForm')} onPress={handleResetForm} variant="primary" />
        </View>
      </View>
      <BottomSheetViewModal
        ref={bottomSheetModalRef}
        pressBehavior="close"
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        style={styles.modal}
        onAnimate={handleAnimate}
      >
        <FlashList
          ref={flashListRef}
          data={currencies}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          renderScrollComponent={BottomSheetFlashListScrollable}
          contentContainerStyle={listContentStyle}
        />
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
  modal: {
    paddingVertical: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  itemSelected: {
    backgroundColor: theme.colors.primary20,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});
