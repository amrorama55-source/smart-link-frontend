import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { API_URL } from '../config';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  // Use useCallback to memoize the function
  const verifyEmail = useCallback(async () => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    try {
      console.log('🔍 Verifying with token:', token);
      const fullUrl = `${API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`}/auth/verify-email/${token}`;
      console.log('🔗 API URL:', fullUrl);

      const { data } = await axios.get(fullUrl);

      console.log('✅ Success response:', data);
      setStatus('success');
      setMessage(data.message || 'Email verified successfully!');
    } catch (error) {
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Full error:', error);

      setStatus('error');
      setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
    }
  }, [token]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Status Icon */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${status === 'verifying' ? 'bg-blue-100' :
            status === 'success' ? 'bg-green-100' :
              'bg-red-100'
            }`}>
            {status === 'verifying' && (
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-8 h-8 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {message && (
            <p className="text-gray-600 mt-2">{message}</p>
          )}
        </div>

        {/* Action Card */}
        <div className="card text-center">
          {status === 'success' && (
            <>
              <p className="text-gray-600 mb-6">
                Your email has been verified successfully. You can now access all features.
              </p>
              <Link
                to="/pricing"
                className="btn-primary inline-flex items-center justify-center w-full"
              >
                Choose Your Plan
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <p className="text-gray-600 mb-6">
                The verification link may have expired or is invalid. Please try logging in or request a new verification email.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center justify-center w-full"
                >
                  Back to Login
                </Link>
                <button
                  onClick={verifyEmail}
                  className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            </>
          )}

          {status === 'verifying' && (
            <div className="space-y-3">
              <p className="text-gray-500">
                Please wait while we verify your email address...
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse text-gray-400 text-sm">
                  This may take a few seconds
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}