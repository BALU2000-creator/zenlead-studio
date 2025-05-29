// src/components/ProtectedRoute.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext'; // This will be the mocked version

// Mock AuthContext
vi.mock('../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('../contexts/AuthContext'); // Get actual module type
  return {
    ...actual, // Spread actual exports
    useAuth: vi.fn(), // Mock useAuth
  };
});


// Dummy component to render when authenticated
const DummyProtectedComponent = () => <div data-testid="protected-content">Protected Content</div>;
const DummySignInComponent = () => <div data-testid="signin-page">Sign In Page</div>;


describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    (useAuth as vi.Mock).mockReset();
  });

  it('should show loading indicator when isLoading is true', () => {
    (useAuth as vi.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<DummyProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    // Check for the Loader2 icon (or its container if easier to select)
    // Assuming Loader2 has a distinct class or role, or its parent div.
    // The current ProtectedRoute renders <Loader2 className="... animate-spin" />
    // We can check for the presence of an element with 'animate-spin'
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('animate-spin'); // Lucide icons might be img role
  });

  it('should redirect to /signin if not authenticated and not loading', () => {
    (useAuth as vi.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<DummyProtectedComponent />} />
          </Route>
          <Route path="/signin" element={<DummySignInComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render child component if authenticated and not loading', () => {
    (useAuth as vi.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { _id: '1', name: 'Test' }, // Mock user data
      token: 'fake-token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<DummyProtectedComponent />} />
          </Route>
          <Route path="/signin" element={<DummySignInComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('signin-page')).not.toBeInTheDocument();
  });
});
