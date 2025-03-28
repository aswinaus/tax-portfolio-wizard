
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
      console.log("Checking React initialization in ReactProvider");
      
      // Check if React is missing or forwardRef is not available
      if (!window.React || !window.React.forwardRef) {
        console.log('Updating global React in ReactProvider - forwardRef was missing');
        
        // Set the complete React object on window
        // @ts-ignore - This is a necessary workaround
        window.React = React;
        
        // Verify forwardRef is now available
        if (!window.React.forwardRef) {
          console.error("Failed to set forwardRef in ReactProvider");
        } else {
          console.log("Successfully set forwardRef in ReactProvider");
        }
      }
    }
  }, []);
  
  return <>{children}</>;
};

export default ReactProvider;
