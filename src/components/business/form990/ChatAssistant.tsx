
import { Info } from 'lucide-react';
import LyzrAgentChat from '@/components/business/LyzrAgentChat';

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
              Our AI assistant can answer your questions about Form 990 filing requirements, deadlines, 
              extensions, and more. Just ask a question to get started.
            </p>
          </div>
        </div>
      </div>
      
      <LyzrAgentChat />
    </div>
  );
};

export default ChatAssistant;
