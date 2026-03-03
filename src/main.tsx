import React from 'react';
import ReactDOM from 'react-dom/client';

import { setupAuth } from '@/utils/auth/setupAuth';

import '@/utils/env';
import App from './App';

setupAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
