
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogsSection = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold">Latest Blogs</h2>
        <Link 
          to="/portfolio/blogs"
          className="flex items-center text-sm text-primary hover:underline"
        >
          View All Blogs <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      
      <div className="bg-secondary/50 rounded-lg p-8 text-center">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Share Your Thoughts</h3>
        <p className="text-muted-foreground mb-4">
          View blogs or showcase your expertise and share knowledge.
        </p>
        <Link to="/portfolio/blogs">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            View Blogs
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BlogsSection;
