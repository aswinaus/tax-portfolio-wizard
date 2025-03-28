
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, AlertCircle, ArrowRight } from 'lucide-react';

const FallbackPage = () => {
  // Determine if we're in a preview environment
  const isPreview = window.location.hostname.includes('preview') || 
                   window.location.hostname.includes('staging') ||
                   window.location.hostname.includes('lovableproject');

  const refreshPage = () => {
    console.log("Refreshing page from FallbackPage");
    // Clear any cached state that might be causing issues
    localStorage.removeItem('app_state');
    sessionStorage.clear();
    window.location.reload();
  };

  const goToHome = () => {
    console.log("Navigating to home from FallbackPage");
    window.location.href = "/";
  };
  
  // Force redirect to /portfolio/blogs if we've been on this page too long
  // But with a longer timeout to give more chance for recovery
  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Auto-redirecting to /portfolio/blogs after timeout");
      window.location.href = "/portfolio/blogs";
    }, 10000); // Increased from 8000ms to 10000ms
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading Application</h1>
          <p className="text-gray-600 mb-6">
            The application is initializing. If this page persists, please try one of the actions below.
          </p>
        </div>

        {isPreview && (
          <div className="rounded-md bg-amber-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Preview Environment Notice</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    This is a preview deployment which may take longer to load initially.
                    Auto-redirecting in a few seconds...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button onClick={refreshPage} className="flex items-center justify-center gap-2 w-full">
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          
          <Button onClick={goToHome} variant="outline" className="flex items-center justify-center gap-2 w-full">
            <Home className="h-4 w-4" />
            Go to Homepage
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/portfolio/blogs"} 
            variant="secondary" 
            className="flex items-center justify-center gap-2 w-full"
          >
            <ArrowRight className="h-4 w-4" />
            Go to Blogs Directly
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FallbackPage;
