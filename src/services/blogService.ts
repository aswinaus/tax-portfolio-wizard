import { BlogPost } from '../types/blog';

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Minimalist Code: Principles and Practices',
    excerpt: 'Explore the principles of minimalist code and learn how to write elegant, efficient, and maintainable software.',
    content: `
      <h2>Introduction</h2>
      <p>Minimalist code is about writing software that is easy to understand, maintain, and extend. It's about reducing complexity and focusing on the essential aspects of the problem you're trying to solve.</p>
      
      <h2>Principles of Minimalist Code</h2>
      <ul>
        <li><strong>Keep it Simple:</strong> Avoid over-engineering and unnecessary complexity.</li>
        <li><strong>Write Readable Code:</strong> Use clear and descriptive names for variables, functions, and classes.</li>
        <li><strong>Avoid Duplication:</strong> Follow the DRY (Don't Repeat Yourself) principle.</li>
        <li><strong>Write Testable Code:</strong> Make sure your code is easy to test and verify.</li>
        <li><strong>Refactor Continuously:</strong> Improve your code over time by removing duplication, simplifying logic, and improving readability.</li>
      </ul>
      
      <h2>Practices for Minimalist Code</h2>
      <ol>
        <li><strong>Use Short Functions:</strong> Keep your functions small and focused on a single task.</li>
        <li><strong>Avoid Deep Nesting:</strong> Reduce the number of nested loops and conditional statements.</li>
        <li><strong>Use Meaningful Names:</strong> Choose names that accurately describe the purpose of variables, functions, and classes.</li>
        <li><strong>Write Comments Sparingly:</strong> Use comments to explain complex logic or non-obvious behavior.</li>
        <li><strong>Use a Consistent Style:</strong> Follow a consistent coding style to improve readability.</li>
      </ol>
      
      <h2>Benefits of Minimalist Code</h2>
      <ul>
        <li><strong>Improved Readability:</strong> Minimalist code is easier to understand and maintain.</li>
        <li><strong>Reduced Complexity:</strong> Minimalist code is less complex and easier to debug.</li>
        <li><strong>Increased Efficiency:</strong> Minimalist code is often more efficient and performs better.</li>
        <li><strong>Improved Testability:</strong> Minimalist code is easier to test and verify.</li>
        <li><strong>Reduced Maintenance Costs:</strong> Minimalist code is easier to maintain and extend, reducing maintenance costs.</li>
      </ul>
    `,
    author: 'Aswin Bhaskaran',
    date: '2023-07-20T12:00:00Z',
    readTime: '5 min read',
    tags: ['code', 'minimalist', 'software', 'development'],
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1542831323-533a41036463?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80'
  },
  {
    id: '2',
    title: 'Mastering Time Management: Strategies for Increased Productivity',
    excerpt: 'Learn effective time management strategies to boost your productivity and achieve your goals.',
    content: `
      <h2>Introduction</h2>
      <p>Time management is the process of planning and controlling how much time to spend on specific activities. Good time management enables you to work smarter, not harder, so that you get more done in less time, even when time is tight and pressures are high.</p>
      
      <h2>Strategies for Time Management</h2>
      <ul>
        <li><strong>Set Clear Goals:</strong> Define what you want to achieve and break it down into smaller, manageable tasks.</li>
        <li><strong>Prioritize Tasks:</strong> Use methods like the Eisenhower Matrix (urgent/important) to prioritize tasks.</li>
        <li><strong>Create a Schedule:</strong> Plan your day and allocate time for specific tasks.</li>
        <li><strong>Eliminate Distractions:</strong> Identify and eliminate distractions that prevent you from focusing on your work.</li>
        <li><strong>Take Breaks:</strong> Regular breaks can help you stay focused and avoid burnout.</li>
      </ul>
      
      <h2>Tools for Time Management</h2>
      <ol>
        <li><strong>Task Management Apps:</strong> Use apps like Todoist, Trello, or Asana to manage your tasks and projects.</li>
        <li><strong>Calendar Apps:</strong> Use apps like Google Calendar or Outlook Calendar to schedule your time and set reminders.</li>
        <li><strong>Time Tracking Apps:</strong> Use apps like Toggl Track or RescueTime to track how you spend your time.</li>
      </ol>
      
      <h2>Benefits of Time Management</h2>
      <ul>
        <li><strong>Increased Productivity:</strong> Effective time management can help you get more done in less time.</li>
        <li><strong>Reduced Stress:</strong> Good time management can reduce stress and improve your overall well-being.</li>
        <li><strong>Improved Focus:</strong> Time management can help you stay focused on your work and avoid distractions.</li>
        <li><strong>Better Work-Life Balance:</strong> Time management can help you balance your work and personal life.</li>
        <li><strong>Achieving Goals:</strong> Time management can help you achieve your goals by breaking them down into smaller, manageable tasks.</li>
      </ul>
    `,
    author: 'Aswin Bhaskaran',
    date: '2023-07-15T10:00:00Z',
    readTime: '6 min read',
    tags: ['time management', 'productivity', 'goals', 'planning'],
    category: 'business',
    image: 'https://images.unsplash.com/photo-1507842214779-84ffb2f8d82c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2590&q=80'
  },
  {
    id: '3',
    title: 'The Power of Data Visualization: Transforming Data into Insights',
    excerpt: 'Discover how data visualization can help you transform raw data into meaningful insights and make better decisions.',
    content: `
      <h2>Introduction</h2>
      <p>Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization tools provide an accessible way to see and understand trends, outliers, and patterns in data.</p>
      
      <h2>Benefits of Data Visualization</h2>
      <ul>
        <li><strong>Improved Understanding:</strong> Data visualization can help you understand complex data more easily.</li>
        <li><strong>Better Decision-Making:</strong> Data visualization can help you make better decisions by providing insights into your data.</li>
        <li><strong>Effective Communication:</strong> Data visualization can help you communicate your findings to others more effectively.</li>
        <li><strong>Identifying Trends:</strong> Data visualization can help you identify trends and patterns in your data.</li>
        <li><strong>Exploring Data:</strong> Data visualization can help you explore your data and discover new insights.</li>
      </ul>
      
      <h2>Tools for Data Visualization</h2>
      <ol>
        <li><strong>Tableau:</strong> A popular data visualization tool for creating interactive dashboards and reports.</li>
        <li><strong>Power BI:</strong> A business analytics tool by Microsoft for creating interactive visualizations and business intelligence capabilities.</li>
        <li><strong>D3.js:</strong> A JavaScript library for creating custom data visualizations.</li>
        <li><strong>Google Charts:</strong> A free tool for creating simple charts and graphs.</li>
        <li><strong>Python Libraries:</strong> Libraries like Matplotlib and Seaborn for creating visualizations in Python.</li>
      </ol>
      
      <h2>Best Practices for Data Visualization</h2>
      <ul>
        <li><strong>Choose the Right Chart:</strong> Select the appropriate chart type for your data and the message you want to convey.</li>
        <li><strong>Keep it Simple:</strong> Avoid clutter and unnecessary complexity in your visualizations.</li>
        <li><strong>Use Color Effectively:</strong> Use color to highlight important information and create visual appeal.</li>
        <li><strong>Provide Context:</strong> Add labels, titles, and captions to provide context and explain your visualizations.</li>
        <li><strong>Tell a Story:</strong> Use data visualization to tell a story and communicate your findings to others.</li>
      </ul>
    `,
    author: 'Aswin Bhaskaran',
    date: '2023-07-10T09:30:00Z',
    readTime: '7 min read',
    tags: ['data visualization', 'insights', 'charts', 'graphs'],
    category: 'business',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f323c184?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
  },
  {
    id: '4',
    title: 'Getting Started with React Query: A Comprehensive Guide',
    excerpt: 'Learn how to use React Query to fetch, cache, and update data in your React applications with ease.',
    content: `
      <h2>Introduction</h2>
      <p>React Query is a powerful library for managing data fetching, caching, and updating in React applications. It provides a simple and declarative API for handling asynchronous data, making it easier to build performant and maintainable applications.</p>
      
      <h2>Key Features of React Query</h2>
      <ul>
        <li><strong>Automatic Caching:</strong> React Query automatically caches data in the background, reducing the need for manual caching.</li>
        <li><strong>Background Updates:</strong> React Query automatically updates data in the background, ensuring that your application always has the latest data.</li>
        <li><strong>Optimistic Updates:</strong> React Query supports optimistic updates, allowing you to update the UI immediately while the data is being updated in the background.</li>
        <li><strong>Error Handling:</strong> React Query provides built-in error handling, making it easier to handle errors when fetching data.</li>
        <li><strong>Pagination and Infinite Loading:</strong> React Query supports pagination and infinite loading, making it easier to display large datasets.</li>
      </ul>
      
      <h2>Basic Usage of React Query</h2>
      <ol>
        <li><strong>Install React Query:</strong> Add React Query to your project using npm or yarn.</li>
        <li><strong>Create a Query Client:</strong> Create a query client to manage your queries.</li>
        <li><strong>Use the useQuery Hook:</strong> Use the useQuery hook to fetch data and access the query state.</li>
        <li><strong>Display the Data:</strong> Display the data in your component.</li>
      </ol>
      
      <h2>Advanced Usage of React Query</h2>
      <ul>
        <li><strong>Mutations:</strong> Use the useMutation hook to update data.</li>
        <li><strong>Query Invalidation:</strong> Invalidate queries to force a refetch of data.</li>
        <li><strong>Prefetching:</strong> Prefetch data to improve performance.</li>
        <li><strong>Custom Queries:</strong> Create custom queries to fetch data from different sources.</li>
        <li><strong>Query Options:</strong> Configure queries using various options, such as caching time and retry behavior.</li>
      </ul>
    `,
    author: 'Aswin Bhaskaran',
    date: '2023-07-05T11:00:00Z',
    readTime: '8 min read',
    tags: ['react', 'react query', 'data fetching', 'caching'],
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1618408933076-4b3514ec144c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80'
  },
  {
    id: '5',
    title: 'OWASP Top 10 for Large Language Models: Security Risks and Mitigation',
    excerpt: 'A comprehensive guide to the OWASP Top 10 vulnerabilities for Large Language Models with examples and mitigation strategies.',
    content: `
      <h2>Introduction</h2>
      <p>Large Language Models (LLMs) are becoming increasingly popular, but they also introduce new security risks. The OWASP Top 10 for LLMs is a list of the most critical security risks associated with LLMs.</p>
      
      <h2>OWASP Top 10 for LLMs</h2>
      <ol>
        <li><strong>Prompt Injection:</strong> Attackers can inject malicious prompts into LLMs to manipulate their behavior.</li>
        <li><strong>Data Poisoning:</strong> Attackers can poison the training data used to train LLMs, leading to biased or malicious behavior.</li>
        <li><strong>Model Denial of Service:</strong> Attackers can overload LLMs with requests, causing them to become unavailable.</li>
        <li><strong>Supply Chain Vulnerabilities:</strong> LLMs rely on various dependencies, which can introduce vulnerabilities.</li>
        <li><strong>Sensitive Information Disclosure:</strong> LLMs can inadvertently disclose sensitive information.</li>
        <li><strong>Insecure Output Handling:</strong> LLMs can generate output that is not properly sanitized, leading to security vulnerabilities.</li>
        <li><strong>Authentication and Authorization:</strong> LLMs may not properly authenticate and authorize users, leading to unauthorized access.</li>
        <li><strong>Insufficient Monitoring and Logging:</strong> LLMs may not be properly monitored and logged, making it difficult to detect and respond to security incidents.</li>
        <li><strong>Insecure Model Deployment:</strong> LLMs may be deployed in an insecure manner, making them vulnerable to attack.</li>
        <li><strong>Unsafe API Integration:</strong> LLMs may be integrated with other APIs in an unsafe manner, leading to security vulnerabilities.</li>
      </ol>
      
      <h2>Mitigation Strategies</h2>
      <ul>
        <li><strong>Input Validation:</strong> Validate user input to prevent prompt injection attacks.</li>
        <li><strong>Data Sanitization:</strong> Sanitize training data to prevent data poisoning attacks.</li>
        <li><strong>Rate Limiting:</strong> Implement rate limiting to prevent model denial of service attacks.</li>
        <li><strong>Dependency Management:</strong> Manage dependencies carefully to prevent supply chain vulnerabilities.</li>
        <li><strong>Data Masking:</strong> Mask sensitive information to prevent sensitive information disclosure.</li>
        <li><strong>Output Sanitization:</strong> Sanitize output to prevent insecure output handling.</li>
        <li><strong>Authentication and Authorization:</strong> Implement proper authentication and authorization mechanisms.</li>
        <li><strong>Monitoring and Logging:</strong> Implement monitoring and logging to detect and respond to security incidents.</li>
        <li><strong>Secure Deployment:</strong> Deploy LLMs in a secure manner.</li>
        <li><strong>Secure API Integration:</strong> Integrate LLMs with other APIs in a secure manner.</li>
      </ul>
    `,
    author: 'Aswin Bhaskaran',
    date: '2023-06-28T14:00:00Z',
    readTime: '9 min read',
    tags: ['owasp', 'llm', 'security', 'vulnerabilities'],
    category: 'security',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
  },
  {
    id: '6',
    title: 'Understanding Reinforcement Learning through Markov Decision Processes',
    excerpt: 'Explore the foundational concepts of Reinforcement Learning, including Markov Decision Processes, policies, value functions, and how agents learn to maximize rewards through sequential decision making.',
    content: `
      <h2>Introduction</h2>
      <p>Reinforcement Learning (RL) is a type of machine learning where an agent learns to make decisions in an environment to maximize a cumulative reward. Markov Decision Processes (MDPs) provide a mathematical framework for modeling sequential decision-making problems, making them a fundamental concept in RL.</p>
      
      <h2>Markov Decision Processes (MDPs)</h2>
      <p>An MDP is defined by a tuple (S, A, P, R, γ), where:</p>
      <ul>
        <li><strong>S:</strong> A set of states</li>
        <li><strong>A:</strong> A set of actions</li>
        <li><strong>P(s' | s, a):</strong> The probability of transitioning from state s to state s' after taking action a</li>
        <li><strong>R(s, a, s'):</strong> The reward received after transitioning from state s to state s' after taking action a</li>
        <li><strong>γ:</strong> The discount factor, which determines the importance of future rewards</li>
      </ul>
      
      <h2>Key Concepts in Reinforcement Learning</h2>
      <ul>
        <li><strong>Policy (π):</strong> A policy defines the agent's behavior, specifying which action to take in each state.</li>
        <li><strong>Value Function (V(s)):</strong> The value function estimates the expected cumulative reward the agent will receive starting from state s and following a particular policy.</li>
        <li><strong>Q-Function (Q(s, a)):</strong> The Q-function estimates the expected cumulative reward the agent will receive starting from state s, taking action a, and following a particular policy.</li>
      </ul>
      
      <h2>Learning in Reinforcement Learning</h2>
      <p>The goal of RL is to find an optimal policy that maximizes the expected cumulative reward. Agents learn through trial and error, interacting with the environment and updating their policy based on the rewards they receive.</p>
      
      <h2>Algorithms in Reinforcement Learning</h2>
      <ul>
        <li><strong>Q-Learning:</strong> An off-policy algorithm that learns the optimal Q-function by iteratively updating the Q-values based on the Bellman equation.</li>
        <li><strong>SARSA:</strong> An on-policy algorithm that learns the Q-function by updating the Q-values based on the current policy.</li>
        <li><strong>Deep Q-Networks (DQN):</strong> A deep learning-based algorithm that uses neural networks to approximate the Q-function.</li>
      </ul>
    `,
    author: 'Aswin Bhaskaran',
    date: '2023-06-20T10:00:00Z',
    readTime: '10 min read',
    tags: ['reinforcement learning', 'markov decision processes', 'machine learning'],
    category: 'machine learning',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
  }
];

