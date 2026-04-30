import { CurrencyConversionRecord } from '@services/api/converter/types';
import { create } from 'zustand';

type HistorySlice = {
  history: CurrencyConversionRecord[];
};

type HistorySliceActions = {
  addHistoryItem: (item: CurrencyConversionRecord) => void;
};

type HistorySliceType = HistorySlice & HistorySliceActions;

const pushHistoryElement = (history: HistorySliceType['history'], item: CurrencyConversionRecord) => {
  if (history.length > 4) {
    return [item, ...history.filter((_value, index) => index < 4)];
  }

  return [item, ...history];
};

export const useConversionHistorySlice = create<HistorySliceType>(set => ({
  history: [],
  addHistoryItem: item => set(state => ({ history: pushHistoryElement(state.history, item) })),
}));
