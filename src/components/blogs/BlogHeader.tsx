
import { Link } from 'react-router-dom';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const BlogHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Link to="/portfolio" className="text-muted-foreground hover:text-foreground flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Portfolio
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2">Blog</Badge>
          <h1 className="text-3xl font-display font-bold">My Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Thoughts, insights, and expertise from abtechnet.com
          </p>
        </div>
        <Link to="/portfolio/blogs/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogHeader;
