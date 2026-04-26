import { api } from '@services/api/api';
import { CurrencyRecord } from '@services/api/converter/types';
import { useQuery } from '@tanstack/react-query';
import { ONE_HOUR } from '@utils/common/timestamps';

type CurrenciesResponse = {
  meta: {
    code: number;
    disclaimer: string;
  };
  response: CurrencyRecord[];
};

const CURRENCIES_QUERY_KEY = 'currencies';

export const useGetCurrencies = () =>
  useQuery({
    queryKey: [CURRENCIES_QUERY_KEY],
    queryFn: async () => api.get<CurrenciesResponse>('/currencies'),
    select: data => data.data,
    staleTime: ONE_HOUR,
  });
