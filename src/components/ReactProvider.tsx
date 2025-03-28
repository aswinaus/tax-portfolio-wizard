
import * as React from 'react';

interface ReactProviderProps {
  children: React.ReactNode;
}

/**
 * ReactProvider ensures React context is properly established
 */
const ReactProvider: React.FC<ReactProviderProps> = ({ children }) => {
  // Make absolutely sure React is globally available
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (!window.React || !window.React.forwardRef)) {
      console.log('Updating global React in ReactProvider');
      window.React = React;
    }
  }, []);
  
  return <>{children}</>;
};

export default ReactProvider;
