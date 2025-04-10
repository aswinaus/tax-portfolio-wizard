
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

interface LyzrResponse {
  response: string;
  conversation_id?: string;
  session_id?: string;
}

const LyzrDocumentAgentChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('67e2c4b7616a743aa6c8cb62');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callLyzrAPI = async (userMessage: string): Promise<LyzrResponse> => {
    try {
      const apiUrl = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
      const apiKey = 'sk-default-cou8kaWkBA01M8SIiVepiEYaiKE4DZMp';
      
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      };
      
      const payload = {
        user_id: "aswinaus@gmail.com",
        agent_id: "67e2c4b7616a743aa6c8cb62",
        session_id: sessionId,
        message: userMessage
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling Lyzr API:', error);
      throw error;
    }
  };

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
      // Call the Lyzr API with the user's message
      const lyzrResponse = await callLyzrAPI(userMessage.content);
      
      // Save session ID for continued conversation
      if (lyzrResponse.session_id) {
        setSessionId(lyzrResponse.session_id);
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
    <Card className="h-[350px] flex flex-col">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Document Archiving Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pb-0">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Ask me about document archiving best practices, retention policies, or compliance requirements.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={`${msg.role}-${index}`}
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
                <span className="text-sm">Processing...</span>
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
            placeholder="Ask about document archiving..."
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

export default LyzrDocumentAgentChat;
