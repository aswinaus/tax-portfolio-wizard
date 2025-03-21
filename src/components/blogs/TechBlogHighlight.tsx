
import { BlogPost } from '@/types/blog';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TechBlogHighlightProps {
  techBlogs: BlogPost[];
  formatDate: (dateString: string) => string;
  setActiveTab: (tab: string) => void;
}

const TechBlogHighlight = ({ techBlogs, formatDate, setActiveTab }: TechBlogHighlightProps) => {
  if (techBlogs.length === 0) return null;
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold">Technology Articles</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setActiveTab('technology')}
        >
          View all tech articles
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techBlogs.slice(0, 4).map((blog) => (
          <Card key={blog.id} className="overflow-hidden border-border/60 hover:shadow-sm transition-shadow h-full">
            {blog.image && (
              <div 
                className="h-32 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${blog.image})` }}
              ></div>
            )}
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">Technology</Badge>
              </div>
              <CardTitle className="text-base font-display line-clamp-2">
                <Link to={`/portfolio/blogs/${blog.id}`} className="hover:text-primary transition-colors">
                  {blog.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-muted-foreground text-sm line-clamp-2">
                {blog.excerpt}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(blog.date)}
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                {blog.readTime}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TechBlogHighlight;
