import { CurrencyConverter } from '@components/features/home/CurrencyConverter';
import { useConvert } from '@hooks/api/converter/useConvert';
import { useGetCurrencies } from '@hooks/api/converter/useGetCurrencies';
import { CurrencyRecord } from '@services/api/converter/types';
import type { FlashListProps } from '@shopify/flash-list';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const mockCurrencies: CurrencyRecord[] = [
  {
    id: 1,
    name: 'US Dollar',
    code: 'USD',
    short_code: 'USD',
    precision: 2,
    subunit: 100,
    symbol: '$',
    symbol_first: true,
    decimal_mark: '.',
    thousands_separator: ',',
  },
  {
    id: 2,
    name: 'Euro',
    code: 'EUR',
    short_code: 'EUR',
    precision: 2,
    subunit: 100,
    symbol: '€',
    symbol_first: true,
    decimal_mark: '.',
    thousands_separator: ',',
  },
];

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

jest.mock('@hooks/api/converter/useGetCurrencies', () => ({
  useGetCurrencies: jest.fn(),
}));

jest.mock('@hooks/api/converter/useConvert', () => ({
  useConvert: jest.fn(),
}));

jest.mock('@hooks/useBottomOffset', () => ({
  useBottomOffset: () => 0,
}));

jest.mock('@shopify/flash-list', () => {
  const { View: RNView } = require('react-native');
  return {
    FlashList: <T,>({ data, renderItem, keyExtractor }: FlashListProps<T>) => (
      <RNView>
        {data?.map((item, index) => (
          <RNView key={keyExtractor ? keyExtractor(item, index) : String(index)}>
            {renderItem?.({ item, index, target: 'Cell' })}
          </RNView>
        ))}
      </RNView>
    ),
  };
});

jest.mock('@components/BottomSheetViewModal', () => {
  const { useRef, useCallback, useMemo } = require('react');
  const { View: RNView } = require('react-native');
  return {
    BottomSheetViewModal: ({ children }: { children: React.ReactNode }) => (
      <RNView testID="bottom-sheet-modal">{children}</RNView>
    ),
    useBottomSheetModalHandlers: () => {
      const ref = useRef(null);
      const handleOpenBottomSheetModal = useCallback(() => {}, []);
      const handleCloseBottomSheetModal = useCallback(() => {}, []);
      return useMemo(
        () => ({
          bottomSheetModalRef: ref,
          handleOpenBottomSheetModal,
          handleCloseBottomSheetModal,
        }),
        [handleOpenBottomSheetModal, handleCloseBottomSheetModal],
      );
    },
  };
});

jest.mock('@assets/ChevronDownIcon', () => {
  const { View: RNView } = require('react-native');
  return { ChevronDownIcon: () => <RNView testID="chevron-icon" /> };
});

jest.mock('@components/form/FormField', () => {
  const { useController } = require('react-hook-form');
  const { View: RNView, Text: RNText } = require('react-native');
  return {
    FormField: ({ name, control, right }: { name: string; control: unknown; right?: React.ReactNode }) => {
      const { field } = useController({ name, control, defaultValue: '' });
      return (
        <RNView testID={`form-field-${name}`}>
          <RNText testID={`form-field-value-${name}`}>{field.value}</RNText>
          {right}
        </RNView>
      );
    },
  };
});

jest.mock('@components/Skeleton', () => {
  const { View: RNView } = require('react-native');
  return { Skeleton: () => <RNView testID="skeleton" /> };
});

jest.mock('@components/errors/GenericErrorView', () => {
  const { Pressable: RNPressable, View: RNView } = require('react-native');
  return {
    GenericErrorView: ({ refetch }: { refetch?: () => void }) => (
      <RNView testID="generic-error-view">
        {refetch && <RNPressable testID="generic-error-refetch" onPress={refetch} />}
      </RNView>
    ),
  };
});

jest.mock('@components/Button', () => {
  const { Pressable: RNPressable, Text: RNText } = require('react-native');
  return {
    Button: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <RNPressable onPress={onPress} testID={`button-${label}`}>
        <RNText>{label}</RNText>
      </RNPressable>
    ),
  };
});

const defaultGetCurrenciesMock = {
  data: { response: mockCurrencies },
  isPending: false,
  error: null,
  refetch: jest.fn(),
};

