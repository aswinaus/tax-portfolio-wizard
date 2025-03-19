
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Calendar, Clock, User, ArrowLeft, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { fetchBlogById } from '@/services/blogService';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch specific blog post using React Query
  const { 
    data: blog, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlogById(id!),
    enabled: !!id
  });
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleDelete = () => {
    // In a real app, this would make an API call to delete the blog
    toast.success("Blog post deleted successfully");
    navigate('/portfolio/blogs');
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }
  
  // Error State
  if (isError || !blog) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-semibold mb-4">Blog post not found</h2>
        <p className="text-muted-foreground mb-6">
          The blog post you're looking for doesn't exist or couldn't be loaded from abtechnet.com.
        </p>
        <Button asChild>
          <Link to="/portfolio/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/portfolio/blogs" className="text-muted-foreground hover:text-foreground flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Blogs
        </Link>
        
        <div className="flex items-center gap-2">
          {blog.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={blog.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                View Original
              </a>
            </Button>
          )}
          
          <Button variant="outline" size="sm" asChild>
            <Link to={`/portfolio/blogs/edit/${blog.id}`}>
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the blog post 
                  and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Blog Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
          {blog.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {blog.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(blog.date)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {blog.readTime}
          </div>
        </div>
      </div>
      
      {/* Featured Image */}
      {blog.image && (
        <div className="mb-8">
          <div 
            className="w-full h-64 md:h-96 bg-cover bg-center rounded-lg overflow-hidden shadow-md"
            style={{ backgroundImage: `url(${blog.image})` }}
          ></div>
        </div>
      )}
      
      {/* Blog Content */}
      <article className="prose prose-gray dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors prose-img:rounded-md max-w-none mb-8">
        <div 
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="blog-content"
        />
      </article>
      
      <Separator className="my-8" />
      
      {/* Author Section */}
      <div className="bg-secondary/30 rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-medium text-lg">About {blog.author}</h3>
          <p className="text-muted-foreground mt-2">
            Technology professional with expertise in software development and business solutions. 
            Passionate about sharing knowledge and insights on various technical and business topics.
          </p>
        </div>
      </div>
      
      {/* Next/Previous Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link to="/portfolio/blogs" className="flex items-center justify-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to All Blogs
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default BlogPost;
