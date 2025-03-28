
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from '@/components/ai/ProductList';

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
              Product List
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor all your products
            </p>
          </div>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm">
          <ProductList />
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationsPage;
