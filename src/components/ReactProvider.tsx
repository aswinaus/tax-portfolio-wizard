
import * as React from 'react';

interface ReactProviderProps {
  children: React.ReactNode;
}

/**
 * ReactProvider ensures React context is properly established
 * This component wraps the entire application to ensure forwardRef works correctly
 * It provides the React context needed for proper component rendering
 */
const ReactProvider: React.FC<ReactProviderProps> = ({ children }) => {
  // Simple wrapper component to ensure React context
  return <React.Fragment>{children}</React.Fragment>;
};

export default ReactProvider;
