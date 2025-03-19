
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    content: `
      <p>Web development has evolved significantly over the past decade, with new tools, frameworks, and methodologies emerging to address the growing complexity of modern applications.</p>
      
      <h2>The Rise of Component-Based Architecture</h2>
      <p>One of the most significant shifts in modern web development has been the move toward component-based architectures. Frameworks like React, Vue, and Angular have popularized this approach, allowing developers to build UIs from small, reusable components.</p>
      <p>Components offer several advantages:</p>
      <ul>
        <li>Reusability across projects</li>
        <li>Easier maintenance and testing</li>
        <li>Better organization of code</li>
        <li>Enhanced collaboration between team members</li>
      </ul>
      
      <h2>Performance Optimization</h2>
      <p>As web applications grow in complexity, performance optimization becomes increasingly important. Modern best practices include:</p>
      <ul>
        <li>Code splitting and lazy loading</li>
        <li>Tree shaking to eliminate unused code</li>
        <li>Efficient state management</li>
        <li>Server-side rendering and static site generation</li>
        <li>Optimizing assets like images and fonts</li>
      </ul>
      
      <h2>Responsive and Accessible Design</h2>
      <p>With users accessing websites from a variety of devices, responsive design is no longer optional. Furthermore, accessibility has rightfully gained attention as a critical aspect of web development.</p>
      <p>Key considerations include:</p>
      <ul>
        <li>Mobile-first design approaches</li>
        <li>Fluid layouts and responsive images</li>
        <li>Semantic HTML</li>
        <li>ARIA attributes for enhanced accessibility</li>
        <li>Keyboard navigation and screen reader compatibility</li>
      </ul>
      
      <h2>TypeScript and Static Typing</h2>
      <p>TypeScript has gained significant adoption in the JavaScript ecosystem, bringing static typing and improved tooling to web development. Benefits include:</p>
      <ul>
        <li>Catching errors during development rather than runtime</li>
        <li>Better IDE support with autocompletion and refactoring tools</li>
        <li>Self-documenting code</li>
        <li>Improved team collaboration with explicit interfaces</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Adopting these modern web development practices can significantly improve the quality, maintainability, and performance of your applications. As the web continues to evolve, staying current with best practices ensures your projects remain competitive and provide the best possible user experience.</p>
    `,
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
    content: `
      <p>Artificial Intelligence (AI) is revolutionizing how businesses operate, offering unprecedented opportunities for automation, insight, and innovation across industries.</p>
      
      <h2>Transforming Customer Experience</h2>
      <p>AI is fundamentally changing how businesses interact with their customers. From chatbots handling customer service inquiries to personalized product recommendations, AI enables more responsive and customized customer experiences.</p>
      <p>Key applications include:</p>
      <ul>
        <li>24/7 customer support through AI chatbots</li>
        <li>Personalized marketing based on customer behavior</li>
        <li>Voice assistants for frictionless interactions</li>
        <li>Sentiment analysis to gauge customer satisfaction</li>
      </ul>
      
      <h2>Data-Driven Decision Making</h2>
      <p>Perhaps the most valuable contribution of AI to business is its ability to process vast amounts of data and extract actionable insights. This capability transforms decision-making from intuition-based to data-driven.</p>
      <p>AI enables businesses to:</p>
      <ul>
        <li>Identify trends and patterns invisible to human analysis</li>
        <li>Forecast market changes with greater accuracy</li>
        <li>Optimize pricing strategies in real-time</li>
        <li>Detect anomalies that might indicate fraud or system failures</li>
      </ul>
      
      <h2>Operational Efficiency</h2>
      <p>AI and automation are streamlining business operations, reducing costs, and minimizing errors in routine tasks. This allows human workers to focus on higher-value activities that require creativity and emotional intelligence.</p>
      <p>Examples include:</p>
      <ul>
        <li>Automated document processing and data entry</li>
        <li>Predictive maintenance for equipment and infrastructure</li>
        <li>Supply chain optimization</li>
        <li>Resource scheduling and allocation</li>
      </ul>
      
      <h2>Ethical Considerations and Challenges</h2>
      <p>Despite its transformative potential, AI implementation comes with significant challenges that businesses must address:</p>
      <ul>
        <li>Data privacy and security concerns</li>
        <li>Algorithmic bias and fairness</li>
        <li>Transparency and explainability of AI decisions</li>
        <li>Workforce transitions and upskilling requirements</li>
      </ul>
      
      <h2>Looking Ahead</h2>
      <p>As AI technology continues to mature, we can expect even deeper integration into business processes. Organizations that strategically implement AI while addressing its ethical implications will gain significant competitive advantages in their industries.</p>
      <p>The future of business is not just about using AI as a tool, but about creating hybrid systems where human creativity and AI capabilities complement each other to achieve outcomes neither could accomplish alone.</p>
    `,
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
    content: `
      <p>Tax preparation for non-profit organizations presents unique challenges. Understanding the specific requirements and exemptions for Form 990 filing can save time, prevent compliance issues, and help your organization maintain its tax-exempt status.</p>
      
      <h2>Understanding Form 990 Requirements</h2>
      <p>The IRS Form 990 is the tax return that most tax-exempt organizations must file annually. The specific form required depends on the organization's gross receipts and total assets:</p>
      <ul>
        <li>Form 990-N (e-Postcard): For organizations with gross receipts ≤ $50,000</li>
        <li>Form 990-EZ: For organizations with gross receipts < $200,000 and total assets < $500,000</li>
        <li>Form 990: For organizations with gross receipts ≥ $200,000 or total assets ≥ $500,000</li>
        <li>Form 990-PF: Required for private foundations regardless of financial status</li>
      </ul>
      
      <h2>Common Filing Mistakes to Avoid</h2>
      <p>Even experienced non-profit professionals can make errors when preparing Form 990. Some common mistakes include:</p>
      <ul>
        <li>Missing the filing deadline (15th day of the 5th month after the end of the fiscal year)</li>
        <li>Incomplete or inconsistent financial information</li>
        <li>Inadequate descriptions of program services and accomplishments</li>
        <li>Failure to properly report governance policies and practices</li>
        <li>Insufficient documentation of public support tests for 501(c)(3) organizations</li>
      </ul>
      
      <h2>Maximizing Transparency</h2>
      <p>Form 990 is more than just a tax document—it's publicly available and often scrutinized by donors, grantmakers, and watchdog organizations. Use it as an opportunity to showcase your organization's impact:</p>
      <ul>
        <li>Provide detailed descriptions of program achievements</li>
        <li>Clearly explain your mission and how activities support it</li>
        <li>Highlight efficiency through appropriate expense allocations</li>
        <li>Document board independence and governance best practices</li>
      </ul>
      
      <h2>Record Keeping Best Practices</h2>
      <p>Maintaining organized records throughout the year simplifies the Form 990 preparation process:</p>
      <ul>
        <li>Implement a consistent chart of accounts aligned with Form 990 categories</li>
        <li>Document all board meetings and key decisions</li>
        <li>Track volunteer hours, particularly for significant services</li>
        <li>Maintain detailed records of fundraising activities and results</li>
        <li>Keep grant documentation organized and accessible</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Form 990 preparation provides an opportunity for non-profit organizations to assess their operations, governance, and impact. By understanding requirements, avoiding common mistakes, emphasizing transparency, and maintaining excellent records, your organization can turn tax compliance into a strategic advantage that builds trust with stakeholders and supports your mission.</p>
    `,
    author: 'Aswin Auswin',
    date: '2023-08-12',
    readTime: '6 min read',
    tags: ['Non-Profit', 'Tax', 'Form 990'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop'
  }
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate fetching blog data
    setLoading(true);
    setTimeout(() => {
      const foundBlog = sampleBlogs.find(blog => blog.id === id);
      setBlog(foundBlog || null);
      setLoading(false);
    }, 500);
  }, [id]);
  
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

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-semibold mb-4">Blog post not found</h2>
        <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
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
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
        <div 
          className="w-full h-64 md:h-96 bg-cover bg-center rounded-lg overflow-hidden mb-8"
          style={{ backgroundImage: `url(${blog.image})` }}
        ></div>
      )}
      
      {/* Blog Content */}
      <article className="prose prose-gray max-w-none lg:prose-lg">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
      
      <Separator className="my-8" />
      
      {/* Author Section */}
      <div className="bg-secondary/30 rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-4">
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
    </motion.div>
  );
};

export default BlogPost;
