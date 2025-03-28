
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MainSidebar } from '@/components/sidebar/MainSidebar';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  // Check window size on initial load and on resize
  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Add a meta tag to hide the "Edit with Lovable" button
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'lovable:editor';
    meta.content = 'hidden';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col w-64 transition-transform duration-300 ease-in-out bg-sidebar border-r border-border",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "shadow-xl" : ""
        )}
      >
        <MainSidebar />
      </div>
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen && !isMobile ? "ml-64" : "ml-0"
        )}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 w-full h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </header>
        
        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6 md:p-8 max-w-full overflow-auto"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;
