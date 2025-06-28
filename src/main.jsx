import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SchoolProvider } from './pages/school_Admin/context/SchoolContext.jsx'; // ✅ Add this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SchoolProvider>
      <App />
    </SchoolProvider>
  </StrictMode>
);
