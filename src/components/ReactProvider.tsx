
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
        // Replace the entire React object to ensure all methods are available
        window.React = React;
      }
    }
  }, []);
  
  return <>{children}</>;
};

export default ReactProvider;
