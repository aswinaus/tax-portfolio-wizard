
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a complete copy of React on the window object before anything else happens
if (typeof window !== 'undefined') {
  console.log("Setting global React in main.tsx with forwardRef:", !!React.forwardRef);
  
  // Create a fully initialized React object on window
  // @ts-ignore - This is a necessary workaround for React initialization
  window.React = Object.assign({}, React);
  
  // Explicitly ensure forwardRef is available
  if (!window.React.forwardRef) {
    console.log("forwardRef not found on window.React, manually setting it");
    // @ts-ignore - Deliberate assignment for compatibility
    window.React.forwardRef = React.forwardRef;
  }
  
  // Add other critical React functions
  // @ts-ignore
  window.React.createElement = React.createElement;
  // @ts-ignore
  window.React.Fragment = React.Fragment;
  // @ts-ignore
  window.React.createContext = React.createContext;
  // @ts-ignore
  window.React.useState = React.useState;
  // @ts-ignore
  window.React.useEffect = React.useEffect;
  // @ts-ignore
  window.React.useRef = React.useRef;
  // @ts-ignore
  window.React.memo = React.memo;
  
  console.log("React fully initialized in main.tsx, forwardRef is", !!window.React.forwardRef);
}

console.log("=== Initializing Application ===");
console.log("React version:", React.version);
console.log("React.forwardRef exists:", !!React.forwardRef);
console.log("window.React.forwardRef exists:", typeof window !== 'undefined' ? !!window.React.forwardRef : 'N/A');

// Add error handlers
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  try {
    console.log("Rendering application...");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Error rendering application:", error);
    // Provide a fallback UI for render errors
    root.render(
      <div className="api-error-fallback">
        <h1>Something went wrong</h1>
        <p>We're sorry, but there was an error loading the application.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </div>
    );
  }
}
