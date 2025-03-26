
import { Info, Bot } from 'lucide-react';
import TaxAgentChat from '@/components/business/TaxAgentChat';
import { Card } from '@/components/ui/card';

const ChatAssistant = () => {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-base mb-1">Form 990 Filing Assistant</h3>
            <p className="text-muted-foreground text-sm">
              Our AI assistant connects to a specialized knowledge base to answer your questions about Form 990 
              filing requirements, deadlines, extensions, and more. Just ask a question to get started.
            </p>
          </div>
        </div>
      </div>
      
      <TaxAgentChat useDirectConnection={true} />
      
      <Card className="p-4 bg-muted/50 border-dashed">
        <div className="flex items-start gap-3">
          <Bot className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">About this assistant</p>
            <p>
              This assistant attempts to connect to the Lyzr API in real-time mode to provide accurate answers.
              If the connection fails after multiple retries, it will temporarily operate in demo mode with limited responses.
              You can retry the connection using the retry button that appears when there are connection issues.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatAssistant;
