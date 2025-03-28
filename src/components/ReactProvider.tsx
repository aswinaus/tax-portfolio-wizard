
import * as React from 'react';

interface ReactProviderProps {
  children: React.ReactNode;
}

/**
 * ReactProvider ensures React context is properly established
 */
const ReactProvider: React.FC<ReactProviderProps> = ({ children }) => {
  // Ensure we have React available in the global scope
  React.useEffect(() => {
    // Make React globally available
    if (typeof window !== 'undefined') {
      console.log('Setting global React in ReactProvider');
      window.React = React;
    }
  }, []);
  
  return <React.Fragment>{children}</React.Fragment>;
};

export default ReactProvider;
