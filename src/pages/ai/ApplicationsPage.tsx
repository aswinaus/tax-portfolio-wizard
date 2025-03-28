
import React from 'react'; // Add explicit React import
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Plus, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicationsList } from '@/components/ai/ApplicationsList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form } from "@/components/ui/form"; // Import Form component

const ApplicationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate checking if content is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
              Applications
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor all your application requests
            </p>
          </div>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
        
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Applications</AlertTitle>
            <AlertDescription>
              {error}. Please try refreshing the page or contact support if the issue persists.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm">
            <ApplicationsList />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ApplicationsPage;
