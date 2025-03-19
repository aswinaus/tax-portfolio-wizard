
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyBlogStateProps {
  searchTerm: string;
}

const EmptyBlogState = ({ searchTerm }: EmptyBlogStateProps) => {
  return (
    <div className="text-center py-16 bg-secondary/40 rounded-lg">
      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {searchTerm 
          ? `No results for "${searchTerm}". Try a different search term.` 
          : "No blog posts available in this category at the moment."}
      </p>
      {!searchTerm && (
        <Link to="/portfolio/blogs/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyBlogState;