// Function to fetch all blogs
export const fetchBlogs = () => {
  return Promise.resolve([...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

// Function to fetch a specific blog by ID
export const fetchBlogById = (id: string) => {
  const blog = blogPosts.find(blog => blog.id === id);
  
  if (!blog) {
    return Promise.reject(new Error('Blog not found'));
  }
  
  return Promise.resolve(blog);
};

// Function to fetch only technology blogs
export const fetchTechnologyBlogs = () => {
  return Promise.resolve(
    [...blogPosts]
      .filter(blog => blog.category === 'technology')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
};

// Function to create a new blog post
export const createBlogPost = (blog: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => {
  const newBlog: BlogPost = {
    id: (blogPosts.length + 1).toString(),
    date: new Date().toISOString(),
    readTime: `${Math.max(Math.ceil(blog.content.length / 2000), 3)} min read`,
    ...blog
  };
  
  blogPosts.push(newBlog);
  return newBlog;
};

// Function to search blogs by term
export const searchBlogs = (term: string) => {
  const lowercaseTerm = term.toLowerCase();
  return Promise.resolve(
    blogPosts.filter(blog => 
      blog.title.toLowerCase().includes(lowercaseTerm) ||
      blog.excerpt.toLowerCase().includes(lowercaseTerm) ||
      blog.content.toLowerCase().includes(lowercaseTerm) ||
      blog.author.toLowerCase().includes(lowercaseTerm) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm))
    )
  );
};

