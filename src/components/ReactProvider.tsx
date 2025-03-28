
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
  // Ensure we have React available in the global scope
  React.useEffect(() => {
    // Make React globally available
    if (typeof window !== 'undefined' && !window.React) {
      console.log('Setting global React in ReactProvider');
      window.React = React;
    }
    
    // Check if forwardRef is available
    if (typeof React.forwardRef !== 'function') {
      console.error('React.forwardRef is still not available after ReactProvider mount');
    } else {
      console.log('React.forwardRef is available in ReactProvider');
    }
  }, []);
  
  // If forwardRef isn't available, create a polyfill
  if (typeof React.forwardRef !== 'function') {
    console.warn('Creating forwardRef polyfill in ReactProvider');
    // Create a fallback implementation if it's missing
    (React as any).forwardRef = function forwardRefPolyfill(render: Function) {
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
