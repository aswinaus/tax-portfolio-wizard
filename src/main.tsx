
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add this to the window object to help with API calls
declare global {
  interface Window {
    isNetlifyDeployment: boolean;
    isAzureDeployment: boolean;
  }
}

// Set deployment flag for API calls
window.isNetlifyDeployment = window.location.hostname.includes("papaya-kleicha-7542d0.netlify.app");
window.isAzureDeployment = window.location.hostname.includes("aswin.ai") || 
                          window.location.hostname.includes("taxaiagents.azurewebsites.net");

// Add global error handler to prevent blank screens
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
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
    root.render(<App />);
    console.log("Application successfully rendered");
  } catch (error) {
    console.error("Error rendering application:", error);
    // Provide a fallback UI in case of render errors
    root.render(
      <div className="api-error-fallback">
        <h1>Something went wrong</h1>
        <p>We're sorry, but there was an error loading the application.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }
}
