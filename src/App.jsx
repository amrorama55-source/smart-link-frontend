// src/App.jsx - Code-split, fast first load
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Lazy-loaded pages — smaller initial bundle, faster on mobile
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Links = lazy(() => import('./pages/EnhancedLinks'));
const Analytics = lazy(() => import('./pages/Analytics'));
const BioEditor = lazy(() => import('./pages/BioEditor'));
const Settings = lazy(() => import('./pages/Settings'));
const BioPage = lazy(() => import('./pages/BioPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Profile = lazy(() => import('./pages/Profile'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const FAQ = lazy(() => import('./pages/FAQ'));

// ==========================================
// Loading Component
// ==========================================
function LoadingScreen() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// ==========================================
// Route Guards
// ==========================================
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" /> : children;
}

function LandingRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return children;
}

// ==========================================
// App Routes (wrapped in Suspense for lazy chunks)
// ==========================================
function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingRoute><Landing /></LandingRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/links" element={<PrivateRoute><Links /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/bio" element={<PrivateRoute><BioEditor /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Public Bio & Legal Pages */}
        <Route path="/@:username" element={<BioPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/faq" element={<FAQ />} />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

// ==========================================
// Main App Component
// ==========================================
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="antialiased">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}