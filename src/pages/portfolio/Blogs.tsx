
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, PlusCircle, BookOpen, Calendar, Clock, ArrowUpRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Blog post interface
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  image?: string;
}

// Sample blog posts data
const sampleBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Modern Web Development Practices',
    excerpt: 'An overview of current best practices in web development and how they impact project success.',
    content: 'Full content here...',
    author: 'Aswin Auswin',
    date: '2023-10-15',
    readTime: '5 min read',
    tags: ['Web Development', 'Best Practices', 'Technology'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'The Future of AI in Business Applications',
    excerpt: 'Exploring how artificial intelligence is transforming business operations and decision-making processes.',
    content: 'Full content here...',
    author: 'Aswin Auswin',
    date: '2023-09-28',
    readTime: '7 min read',
    tags: ['AI', 'Business', 'Technology Trends'],
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Essential Tax Preparation Tips for Non-Profits',
    excerpt: 'Key insights and strategies for non-profit organizations preparing their annual tax submissions.',
    content: 'Full content here...',
    author: 'Aswin Auswin',
    date: '2023-08-12',
    readTime: '6 min read',
    tags: ['Non-Profit', 'Tax', 'Form 990'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop'
  }
];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs] = useState<BlogPost[]>(sampleBlogs);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter blogs based on search term and active tab
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
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
              Thoughts, insights, and expertise on various topics
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
      
      {/* Blog List */}
      {filteredBlogs.length > 0 ? (
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
                        {blog.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
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
                    <CardFooter>
                      <Link 
                        to={`/portfolio/blogs/${blog.id}`}
                        className="text-primary text-sm hover:underline flex items-center"
                      >
                        Read more <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchTerm 
              ? `No results for "${searchTerm}". Try a different search term.` 
              : "Start creating your first blog post to share your knowledge."}
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
      )}
    </div>
  );
};

export default Blogs;
