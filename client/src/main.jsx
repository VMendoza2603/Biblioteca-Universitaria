import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/variables.css';
import './styles/reset.css';
import './styles/globals.css';
import './styles/layout.css';
import './styles/buttons.css';
import './styles/forms.css';
import './styles/cards.css';
import './styles/dashboard.css';
import './styles/dark-mode.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
