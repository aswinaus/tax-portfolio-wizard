
import * as React from 'react' // Use namespace import for React
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ReactProvider from './components/ReactProvider.tsx'

// Add this to the window object to help with API calls
declare global {
  interface Window {
    isNetlifyDeployment: boolean;
    isAzureDeployment: boolean;
    React?: any; // Allow for global React definition
    ReactDOM?: any; // Allow for global ReactDOM definition
  }
}

// Set deployment flag for API calls
window.isNetlifyDeployment = window.location.hostname.includes("papaya-kleicha-7542d0.netlify.app");
window.isAzureDeployment = window.location.hostname.includes("aswin.ai") || 
                          window.location.hostname.includes("taxaiagents.azurewebsites.net");

// Explicitly make React globally available before anything else
window.React = window.React || React;

console.log("=== Initializing Application ===");
console.log("React version:", React.version);
console.log("React.forwardRef exists:", !!React.forwardRef);
console.log("window.React exists:", !!window.React);
console.log("window.React.forwardRef exists:", !!(window.React && window.React.forwardRef));

// Add global error handler to prevent blank screens
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Log additional details about React
  console.log("During error: React.forwardRef exists:", !!React.forwardRef);
  console.log("During error: window.React.forwardRef exists:", !!(window.React && window.React.forwardRef));
  // Don't let JavaScript errors cause a blank screen
  event.preventDefault();
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Don't let Promise rejections cause a blank screen
  event.preventDefault();
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  try {
    console.log("About to render the application");
    root.render(
      <ReactProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ReactProvider>
    );
    console.log("Application successfully rendered");
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
