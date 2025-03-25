
import { motion } from 'framer-motion';
import DocumentRepository from '@/components/business/document-repository/DocumentRepository';

const DocumentRepositoryPage = () => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
            Document Repository
          </h1>
          <p className="text-muted-foreground">
            Securely store, organize, and share documents with GitHub integration
          </p>
        </div>
        
        <DocumentRepository />
      </motion.div>
    </div>
  );
};

export default DocumentRepositoryPage;
