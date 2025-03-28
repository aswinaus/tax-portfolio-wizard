
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
  // Ensure React and its critical methods are globally available
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if React is missing or forwardRef is not available
      if (!window.React || !window.React.forwardRef) {
        console.log('Updating global React in ReactProvider - forwardRef was missing');
        // Make a copy of React to avoid direct assignment to read-only properties
        // @ts-ignore - This is a necessary workaround for React initialization
        window.React = Object.assign({}, React);
        
        // Explicitly add the forwardRef function to the global React object 
        // @ts-ignore - This is a necessary workaround
        if (!window.React.forwardRef) {
          console.log('Adding forwardRef to global React object');
          // @ts-ignore - This is a necessary workaround
          window.React.forwardRef = React.forwardRef;
        }
      }
    }
  }, []);
  
  return <>{children}</>;
};

export default ReactProvider;
