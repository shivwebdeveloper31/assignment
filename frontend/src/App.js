import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

import DashboardPage  from './pages/DashboardPage';
import AnalyticsPage  from './pages/AnalyticsPage';
import ProductsPage   from './pages/ProductsPage';
import UploadPage     from './pages/UploadPage';

const Loader = () => (
  <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ErrorBoundary>
            <Layout>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/"          element={<DashboardPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/products"  element={<ProductsPage />} />
                  <Route path="/upload"    element={<UploadPage />} />
                  <Route path="*"          element={<DashboardPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
