
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
      console.log("Initializing React in ReactProvider");
      
      try {
        // Always create a fresh React object to avoid reference issues
        window.React = React || {} as typeof React;
        
        // CRITICAL: Define forwardRef first since it's used by many components
        // Here's a more robust implementation to ensure it's always available
        if (typeof React.forwardRef === 'function') {
          window.React.forwardRef = React.forwardRef;
          console.log("Set window.React.forwardRef from React.forwardRef");
        } else {
          console.error("React.forwardRef not found! Creating fallback implementation");
          // Define a correctly typed fallback
          window.React.forwardRef = function(render) {
            function ForwardRef(props, ref) {
              return render(props, ref);
            }
            ForwardRef.displayName = render.displayName || render.name || '';
            // Essential: Add required Symbol property for type checking
            ForwardRef.$$typeof = Symbol.for('react.forward_ref');
            return ForwardRef;
          } as any;
        }
        
        // Check and confirm forwardRef is properly defined
        if (!window.React.forwardRef) {
          console.error("forwardRef still not defined after initialization attempt!");
          
          // Last attempt emergency polyfill
          window.React.forwardRef = function(render) {
            return function(props) {
              return render(props, null);
            };
          } as any;
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
        
        console.log("React fully initialized in ReactProvider, forwardRef exists:", !!window.React.forwardRef);
        
        // Mark initialization immediately
        window.__APP_INITIALIZED__ = true;
        setInitialized(true);
      } catch (err) {
        console.error("Error during React initialization:", err);
      }
    }
  }, []);
  
  // Show a loading indicator until React is initialized
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
