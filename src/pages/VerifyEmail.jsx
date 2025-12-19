import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(data.message || 'Email verified successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Status Icon */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
            status === 'verifying' ? 'bg-blue-100' :
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
                to="/dashboard" 
                className="btn-primary inline-flex items-center justify-center w-full"
              >
                Go to Dashboard
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <p className="text-gray-600 mb-6">
                The verification link may have expired or is invalid. Please try logging in or request a new verification email.
              </p>
              <Link 
                to="/login" 
                className="btn-primary inline-flex items-center justify-center w-full"
              >
                Back to Login
              </Link>
            </>
          )}
          
          {status === 'verifying' && (
            <p className="text-gray-500">
              Please wait while we verify your email address...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}