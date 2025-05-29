import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path if needed
import { useState, useEffect, FormEvent } from "react";

const SignIn = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app"); // Redirect to dashboard if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await login(email, password);
      // Navigation will be handled by the useEffect hook watching isAuthenticated
      // Or, can navigate here explicitly if preferred after successful login,
      // but useEffect is good for handling pre-existing auth state too.
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Sign In Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-6">
          <LogIn className="h-8 w-8 text-primary dark:text-blue-400 mb-2" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Sign In</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">Sign in to Zenlead Studio to access your dashboard and tools.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring focus:ring-primary"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring focus:ring-primary"
            required
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          {/* Placeholder buttons for Google/Twitter, functionality not in scope */}
          <Button
            variant="outline"
            className="p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            asChild
          >
            <a href="/auth/google">
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#4285F4"/>
                <path d="M6.6 14.7l7.3 5.4c1.9-3.5 5.3-5.9 9.1-5.9 3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C33.6 7.1 29.6 5 24 5c-6.4 0-12 2.8-15.4 7.7z" fill="#34A853"/>
                <path d="M24 45c5.9 0 11.2-2.3 15.1-6l-7-5.4c-2.3 1.5-5.2 2.4-8.1 2.4-4.1 0-7.7-2.2-9.7-5.5l-7.3 5.7C10.8 41.8 17 45 24 45z" fill="#FBBC05"/>
                <path d="M44.5 20H24v8.5h11.8c-.7 2.3-2 4.3-3.7 5.8l7 5.4c4.1-3.8 6.9-9.5 6.9-15.7 0-1.3-.2-2.7-.5-4z" fill="#EA4335"/>
              </svg>
            </a>
          </Button>
          <Button
            variant="outline"
            className="p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            asChild
          >
            <a href="/auth/twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000000" className="dark:fill-white"/>
              </svg>
            </a>
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">Sign up</Link>
        </div>
        <div className="mt-2 text-center">
          <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 text-xs">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;