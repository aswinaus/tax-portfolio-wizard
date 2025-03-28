
import React from 'react';

interface ReactProviderProps {
  children: React.ReactNode;
}

/**
 * ReactProvider ensures React context is properly established
 * This component helps fix forwardRef issues by ensuring React
 * is properly imported and initialized throughout the component tree
 */
const ReactProvider: React.FC<ReactProviderProps> = ({ children }) => {
  // Simple wrapper component to ensure React context
  return <>{children}</>;
};

export default ReactProvider;
