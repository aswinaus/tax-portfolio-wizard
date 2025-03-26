
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, UserCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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

const LyzrAgentChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if API is available
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        // Add a simple ping to check if the API is reachable
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('https://api.lyzr.ai/ping', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        setIsApiAvailable(response.ok);
        if (!response.ok) {
          console.warn('Lyzr API is not available, using fallback mode');
        }
      } catch (error) {
        console.error('Error checking API availability:', error);
        setIsApiAvailable(false);
      }
    };
    
    checkApiAvailability();
  }, []);

  const callLyzrAPI = async (userMessage: string): Promise<LyzrResponse> => {
    try {
      // If API is not available, use fallback mode with demo responses
      if (!isApiAvailable) {
        console.log('Using fallback mode for Lyzr API');
        
        // Simple fallback responses for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        const demoResponses: Record<string, string> = {
          default: "I can help you with Form 990 filing information. What would you like to know?",
          deadline: "Form 990 is generally due by the 15th day of the 5th month after the organization's accounting period ends. For calendar-year filers, this is May 15.",
          extension: "You can request an automatic 6-month extension by filing Form 8868 before the due date.",
          requirements: "Organizations with gross receipts ≥ $200,000 or total assets ≥ $500,000 must file Form 990. Smaller organizations may file Form 990-EZ or 990-N (e-Postcard).",
        };
        
        // Simple keyword matching
        let response = demoResponses.default;
        const lowercaseMsg = userMessage.toLowerCase();
        
        if (lowercaseMsg.includes('deadline') || lowercaseMsg.includes('due date')) {
          response = demoResponses.deadline;
        } else if (lowercaseMsg.includes('extension')) {
          response = demoResponses.extension;
        } else if (lowercaseMsg.includes('requirement') || lowercaseMsg.includes('who needs')) {
          response = demoResponses.requirements;
        }
        
        return { response, conversation_id: 'demo-mode' };
      }
      
      // Regular API call implementation
      const apiUrl = 'https://api.lyzr.ai/chat';
      const agentId = '67d85a7eb0001308323789d0'; // Your agent ID from the URL
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LYZR_API_KEY || 'your-lyzr-api-key'}`
      };
      
      const payload = {
        message: userMessage,
        conversation_id: conversationId,
        agent_id: agentId,
        metadata: {
          source: 'form990_assistant'
        }
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
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
      
      // If we encounter an error, switch to fallback mode for future calls
      setIsApiAvailable(false);
      
      // Return a friendly error message
      return { 
        response: "I'm having trouble connecting to my knowledge base right now. Let me use my general knowledge to help you with Form 990 questions instead.",
        conversation_id: 'error-fallback'
      };
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
      // Call the Lyzr API with the user's message
      const lyzrResponse = await callLyzrAPI(userMessage.content);
      
      // Save conversation ID for continued conversation
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
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Form 990 Filing Assistant {!isApiAvailable && "(Demo Mode)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pb-0">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Ask me anything about Form 990 filing requirements, deadlines, or procedures.
              </p>
              {!isApiAvailable && (
                <p className="text-xs text-amber-500 mt-2">
                  Running in demo mode with limited responses (API unavailable)
                </p>
              )}
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
            placeholder="Ask about Form 990 requirements, deadlines, etc."
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

export default LyzrAgentChat;
