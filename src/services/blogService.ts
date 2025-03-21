
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
      <ul>
        <li><strong>Prompt Injection:</strong> Attackers can inject malicious prompts to manipulate the model's output.</li>
        <li><strong>Insecure Output Handling:</strong> Failure to validate and sanitize the output from LLMs.</li>
        <li><strong>Training Data Poisoning:</strong> Malicious manipulation of training data to introduce vulnerabilities.</li>
        <li><strong>Model Denial of Service:</strong> Overloading the model with requests to cause service disruption.</li>
        <li><strong>Supply Chain Vulnerabilities:</strong> Risks associated with the components and dependencies of LLM systems.</li>
        <li><strong>Sensitive Information Disclosure:</strong> Leakage of confidential or private information in model responses.</li>
        <li><strong>Insecure Plugin Design:</strong> Vulnerabilities in extensions and plugins for LLM applications.</li>
        <li><strong>Excessive Agency:</strong> Giving LLMs too much autonomy without proper oversight.</li>
        <li><strong>Overreliance:</strong> Depending too heavily on LLMs without human verification.</li>
        <li><strong>Model Theft:</strong> Unauthorized access to or copying of proprietary models.</li>
      </ul>
      
      <h2>Code Examples for Mitigation</h2>
      
      <h3>1. Prompt Injection Prevention</h3>
      <pre><code class="language-javascript">
        // Input validation to prevent prompt injection
        function validateUserPrompt(userInput) {
          // Remove any system instructions or control characters
          const sanitizedInput = userInput.replace(/system:|assistant:|user:/gi, "[FILTERED]");
          
          // Check for malicious patterns
          const suspiciousPatterns = [
            "ignore previous instructions",
            "disregard all prompts",
            "override system settings"
          ];
          
          for (const pattern of suspiciousPatterns) {
            if (sanitizedInput.toLowerCase().includes(pattern)) {
              return { valid: false, error: "Potentially malicious prompt detected" };
            }
          }
          
          return { valid: true, sanitizedInput };
        }
        
        // Usage
        const userInput = getUserInput();
        const validation = validateUserPrompt(userInput);
        
        if (validation.valid) {
          // Proceed with the sanitized input
          sendToLLM(validation.sanitizedInput);
        } else {
          // Handle invalid input
          showError(validation.error);
        }
      </code></pre>
      
      <h3>2. Output Filtering</h3>
      <pre><code class="language-python">
        def filter_llm_output(llm_response):
            # Define patterns for harmful content
            harmful_patterns = [
                r'(how to make .*? bomb)',
                r'(instructions for .*? illegal)',
                r'(personal information such as .*?)'
            ]
            
            # Check if response contains harmful content
            for pattern in harmful_patterns:
                if re.search(pattern, llm_response, re.IGNORECASE):
                    return "I cannot provide that information as it may violate safety guidelines."
            
            # Apply content moderation API
            moderation_result = content_moderation_api.analyze(llm_response)
            
            if moderation_result.is_harmful:
                return "The requested information cannot be provided due to safety concerns."
                
            return llm_response
            
        # Usage
        user_query = "Tell me about encryption algorithms"
        raw_response = llm_model.generate(user_query)
        safe_response = filter_llm_output(raw_response)
        return safe_response
      </code></pre>
      
      <h3>3. Rate Limiting Implementation</h3>
      <pre><code class="language-typescript">
        import { RateLimiterMemory } from 'rate-limiter-flexible';

        // Configure rate limiter - 10 requests per minute maximum
        const rateLimiter = new RateLimiterMemory({
          points: 10, // Number of requests
          duration: 60, // Per 60 seconds
        });

        // Express middleware for rate limiting
        export async function rateLimitMiddleware(req, res, next) {
          try {
            // Identify the user based on API key, user ID, or IP address
            const userKey = req.headers['api-key'] || req.ip;
            
            // Consume point
            await rateLimiter.consume(userKey);
            next();
          } catch (error) {
            // Rate limit exceeded
            res.status(429).json({
              error: 'Too many requests. Please try again later.',
              retryAfter: error.msBeforeNext / 1000
            });
          }
        }

        // Usage in an Express application
        app.use('/api/llm', rateLimitMiddleware);
        app.post('/api/llm', async (req, res) => {
          // Handle LLM request
          const response = await processLLMRequest(req.body);
          res.json(response);
        });
      </code></pre>
      
      <h3>4. Detecting PII in LLM Outputs</h3>
      <pre><code class="language-python">
        import re
        import spacy

        # Load NER model
        nlp = spacy.load("en_core_web_lg")

        def redact_pii(text):
            # Use regex patterns for structured PII
            # Credit Card Numbers
            text = re.sub(r'\\b(?:\\d{4}[- ]?){3}\\d{4}\\b', '[REDACTED CREDIT CARD]', text)
            
            # SSN
            text = re.sub(r'\\b\\d{3}-\\d{2}-\\d{4}\\b', '[REDACTED SSN]', text)
            
            # Email addresses
            text = re.sub(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', '[REDACTED EMAIL]', text)
            
            # Use NER for unstructured PII
            doc = nlp(text)
            entities_to_redact = ['PERSON', 'ORG', 'GPE', 'LOC', 'PHONE']
            
            redacted_text = text
            for ent in reversed(doc.ents):
                if ent.label_ in entities_to_redact:
                    redacted_text = redacted_text[:ent.start_char] + f'[REDACTED {ent.label_}]' + redacted_text[ent.end_char:]
            
            return redacted_text

        # Usage
        llm_output = get_llm_response("Tell me about John Doe who lives in New York")
        safe_output = redact_pii(llm_output)
        print(safe_output)  # "Tell me about [REDACTED PERSON] who lives in [REDACTED GPE]"
      </code></pre>
      
      <h3>5. Secure LLM Integration Class</h3>
      <pre><code class="language-typescript">
        class SecureLLMService {
          private apiKey: string;
          private modelName: string;
          private maxRetries: number = 3;
          private sensitiveTerms: string[] = [
            "password", "secret", "api key", "token", "credentials"
          ];
          
          constructor(apiKey: string, modelName: string) {
            this.apiKey = apiKey;
            this.modelName = modelName;
          }
          
          private sanitizePrompt(prompt: string): string {
            // Remove potential instruction hijacking attempts
            let sanitized = prompt.replace(/system:|assistant:|user:/gi, "[FILTERED]");
            
            // Check for sensitive information in the prompt
            this.sensitiveTerms.forEach(term => {
              sanitized = sanitized.replace(new RegExp(\`\\\\b\${term}\\\\s*[:=]\\\\s*[^\\\\s]+\`, 'gi'), 
                \`\${term}: [REDACTED]\`);
            });
            
            return sanitized;
          }
          
          private async logRequest(prompt: string, response: string): Promise<void> {
            // Log to secure audit system (without sensitive data)
            const sanitizedPrompt = this.sanitizePrompt(prompt);
            const sanitizedResponse = response.substring(0, 100) + "..."; // Truncate for logging
            
            await auditLogger.log({
              timestamp: new Date(),
              modelName: this.modelName,
              promptPreview: sanitizedPrompt.substring(0, 50) + "...",
              responsePreview: sanitizedResponse,
              userId: getCurrentUser().id
            });
          }
          
          public async generateResponse(prompt: string): Promise<string> {
            // Sanitize input
            const sanitizedPrompt = this.sanitizePrompt(prompt);
            
            // Apply content safety filter to prompt
            const safetyResult = await contentSafetyService.checkPrompt(sanitizedPrompt);
            if (!safetyResult.safe) {
              throw new Error(\`Prompt rejected: \${safetyResult.reason}\`);
            }
            
            // Make API request with retry logic
            let attempts = 0;
            let response = null;
            
            while (attempts < this.maxRetries && !response) {
              try {
                response = await llmApiClient.complete({
                  model: this.modelName,
                  prompt: sanitizedPrompt,
                  max_tokens: 1000,
                  temperature: 0.7,
                  headers: {
                    Authorization: \`Bearer \${this.apiKey}\`
                  }
                });
              } catch (error) {
                attempts++;
                if (attempts >= this.maxRetries) {
                  throw new Error(\`Failed to get LLM response after \${this.maxRetries} attempts\`);
                }
                // Exponential backoff
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempts)));
              }
            }
            
            // Filter the response for safety
            const filteredResponse = await contentSafetyService.filterResponse(response.text);
            
            // Log the interaction
            await this.logRequest(prompt, filteredResponse);
            
            return filteredResponse;
          }
        }
        
        // Usage
        const llmService = new SecureLLMService(process.env.LLM_API_KEY, "gpt-4");
        
        app.post('/api/ask', async (req, res) => {
          try {
            const userPrompt = req.body.prompt;
            const response = await llmService.generateResponse(userPrompt);
            res.json({ response });
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
        });
      </code></pre>

      <h2>Mitigation Strategies</h2>
      <p>Here are some best practices to mitigate these risks:</p>
      <ul>
        <li><strong>Input Validation:</strong> Implement strict validation of user inputs to prevent prompt injection.</li>
        <li><strong>Output Filtering:</strong> Apply content filters to model outputs to prevent harmful content.</li>
        <li><strong>Training Data Verification:</strong> Carefully curate and verify training data to prevent poisoning.</li>
        <li><strong>Rate Limiting:</strong> Implement rate limiting to prevent denial of service attacks.</li>
        <li><strong>Regular Auditing:</strong> Conduct regular security audits of the entire LLM system.</li>
        <li><strong>Access Controls:</strong> Implement proper authentication and authorization mechanisms.</li>
        <li><strong>Secure Development:</strong> Follow secure coding practices when developing LLM applications.</li>
        <li><strong>Human Oversight:</strong> Maintain human review of critical LLM operations.</li>
        <li><strong>Encryption:</strong> Use encryption to protect sensitive data processed by LLMs.</li>
        <li><strong>Monitoring:</strong> Implement continuous monitoring of LLM behavior for anomalies.</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>As LLMs continue to evolve and become more integrated into our digital infrastructure, understanding and addressing these security risks becomes increasingly important. By implementing the mitigation strategies outlined above, organizations can significantly reduce the risks associated with LLM technology.</p>
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
      
      <h2>Code Implementation: Q-Learning Algorithm</h2>
      <pre><code class="language-python">
        import numpy as np
        import matplotlib.pyplot as plt
        import gym

        # Create a simple environment
        env = gym.make('FrozenLake-v1')

        # Initialize Q-table
        Q = np.zeros([env.observation_space.n, env.action_space.n])

        # Hyperparameters
        learning_rate = 0.8
        discount_factor = 0.95
        exploration_rate = 1.0
        max_exploration_rate = 1.0
        min_exploration_rate = 0.01
        exploration_decay_rate = 0.001

        # Training parameters
        num_episodes = 10000
        max_steps_per_episode = 100

        # List to track rewards
        rewards_all_episodes = []

        # Q-learning algorithm
        for episode in range(num_episodes):
            # Initialize new episode
            state = env.reset()
            done = False
            rewards_current_episode = 0
            
            for step in range(max_steps_per_episode):
                # Exploration-exploitation trade-off
                exploration_threshold = np.random.uniform(0, 1)
                
                if exploration_threshold > exploration_rate:
                    # Exploit: choose action with highest Q-value
                    action = np.argmax(Q[state, :])
                else:
                    # Explore: choose random action
                    action = env.action_space.sample()
                
                # Take action and observe new state and reward
                new_state, reward, done, _ = env.step(action)
                
                # Update Q-table using Bellman equation
                Q[state, action] = Q[state, action] * (1 - learning_rate) + \
                    learning_rate * (reward + discount_factor * np.max(Q[new_state, :]))
                
                # Update state and add reward
                state = new_state
                rewards_current_episode += reward
                
                # End episode if done
                if done:
                    break
            
            # Update exploration rate
            exploration_rate = min_exploration_rate + \
                (max_exploration_rate - min_exploration_rate) * np.exp(-exploration_decay_rate * episode)
            
            # Add current episode reward to total rewards list
            rewards_all_episodes.append(rewards_current_episode)
            
            # Print average reward every 1000 episodes
            if episode % 1000 == 0:
                average_reward = np.mean(rewards_all_episodes[-1000:])
                print(f"Episode: {episode}, Average Reward: {average_reward}, Exploration Rate: {exploration_rate}")

        print("Training completed!")

        # Calculate and print average reward per thousand episodes
        rewards_per_thousand_episodes = np.split(np.array(rewards_all_episodes), num_episodes/1000)
        count = 1000
        
        print("Average reward per thousand episodes:")
        for r in rewards_per_thousand_episodes:
            print(count, ": ", str(sum(r/1000)))
            count += 1000
            
        # Print trained Q-table
        print("\\nQ-table:")
        print(Q)

        # Visualize results
        plt.figure(figsize=(12, 5))
        plt.plot(rewards_all_episodes)
        plt.xlabel('Episode')
        plt.ylabel('Reward')
        plt.title('Rewards per Episode')
        plt.show()
      </code></pre>
      
      <h2>Deep Q-Networks (DQN)</h2>
      <p>For more complex environments, we can use neural networks to approximate the Q-function:</p>
      
      <pre><code class="language-python">
        import tensorflow as tf
        from tensorflow import keras
        from collections import deque
        import numpy as np
        import random
        import gym

        class DQNAgent:
            def __init__(self, state_size, action_size):
                self.state_size = state_size
                self.action_size = action_size
                self.memory = deque(maxlen=2000)
                self.gamma = 0.95    # discount factor
                self.epsilon = 1.0   # exploration rate
                self.epsilon_min = 0.01
                self.epsilon_decay = 0.995
                self.learning_rate = 0.001
                self.model = self._build_model()
                
            def _build_model(self):
                # Neural network for deep Q learning
                model = keras.Sequential()
                model.add(keras.layers.Dense(24, input_dim=self.state_size, activation='relu'))
                model.add(keras.layers.Dense(24, activation='relu'))
                model.add(keras.layers.Dense(self.action_size, activation='linear'))
                model.compile(loss='mse', optimizer=keras.optimizers.Adam(lr=self.learning_rate))
                return model
                
            def remember(self, state, action, reward, next_state, done):
                self.memory.append((state, action, reward, next_state, done))
                
            def act(self, state):
                if np.random.rand() <= self.epsilon:
                    return random.randrange(self.action_size)
                act_values = self.model.predict(state)
                return np.argmax(act_values[0])
                
            def replay(self, batch_size):
                minibatch = random.sample(self.memory, batch_size)
                for state, action, reward, next_state, done in minibatch:
                    target = reward
                    if not done:
                        target = reward + self.gamma * np.amax(self.model.predict(next_state)[0])
                    target_f = self.model.predict(state)
                    target_f[0][action] = target
                    self.model.fit(state, target_f, epochs=1, verbose=0)
                if self.epsilon > self.epsilon_min:
                    self.epsilon *= self.epsilon_decay

        # Main training loop
        def train_dqn(env_name):
            env = gym.make(env_name)
            state_size = env.observation_space.shape[0]
            action_size = env.action_space.n
            agent = DQNAgent(state_size, action_size)
            batch_size = 32
            EPISODES = 1000
            
            for e in range(EPISODES):
                state = env.reset()
                state = np.reshape(state, [1, state_size])
                total_reward = 0
                
                for time in range(500):
                    # env.render()  # Uncomment to visualize
                    action = agent.act(state)
                    next_state, reward, done, _ = env.step(action)
                    next_state = np.reshape(next_state, [1, state_size])
                    agent.remember(state, action, reward, next_state, done)
                    state = next_state
                    total_reward += reward
                    
                    if done:
                        print(f"Episode: {e}/{EPISODES}, Score: {total_reward}, Epsilon: {agent.epsilon:.2}")
                        break
                        
                    if len(agent.memory) > batch_size:
                        agent.replay(batch_size)
            
            return agent

        # Train the agent
        trained_agent = train_dqn('CartPole-v1')
      </code></pre>
      
      <h2>Learning in Reinforcement Learning</h2>
      <p>The goal of RL is to find an optimal policy that maximizes the expected cumulative reward. Agents learn through trial and error, interacting with the environment and updating their policy based on the rewards they receive.</p>
      
      <h2>Algorithms in Reinforcement Learning</h2>
      <ul>
        <li><strong>Q-Learning:</strong> An off-policy algorithm that learns the optimal Q-function by iteratively updating the Q-values based on the Bellman equation.</li>
        <li><strong>SARSA:</strong> An on-policy algorithm that learns the Q-function by updating the Q-values based on the current policy.</li>
        <li><strong>Deep Q-Networks (DQN):</strong> A deep learning-based algorithm that uses neural networks to approximate the Q-function.</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Reinforcement learning through Markov Decision Processes provides a powerful framework for solving sequential decision-making problems. By understanding these foundational concepts and implementing algorithms like Q-learning and DQN, you can develop agents that learn to make optimal decisions in complex environments.</p>
    `,
    author: 'Aswin Bhaskaran',
    date: '2023-06-20T10:00:00Z',
    readTime: '10 min read',
    tags: ['reinforcement learning', 'markov decision processes', 'machine learning'],
    category: 'machine learning',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80'
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
