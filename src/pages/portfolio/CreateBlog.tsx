
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, X, Image as ImageIcon, Tag as TagIcon, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      toast.error('Please enter a title for your blog post');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter content for your blog post');
      return;
    }
    
    // In a real app, this would make an API call to save the blog
    // For now, we'll just simulate success and redirect
    
    toast.success('Blog post created successfully!');
    navigate('/portfolio/blogs');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <Link to="/portfolio/blogs" className="text-muted-foreground hover:text-foreground flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Blogs
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground mt-1">
          Share your thoughts, insights, and expertise
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter a descriptive title for your blog post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">
            Excerpt <span className="text-muted-foreground text-xs">(Brief summary)</span>
          </Label>
          <Textarea
            id="excerpt"
            placeholder="Write a short summary of your blog post (appears in blog listings)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full resize-none"
          />
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            You can use HTML tags to format your content. For example, &lt;h2&gt; for headings, &lt;p&gt; for paragraphs, &lt;ul&gt; and &lt;li&gt; for lists.
          </p>
        </div>
        
        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" /> 
            Featured Image URL
          </Label>
          <Input
            id="imageUrl"
            placeholder="Enter an image URL for the blog post (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full"
          />
          {imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div 
                className="w-full h-40 bg-cover bg-center rounded-md overflow-hidden"
                style={{ backgroundImage: `url(${imageUrl})` }}
              ></div>
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="space-y-2">
          <Label className="flex items-center">
            <TagIcon className="h-4 w-4 mr-2" /> 
            Tags
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add tags (press Enter to add)"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={addTag}
              disabled={!currentTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 pl-2">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-secondary-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-muted-foreground">
                No tags added yet. Tags help categorize your blog and make it more discoverable.
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/portfolio/blogs')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Publish Blog Post
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateBlog;
