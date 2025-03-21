
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useQueryClient } from '@tanstack/react-query';

const BlogErrorState = () => {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    // Invalidate all blog-related queries to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
    queryClient.invalidateQueries({ queryKey: ['blogs', 'technology'] });
  };

  return (
    <Alert variant="destructive" className="my-6">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="ml-2">Failed to load blogs</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">
          There was an error loading the blogs. Please try again.
        </p>
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="mt-2 bg-background"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default BlogErrorState;
