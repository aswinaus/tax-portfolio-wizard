
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { lazy, Suspense } from "react";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import NotFound from "./pages/NotFound";

// Lazy loaded pages for better performance
const Portfolio = lazy(() => import("./pages/portfolio/Portfolio"));
const Blogs = lazy(() => import("./pages/portfolio/Blogs"));
const BlogPost = lazy(() => import("./pages/portfolio/BlogPost"));
const CreateBlog = lazy(() => import("./pages/portfolio/CreateBlog"));
const Form990 = lazy(() => import("./pages/business/Form990"));
const TransferPricing = lazy(() => import("./pages/business/TransferPricing"));
const DocumentRepositoryPage = lazy(() => import("./pages/documents/DocumentRepositoryPage"));

// New AI Pages
const AgentServicePage = lazy(() => import("./pages/ai/AgentServicePage"));
const ToolsServicePage = lazy(() => import("./pages/ai/ToolsServicePage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<DocumentRepositoryPage />} />
                
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
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
