import { useState, useRef, useEffect } from 'react';
import { Send, Bot, UserCircle2, Loader2, AlertTriangle, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Lyzr API response structure
interface LyzrResponse {
  response: string;
  conversation_id?: string;
}

interface TaxAgentChatProps {
  useDirectConnection?: boolean;
}

const TaxAgentChat = ({ useDirectConnection = false }: TaxAgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const MAX_RETRIES = 3;
  const API_TIMEOUT = 8000; // 8 seconds
  const AZURE_ENDPOINT = "https://taxaiagents.azurewebsites.net";

  const sampleCypherQuery = `
    MATCH (s:STATE)-[:Size_of_adjusted_gross_income]->(n:No_of_returns)
    WHERE n.name > 10000
    RETURN COUNT(s)
  `;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setConnectionError(null);
  }, []);

  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const pingUrl = `${AZURE_ENDPOINT}/api/ping`;
        console.log(`Checking API availability at: ${pingUrl}`);
        
        const response = await fetch(pingUrl, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setIsApiAvailable(true);
          setConnectionError(null);
        } else {
          setConnectionError('Unable to connect to the Azure Function service');
          console.warn('Azure Function returned an error status:', response.status);
          
          if (retryCount >= MAX_RETRIES) {
            setIsApiAvailable(false);
            console.warn('Max retries exceeded, falling back to demo mode');
          } else {
            setRetryCount(prev => prev + 1);
            setTimeout(checkApiAvailability, 2000);
          }
        }
      } catch (error) {
        console.error('Error checking API availability:', error);
        setConnectionError(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        if (retryCount >= MAX_RETRIES) {
          setIsApiAvailable(false);
          console.warn('Max retries exceeded, falling back to demo mode');
        } else {
          setRetryCount(prev => prev + 1);
          setTimeout(checkApiAvailability, 2000);
        }
      }
    };
    
    checkApiAvailability();
  }, [retryCount, useDirectConnection]);

  const callLyzrAPI = async (userMessage: string): Promise<LyzrResponse> => {
    try {
      if (!isApiAvailable) {
        console.log('Using fallback mode for Lyzr API');
        
        const demoResponses: Record<string, string> = {
          default: "I can help you with Form 990 filing information. What would you like to know?",
          deadline: "Form 990 is generally due by the 15th day of the 5th month after the organization's accounting period ends. For calendar-year filers, this is May 15.",
          extension: "You can request an automatic 6-month extension by filing Form 8868 before the due date.",
          requirements: "Organizations with gross receipts ≥ $200,000 or total assets ≥ $500,000 must file Form 990. Smaller organizations may file Form 990-EZ or 990-N (e-Postcard).",
          cypher: `I can provide information about Neo4j queries. Here's a sample Cypher query for tax data:\n\n${sampleCypherQuery}`,
        };
        
        let response = demoResponses.default;
        const lowercaseMsg = userMessage.toLowerCase();
        
        if (lowercaseMsg.includes('deadline') || lowercaseMsg.includes('due date')) {
          response = demoResponses.deadline;
        } else if (lowercaseMsg.includes('extension')) {
          response = demoResponses.extension;
        } else if (lowercaseMsg.includes('requirement') || lowercaseMsg.includes('who needs')) {
          response = demoResponses.requirements;
        } else if (lowercaseMsg.includes('cypher') || lowercaseMsg.includes('query') || lowercaseMsg.includes('neo4j')) {
          response = demoResponses.cypher;
        }
        
        return { response, conversation_id: 'demo-mode' };
      }
      
      const apiUrl = `${AZURE_ENDPOINT}/api/chat`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LYZR_API_KEY || 'your-lyzr-api-key'}`
      };
      
      const payload = {
        message: userMessage,
        conversation_id: conversationId,
        agent_id: '67d85a7eb0001308323789d0',
        metadata: {
          source: 'form990_assistant'
        }
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling Lyzr API:', error);
      
      if (retryCount >= MAX_RETRIES) {
        setIsApiAvailable(false);
      } else {
        setRetryCount(prev => prev + 1);
      }
      
      return { 
        response: "I'm experiencing connection issues. Let me try to reconnect to my knowledge base. Please try again in a moment.",
        conversation_id: 'error-retry'
      };
    }
  };

  const retryConnection = async () => {
    setConnectionError(null);
    setIsApiAvailable(true);
    setRetryCount(0);
    toast.info("Attempting to reconnect to the server...");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const pingUrl = `${AZURE_ENDPOINT}/api/ping`;
      
      const response = await fetch(pingUrl, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        toast.success("Successfully reconnected!");
        setIsApiAvailable(true);
        setConnectionError(null);
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (error) {
      console.error('Error during reconnection attempt:', error);
      setConnectionError(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error("Reconnection failed. Please check your network connection.");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const lyzrResponse = await callLyzrAPI(userMessage.content);
      
      if (lyzrResponse.conversation_id) {
        setConversationId(lyzrResponse.conversation_id);
      }
      
      const assistantMessage: Message = {
        content: lyzrResponse.response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with Lyzr API:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[500px] md:h-[600px] flex flex-col">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Form 990 Filing Assistant {!isApiAvailable && "(Demo Mode)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pb-0">
        {connectionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span>{connectionError}</span>
              <Button size="sm" variant="outline" onClick={retryConnection}>
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Ask me anything about Form 990 filing requirements, deadlines, or procedures.
              </p>
              {!isApiAvailable && (
                <div className="mt-4">
                  <p className="text-xs text-amber-500">
                    Running in demo mode with limited responses (API unavailable)
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2" 
                    onClick={retryConnection}
                  >
                    Attempt to reconnect
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="sample-query">
                    <AccordionTrigger className="text-sm text-left">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Sample Neo4j Tax Query
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto text-left">
                        <code>{sampleCypherQuery}</code>
                      </pre>
                      <p className="text-xs mt-2 text-left">
                        This query finds states with more than 10,000 tax returns and counts them.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
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
                  className={`flex gap-3 max-w-[95%] sm:max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } p-3 rounded-lg`}
                >
                  {msg.role === 'assistant' && (
                    <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm break-words">{msg.content}</p>
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
                <span className="text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }} className="w-full flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isMobile ? "Ask about Form 990..." : "Ask about Form 990 requirements, deadlines, etc."}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default TaxAgentChat;
