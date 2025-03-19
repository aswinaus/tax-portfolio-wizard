
import { Dispatch, SetStateAction } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogSearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const BlogSearch = ({ searchTerm, setSearchTerm, activeTab, setActiveTab }: BlogSearchProps) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search blog posts..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto overflow-auto">
          <TabsTrigger value="all" className="text-xs">All Posts</TabsTrigger>
          <TabsTrigger value="technology" className="text-xs">Technology</TabsTrigger>
          <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
          <TabsTrigger value="tax" className="text-xs">Tax</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BlogSearch;
