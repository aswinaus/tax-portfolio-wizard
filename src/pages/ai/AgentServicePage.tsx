
import { motion } from 'framer-motion';

const AgentServicePage = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              Our AI Agent service is currently under development. Check back soon for updates.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentServicePage;
