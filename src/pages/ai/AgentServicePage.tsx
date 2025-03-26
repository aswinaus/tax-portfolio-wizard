
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Workflow, Zap, MessagesSquare, Sparkles, Send, Database, Loader2, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }
    
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
        
        <div className="bg-card border rounded-lg p-6 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Coming Soon</h2>
              <p className="text-muted-foreground">Our specialized AI agents are currently in development</p>
            </div>
            <Badge className="ml-auto" variant="outline">Preview</Badge>
          </div>
        </div>
        
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
