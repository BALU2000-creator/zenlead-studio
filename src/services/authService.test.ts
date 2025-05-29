import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'; // Or 'jest'
import { authService } from './authService';

// Mocking global fetch
global.fetch = vi.fn();

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
  });

  const mockEmail = "test@example.com";
  const mockPassword = "password123";

  const mockSuccessResponse = {
    status: 200,
    success: true,
    message: "Login successful",
    data: {
      user: {
        _id: "user123",
        firstName: "Test",
        lastName: "User",
        email: mockEmail,
        credits: 100,
      },
      access_token: "fake_token_123",
      token_type: "bearer",
    },
  };

  const mockApiErrorResponse = {
    status: 401, // Or any other error code
    success: false,
    message: "Invalid credentials",
  };

  it('loginUser should return user data and token on successful login', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const result = await authService.loginUser(mockEmail, mockPassword);

    expect(fetch).toHaveBeenCalledWith(
      'https://zenleadai-studio-backend.vercel.app/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, password: mockPassword }),
      }
    );
    expect(result).toEqual(mockSuccessResponse.data);
  });

  it('loginUser should throw an error if API returns success:false', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true, // Response itself is ok, but API indicates failure
      json: async () => mockApiErrorResponse,
    });

    await expect(authService.loginUser(mockEmail, mockPassword))
      .rejects
      .toThrow(mockApiErrorResponse.message);
    
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('loginUser should throw an error for non-ok HTTP response', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500, // Server error
      json: async () => ({ message: "Internal Server Error" }), // Body might not always be success:false format
    });

    await expect(authService.loginUser(mockEmail, mockPassword))
      .rejects
      .toThrow('HTTP error! status: 500'); // Or could be "Internal Server Error" if that's what the service throws

    expect(fetch).toHaveBeenCalledTimes(1);
  });
  
  it('loginUser should throw an error for network issues', async () => {
    (fetch as vi.Mock).mockRejectedValueOnce(new Error("Network failure"));

    await expect(authService.loginUser(mockEmail, mockPassword))
      .rejects
      .toThrow("Network failure");
      
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
