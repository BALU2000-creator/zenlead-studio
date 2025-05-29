// src/contexts/AuthContext.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

// Mock authService
vi.mock('../services/authService', () => ({
  authService: {
    loginUser: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test component to consume the context
const TestConsumerComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{String(auth.isAuthenticated)}</div>
      <div data-testid="isLoading">{String(auth.isLoading)}</div>
      <div data-testid="user">{JSON.stringify(auth.user)}</div>
      <div data-testid="token">{auth.token}</div>
      <button onClick={() => auth.login('test@example.com', 'password')}>Login</button>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();
  });

  const mockUser = { _id: '1', firstName: 'Test', lastName: 'User', email: 'test@example.com', credits: 100 };
  const mockToken = 'test-token';

  it('should have initial state as not authenticated, not loading, no user, no token', () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('isLoading').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('');
  });

  it('login should update context and localStorage on successful API call', async () => {
    (authService.loginUser as vi.Mock).mockResolvedValueOnce({ user: mockUser, access_token: mockToken });
    
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });
    
    expect(screen.getByTestId('isLoading').textContent).toBe('true'); // Check loading state during API call

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });

    expect(screen.getByTestId('isLoading').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
    expect(screen.getByTestId('token').textContent).toBe(mockToken);
    expect(localStorageMock.getItem('authUser')).toBe(JSON.stringify(mockUser));
    expect(localStorageMock.getItem('authToken')).toBe(mockToken);
    expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('login should handle API error and not update context/localStorage', async () => {
    const loginError = new Error('Invalid credentials');
    (authService.loginUser as vi.Mock).mockRejectedValueOnce(loginError);

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Suppress console.error for this test as we expect an error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      // Click login and expect it to throw, or handle the throw in UI
      // For this test, we verify the state after the attempt.
      // The actual error throw is tested in authService, context re-throws it.
      try {
        // The click itself might not throw if the promise rejection is handled internally
        // and the error is re-thrown. We just need to ensure the async operation completes.
         screen.getByText('Login').click(); 
      } catch (e) {
        // Error is expected to be re-thrown by the login function in AuthContext
      }
    });
    
    // Wait for isLoading to become false after the login attempt
    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('');
    expect(localStorageMock.getItem('authUser')).toBeNull();
    expect(localStorageMock.getItem('authToken')).toBeNull();
    
    consoleErrorSpy.mockRestore();
  });

  it('logout should clear context and localStorage', async () => {
    // Setup initial logged-in state
    localStorageMock.setItem('authUser', JSON.stringify(mockUser));
    localStorageMock.setItem('authToken', mockToken);
    
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Wait for initial load from localStorage to complete
    await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });
    expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));


    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('');
    expect(localStorageMock.getItem('authUser')).toBeNull();
    expect(localStorageMock.getItem('authToken')).toBeNull();
  });

  it('should load initial state from localStorage if token and user exist', async () => {
    localStorageMock.setItem('authUser', JSON.stringify(mockUser));
    localStorageMock.setItem('authToken', mockToken);

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });
    expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
    expect(screen.getByTestId('token').textContent).toBe(mockToken);
  });
});
