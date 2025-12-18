import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Mail, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.isEmailVerified || dismissed) {
    return null;
  }

  const resendEmail = async () => {
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/auth/resend-verification`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      alert('Failed to resend email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>Verify your email</strong> to unlock all features.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {sent ? (
              <span className="text-sm text-green-600 font-medium">
                ✓ Email sent!
              </span>
            ) : (
              <button
                onClick={resendEmail}
                disabled={sending}
                className="text-sm text-yellow-800 hover:text-yellow-900 font-medium underline disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Resend email'}
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}