describe('CurrencyConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetCurrencies as jest.Mock).mockReturnValue(defaultGetCurrenciesMock);
    (useConvert as jest.Mock).mockReturnValue({ data: undefined });
  });

  describe('loading state', () => {
    it('renders skeletons while currencies are loading', () => {
      (useGetCurrencies as jest.Mock).mockReturnValue({
        data: undefined,
        isPending: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<CurrencyConverter />);
      expect(screen.getAllByTestId('skeleton')).toHaveLength(2);
    });

    it('does not render the form while loading', () => {
      (useGetCurrencies as jest.Mock).mockReturnValue({
        data: undefined,
        isPending: true,
        error: null,
        refetch: jest.fn(),
      });
      render(<CurrencyConverter />);
      expect(screen.queryByTestId('dropdown-from')).toBeNull();
    });
  });

  describe('error state', () => {
    it('renders GenericErrorView when currencies fail to load', () => {
      (useGetCurrencies as jest.Mock).mockReturnValue({
        data: undefined,
        isPending: false,
        error: new Error('Network error'),
        refetch: jest.fn(),
      });
      render(<CurrencyConverter />);
      expect(screen.getByTestId('generic-error-view')).toBeTruthy();
    });

    it('does not render the form when there is an error', () => {
      (useGetCurrencies as jest.Mock).mockReturnValue({
        data: undefined,
        isPending: false,
        error: new Error('Network error'),
        refetch: jest.fn(),
      });
      render(<CurrencyConverter />);
      expect(screen.queryByTestId('dropdown-from')).toBeNull();
    });

    it('passes refetch to GenericErrorView so the user can retry', () => {
      const mockRefetch = jest.fn();
      (useGetCurrencies as jest.Mock).mockReturnValue({
        data: undefined,
        isPending: false,
        error: new Error('Network error'),
        refetch: mockRefetch,
      });
      render(<CurrencyConverter />);
      fireEvent.press(screen.getByTestId('generic-error-refetch'));
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset form', () => {
    it('clears both dropdown labels after pressing reset', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));
      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      fireEvent.press(screen.getByTestId('button-resetForm'));

      expect(screen.getByTestId('dropdown-from')).not.toHaveTextContent('USD');
      expect(screen.getByTestId('dropdown-to')).not.toHaveTextContent('EUR');
    });
  });

  describe('convert data side effects', () => {
    it('sets valueTo when convert result matches from→to direction', () => {
      (useConvert as jest.Mock).mockReturnValue({
        data: { from: 'USD', to: 'EUR', amount: 100, value: 85.5, timestamp: 0, date: '' },
      });

      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));
      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      expect(screen.getByTestId('form-field-value-valueTo')).toHaveTextContent('85.5');
    });

    it('sets valueFrom when convert result matches to→from direction', () => {
      (useConvert as jest.Mock).mockReturnValue({
        data: { from: 'EUR', to: 'USD', amount: 100, value: 117.2, timestamp: 0, date: '' },
      });

      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));
      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      expect(screen.getByTestId('form-field-value-valueFrom')).toHaveTextContent('117.2');
    });

    it('does not update any field when convert result currency pair does not match selection', () => {
      (useConvert as jest.Mock).mockReturnValue({
        data: { from: 'GBP', to: 'JPY', amount: 100, value: 200, timestamp: 0, date: '' },
      });

      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));
      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      expect(screen.getByTestId('form-field-value-valueTo')).not.toHaveTextContent('200');
      expect(screen.getByTestId('form-field-value-valueFrom')).not.toHaveTextContent('200');
    });
  });

  describe('dropdown labels', () => {
    it('shows the selected currency code as label on the from dropdown after selection', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));

      expect(screen.getByTestId('dropdown-from')).toHaveTextContent('USD');
    });

    it('shows the selected currency code as label on the to dropdown after selection', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      expect(screen.getByTestId('dropdown-to')).toHaveTextContent('EUR');
    });

    it('from and to dropdowns track selections independently', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));

      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      expect(screen.getByTestId('dropdown-from')).toHaveTextContent('USD');
      expect(screen.getByTestId('dropdown-to')).toHaveTextContent('EUR');
    });
  });

  describe('currency item highlight', () => {
    it('applies a background color to the selected currencyFrom item when mode is from', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));

      const item = screen.getByTestId('currency-item-USD');
      const flatStyle = StyleSheet.flatten(item.props.style);

      expect(flatStyle.backgroundColor).toBeDefined();
    });

    it('does not apply a background color to non-selected items', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));

      const nonSelectedItem = screen.getByTestId('currency-item-EUR');
      const flatStyle = StyleSheet.flatten(nonSelectedItem.props.style);

      expect(flatStyle.backgroundColor).toBeUndefined();
    });

    it('applies a background color to the selected currencyTo item when mode is to', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      const item = screen.getByTestId('currency-item-EUR');
      const flatStyle = StyleSheet.flatten(item.props.style);

      expect(flatStyle.backgroundColor).toBeDefined();
    });

    it('highlights currencyFrom selection when in from mode, not currencyTo selection', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));

      const fromItemStyle = StyleSheet.flatten(screen.getByTestId('currency-item-USD').props.style);
      const toItemStyle = StyleSheet.flatten(screen.getByTestId('currency-item-EUR').props.style);

      expect(fromItemStyle.backgroundColor).toBeDefined();
      expect(toItemStyle.backgroundColor).toBeUndefined();
    });

    it('highlights currencyTo selection when in to mode, not currencyFrom selection', () => {
      render(<CurrencyConverter />);

      fireEvent.press(screen.getByTestId('dropdown-from'));
      fireEvent.press(screen.getByTestId('currency-item-USD'));

      fireEvent.press(screen.getByTestId('dropdown-to'));
      fireEvent.press(screen.getByTestId('currency-item-EUR'));

      const toItemStyle = StyleSheet.flatten(screen.getByTestId('currency-item-EUR').props.style);
      const fromItemStyle = StyleSheet.flatten(screen.getByTestId('currency-item-USD').props.style);

      expect(toItemStyle.backgroundColor).toBeDefined();
      expect(fromItemStyle.backgroundColor).toBeUndefined();
    });
  });
});
