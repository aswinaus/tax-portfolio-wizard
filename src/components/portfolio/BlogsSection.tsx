
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Shield, Brain, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BlogsSection = () => {
  return (
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
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="overflow-hidden border-border/60 hover:shadow-sm transition-shadow">
          <CardHeader>
            <Badge variant="secondary" className="w-fit mb-2">Machine Learning</Badge>
            <CardTitle className="text-lg font-display">
              <Link to="/portfolio/blogs/6" className="hover:text-primary transition-colors">
                Understanding Reinforcement Learning through Markov Decision Processes
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Explore the foundational concepts of Reinforcement Learning, including Markov Decision Processes, policies, value functions, and how agents learn to maximize rewards through sequential decision making.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/portfolio/blogs/6">
              <Button variant="outline" className="mt-2">
                <Brain className="mr-2 h-4 w-4" />
                Read Blog Post
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden border-border/60 hover:shadow-sm transition-shadow">
          <CardHeader>
            <Badge variant="secondary" className="w-fit mb-2">Security</Badge>
            <CardTitle className="text-lg font-display">
              <Link to="/portfolio/blogs/5" className="hover:text-primary transition-colors">
                OWASP Top 10 for Large Language Models: Security Risks and Mitigation
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              A comprehensive guide to the OWASP Top 10 vulnerabilities for Large Language Models with examples and mitigation strategies.
              Learn how to protect your LLM applications from prompt injection, data poisoning, and other emerging threats.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/portfolio/blogs/5">
              <Button variant="outline" className="mt-2">
                <Shield className="mr-2 h-4 w-4" />
                Read Blog Post
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="bg-secondary/50 rounded-lg p-8 text-center">
          <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">More AI & ML Topics</h3>
          <p className="text-muted-foreground mb-4">
            Explore blog posts on LLM Quantization, OWASP Security, Reinforcement Learning, and LLM Evaluation techniques.
          </p>
          <Link to="/portfolio/blogs">
            <Button>
              <Cpu className="mr-2 h-4 w-4" />
              View More Blogs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
