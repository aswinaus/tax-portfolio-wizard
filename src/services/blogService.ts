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

// Function to estimate read time based on content length
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

// Function to extract tags from categories or content
const extractTags = (categories: string[] = [], content: string = ''): string[] => {
  if (categories && categories.length > 0) {
    return categories.slice(0, 5);
  }
  
  const commonTechTerms = [
    'Technology', 'Web Development', 'Programming', 'Business', 
    'AI', 'Machine Learning', 'Cloud', 'DevOps', 'Blockchain',
    'Form 990', 'Tax', 'Non-Profit', 'Transfer Pricing'
  ];
  
  return commonTechTerms.filter(term => 
    content.toLowerCase().includes(term.toLowerCase())
  ).slice(0, 3);
};

// Function to determine the primary category
const determineCategory = (categories: string[] = [], content: string = ''): string => {
  const techKeywords = ['Technology', 'Web Development', 'Programming', 'Software', 'AI', 'Machine Learning', 'Cloud', 'DevOps', 'Blockchain', 'Coding', 'Tech'];
  const businessKeywords = ['Business', 'Strategy', 'Management', 'Entrepreneurship', 'Marketing'];
  const taxKeywords = ['Form 990', 'Tax', 'Non-Profit', 'Transfer Pricing', 'IRS', 'Taxation'];
  
  for (const category of categories) {
    if (techKeywords.some(keyword => category.toLowerCase().includes(keyword.toLowerCase()))) {
      return 'technology';
    }
    if (businessKeywords.some(keyword => category.toLowerCase().includes(keyword.toLowerCase()))) {
      return 'business';
    }
    if (taxKeywords.some(keyword => category.toLowerCase().includes(keyword.toLowerCase()))) {
      return 'tax';
    }
  }
  
  const contentLower = content.toLowerCase();
  
  const techCount = techKeywords.filter(keyword => contentLower.includes(keyword.toLowerCase())).length;
  const businessCount = businessKeywords.filter(keyword => contentLower.includes(keyword.toLowerCase())).length;
  const taxCount = taxKeywords.filter(keyword => contentLower.includes(keyword.toLowerCase())).length;
  
  if (techCount >= businessCount && techCount >= taxCount) {
    return 'technology';
  } else if (businessCount >= techCount && businessCount >= taxCount) {
    return 'business';
  } else if (taxCount >= techCount && taxCount >= businessCount) {
    return 'tax';
  }
  
  return 'general';
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
  
  // In a real app, this would be saved to a database
  // For now, we'll just return the new blog
  return newBlog;
};

export const fetchBlogs = async (): Promise<BlogPost[]> => {
  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch('https://abtechnet.com/wp-json/wp/v2/posts?_embed&per_page=20', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
    }
    
    const postsData = await response.json();
    console.log('Successfully fetched blog posts:', postsData.length);
    
    return postsData.map((post: any) => {
      let featuredImage = undefined;
      if (post._embedded && 
          post._embedded['wp:featuredmedia'] && 
          post._embedded['wp:featuredmedia'][0] &&
          post._embedded['wp:featuredmedia'][0].source_url) {
        featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
      }
      
      let categories: string[] = [];
      if (post._embedded && 
          post._embedded['wp:term'] && 
          post._embedded['wp:term'][0]) {
        categories = post._embedded['wp:term'][0].map((term: any) => term.name);
      }
      
      const content = post.content.rendered;
      let excerpt = post.excerpt.rendered;
      excerpt = excerpt.replace(/<\/?[^>]+(>|$)/g, "").trim();
      
      return {
        id: post.id.toString(),
        title: post.title.rendered,
        excerpt: excerpt,
        content: content,
        author: post._embedded?.author?.[0]?.name || "Aswin Auswin",
        date: post.date,
        readTime: calculateReadTime(content),
        tags: extractTags(categories, content),
        image: featuredImage,
        url: post.link,
        category: determineCategory(categories, content)
      };
    });
  } catch (error: any) {
    console.error('Error fetching blogs from abtechnet.com:', error);
    
    // Provide more specific error messages based on the error type
    if (error.name === 'AbortError') {
      toast.error('Request timeout: The server took too long to respond');
    } else if (error.message.includes('NetworkError') || !navigator.onLine) {
      toast.error('Network error: Please check your internet connection');
    } else if (error.message.includes('CORS')) {
      toast.error('CORS error: Unable to access the blog server due to cross-origin restrictions');
    } else {
      toast.error('Failed to load blogs from abtechnet.com');
    }
    
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
  try {
    const response = await fetch(`https://abtechnet.com/wp-json/wp/v2/posts/${id}?_embed`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }
    
    const post = await response.json();
    
    let featuredImage = undefined;
    if (post._embedded && 
        post._embedded['wp:featuredmedia'] && 
        post._embedded['wp:featuredmedia'][0] &&
        post._embedded['wp:featuredmedia'][0].source_url) {
      featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
    }
    
    let categories: string[] = [];
    if (post._embedded && 
        post._embedded['wp:term'] && 
        post._embedded['wp:term'][0]) {
      categories = post._embedded['wp:term'][0].map((term: any) => term.name);
    }
    
    const content = post.content.rendered;
    let excerpt = post.excerpt.rendered;
    excerpt = excerpt.replace(/<\/?[^>]+(>|$)/g, "").trim();
    
    return {
      id: post.id.toString(),
      title: post.title.rendered,
      excerpt: excerpt,
      content: content,
      author: post._embedded?.author?.[0]?.name || "Aswin Auswin",
      date: post.date,
      readTime: calculateReadTime(content),
      tags: extractTags(categories, content),
      image: featuredImage,
      url: post.link
    };
  } catch (error) {
    console.error(`Error fetching blog ${id} from abtechnet.com:`, error);
    toast.error('Failed to load blog post');
    return null;
  }
};
