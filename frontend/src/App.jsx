// src/App.jsx - Code-split, fast first load
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastProvider';
import { useEffect } from 'react';
import { API_URL } from './config';

function RenderTrigger() {
  useEffect(() => {
    // Fire event after a tiny delay to ensure DOM is fully painted
    const timer = setTimeout(() => document.dispatchEvent(new Event('render-event')), 100);
    
    // Silent background pre-warmup to wake up backend container on page load
    try {
      fetch(`${API_URL}/health`, { method: 'GET', mode: 'no-cors' }).catch(() => {});
    } catch {}

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

import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';


// Lazy-loaded subpages
const Login = lazyWithRetry(() => import('./pages/Login'));
const Register = lazyWithRetry(() => import('./pages/Register'));
const ForgotPassword = lazyWithRetry(() => import('./pages/ForgotPassword'));
const ResetPassword = lazyWithRetry(() => import('./pages/ResetPassword'));
const VerifyEmail = lazyWithRetry(() => import('./pages/VerifyEmail'));
const LandingAR = lazyWithRetry(() => import('./pages/LandingAR'));

const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Links = lazyWithRetry(() => import('./pages/EnhancedLinks'));
const Analytics = lazyWithRetry(() => import('./pages/Analytics'));
const CinemaAnalytics = lazyWithRetry(() => import('./pages/CinemaAnalytics'));
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
const AffiliatesLanding = lazyWithRetry(() => import('./pages/AffiliatesLanding'));
const Redeem = lazyWithRetry(() => import('./pages/Redeem'));
const FreeTools = lazyWithRetry(() => import('./pages/tools/FreeTools'));
const QrCodeGenerator = lazyWithRetry(() => import('./pages/tools/QrCodeGenerator'));
const UtmBuilder = lazyWithRetry(() => import('./pages/tools/UtmBuilder'));
const MetaTagGenerator = lazyWithRetry(() => import('./pages/tools/MetaTagGenerator'));

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
// Trial Expired Screen
// ==========================================
function TrialExpiredScreen() {
  const handleLogout = () => {
    window.location.href = '/login?logout=true';
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-red-500/20">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            Your Free Trial Has Ended
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We hope you enjoyed the 14-day trial of Smart Link. To continue tracking links, protecting against bot traffic, and using all premium features, please upgrade your account.
          </p>
          <div className="flex flex-col gap-3">
            <a 
              href="/pricing"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              View Pricing & Upgrade
            </a>
            <button 
              onClick={handleLogout}
              className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
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
  if (!user) return <Navigate to="/login" />;
  
  // 🛡️ ENFORCEMENT: Reverse Trial Lockout
  if (user.plan === 'trial' && !user.isTrialActive) {
    return <><TrialExpiredScreen /><RenderTrigger /></>;
  }

  return <>{children}<RenderTrigger /></>;
}

function AdminRoute({ children }) {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return <>{children}<RenderTrigger /></>;
}




function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to={redirectTarget} replace /> : <>{children}<RenderTrigger /></>;
}


function LandingRoute({ children }) {
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
        <Route path="/for-affiliates" element={<LandingRoute><AffiliatesLanding /></LandingRoute>} />
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
        <Route path="/cinema" element={<PrivateRoute><CinemaAnalytics /></PrivateRoute>} />
        <Route path="/bio" element={<PrivateRoute><BioEditor /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />




        {/* Public Bio & Legal Pages (No auth guard, but need RenderTrigger) */}
        <Route path="/@:username" element={<><BioPage /><RenderTrigger /></>} />
        <Route path="/u/:username" element={<><BioPage /><RenderTrigger /></>} />
        <Route path="/privacy" element={<><PrivacyPolicy /><RenderTrigger /></>} />
        <Route path="/terms" element={<><TermsOfService /><RenderTrigger /></>} />
        <Route path="/faq" element={<><FAQ /><RenderTrigger /></>} />
        <Route path="/blog" element={<><Blog /><RenderTrigger /></>} />
        <Route path="/blog/:id" element={<><BlogPost /><RenderTrigger /></>} />
        <Route path="/success" element={<><Success /><RenderTrigger /></>} />
        <Route path="/pricing" element={<LandingRoute><Pricing /></LandingRoute>} />
        <Route path="/redeem" element={<><Redeem /><RenderTrigger /></>} />
        <Route path="/tools" element={<><FreeTools /><RenderTrigger /></>} />
        <Route path="/tools/qr-code-generator" element={<><QrCodeGenerator /><RenderTrigger /></>} />
        <Route path="/tools/utm-builder" element={<><UtmBuilder /><RenderTrigger /></>} />
        <Route path="/tools/meta-tag-generator" element={<><MetaTagGenerator /><RenderTrigger /></>} />

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