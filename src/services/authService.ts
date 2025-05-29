// Define the structure of the User data based on the API response
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  credits: number;
}

// Define the structure of the successful API response
interface LoginSuccessResponse {
  status: number;
  success: true;
  message: string;
  data: {
    user: User;
    access_token: string;
    token_type: string; // Typically "bearer"
  };
}

// Define the structure of a potential error response (can be expanded)
interface LoginErrorResponse {
  status: number;
  success: false;
  message: string;
  data?: any; // Or a more specific error data structure
}

// Type for the login function's return value
type LoginResponse = LoginSuccessResponse; // Can be union with LoginErrorResponse if we return error objects instead of throwing

const API_URL = 'https://zenleadai-studio-backend.vercel.app/auth/login';

export const authService = {
  loginUser: async (email_param: string, password_param: string): Promise<LoginResponse['data']> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email_param, password: password_param }),
      });

      const data: LoginSuccessResponse | LoginErrorResponse = await response.json();

      if (!response.ok || !data.success) {
        // Log the error for debugging
        console.error('Login API Error:', data); 
        // Use the message from the API response if available, otherwise a generic one
        throw new Error((data as LoginErrorResponse).message || `HTTP error! status: ${response.status}`);
      }
      
      // Ensure data is treated as LoginSuccessResponse here due to the check above
      return (data as LoginSuccessResponse).data;
    } catch (error) {
      console.error('Network or parsing error during login:', error);
      // Re-throw the error to be handled by the caller (e.g., AuthContext)
      // Ensure it's an Error object
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unknown error occurred during login.');
      }
    }
  },
};
