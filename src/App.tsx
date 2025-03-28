
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { lazy, Suspense, useState, useEffect } from "react";
import './App.css';
import ReactProvider from './components/ReactProvider';

// Layouts
import MainLayout from "./layouts/MainLayout";

// Directly imported pages (not lazy loaded)
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/portfolio/Portfolio";
import Blogs from "./pages/portfolio/Blogs";
import FallbackPage from "./pages/FallbackPage";

// Lazy loaded pages
const BlogPost = lazy(() => import("./pages/portfolio/BlogPost"));
const CreateBlog = lazy(() => import("./pages/portfolio/CreateBlog"));
const Form990 = lazy(() => import("./pages/business/Form990"));
const TransferPricing = lazy(() => import("./pages/business/TransferPricing"));
const DocumentRepositoryPage = lazy(() => import("./pages/documents/DocumentRepositoryPage"));
const AgentServicePage = lazy(() => import("./pages/ai/AgentServicePage"));
const ToolsServicePage = lazy(() => import("./pages/ai/ToolsServicePage"));
const ApplicationsPage = lazy(() => import("./pages/ai/ApplicationsPage"));
const TaxAgentNeo4jGraphDB = lazy(() => import("./templates/TaxAgentNeo4jGraphDB"));

// Create a new QueryClient instance with improved options for preview environment
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Increase retry for preview environment
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

// Simple loading component
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white text-black">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

const App = () => {
  console.log("App component rendering");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate checking environment readiness
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (isLoading) {
    return <FallbackPage />;
  }
  
  return (
    <ReactProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SidebarProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Toaster />
              <Sonner />
              <BrowserRouter basename="/">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<MainLayout />}>
                      {/* Make Blogs the default landing page */}
                      <Route index element={<Navigate to="/portfolio/blogs" replace />} />
                      
                      {/* Portfolio Routes */}
                      <Route path="portfolio" element={<Portfolio />} />
                      <Route path="portfolio/blogs" element={<Blogs />} />
                      <Route path="portfolio/blogs/:id" element={<BlogPost />} />
                      <Route path="portfolio/blogs/create" element={<CreateBlog />} />
                      
                      {/* Business Routes */}
                      <Route path="business/form990" element={<Form990 />} />
                      <Route path="business/transfer-pricing" element={<TransferPricing />} />
                      <Route path="documents" element={<DocumentRepositoryPage />} />
                      
                      {/* AI Routes */}
                      <Route path="ai/agent" element={<AgentServicePage />} />
                      <Route path="ai/tools" element={<ToolsServicePage />} />
                      <Route path="ai/applications" element={<ApplicationsPage />} />
                      
                      {/* Template Routes */}
                      <Route path="templates/tax-agent-neo4j" element={<TaxAgentNeo4jGraphDB />} />
                      
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ReactProvider>
  );
};

export default App;
