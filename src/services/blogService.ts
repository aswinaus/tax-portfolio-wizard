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

export const fetchBlogs = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch('https://abtechnet.com/wp-json/wp/v2/posts?_embed&per_page=20');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }
    
    const postsData = await response.json();
    
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
  } catch (error) {
    console.error('Error fetching blogs from abtechnet.com:', error);
    toast.error('Failed to load blogs from abtechnet.com');
    
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
