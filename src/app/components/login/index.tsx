import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import Button from '../common/button';
import { useAuth } from '../context/AuthContext';

// Type functional react component
const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setAuthToken } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    // prevent page refresh, clear errors and set loading
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // send login request with expiry, retrieve token and store in local storage
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
        expiresInMins: '60',
      });
      const token = response.data.accessToken;
      localStorage.setItem('authToken', token);
      setAuthToken(token);
    } catch (err: unknown) {
      // handle errors and set error message to display to user
      // if error is AxiosError, display error message from server
      // if error is not AxiosError, display generic error message
      // finally, set loading to false
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid credentials, please try again.');
      } else {
        setError('Error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Login</h1>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md text-gray-500 focus:ring-blue-500 focus:border-blue-500"
              placeholder='Enter your username'
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md  text-gray-500 focus:ring-blue-500 focus:border-blue-500"
              placeholder='Enter your password'
              required
            />
          </div>
          <Button type="submit" classes="w-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-400" buttonText={isLoading ? 'Logging in...' : 'Login'}isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
};

export default Login;
