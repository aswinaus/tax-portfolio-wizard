
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicationsList } from '@/components/ai/ApplicationsList';

const ApplicationsPage = () => {
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
        
        <div className="bg-white rounded-lg border shadow-sm">
          <ApplicationsList />
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationsPage;
