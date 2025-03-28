
import * as React from 'react'; // Use namespace import for React
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { lazy, Suspense } from "react";
import './App.css';

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/portfolio/Portfolio";
import Index from "./pages/Index";

// Lazy loaded pages for better performance
const Blogs = lazy(() => import("./pages/portfolio/Blogs"));
const BlogPost = lazy(() => import("./pages/portfolio/BlogPost"));
const CreateBlog = lazy(() => import("./pages/portfolio/CreateBlog"));
const Form990 = lazy(() => import("./pages/business/Form990"));
const TransferPricing = lazy(() => import("./pages/business/TransferPricing"));
const DocumentRepositoryPage = lazy(() => import("./pages/documents/DocumentRepositoryPage"));

// AI Pages
const AgentServicePage = lazy(() => import("./pages/ai/AgentServicePage"));
const ToolsServicePage = lazy(() => import("./pages/ai/ToolsServicePage"));
const ApplicationsPage = lazy(() => import("./pages/ai/ApplicationsPage"));

// Templates
const TaxAgentNeo4jGraphDB = lazy(() => import("./templates/TaxAgentNeo4jGraphDB"));

// Create a new QueryClient instance with more conservative settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Disable retries to avoid cascading errors
      refetchOnWindowFocus: false, // Disable refetch on window focus
      staleTime: 60000, // 1 minute stale time
    },
  },
});

// Verify React.forwardRef is available before rendering
if (!React.forwardRef) {
  console.error("React.forwardRef is not available when App.tsx is evaluated");
}

const App = () => {
  console.log("App component rendering");
  console.log("React.forwardRef available in App:", !!React.forwardRef);
  
  // Extra safety check to ensure React.forwardRef is available
  React.useEffect(() => {
    console.log("React in App useEffect:", React);
    console.log("React.forwardRef in App useEffect:", React.forwardRef);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/">
              <Suspense fallback={
                <div className="w-full h-screen flex items-center justify-center bg-white text-black">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    {/* Redirect base path to portfolio */}
                    <Route index element={<Portfolio />} />
                    
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
  );
};

export default App;
