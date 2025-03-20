import { toast } from 'sonner';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  image?: string;
  url?: string;
  category?: string;
}

// In-memory storage for locally created blog posts
const localBlogCache: Record<string, BlogPost> = {
  // Only keep non-profit tax form blog post
  '2': {
    id: '2',
    title: 'Understanding Non-Profit Tax Forms',
    excerpt: 'A comprehensive guide to Form 990 and other tax considerations for non-profit organizations.',
    content: 'Form 990 is a tax document that non-profit organizations must file with the IRS annually. This post explains the different sections of Form 990 and provides guidance on how to complete it correctly.',
    author: 'Aswin Bhaskaran',
    date: '2023-06-20T14:30:00Z',
    readTime: '8 min read',
    tags: ['Tax', 'Non-Profit', 'Form 990', 'Finance'],
    category: 'tax'
  }
};

// Function to calculate read time based on content length
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

// Function to create a new blog post
export const createBlogPost = (blog: Omit<BlogPost, 'id' | 'date' | 'readTime'>): BlogPost => {
  // Generate a unique ID
  const id = Date.now().toString();
  
  // Use current date
  const date = new Date().toISOString();
  
  // Calculate read time
  const readTime = calculateReadTime(blog.content);
  
  // Create the blog post
  const newBlog: BlogPost = {
    ...blog,
    id,
    date,
    readTime,
  };
  
  // Store in local cache
  localBlogCache[id] = newBlog;
  
  return newBlog;
};

export const fetchBlogs = async (): Promise<BlogPost[]> => {
  try {
    // Return local blogs
    return Object.values(localBlogCache);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    toast.error('Failed to load blogs');
    return [];
  }
};

export const fetchBlogsByCategory = async (category: string): Promise<BlogPost[]> => {
  const allBlogs = await fetchBlogs();
  return allBlogs.filter(blog => blog.category === category);
};

export const fetchTechnologyBlogs = async (): Promise<BlogPost[]> => {
  return fetchBlogsByCategory('technology');
};

export const fetchBlogById = async (id: string): Promise<BlogPost | null> => {
  // Check local cache
  if (localBlogCache[id]) {
    return localBlogCache[id];
  }
  
  console.error(`Blog with ID ${id} not found`);
  toast.error('Blog post not found');
  return null;
};
