
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export interface BlogSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  topicFilters?: Array<{ label: string; value: string }>;
}

const BlogSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  activeTab, 
  setActiveTab,
  topicFilters
}: BlogSearchProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search blog posts..." 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All Posts</TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
          <TabsTrigger value="popular" className="flex-1">Popular</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {topicFilters && topicFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topicFilters.map((topic) => (
            <Badge
              key={topic.value}
              variant={selectedTopics.includes(topic.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTopicToggle(topic.value)}
            >
              {topic.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogSearch;
