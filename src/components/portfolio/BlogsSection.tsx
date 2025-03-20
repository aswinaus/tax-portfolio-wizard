
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="overflow-hidden border-border/60 hover:shadow-sm transition-shadow">
          <CardHeader>
            <Badge variant="secondary" className="w-fit mb-2">Technology</Badge>
            <CardTitle className="text-lg font-display">
              <Link to="/portfolio/blogs" className="hover:text-primary transition-colors">
                LLM Evals: A Comprehensive Guide to Evaluating Language Models
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Explore the essential frameworks and metrics for evaluating Large Language Models (LLMs), 
              understanding why robust evaluation matters, and how to prepare effective datasets for testing.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/portfolio/blogs">
              <Button variant="outline" className="mt-2">
                <Presentation className="mr-2 h-4 w-4" />
                View Presentation
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="bg-secondary/50 rounded-lg p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Share Your Thoughts</h3>
          <p className="text-muted-foreground mb-4">
            View blogs or showcase your expertise and share knowledge.
          </p>
          <Link to="/portfolio/blogs">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              View More Blogs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
