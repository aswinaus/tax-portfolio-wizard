import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitFork, Search, Star, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<string>('recent');
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
          throw new Error('No repositories found or GitHub API rate limit exceeded');
        }
        
        setRepos(fetchedRepos);
        setFilteredRepos(fetchedRepos);
        setError(null);
        console.log('Fetched repos successfully:', fetchedRepos.length);
      } catch (err) {
        console.error('Error in GitHub component:', err);
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(loadGitHubRepos, 2000 * (retryCount + 1));
        } else {
          setError('Unable to access GitHub repositories. This could be due to network issues, API rate limits, or the repository not being publicly accessible.');
          toast.error('Failed to load GitHub repositories');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadGitHubRepos();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    toast.info('Retrying GitHub repository fetch...');
  };

  useEffect(() => {
    let result = [...repos];
    
    if (selectedLanguage !== 'all') {
      result = result.filter(repo => repo.language === selectedLanguage);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(repo => 
        repo.name.toLowerCase().includes(query) || 
        (repo.description && repo.description.toLowerCase().includes(query))
      );
    }
    
    switch (sortBy) {
      case 'stars':
        result.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case 'forks':
        result.sort((a, b) => b.forks_count - a.forks_count);
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
    }
    
    setFilteredRepos(result);
  }, [repos, selectedLanguage, searchQuery, sortBy]);

  const languages = ['all', ...Array.from(new Set(repos.map(repo => repo.language).filter(Boolean)))];

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
                <Search className="h-4 w-4" /> Retry Connection
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

  const FolderIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber-400"
    >
      <path
        d="M3 8.2V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V8M3 8.2V7C3 4.79086 4.79086 3 7 3H9.5C10.0523 3 10.5 3.44772 10.5 4V5C10.5 5.55228 10.9477 6 11.5 6H17C19.2091 6 21 7.79086 21 10V8M3 8.2C3 7.53726 3.53726 7 4.2 7H19.8C20.4627 7 21 7.53726 21 8.2"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );

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
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search repositories..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  >
                    {languages.map(lang => (
                      <option key={lang || 'null'} value={lang || 'null'}>
                        {lang === 'all' ? 'All Languages' : lang || 'Unspecified'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex bg-muted rounded-md p-0.5">
                  <Button 
                    variant={sortBy === 'recent' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setSortBy('recent')}
                    className="rounded-r-none"
                  >
                    Recent
                  </Button>
                  <Button 
                    variant={sortBy === 'stars' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setSortBy('stars')}
                    className="rounded-none"
                  >
                    Stars
                  </Button>
                  <Button 
                    variant={sortBy === 'forks' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setSortBy('forks')}
                    className="rounded-l-none"
                  >
                    Forks
                  </Button>
                </div>
              </div>
            </div>
            
            {filteredRepos.length === 0 ? (
              <div className="text-center py-8 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">No repositories match your filter criteria</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLanguage('all');
                    setSortBy('recent');
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
                    <div className="h-full border border-border/60 rounded-md p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <FolderIcon />
                        <h3 className="font-medium truncate">{repo.name}</h3>
                        
                        <span className="ml-auto px-3 py-0.5 text-xs bg-muted rounded-full">
                          {repo.language || "Unspecified"}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                        {repo.description || "No description available"}
                      </p>
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-auto">
                        <div className="flex space-x-4">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" /> {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-4 w-4" /> {repo.forks_count}
                          </span>
                        </div>
                        
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          View <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
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
