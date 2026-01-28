import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BlogList from './pages/admin/BlogList';
import BlogForm from './pages/admin/BlogForm';
import Settings from './pages/admin/Settings';
import NetworkAdmin from './pages/admin/NetworkAdmin';

import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="blogs" element={<BlogList />} />
                  <Route path="blogs/new" element={<BlogForm />} />
                  <Route path="blogs/edit/:id" element={<BlogForm />} />
                  <Route path="network" element={<NetworkAdmin />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;