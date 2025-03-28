
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is available globally
window.React = React;

console.log("=== Initializing Application ===");
console.log("React version:", React.version);
console.log("React.forwardRef exists:", !!React.forwardRef);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  event.preventDefault();
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  event.preventDefault();
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
    // Provide a fallback UI in case of render errors
    root.render(
      <div className="api-error-fallback">
        <h1>Something went wrong</h1>
        <p>We're sorry, but there was an error loading the application.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
        <div>
          <p>Error details (for debugging):</p>
          <pre>{error instanceof Error ? error.message : String(error)}</pre>
        </div>
      </div>
    );
  }
}
