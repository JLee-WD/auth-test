import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('handleLogin', () => {
  let authToken: string | null;
  let error: string | unknown | null;
  let isLoading: boolean;

  const setAuthToken = (token: string | null) => {
    authToken = token;
  };

  const setError = (message: string | null) => {
    error = message;
  };

  const setIsLoading = (state: boolean) => {
    isLoading = state;
  };

  const handleLogin = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
        expiresInMins: 60,
      });
      const token = response.data.accessToken;
      setAuthToken(token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError('Invalid credentials');
      } else {
        setError('Error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  beforeEach(() => {
    authToken = null;
    error = null;
    isLoading = false;
    jest.clearAllMocks();
  });

  it('should set authToken on successful login', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { accessToken: 'mocked-token' },
    });

    await handleLogin('testuser', 'password123');
    expect(authToken).toBe('mocked-token');
    expect(error).toBeNull();
    expect(isLoading).toBe(false);
  });

  it('should set error on login failure', async () => {
    await handleLogin('testuser', 'wrongpassword');
    expect(authToken).toBeNull();
    expect(isLoading).toBe(false);
  });

  it('should set a generic error if the error is not an AxiosError', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    await handleLogin('testuser', 'password123');
    expect(authToken).toBeNull();
    expect(error).toBe('Error occurred. Please try again.');
    expect(isLoading).toBe(false);
  });
});
