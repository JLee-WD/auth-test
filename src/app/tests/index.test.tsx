import axios from 'axios';
import TodoList from '../components/todos';
import { useAuth } from '../components/context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('axios');
jest.mock('../components/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
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

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ setAuthToken: jest.fn() });
  });

  it('displays loading initially and renders todos after a successful fetch', async () => {
    const mockTodos = [
      { id: 1, todo: 'Todo 1' },
      { id: 2, todo: 'Todo 2' },
    ];
    mockedAxios.get.mockResolvedValueOnce({
      data: { todos: mockTodos, total: 20 },
    });

    render(<TodoList />);

    // Initially, show loading
    expect(screen.getByText(/loading.../i)).toBeTruthy();

    // Wait for todos to render
    await waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeTruthy();
      expect(screen.getByText('Todo 2')).toBeTruthy();
    });
  });

  it('displays an error message if fetching todos fails', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Failed to fetch todos' } },
    });

    render(<TodoList />);

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch todos/i)).toBeTruthy();
    });
  });

  it('calls handleLogout when Logout button is clicked', () => {
    const mockSetAuthToken = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({ setAuthToken: mockSetAuthToken });

    render(<TodoList />);
    fireEvent.click(screen.getByText(/logout/i));

    expect(mockSetAuthToken).toHaveBeenCalledWith(null);
  });
});