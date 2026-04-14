import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import CarDetailPage from './pages/public/CarDetailPage';
import InquiryPage from './pages/public/InquiryPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCarsPage from './pages/admin/ManageCarsPage';
import AddCarPage from './pages/admin/AddCarPage';
import EditCarPage from './pages/admin/EditCarPage';
import ManageInquiriesPage from './pages/admin/ManageInquiriesPage';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Public layout wrapper — includes Navbar + Footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/cars/:id" element={<PublicLayout><CarDetailPage /></PublicLayout>} />
      <Route path="/inquiry/:carId?" element={<PublicLayout><InquiryPage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="cars" element={<ManageCarsPage />} />
        <Route path="cars/add" element={<AddCarPage />} />
        <Route path="cars/edit/:id" element={<EditCarPage />} />
        <Route path="inquiries" element={<ManageInquiriesPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
