
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

const LyzrAgentChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
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
      // In a real implementation, you would connect to the Lyzr API here
      // https://studio.lyzr.ai/agent-create/67d85a7eb0001308323789d0
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add mock response - in production, this would come from the Lyzr API
      const mockResponses: {[key: string]: string} = {
        "filing deadline": "Form 990 must be filed by the 15th day of the 5th month after your organization's fiscal year ends. For organizations with a December 31 year-end, the deadline is May 15.",
        "extension": "Yes, you can request an automatic 6-month extension by filing Form 8868 before your original due date.",
        "penalties": "Penalties for late filing start at $20 per day, with a maximum of $10,000 or 5% of your gross receipts. Organizations with annual gross receipts exceeding $1,068,500 face penalties of $105 per day, up to $54,500.",
        "requirements": "Your organization needs to file Form 990 if annual gross receipts are ≥ $200,000 or total assets are ≥ $500,000. Smaller organizations may file Form 990-EZ or 990-N instead.",
        "help": "I can help with Form 990 filing questions, deadlines, requirements, and basic guidance. Please ask me anything specific about Form 990."
      };
      
      let responseContent = "I'm your Form 990 filing assistant. I can answer questions about Form 990 requirements, deadlines, and filing procedures. How can I help you today?";
      
      // Check if the user message contains any keywords
      for (const [keyword, response] of Object.entries(mockResponses)) {
        if (userMessage.content.toLowerCase().includes(keyword)) {
          responseContent = response;
          break;
        }
      }
      
      const assistantMessage: Message = {
        content: responseContent,
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
          Form 990 Filing Assistant
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
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
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
