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
        const error = searchParams.get('error');

        if (error) {
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

        // The backend sets an HttpOnly cookie on the Google OAuth callback redirect.
        // We just need to verify the session by calling getCurrentUser (via loginWithToken).
        try {
          await loginWithToken();
          setStatus('success');

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);

        } catch (loginError) {
          let errorMsg = 'Login failed. Please try again.';

          if (loginError.response) {
            const { status: httpStatus, data } = loginError.response;
            if (httpStatus === 404) {
              errorMsg = 'Account not found. Your Google account may not be registered yet.';
            } else if (httpStatus === 429) {
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

      } catch (err) {
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authenticating...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
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
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Redirecting to login page...
            </p>
          </>
        )}

      </div>
    </div>
  );
}
