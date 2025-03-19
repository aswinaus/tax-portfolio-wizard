
import { BlogPost } from '@/services/blogService';
import BlogCard from './BlogCard';

interface BlogListProps {
  blogs: BlogPost[];
  formatDate: (dateString: string) => string;
}

const BlogList = ({ blogs, formatDate }: BlogListProps) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {blogs.map((blog, index) => (
        <BlogCard 
          key={blog.id || index}
          blog={blog}
          index={index}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default BlogList;
