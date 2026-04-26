import { useConvert } from '@hooks/api/converter/useConvert';
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

describe('useConvert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not run query when params are missing (enabled: false)', () => {
    const { result } = renderHook(() => useConvert({ from: null, to: 'USD', amount: 100 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should fetch conversion data successfully', async () => {
    const mockData = { data: { result: 400, rate: 4 } };
    (api.get as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useConvert({ from: 'EUR', to: 'PLN', amount: 100 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData.data);
    expect(api.get).toHaveBeenCalledWith('/convert', {
      params: { from: 'EUR', to: 'PLN', amount: 100 },
    });
  });

  it('should return error when API fails', async () => {
    const error = new Error('Network Error');
    (api.get as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useConvert({ from: 'EUR', to: 'PLN', amount: 100 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
