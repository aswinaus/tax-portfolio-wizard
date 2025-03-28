
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
        // Create window.React if it doesn't exist
        if (!window.React) {
          console.log("Creating new window.React object in ReactProvider");
          window.React = {} as typeof React;
        }
        
        // Create a complete copy of React on window, with proper type casting
        window.React = Object.assign({}, React) as typeof React;
        
        // Double check that forwardRef is properly assigned
        if (typeof React.forwardRef === 'function' && window.React.forwardRef !== React.forwardRef) {
          console.log("Explicitly assigning forwardRef in ReactProvider");
          window.React.forwardRef = React.forwardRef;
        } else {
          console.log("React.forwardRef is not a function, creating fallback");
          // Use proper type assertion for the fallback implementation
          window.React.forwardRef = ((render: any) => {
            function ForwardRef(props: any, ref: any) {
              return render(props, ref);
            }
            ForwardRef.displayName = render.displayName || render.name || '';
            // Cast the entire result to any to avoid TS errors
            return ForwardRef as any;
          });
        }
        
        // Add other critical React functions 
        window.React.createElement = React.createElement;
        window.React.Fragment = React.Fragment;
        window.React.createContext = React.createContext;
        window.React.useState = React.useState;
        window.React.useEffect = React.useEffect;
        window.React.useRef = React.useRef;
        window.React.memo = React.memo;
        window.React.Suspense = React.Suspense;
        window.React.lazy = React.lazy;
        
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
