
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, PlusCircle, BookOpen, Calendar, Clock, ArrowUpRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchBlogs, fetchTechnologyBlogs, BlogPost } from '@/services/blogService';

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch all blogs using React Query
  const { data: allBlogs = [], isLoading: isLoadingAll, isError: isErrorAll } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs
  });
  
  // Fetch technology blogs using React Query
  const { data: techBlogs = [], isLoading: isLoadingTech, isError: isErrorTech } = useQuery({
    queryKey: ['blogs', 'technology'],
    queryFn: fetchTechnologyBlogs
  });
  
  // Determine which blogs to display based on active tab
  const blogs = activeTab === 'technology' ? techBlogs : allBlogs;
  
  // Filter blogs based on search term and active tab
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'technology') return matchesSearch && blog.category === 'technology';
    return matchesSearch && blog.tags.some(tag => tag.toLowerCase().includes(activeTab.toLowerCase()));
  });

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
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
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto overflow-auto">
            <TabsTrigger value="all" className="text-xs">All Posts</TabsTrigger>
            <TabsTrigger value="technology" className="text-xs">Technology</TabsTrigger>
            <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
            <TabsTrigger value="tax" className="text-xs">Tax</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Loading State */}
      {(isLoadingAll || isLoadingTech) && (
        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="overflow-hidden border-border/60">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <Skeleton className="h-48 md:h-full" />
                </div>
                <div className="md:w-2/3">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-5 w-16" />
                      ))}
                    </div>
                    <Skeleton className="h-8 w-full mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-24" />
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Error State */}
      {(isErrorAll || isErrorTech) && (
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
      )}
      
      {/* Technology Blogs Highlight Section (when viewing all blogs) */}
      {activeTab === 'all' && techBlogs.length > 0 && !isLoadingAll && !isErrorAll && (
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
            {techBlogs.slice(0, 4).map((blog, index) => (
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
      )}
      
      {/* Blog List */}
      {!isLoadingAll && !isErrorAll && filteredBlogs.length > 0 ? (
        <div className="space-y-6">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
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
          ))}
        </div>
      ) : !isLoadingAll && !isErrorAll ? (
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
      ) : null}
    </div>
  );
};

export default Blogs;
