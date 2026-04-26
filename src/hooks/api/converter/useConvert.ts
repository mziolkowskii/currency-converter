import { api } from '@services/api/api';
import { CurrencyConversionRecord } from '@services/api/converter/types';
import { useQuery } from '@tanstack/react-query';
import { ONE_MINUTE } from '@utils/common/timestamps';

type ConvertCurrencyProps = {
  from: string | null;
  to: string | null;
  amount: number;
};

const CURRENCY_CONVERSION_QUERY_KEY = 'currency-conversion';

export const useConvert = ({ amount, from, to }: ConvertCurrencyProps) =>
  useQuery({
    queryKey: [CURRENCY_CONVERSION_QUERY_KEY, from, to, amount],
    queryFn: async () => api.get<CurrencyConversionRecord>('/convert', { params: { amount, from, to } }),
    select: data => data.data,
    staleTime: 5 * ONE_MINUTE,
    enabled: !!from && !!to && !!amount,
  });
