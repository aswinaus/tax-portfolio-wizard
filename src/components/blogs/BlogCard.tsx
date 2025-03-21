import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  blog: BlogPost;
  index: number;
  formatDate: (dateString: string) => string;
}

const BlogCard = ({ blog, index, formatDate }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden border-border/60 hover:shadow-sm transition-shadow">
        <div className="md:flex">
          {blog.image && (
            <div className="md:w-1/3">
              <div 
                className="h-48 md:h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${blog.image})` }}
              ></div>
            </div>
          )}
          <div className={`md:${blog.image ? 'w-2/3' : 'w-full'}`}>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {blog.category && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {blog.category}
                  </Badge>
                )}
                {blog.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-xl font-display">
                <Link to={`/portfolio/blogs/${blog.id}`} className="hover:text-primary transition-colors">
                  {blog.title}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center gap-3 text-xs">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(blog.date)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {blog.readTime}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2">
                {blog.excerpt}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link 
                to={`/portfolio/blogs/${blog.id}`}
                className="text-primary text-sm hover:underline flex items-center"
              >
                Read more <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
              
              {blog.url && (
                <a 
                  href={blog.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-xs hover:text-foreground flex items-center"
                >
                  Original post <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
