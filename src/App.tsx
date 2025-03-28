
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
      retry: 2, // Reduced retry for faster feedback
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
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

// Define proper interfaces for ErrorBoundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error boundary for Suspense fallbacks
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught error in error boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackPage />;
    }
    return this.props.children;
  }
}

const App = () => {
  console.log("App component rendering");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mark that the app has been initialized
    if (typeof window !== 'undefined') {
      window.__APP_INITIALIZED__ = true;
    }
    
    // Simulate checking environment readiness
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Reduced timing for faster loading
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (isLoading) {
    return <LoadingFallback />;
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
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<MainLayout />}>
                        {/* Make Blogs the default landing page */}
                        <Route index element={<Navigate to="/portfolio/blogs" replace />} />
                        
                        {/* Portfolio Routes */}
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route path="portfolio/blogs" element={<Blogs />} />
                        <Route path="portfolio/blogs/:id" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <BlogPost />
                          </Suspense>
                        } />
                        <Route path="portfolio/blogs/create" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <CreateBlog />
                          </Suspense>
                        } />
                        
                        {/* Business Routes */}
                        <Route path="business/form990" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <Form990 />
                          </Suspense>
                        } />
                        <Route path="business/transfer-pricing" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <TransferPricing />
                          </Suspense>
                        } />
                        
                        <Route path="documents" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <DocumentRepositoryPage />
                          </Suspense>
                        } />
                        
                        {/* AI Routes */}
                        <Route path="ai/agent" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <AgentServicePage />
                          </Suspense>
                        } />
                        <Route path="ai/tools" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ToolsServicePage />
                          </Suspense>
                        } />
                        <Route path="ai/applications" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <ApplicationsPage />
                          </Suspense>
                        } />
                        
                        {/* Template Routes */}
                        <Route path="templates/tax-agent-neo4j" element={
                          <Suspense fallback={<LoadingFallback />}>
                            <TaxAgentNeo4jGraphDB />
                          </Suspense>
                        } />
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </BrowserRouter>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ReactProvider>
  );
};

export default App;
