
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
    return categories.slice(0, 5); // Limit to 5 tags max
  }
  
  // Fallback: Try to extract some keywords from content
  const commonTechTerms = [
    'Technology', 'Web Development', 'Programming', 'Business', 
    'AI', 'Machine Learning', 'Cloud', 'DevOps', 'Blockchain',
    'Form 990', 'Tax', 'Non-Profit', 'Transfer Pricing'
  ];
  
  return commonTechTerms.filter(term => 
    content.toLowerCase().includes(term.toLowerCase())
  ).slice(0, 3);
};

export const fetchBlogs = async (): Promise<BlogPost[]> => {
  try {
    // Attempt to fetch blogs from abtechnet.com
    const response = await fetch('https://abtechnet.com/wp-json/wp/v2/posts?_embed&per_page=10');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }
    
    const postsData = await response.json();
    
    return postsData.map((post: any) => {
      // Extract featured image if available
      let featuredImage = undefined;
      if (post._embedded && 
          post._embedded['wp:featuredmedia'] && 
          post._embedded['wp:featuredmedia'][0] &&
          post._embedded['wp:featuredmedia'][0].source_url) {
        featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
      }
      
      // Extract categories/tags if available
      let categories: string[] = [];
      if (post._embedded && 
          post._embedded['wp:term'] && 
          post._embedded['wp:term'][0]) {
        categories = post._embedded['wp:term'][0].map((term: any) => term.name);
      }
      
      // Parse content and remove HTML tags for excerpt if needed
      const content = post.content.rendered;
      let excerpt = post.excerpt.rendered;
      // Remove HTML tags for clean excerpt
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
    });
  } catch (error) {
    console.error('Error fetching blogs from abtechnet.com:', error);
    toast.error('Failed to load blogs from abtechnet.com');
    
    // Return empty array on error
    return [];
  }
};

export const fetchBlogById = async (id: string): Promise<BlogPost | null> => {
  try {
    const response = await fetch(`https://abtechnet.com/wp-json/wp/v2/posts/${id}?_embed`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }
    
    const post = await response.json();
    
    // Extract featured image if available
    let featuredImage = undefined;
    if (post._embedded && 
        post._embedded['wp:featuredmedia'] && 
        post._embedded['wp:featuredmedia'][0] &&
        post._embedded['wp:featuredmedia'][0].source_url) {
      featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
    }
    
    // Extract categories/tags if available
    let categories: string[] = [];
    if (post._embedded && 
        post._embedded['wp:term'] && 
        post._embedded['wp:term'][0]) {
      categories = post._embedded['wp:term'][0].map((term: any) => term.name);
    }
    
    // Parse content and excerpt
    const content = post.content.rendered;
    let excerpt = post.excerpt.rendered;
    // Remove HTML tags for clean excerpt
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
