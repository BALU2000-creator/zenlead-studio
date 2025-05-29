import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import { Loader2 } from 'lucide-react'; // Import Loader2

interface ProtectedRouteProps {
  // We can add specific props if needed in the future, e.g., roles/permissions
  // children?: React.ReactNode; // Using Outlet for nested routes is often preferred
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Optional: Show a loading spinner or a blank page while auth state is being determined,
    // especially on initial load or after a refresh.
    // This prevents flashing the login page briefly if the user is actually authenticated.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background"> {/* Added bg-background for consistency */}
        <Loader2 className="h-10 w-10 text-primary animate-spin" /> {/* Using Loader2 icon with spin animation */}
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to in the state of the navigation. This allows us to redirect
    // them back to their intended page after they log in.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated, render the child route elements
  return <Outlet />; 
  // Using <Outlet /> is standard for layout routes in react-router-dom v6+
  // If you were passing children directly, it would be: return <>{children}</>;
};

export default ProtectedRoute;
