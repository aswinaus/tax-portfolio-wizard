import React from 'react'; // Add explicit React import
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import the components
import Biography from '@/components/portfolio/Biography';
import Skills from '@/components/portfolio/Skills';
import GitHubProjects from '@/components/portfolio/GitHubProjects';
import BlogsSection from '@/components/portfolio/BlogsSection';
import Achievements from '@/components/portfolio/Achievements';
import Certifications from '@/components/portfolio/Certifications';

const Portfolio = () => {
  const location = useLocation();
  const githubRef = useRef<HTMLDivElement>(null);
  const certificationsRef = useRef<HTMLDivElement>(null);
  
  // Determine active tab based on URL hash
  const activeTab = location.hash === '#achievements' ? 'achievements' : 'about';

  useEffect(() => {
    if (location.hash === '#github' && githubRef.current) {
      githubRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#certifications' && certificationsRef.current) {
      certificationsRef.current.scrollIntoView({ behavior: 'smooth' });
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4 mb-12"
      >
        <Badge className="mb-4" variant="outline">Portfolio</Badge>
        <h1 className="text-4xl font-display font-bold tracking-tight">Aswin Bhaskaran</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Principal Consultant at Hexaware Technologies. Building AI-Powered Tax Applications.
        </p>
      </motion.div>

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
          
          {/* Certifications Component */}
          <div ref={certificationsRef} id="certifications">
            <Certifications />
          </div>
          
          {/* GitHub Projects Component */}
          <div ref={githubRef} id="github">
            <GitHubProjects />
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
