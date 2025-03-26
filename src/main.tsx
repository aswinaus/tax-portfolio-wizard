
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add this to the window object to help with API calls
window.isNetlifyDeployment = window.location.hostname.includes("papaya-kleicha-7542d0.netlify.app");

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  root.render(<App />);
}
