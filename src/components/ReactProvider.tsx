
import * as React from 'react';

interface ReactProviderProps {
  children: React.ReactNode;
}

/**
 * ReactProvider ensures React context is properly established
 * This component runs early in the application lifecycle to guarantee
 * that React is globally available with all required methods
 */
const ReactProvider: React.FC<ReactProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = React.useState(false);
  
  // Ensure React and its critical methods are globally available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Checking React initialization in ReactProvider");
      
      try {
        // Create a complete copy of React on window regardless of existing state
        // @ts-ignore - This is a necessary workaround
        window.React = { ...React };
        
        // Directly assign critical methods
        // @ts-ignore - Deliberate assignment for compatibility
        window.React.forwardRef = React.forwardRef;
        // @ts-ignore
        window.React.createElement = React.createElement;
        // @ts-ignore
        window.React.Fragment = React.Fragment;
        // @ts-ignore
        window.React.createContext = React.createContext;
        // @ts-ignore
        window.React.useState = React.useState;
        // @ts-ignore
        window.React.useEffect = React.useEffect;
        // @ts-ignore
        window.React.useRef = React.useRef;
        // @ts-ignore
        window.React.memo = React.memo;
        // @ts-ignore
        window.React.Suspense = React.Suspense;
        // @ts-ignore
        window.React.lazy = React.lazy;
        
        // Verify critical methods
        if (!window.React.forwardRef) {
          console.error("Failed to set forwardRef in ReactProvider");
        } else {
          console.log("Successfully set forwardRef in ReactProvider");
        }
        
        console.log("React fully initialized in ReactProvider");
        setInitialized(true);
      } catch (err) {
        console.error("Error during React initialization:", err);
      }
    }
  }, []);
  
  // Only render children once React is initialized to prevent errors
  if (!initialized && typeof window !== 'undefined') {
    console.log("Waiting for React initialization before rendering children");
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Initializing React...</span>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ReactProvider;
