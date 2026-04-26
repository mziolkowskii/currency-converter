import { useGetCurrencies } from '@hooks/api/converter/useGetCurrencies';
import { api } from '@services/api/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';

jest.mock('@services/api/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useGetCurrencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch currencies and return only the data portion (via select)', async () => {
    const mockApiResponse = {
      data: {
        meta: { code: 200, disclaimer: 'Usage limits apply' },
        response: [
          { code: 'USD', name: 'US Dollar' },
          { code: 'PLN', name: 'Polish Zloty' },
        ],
      },
    };

    (api.get as jest.Mock).mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useGetCurrencies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockApiResponse.data);

    expect(api.get).toHaveBeenCalledWith('/currencies');
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors gracefully', async () => {
    const apiError = new Error('Service Unavailable');
    (api.get as jest.Mock).mockRejectedValue(apiError);

    const { result } = renderHook(() => useGetCurrencies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(apiError);
    expect(result.current.data).toBeUndefined();
  });

  it('should cache data and not refetch within the staleTime period', async () => {
    const mockData = { data: { response: [] } };
    (api.get as jest.Mock).mockResolvedValue(mockData);

    const wrapper = createWrapper();

    const { result, rerender } = renderHook(() => useGetCurrencies(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender(undefined);

    expect(api.get).toHaveBeenCalledTimes(1);
  });
});
