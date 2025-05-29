import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Construction } from "lucide-react";

// Import AuthProvider
import { AuthProvider } from "./contexts/AuthContext";

// Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AudioProcessing from "./pages/AudioProcessing";
import TextProcessing from "./pages/TextProcessing";
import VideoProcessing from "./pages/VideoProcessing";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import SignIn from "./pages/SignIn";
import CaseStudies from "./pages/CaseStudies";
import Documentation from "./pages/Documentation";
import Company from "./pages/Company";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import GDPR from "./pages/GDPR";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Wrap BrowserRouter with AuthProvider */}
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <div className="w-full bg-amber-100 dark:bg-gray-800/50 text-foreground dark:text-muted-foreground text-center py-2 px-2 sm:px-4 flex items-center justify-center gap-2 text-xs sm:text-sm z-10">
              <Construction className="h-4 w-4 text-amber-600 dark:text-amber-300" />
              <p className="font-medium">
              App under construction: All functionalities are currently disabled. See you soon!
            </p>
          </div>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/company" element={<Company />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/gdpr" element={<GDPR />} />
            
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<Dashboard />} />
                <Route path="/audio" element={<AudioProcessing />} />
                <Route path="/text" element={<TextProcessing />} />
                <Route path="/text-processing" element={<TextProcessing />} /> 
                <Route path="/video" element={<VideoProcessing />} />
                <Route path="/library" element={<Library />} />
                {/* Add any other routes that need protection here as children of ProtectedRoute */}
              </Route>
            
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;