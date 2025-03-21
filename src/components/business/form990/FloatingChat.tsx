
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LyzrAgentChat from '@/components/business/LyzrAgentChat';

const FloatingChat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  
  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={() => setChatOpen(!chatOpen)}
            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
      
      {/* AI Assistant Chat Panel */}
      {chatOpen && (
        <motion.div 
          className="fixed bottom-24 right-6 w-[400px] z-10 shadow-xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <LyzrAgentChat />
        </motion.div>
      )}
    </>
  );
};

export default FloatingChat;
