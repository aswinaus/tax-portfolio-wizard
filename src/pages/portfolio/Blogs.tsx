
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogs, fetchTechnologyBlogs } from '@/services/blogService';
import { formatDate } from '@/utils/dateUtils';

// Components
import BlogHeader from '@/components/blogs/BlogHeader';
import BlogSearch from '@/components/blogs/BlogSearch';
import BlogLoadingSkeleton from '@/components/blogs/BlogLoadingSkeleton';
import BlogErrorState from '@/components/blogs/BlogErrorState';
import EmptyBlogState from '@/components/blogs/EmptyBlogState';
import TechBlogHighlight from '@/components/blogs/TechBlogHighlight';
import BlogList from '@/components/blogs/BlogList';

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch all blogs using React Query
  const { data: allBlogs = [], isLoading: isLoadingAll, isError: isErrorAll } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs
  });
  
  // Fetch technology blogs using React Query
  const { data: techBlogs = [], isLoading: isLoadingTech, isError: isErrorTech } = useQuery({
    queryKey: ['blogs', 'technology'],
    queryFn: fetchTechnologyBlogs
  });
  
  // Determine which blogs to display based on active tab
  const blogs = activeTab === 'technology' ? techBlogs : allBlogs;
  
  // Filter blogs based on search term and active tab
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'technology') return matchesSearch && blog.category === 'technology';
    return matchesSearch && blog.tags.some(tag => tag.toLowerCase().includes(activeTab.toLowerCase()));
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header Component */}
      <BlogHeader />
      
      {/* Search and Filters Component */}
      <BlogSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Loading State */}
      {(isLoadingAll || isLoadingTech) && <BlogLoadingSkeleton />}
      
      {/* Error State */}
      {(isErrorAll || isErrorTech) && <BlogErrorState />}
      
      {/* Technology Blogs Highlight Section (when viewing all blogs) */}
      {activeTab === 'all' && !isLoadingAll && !isErrorAll && (
        <TechBlogHighlight 
          techBlogs={techBlogs} 
          formatDate={formatDate} 
          setActiveTab={setActiveTab} 
        />
      )}
      
      {/* Blog List or Empty State */}
      {!isLoadingAll && !isErrorAll && filteredBlogs.length > 0 ? (
        <BlogList blogs={filteredBlogs} formatDate={formatDate} />
      ) : !isLoadingAll && !isErrorAll ? (
        <EmptyBlogState searchTerm={searchTerm} />
      ) : null}
    </div>
  );
};

export default Blogs;
