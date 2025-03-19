
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import the newly created components
import Biography from '@/components/portfolio/Biography';
import Skills from '@/components/portfolio/Skills';
import GitHubProjects from '@/components/portfolio/GitHubProjects';
import BlogsSection from '@/components/portfolio/BlogsSection';
import Achievements from '@/components/portfolio/Achievements';

const Portfolio = () => {
  const location = useLocation();
  const githubRef = useRef<HTMLDivElement>(null);
  
  // Determine active tab based on URL hash
  const activeTab = location.hash === '#achievements' ? 'achievements' : 'about';

  useEffect(() => {
    if (location.hash === '#github' && githubRef.current) {
      githubRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

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
          <h1 className="text-4xl font-display font-bold tracking-tight">Aswin Bhaskaran</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Senior Tax Director with expertise in international tax planning and financial services
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
          {/* Biography Component */}
          <Biography />
          
          {/* Skills Component */}
          <Skills />
          
          {/* GitHub Projects Component */}
          <div ref={githubRef}>
            <GitHubProjects id="github" />
          </div>
          
          {/* Blogs Section Component */}
          <BlogsSection />
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-8">
          <Achievements />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Portfolio;
