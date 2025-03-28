
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import FallbackPage from './pages/FallbackPage.tsx';

// CRITICAL: Initialize React global object immediately
// This must happen before any imports that might use React.forwardRef
if (typeof window !== 'undefined') {
  console.log("Setting up global React object in main.tsx");
  
  try {
    // Create new React object if it doesn't exist
    window.React = window.React || {} as typeof React;
    
    // Explicitly ensure forwardRef is available before anything else
    if (typeof React.forwardRef === 'function') {
      window.React.forwardRef = React.forwardRef;
      console.log("Assigned React.forwardRef directly to window.React.forwardRef");
    } else {
      console.error("React.forwardRef missing! Creating fallback implementation");
      window.React.forwardRef = function(render) {
        function ForwardRef(props, ref) {
          return render(props, ref);
        }
        ForwardRef.displayName = render.displayName || render.name || '';
        ForwardRef.$$typeof = Symbol.for('react.forward_ref');
        return ForwardRef;
      } as any;
    }
    
    // Add remaining critical React methods
    window.React.createElement = React.createElement;
    window.React.Fragment = React.Fragment;
    window.React.createContext = React.createContext;
    window.React.useState = React.useState;
    window.React.useEffect = React.useEffect;
    window.React.useRef = React.useRef;
    window.React.memo = React.memo;
    window.React.Suspense = React.Suspense;
    window.React.lazy = React.lazy;
    
    console.log("React initialized in main.tsx, forwardRef exists:", !!window.React.forwardRef);
  } catch (err) {
    console.error("Failed to initialize React in main.tsx:", err);
  }
}

console.log("=== Initializing Application ===");
console.log("React version:", React.version);
console.log("React.forwardRef exists:", !!React.forwardRef);
console.log("window.React.forwardRef exists:", typeof window !== 'undefined' ? !!window.React.forwardRef : 'N/A');

// Add error handlers
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Don't show error UI for network errors, which are common in preview environments
  if (!event.error?.message?.includes('Failed to fetch') && 
      !event.error?.message?.includes('Network error')) {
    renderFallbackUI("An unexpected error occurred: " + event.error?.message);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Don't show error UI for network errors, which are common in preview environments
  if (!event.reason?.message?.includes('Failed to fetch') && 
      !event.reason?.message?.includes('Network error')) {
    renderFallbackUI("An unexpected error occurred: " + event.reason?.message);
  }
});

function renderFallbackUI(errorMessage: string) {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    // Check if we already rendered something
    if (rootElement._reactRootContainer) {
      console.log("Root already has React content, not replacing with fallback");
      return;
    }
    
    try {
      const root = createRoot(rootElement);
      root.render(<FallbackPage />);
      console.log("Rendered fallback UI due to error:", errorMessage);
    } catch (error) {
      console.error("Failed to render fallback UI:", error);
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
          <h1 style="color: #e53e3e; margin-bottom: 16px;">Application Error</h1>
          <p style="margin-bottom: 16px;">${errorMessage || "Sorry, there was a problem loading the application."}</p>
          <button onclick="window.location.href='/portfolio/blogs'" style="background: #3182ce; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
            Go to Blogs
          </button>
          <button onclick="window.location.reload()" style="background: #718096; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  try {
    console.log("Rendering application...");
    const root = createRoot(rootElement);
    
    // For preview/staging environments, check if we should render the app or fallback
    const isPreviewEnv = window.location.hostname.includes('preview') || 
                         window.location.hostname.includes('staging') ||
                         window.location.hostname.includes('lovableproject');
    
    // In preview environments, add a timeout to fall back if app doesn't render quickly
    if (isPreviewEnv) {
      console.log("In preview environment, setting fallback timeout");
      window.setTimeout(() => {
        // If app hasn't loaded properly within this time, render fallback
        if (!window.__APP_INITIALIZED__) {
          console.log("App initialization timeout in preview env, rendering fallback");
          root.render(<FallbackPage />);
        }
      }, 5000); // 5 second timeout for more reliable loading
    }
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Mark that the app initialized successfully
    window.__APP_INITIALIZED__ = true;
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Error rendering application:", error);
    renderFallbackUI(error instanceof Error ? error.message : String(error));
  }
}
