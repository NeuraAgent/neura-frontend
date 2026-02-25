import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from '@/components/AppRoutes';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import '@/styles/index.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LocaleProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LocaleProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
