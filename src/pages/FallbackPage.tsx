
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

const FallbackPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading Application</h1>
          <p className="text-gray-600 mb-6">
            The application is initializing. If this page persists, please try refreshing.
          </p>
        </div>

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
                  If you continue to see this page, try one of the actions below.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
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

export default FallbackPage;
