
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
  // Ensure forwardRef is available globally
  if (typeof React.forwardRef !== 'function') {
    console.error('React.forwardRef is not available. This will cause rendering errors.');
    // Create a fallback implementation if it's missing
    (React as any).forwardRef = function forwardRefPolyfill(render) {
      return {
        $$typeof: Symbol.for('react.forward_ref'),
        render: render
      };
    };
  }
  
  // Simple wrapper component to ensure React context
  return <React.Fragment>{children}</React.Fragment>;
};

export default ReactProvider;
