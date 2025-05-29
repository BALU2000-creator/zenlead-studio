
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Headphones, Menu, Moon, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth(); // Get auth state and logout function
  const navigate = useNavigate(); // For redirection

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Headphones className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Zenlead Studio</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link to="/app" className="px-3 py-2 text-sm font-medium hover:text-primary">
                  Studio Dashboard
                </Link>
                <Link to="/audio" className="px-3 py-2 text-sm font-medium hover:text-primary">
                  Audios
                </Link>
                <Link to="/text" className="px-3 py-2 text-sm font-medium hover:text-primary">
                  Texts
                </Link>
                <Link to="/video" className="px-3 py-2 text-sm font-medium hover:text-primary">
                  Videos
                </Link>
                <Link to="/pricing" className="px-3 py-2 text-sm font-medium hover:text-primary">
                  Pricing
                </Link>
                <Link to="/library" className="px-3 py-2 text-sm font-medium hover:text-primary">
                  Library
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-4"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              {isAuthenticated ? (
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="outline" className="mr-4">Sign In</Button>
                  </Link>
                  <Link to="/signup"> {/* Changed /app to /signup for Get Started when logged out */}
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[385px] pt-10">
                <div className="flex flex-col space-y-4 mt-4">
                  <Link to="/" className="px-3 py-2 text-lg font-medium hover:text-primary">
                    Home
                  </Link>
                  <Link to="/app" className="px-3 py-2 text-lg font-medium hover:text-primary">
                    Studio Dashboard
                  </Link>
                  <Link to="/audio" className="px-3 py-2 text-lg font-medium hover:text-primary">
                    Audios
                  </Link>
                  <Link to="/text" className="px-3 py-2 text-lg font-medium hover:text-primary">
                    Texts
                  </Link>
                  <Link to="/video" className="px-3 py-2 text-lg font-medium hover:text-primary">
                    Videos
                  </Link>
                  <Link to="/pricing" className="px-3 py-2 text-lg font-medium hover:text-primary">
                    Pricing
                  </Link>
                  <Link to="/library" className="px-3 py-2 text-lg font-medium hover:text-primary">
                    Library
                  </Link>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    {isAuthenticated ? (
                      <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
                    ) : (
                      <>
                        <Link to="/signin">
                          <Button variant="outline" className="w-full mb-2">Sign In</Button>
                        </Link>
                        <Link to="/signup"> {/* Changed /app to /signup for Get Started when logged out */}
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
