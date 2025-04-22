
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove o loader inicial quando a aplicação estiver carregada
const removeInitialLoader = () => {
  const initialLoader = document.querySelector('.initial-loader');
  if (initialLoader) {
    initialLoader.classList.add('fade-out');
    setTimeout(() => {
      initialLoader.remove();
    }, 300);
  }
};

// Inicia a renderização somente quando o DOM estiver pronto
const renderApp = () => {
  const root = document.getElementById("root");
  if (!root) return;
  createRoot(root).render(<App />);
  
  // Remove o loader após renderização
  removeInitialLoader();
};

// Use requestIdleCallback para renderizar durante tempo ocioso
if ('requestIdleCallback' in window) {
  requestIdleCallback(renderApp);
} else {
  // Fallback para navegadores que não suportam requestIdleCallback
  setTimeout(renderApp, 0);
}
