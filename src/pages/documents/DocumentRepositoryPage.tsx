
import { motion } from 'framer-motion';
import DocumentRepository from '@/components/business/document-repository/DocumentRepository';

const DocumentRepositoryPage = () => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col w-full"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
            Document Repository
          </h1>
          <p className="text-muted-foreground">
            Securely store, organize, and share documents with GitHub integration
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              New Feature
            </span> <span className="ml-1">Enhanced document sorting and filtering now available</span>
          </div>
        </div>
        
        <DocumentRepository />
      </motion.div>
    </div>
  );
};

export default DocumentRepositoryPage;
