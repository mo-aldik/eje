import FullPageSpinner from 'pages/full-page-spinner';
import { Providers } from 'providers';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<FullPageSpinner />}>
      <Providers>
        <App />
      </Providers>
    </Suspense>
  </StrictMode>,
);
