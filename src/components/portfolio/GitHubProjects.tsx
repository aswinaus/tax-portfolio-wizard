
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchGitHubRepos, GitHubRepo } from '@/services/githubService';
import { toast } from 'sonner';

interface GitHubProjectsProps {
  id?: string;
}

const GitHubProjects = ({ id }: GitHubProjectsProps) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const githubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGitHubRepos = async () => {
      try {
        setLoading(true);
        const fetchedRepos = await fetchGitHubRepos();
        setRepos(fetchedRepos);
        setError(null);
      } catch (err) {
        console.error('Error in GitHub component:', err);
        setError('Unable to load GitHub repositories');
        toast.error('Failed to load GitHub repositories');
      } finally {
        setLoading(false);
      }
    };
    
    loadGitHubRepos();
  }, []);

  return (
    <section className="space-y-6" id={id} ref={githubRef}>
      <div className="flex items-center justify-between">
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
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No repositories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/60 hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    {repo.name}
                  </CardTitle>
                  {repo.language && (
                    <Badge variant="outline" className="ml-auto">
                      {repo.language}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription className="line-clamp-2 h-10">
                    {repo.description || "No description available"}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex space-x-3">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🔄 {repo.forks_count}</span>
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
    </section>
  );
};

export default GitHubProjects;
