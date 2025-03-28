
import { BlogPost } from '@/services/blogService';
import BlogCard from './BlogCard';
import { motion } from 'framer-motion';

interface BlogListProps {
  blogs: BlogPost[];
  formatDate: (dateString: string) => string;
}

const BlogList = ({ blogs, formatDate }: BlogListProps) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent -z-10 rounded-3xl blur-3xl" />
        <div className="grid grid-cols-1 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <BlogCard 
                blog={blog}
                index={index}
                formatDate={formatDate}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogList;
