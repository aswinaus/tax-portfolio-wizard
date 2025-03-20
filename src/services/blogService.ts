
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
  },
  // Add new LLM Quantization blog post
  '4': {
    id: '4',
    title: 'LLM Quantization: Making Large Language Models More Efficient',
    excerpt: 'Explore how quantization techniques can significantly reduce the computational requirements of LLMs while maintaining performance.',
    content: `
<h2>Introduction to LLM Quantization</h2>
<p>Large Language Models (LLMs) have revolutionized AI capabilities, but their size presents significant deployment challenges. LLM quantization is a technique that reduces the precision of model weights from 32-bit floating point (FP32) to lower bit representations, making models smaller and faster to run.</p>

<h2>Why Quantize LLMs?</h2>
<ul>
  <li><strong>Reduced Memory Usage:</strong> Quantized models require significantly less RAM and storage</li>
  <li><strong>Faster Inference:</strong> Lower precision operations execute faster on most hardware</li>
  <li><strong>Energy Efficiency:</strong> Less computation means lower power consumption</li>
  <li><strong>Edge Deployment:</strong> Makes LLMs viable on resource-constrained devices</li>
</ul>

<h2>Quantization Methods</h2>
<h3>Post-Training Quantization (PTQ)</h3>
<p>Applied after a model is trained at full precision:</p>
<ul>
  <li>Weight-only quantization: Only model weights are quantized (parameters)</li>
  <li>Activation quantization: Both weights and activations (intermediate outputs) are quantized</li>
  <li>Popular bit-widths: 8-bit (INT8), 4-bit (INT4), and even 2-bit or 1-bit (binary)</li>
</ul>

<h3>Quantization-Aware Training (QAT)</h3>
<p>Incorporates quantization effects during the training process:</p>
<ul>
  <li>Simulates quantization during training</li>
  <li>Allows the model to adapt to quantization noise</li>
  <li>Generally produces better results than PTQ</li>
</ul>

<h2>Popular Quantization Techniques for LLMs</h2>
<h3>GPTQ</h3>
<p>A one-shot weight quantization method specifically designed for large Transformer models:</p>
<ul>
  <li>Reconstructs layer outputs by solving a least squares optimization problem</li>
  <li>Shows minimal accuracy degradation even at 3 or 4 bits</li>
</ul>

<h3>AWQ (Activation-aware Weight Quantization)</h3>
<p>Preserves the most important weights based on activation magnitudes:</p>
<ul>
  <li>Identifies and preserves weights that have the largest impact on activations</li>
  <li>Uses per-channel scaling for better accuracy</li>
</ul>

<h3>QLoRA</h3>
<p>Combines quantization with Low-Rank Adaptation (LoRA) for efficient fine-tuning:</p>
<ul>
  <li>Keeps base model in low precision (e.g., 4-bit)</li>
  <li>Adds small trainable adapters in higher precision</li>
  <li>Enables efficient fine-tuning of large models on consumer hardware</li>
</ul>

<h2>Challenges in LLM Quantization</h2>
<h3>Accuracy Degradation</h3>
<p>Lower precision can lead to:</p>
<ul>
  <li>Reduced performance on specific tasks</li>
  <li>More hallucinations or incorrect outputs</li>
  <li>Worse handling of edge cases</li>
</ul>

<h3>Technical Challenges</h3>
<ul>
  <li>Outlier weights can cause significant quantization errors</li>
  <li>Attention layers are particularly sensitive to quantization</li>
  <li>Hardware support for sub-8-bit operations varies widely</li>
</ul>

<h2>Hardware Considerations</h2>
<p>Different hardware platforms offer varying support for quantized models:</p>
<ul>
  <li><strong>GPUs:</strong> NVIDIA GPUs with Tensor Cores excel at INT8 operations</li>
  <li><strong>CPUs:</strong> Modern x86 processors support INT8 via instruction sets like AVX-512</li>
  <li><strong>Mobile/Edge:</strong> ARM processors often include dedicated low-precision accelerators</li>
</ul>

<h2>Case Studies: Quantized LLM Performance</h2>
<h3>Llama 2 Quantization</h3>
<p>Meta's Llama 2 7B model shows these characteristics when quantized:</p>
<ul>
  <li>FP16 (16-bit): Baseline performance, 14GB model size</li>
  <li>INT8 (8-bit): ~0.5% perplexity increase, 7GB model size</li>
  <li>INT4 (4-bit): ~3% perplexity increase, 3.5GB model size</li>
</ul>

<h3>Real-world Deployment Examples</h3>
<ul>
  <li>Mobile assistants using 4-bit quantized models</li>
  <li>Embedded devices running specialized 2-bit models</li>
  <li>Cloud providers offering quantized models for cost savings</li>
</ul>

<h2>Future Directions in LLM Quantization</h2>
<ul>
  <li>Mixed-precision approaches (different precision for different layers)</li>
  <li>Sparse-quantized models (combining pruning with quantization)</li>
  <li>Hardware-aware quantization optimized for specific devices</li>
  <li>Task-specific quantization (preserving precision for critical tasks)</li>
</ul>

<h2>Conclusion</h2>
<p>LLM quantization represents a critical advance in making large language models more accessible and deployable. As techniques continue to improve, we can expect to see increasingly powerful language models running efficiently on a wider range of devices, from data centers to smartphones and IoT devices.</p>

<p>The field is evolving rapidly, with new methods constantly emerging that push the boundaries of efficiency while maintaining performance. Quantization, along with other optimization techniques like pruning and distillation, is helping to democratize access to state-of-the-art AI capabilities.</p>
`,
    author: 'Aswin Bhaskaran',
    date: '2024-08-01T10:00:00Z',
    readTime: '12 min read',
    tags: ['AI', 'Machine Learning', 'LLM', 'Quantization', 'Optimization'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    category: 'technology'
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
