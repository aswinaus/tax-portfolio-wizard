
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Award, Github, ExternalLink, ArrowRight, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchGitHubRepos, GitHubRepo } from '@/services/githubService';
import { toast } from 'sonner';

// Skills data
const skills = [
  { name: 'Web Development', category: 'technical' },
  { name: 'Data Analysis', category: 'technical' },
  { name: 'React', category: 'technical' },
  { name: 'Python', category: 'technical' },
  { name: 'TypeScript', category: 'technical' },
  { name: 'Project Management', category: 'soft' },
  { name: 'Leadership', category: 'soft' },
  { name: 'Strategic Planning', category: 'soft' },
  { name: 'Problem Solving', category: 'soft' }
];

// Achievements data
const achievements = [
  {
    id: 1,
    title: 'Excellence in Innovation Award',
    organization: 'Tech Innovators Association',
    year: 2023,
    description: 'Recognized for outstanding contributions to technological innovation in the field of data science.'
  },
  {
    id: 2,
    title: 'Leadership Recognition',
    organization: 'Business Leaders Forum',
    year: 2022,
    description: 'Awarded for exemplary leadership in digital transformation initiatives.'
  },
  {
    id: 3,
    title: 'Project Management Professional (PMP)',
    organization: 'Project Management Institute',
    year: 2021,
    description: 'Obtained professional certification for project management excellence.'
  }
];

const Portfolio = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const githubRef = useRef<HTMLDivElement>(null);
  
  // Determine active tab based on URL hash
  const activeTab = location.hash === '#achievements' ? 'achievements' : 'about';

  useEffect(() => {
    if (location.hash === '#github' && githubRef.current) {
      githubRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      {/* Header Section */}
      <section className="space-y-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Badge className="mb-4" variant="outline">Portfolio</Badge>
          <h1 className="text-4xl font-display font-bold tracking-tight">Aswin Auswin</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Technology professional with expertise in software development and business solutions
          </p>
        </motion.div>
      </section>

      {/* Main Content Tabs */}
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="mb-8 w-full md:w-auto">
          <TabsTrigger value="about" className="text-sm">About Me</TabsTrigger>
          <TabsTrigger value="achievements" className="text-sm">Achievements</TabsTrigger>
        </TabsList>
        
        {/* About Tab */}
        <TabsContent value="about" className="space-y-10">
          {/* Bio Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold">Biography</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                I am a passionate technologist with a strong background in software development and 
                business solutions. With years of experience in the industry, I have developed a diverse 
                skill set that allows me to bridge the gap between technical implementation and business strategy.
              </p>
              <p>
                My expertise spans across web development, data analysis, and project management, 
                with a particular focus on creating efficient and scalable solutions for complex business problems.
              </p>
            </div>
          </section>
          
          {/* Skills Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Badge 
                    variant={skill.category === 'technical' ? 'default' : 'secondary'}
                    className="py-1"
                  >
                    {skill.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* GitHub Projects */}
          <section className="space-y-6" id="github" ref={githubRef}>
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
          
          {/* Blogs Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-semibold">Latest Blogs</h2>
              <Link 
                to="/portfolio/blogs"
                className="flex items-center text-sm text-primary hover:underline"
              >
                View All Blogs <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Share Your Thoughts</h3>
              <p className="text-muted-foreground mb-4">
                View blogs or showcase your expertise and share knowledge.
              </p>
              <Link to="/portfolio/blogs">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  View Blogs
                </Button>
              </Link>
            </div>
          </section>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-8">
          <section>
            <h2 className="text-2xl font-display font-semibold mb-6">Awards & Recognitions</h2>
            
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-border/60">
                    <CardHeader className="pb-3 flex flex-row items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{achievement.title}</CardTitle>
                        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                          <span>{achievement.organization}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{achievement.year}</span>
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{achievement.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Portfolio;
