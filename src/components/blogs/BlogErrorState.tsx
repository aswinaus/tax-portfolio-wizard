
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogErrorState = () => {
  return (
    <div className="text-center py-16 bg-secondary/40 rounded-lg">
      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Failed to load blogs</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        There was an error loading blogs from abtechnet.com. Please try again later.
      </p>
      <Button onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
};

export default BlogErrorState;
