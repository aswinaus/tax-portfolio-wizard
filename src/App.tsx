
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  
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
