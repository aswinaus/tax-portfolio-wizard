
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Workflow, Zap, MessagesSquare, Sparkles, Send, Database, Loader2, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AgentServicePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // This would handle scrolling to the bottom when new messages arrive
  useRef(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  });
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }
    
    // In a real implementation, this would securely store the API key
    // For demo purposes, we're just setting a flag
    setIsApiKeySet(true);
    toast.success('API key set successfully');
  };
  
  const handleTaxAgentQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter a query');
      return;
    }
    
    if (!isApiKeySet) {
      toast.error('Please set your OpenAI API key first');
      return;
    }
    
    const userMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // In a production environment, this would call the Tax Agent API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate the agent processing the query using the GraphSearch tool
      const simulatedSteps = [
        "I need to answer a question about tax data.",
        "I'll use the GraphSearch tool to query the Neo4j database.",
        `Executing Cypher query to find information related to: "${userMessage.content}"`,
        "Processing results and formulating a response..."
      ];
      
      for (const step of simulatedSteps) {
        console.log(step);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Simulate the agent's response
      const simulatedResponse = `Based on the tax data in our graph database, I found that ${userMessage.content.includes('organization') ? 'organizations' : 'taxpayers'} in this category typically report an average of 15% higher deductions compared to the national average. The data shows significant regional variations, with California, New York, and Texas showing the highest volumes of such transactions.`;
      
      const assistantMessage: Message = {
        content: simulatedResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Failed to process your query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
            Agent as a Service
          </h1>
          <p className="text-muted-foreground">
            Discover AI agents that can handle tasks and workflows autonomously
          </p>
        </div>
        
        {/* Tax Agent Demo Section */}
        <div className="mb-16 bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Tax Data Analysis Agent</h2>
              <p className="text-muted-foreground">Ask questions about tax data using our Neo4j-powered agent</p>
            </div>
            <Badge className="ml-auto" variant="outline">Live Demo</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="h-[400px] flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Tax Agent Chat
                  </CardTitle>
                  <CardDescription>
                    Using LangChain's Agent architecture with GraphSearch tool
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow overflow-y-auto">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">
                          Ask questions about tax data, filing statistics, or regional trends.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`flex gap-3 max-w-[80%] ${
                              msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            } p-3 rounded-lg`}
                          >
                            {msg.role === 'assistant' && (
                              <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-sm">{msg.content}</p>
                              <span className="text-xs opacity-70 block mt-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {msg.role === 'user' && (
                              <UserCircle2 className="h-5 w-5 mt-1 flex-shrink-0" />
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted p-3 rounded-lg flex items-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          <span className="text-sm">Processing your query...</span>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                <CardFooter className="pt-3 border-t">
                  <form onSubmit={handleTaxAgentQuery} className="w-full flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about tax filings, statistics, or trends..."
                      disabled={isLoading || !isApiKeySet}
                      className="flex-grow"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={isLoading || !isApiKeySet || !input.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardFooter>
              </Card>
              
              {!isApiKeySet && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Set OpenAI API Key</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleApiKeySubmit} className="flex gap-2">
                      <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your OpenAI API key"
                        className="flex-grow"
                      />
                      <Button type="submit">
                        Set Key
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Agent Implementation</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <pre className="whitespace-pre-wrap bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto text-xs">
{`from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType

tools = [
    Tool(
        name="GraphSearch",
        func=cypher_chain.run,
        description="""Useful for questions related to tax mostly analytical data querying,
        Always have complete questions as input.
        """,
    ),
]

TaxAgent = initialize_agent(
    tools,
    ChatOpenAI(temperature=0, model_name='gpt-4'),
    agent=AgentType.OPENAI_FUNCTIONS, 
    verbose=True
)`}
                  </pre>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Your question is sent to the LangChain-powered agent</li>
                    <li>The agent analyzes your query and decides to use the GraphSearch tool</li>
                    <li>GraphSearch generates a Cypher query for Neo4j</li>
                    <li>Results are processed and returned in natural language</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Original content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <Bot className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Specialized Agents</CardTitle>
              <CardDescription>
                Purpose-built AI assistants for specific domains and tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Form 990 filing assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Transfer pricing documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>LLM safety and security advisors</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-primary border-primary/30">
                Coming Soon
              </Badge>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <Workflow className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Workflow Automation</CardTitle>
              <CardDescription>
                Automate repetitive tasks with intelligent agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Document processing pipelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Multi-step data analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Report generation and distribution</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-primary border-primary/30">
                Coming Soon
              </Badge>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <MessagesSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Conversational AI</CardTitle>
              <CardDescription>
                Natural language interfaces for complex systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Contextual knowledge bases</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Integration with enterprise systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Multi-turn reasoning capabilities</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-primary border-primary/30">
                Coming Soon
              </Badge>
            </CardFooter>
          </Card>
        </div>
        
        <Separator className="my-16" />
        
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-display font-semibold">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 text-primary font-semibold rounded-full w-8 h-8 flex items-center justify-center mb-4">1</div>
              <h3 className="text-lg font-medium mb-2">Define Your Needs</h3>
              <p className="text-muted-foreground text-sm">
                Specify the tasks, knowledge domains, and integration points for your custom AI agent.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 text-primary font-semibold rounded-full w-8 h-8 flex items-center justify-center mb-4">2</div>
              <h3 className="text-lg font-medium mb-2">Configure & Deploy</h3>
              <p className="text-muted-foreground text-sm">
                We'll build, test, and deploy your agent with the right capabilities and safeguards.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 text-primary font-semibold rounded-full w-8 h-8 flex items-center justify-center mb-4">3</div>
              <h3 className="text-lg font-medium mb-2">Continuous Improvement</h3>
              <p className="text-muted-foreground text-sm">
                Your agent learns and improves over time based on feedback and new requirements.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/30 p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
            <p className="text-muted-foreground">
              Explore how our AI agents can transform your business processes.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentServicePage;
