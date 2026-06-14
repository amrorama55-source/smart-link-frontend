// src/App.jsx - Code-split, fast first load
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastProvider';
import { useEffect } from 'react';

function RenderTrigger() {
  useEffect(() => {
    // Fire event after a tiny delay to ensure DOM is fully painted
    const timer = setTimeout(() => document.dispatchEvent(new Event('render-event')), 100);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

// Helper to automatically reload the page if a chunk fails to load (e.g. after a new deployment)
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Error loading chunk:', error);
      // If we get a chunk load error (network error or 404 because of new deployment), reload the page to get the new index.html
      if (
        error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('Importing a module script failed') ||
        error.name === 'TypeError'
      ) {
        // Prevent infinite reload loops by checking sessionStorage
        if (!sessionStorage.getItem('chunk-retry')) {
          sessionStorage.setItem('chunk-retry', 'true');
          window.location.reload();
        }
      }
      throw error;
    }
  });

// Lazy-loaded pages — smaller initial bundle, faster on mobile
const Login = lazyWithRetry(() => import('./pages/Login'));
const Register = lazyWithRetry(() => import('./pages/Register'));
const ForgotPassword = lazyWithRetry(() => import('./pages/ForgotPassword'));
const ResetPassword = lazyWithRetry(() => import('./pages/ResetPassword'));
const VerifyEmail = lazyWithRetry(() => import('./pages/VerifyEmail'));
const Landing = lazyWithRetry(() => import('./pages/Landing'));
const LandingAR = lazyWithRetry(() => import('./pages/LandingAR'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Links = lazyWithRetry(() => import('./pages/EnhancedLinks'));
const Analytics = lazyWithRetry(() => import('./pages/Analytics'));
const BioEditor = lazyWithRetry(() => import('./pages/BioEditor'));
const Settings = lazyWithRetry(() => import('./pages/Settings'));
const BioPage = lazyWithRetry(() => import('./pages/BioPage'));
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazyWithRetry(() => import('./pages/TermsOfService'));
const Profile = lazyWithRetry(() => import('./pages/Profile'));
const AuthCallback = lazyWithRetry(() => import('./pages/AuthCallback'));
const FAQ = lazyWithRetry(() => import('./pages/FAQ'));
const Success = lazyWithRetry(() => import('./pages/Success'));
const Pricing = lazyWithRetry(() => import('./pages/Pricing'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost'));
const NicheLanding = lazyWithRetry(() => import('./pages/NicheLanding'));

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
  return user ? <>{children}<RenderTrigger /></> : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" /> : <>{children}<RenderTrigger /></>;
}

function LandingRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return <>{children}<RenderTrigger /></>;
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
        <Route path="/ar" element={<LandingRoute><LandingAR /></LandingRoute>} />
        <Route path="/for-creators" element={<LandingRoute><NicheLanding nicheKey="creators" /></LandingRoute>} />
        <Route path="/for-marketers" element={<LandingRoute><NicheLanding nicheKey="marketers" /></LandingRoute>} />
        <Route path="/for-ecommerce" element={<LandingRoute><NicheLanding nicheKey="ecommerce" /></LandingRoute>} />
        <Route path="/for-affiliates" element={<LandingRoute><NicheLanding nicheKey="affiliates" /></LandingRoute>} />
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

        {/* Public Bio & Legal Pages (No auth guard, but need RenderTrigger) */}
        <Route path="/@:username" element={<><BioPage /><RenderTrigger /></>} />
        <Route path="/u/:username" element={<><BioPage /><RenderTrigger /></>} />
        <Route path="/privacy" element={<><PrivacyPolicy /><RenderTrigger /></>} />
        <Route path="/terms" element={<><TermsOfService /><RenderTrigger /></>} />
        <Route path="/faq" element={<><FAQ /><RenderTrigger /></>} />
        <Route path="/blog" element={<><Blog /><RenderTrigger /></>} />
        <Route path="/blog/:id" element={<><BlogPost /><RenderTrigger /></>} />
        <Route path="/success" element={<><Success /><RenderTrigger /></>} />
        <Route path="/pricing" element={<PrivateRoute><Pricing /></PrivateRoute>} />

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
  console.log('App Component Rendering');
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