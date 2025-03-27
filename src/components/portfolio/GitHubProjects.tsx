
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Search, Filter, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchGitHubRepos, GitHubRepo } from '@/services/githubService';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface GitHubProjectsProps {
  id?: string;
}

const GitHubProjects = ({ id }: GitHubProjectsProps) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const githubRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const MAX_RETRIES = 3;

  useEffect(() => {
    const loadGitHubRepos = async () => {
      try {
        console.log('Fetching GitHub repos, attempt:', retryCount + 1);
        setLoading(true);
        const fetchedRepos = await fetchGitHubRepos();
        
        if (fetchedRepos.length === 0 && retryCount < MAX_RETRIES) {
          // If no repos were fetched and we haven't exceeded max retries
          throw new Error('No repositories found or GitHub API rate limit exceeded');
        }
        
        setRepos(fetchedRepos);
        setFilteredRepos(fetchedRepos);
        setError(null);
        console.log('Fetched repos successfully:', fetchedRepos.length);
      } catch (err) {
        console.error('Error in GitHub component:', err);
        
        if (retryCount < MAX_RETRIES) {
          // Increment retry count and try again after a delay
          setRetryCount(prev => prev + 1);
          setTimeout(loadGitHubRepos, 2000 * (retryCount + 1)); // Exponential backoff
        } else {
          // After max retries, show error to user
          setError('Unable to access GitHub repositories. This could be due to network issues, API rate limits, or the repository not being publicly accessible.');
          toast.error('Failed to load GitHub repositories');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadGitHubRepos();
  }, [retryCount]);

  // Handle retry button click
  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    toast.info('Retrying GitHub repository fetch...');
  };

  useEffect(() => {
    // Filter and sort repos based on user selections
    let result = [...repos];
    
    // Apply language filter
    if (selectedLanguage !== 'all') {
      result = result.filter(repo => repo.language === selectedLanguage);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(repo => 
        repo.name.toLowerCase().includes(query) || 
        (repo.description && repo.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'stars':
        result.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case 'forks':
        result.sort((a, b) => b.forks_count - a.forks_count);
        break;
      case 'updated':
      default:
        result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
    }
    
    setFilteredRepos(result);
  }, [repos, selectedLanguage, searchQuery, sortBy]);

  // Get unique languages for filter
  const languages = ['all', ...Array.from(new Set(repos.map(repo => repo.language).filter(Boolean)))];

  // Let's add a fallback component for empty/error state
  if (error) {
    return (
      <section className="space-y-6 bg-background text-foreground" id={id} ref={githubRef}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-display font-semibold">GitHub Projects</h2>
          <a 
            href="https://github.com/aswinaus" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm text-primary hover:underline"
          >
            View GitHub Profile <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
        
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Repository Access Error</AlertTitle>
          <AlertDescription className="flex flex-col space-y-4">
            <p>{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button onClick={handleRetry} size="sm" variant="outline" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> Retry Connection
              </Button>
              <a 
                href="https://github.com/aswinaus" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="link" size="sm" className="flex items-center gap-2">
                  Visit GitHub Profile <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="space-y-6 bg-background text-foreground" id={id} ref={githubRef}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-display font-semibold">GitHub Projects</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 bg-background text-foreground" id={id} ref={githubRef}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-display font-semibold">GitHub Projects</h2>
        <a 
          href="https://github.com/aswinaus" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-sm text-primary hover:underline"
        >
          View GitHub Profile <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
      
      {repos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No repositories found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search repositories..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Collapsible 
                open={!isMobile || isFilterOpen}
                onOpenChange={isMobile ? setIsFilterOpen : undefined}
                className={isMobile ? "w-full" : "sm:flex sm:items-center sm:gap-3"}
              >
                {isMobile && (
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter & Sort
                      {isFilterOpen ? ' ▲' : ' ▼'}
                    </Button>
                  </CollapsibleTrigger>
                )}
                
                <CollapsibleContent className={`flex flex-col sm:flex-row gap-3 ${isMobile ? 'mt-3' : ''}`}>
                  <div className={isMobile ? "w-full" : "w-auto"}>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang || 'null'} value={lang || 'null'}>
                            {lang === 'all' ? 'All Languages' : lang || 'Unspecified'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className={isMobile ? "w-full mt-2" : "w-auto"}>
                    <ToggleGroup type="single" value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
                      <ToggleGroupItem value="updated" size="sm">Recent</ToggleGroupItem>
                      <ToggleGroupItem value="stars" size="sm">Stars</ToggleGroupItem>
                      <ToggleGroupItem value="forks" size="sm">Forks</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            {filteredRepos.length === 0 ? (
              <div className="text-center py-8 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">No repositories match your filter criteria</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLanguage('all');
                    setSortBy('updated');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRepos.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-border/60 hover:shadow-sm transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center truncate">
                            <Github className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{repo.name}</span>
                          </CardTitle>
                          {repo.language && (
                            <Badge variant="outline" className="ml-2 flex-shrink-0">
                              {repo.language}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <CardDescription className="line-clamp-2 h-10">
                          {repo.description || "No description available"}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex space-x-3">
                          <span title="Stars">⭐ {repo.stargazers_count}</span>
                          <span title="Forks">🔄 {repo.forks_count}</span>
                        </div>
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          View <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredRepos.length} of {repos.length} repositories
          </div>
        </>
      )}
    </section>
  );
};

export default GitHubProjects;
