import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import FileUploadPage from './pages/FileUploadPage';
import PersonsPage from './pages/PersonsPage';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/upload" replace />} />
              <Route
                path="/upload"
                element={
                  <PrivateRoute>
                    <FileUploadPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/persons"
                element={
                  <PrivateRoute>
                    <PersonsPage />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;