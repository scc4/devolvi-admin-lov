
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Remove the initial loader when the application is loaded
const removeInitialLoader = () => {
  const initialLoader = document.querySelector('.initial-loader');
  if (initialLoader) {
    initialLoader.classList.add('fade-out');
    setTimeout(() => {
      initialLoader.remove();
    }, 300);
  }
};

// Start rendering only when DOM is ready
const renderApp = () => {
  const root = document.getElementById("root");
  if (!root) return;
  createRoot(root).render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
  
  // Remove loader after rendering
  removeInitialLoader();
};

// Use requestIdleCallback to render during idle time
if ('requestIdleCallback' in window) {
  requestIdleCallback(renderApp);
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(renderApp, 0);
}
