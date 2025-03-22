
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-4">Page not found</p>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or may still be propagating from DNS changes.
          </p>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>DNS Configuration Notice</AlertTitle>
          <AlertDescription>
            If you've recently configured your domain (aswin.ai), please note that DNS changes can take 
            up to 24-48 hours to propagate worldwide. Try again later.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={refreshPage} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
