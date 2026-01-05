import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        console.log('🔍 Auth Callback:', { 
          token: token ? 'present' : 'missing', 
          error 
        });

        if (error) {
          console.error('❌ OAuth Error:', error);
          setStatus('error');
          
          const errorMessages = {
            'google_auth_failed': 'Google authentication failed. Please try again.',
            'auth_error': 'Authentication error occurred. Please try again.',
            'user_not_found': 'User not found. Please register first.',
            'token_failed': 'Failed to create authentication token.',
            'no_token': 'No authentication token received.',
            'callback_failed': 'Authentication callback failed.'
          };
          
          const msg = errorMessages[error] || 'Authentication failed. Please try again.';
          setErrorMessage(msg);
          
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent(msg), { replace: true });
          }, 3000);
          return;
        }

        if (token) {
          console.log('✅ Token received, logging in...');
          
          try {
            await loginWithToken(token);
            console.log('✅ Login successful');
            setStatus('success');
            
            setTimeout(() => {
              console.log('🔀 Redirecting to dashboard...');
              navigate('/dashboard', { replace: true });
            }, 1000);
            
          } catch (loginError) {
            console.error('❌ Login with token failed:', loginError);
            
            // ✅ تحليل الخطأ بشكل دقيق
            let errorMsg = 'Login failed. Please try again.';
            
            if (loginError.response) {
              const { status, data } = loginError.response;
              
              if (status === 404) {
                errorMsg = 'Account not found. Your Google account may not be registered yet.';
              } else if (status === 429) {
                errorMsg = 'Too many attempts. Please wait a few minutes and try again.';
              } else if (data?.error) {
                errorMsg = data.error;
              }
            }
            
            setStatus('error');
            setErrorMessage(errorMsg);
            
            setTimeout(() => {
              navigate('/login?error=' + encodeURIComponent(errorMsg), { replace: true });
            }, 3000);
          }
          
        } else {
          console.error('⚠️ No token and no error');
          setStatus('error');
          setErrorMessage('No authentication token received');
          
          setTimeout(() => {
            navigate('/login?error=no_token', { replace: true });
          }, 2000);
        }

      } catch (err) {
        console.error('❌ Callback handling error:', err);
        setStatus('error');
        setErrorMessage('An unexpected error occurred');
        
        setTimeout(() => {
          navigate('/login?error=callback_failed', { replace: true });
        }, 2000);
      }
    };

    processCallback();
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
        
        {status === 'processing' && (
          <>
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authenticating...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we log you in
            </p>
            
            <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full animate-progress"></div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <svg 
                  className="w-8 h-8 text-green-600 dark:text-green-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Success!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg 
                  className="w-8 h-8 text-red-600 dark:text-red-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {errorMessage || 'An error occurred during authentication'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Redirecting back to login...
            </p>
          </>
        )}

      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}