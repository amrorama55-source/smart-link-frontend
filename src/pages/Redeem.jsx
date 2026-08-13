import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastProvider';

export default function Redeem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      setCode(codeParam);
    }
  }, [location]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      showError('Please enter a valid code');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/appsumo/redeem', { code });
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#2563eb', '#3b82f6', '#93c5fd'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#2563eb', '#3b82f6', '#93c5fd'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
      setSuccessData(response.data);
      success('AppSumo code redeemed successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to redeem code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Redeem AppSumo Code</h2>
          <p className="mt-2 text-sm text-gray-600">To redeem your Lifetime Deal, you need a Smart Link account first.</p>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 text-center">
            <button onClick={() => navigate('/register?redirect=/redeem')} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 mb-4 transition-colors">Create Free Account</button>
            <button onClick={() => navigate('/login?redirect=/redeem')} className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">Log In</button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow sm:rounded-xl sm:px-10 border border-green-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifetime Deal Activated!</h2>
            <p className="text-gray-600 mb-6">Your account has been upgraded to the <strong className="text-blue-600 capitalize">{successData.plan}</strong> plan.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">Codes Stacked:</span>
                <span className="text-sm font-bold text-gray-900">{successData.stackedCodesCount}</span>
              </div>
            </div>
            <button onClick={() => window.location.href = '/dashboard'} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Go to Dashboard</button>
            {successData.stackedCodesCount < 3 && (
              <p className="mt-4 text-xs text-gray-500">Want more features? <button onClick={() => setSuccessData(null)} className="ml-1 text-blue-600 font-medium hover:underline">Redeem another code</button></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main redeem form
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Redeem AppSumo Code</h2>
          <p className="mt-3 text-sm text-gray-600">Welcome, <strong>{user.name}</strong>! Enter your AppSumo code below.</p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-semibold mb-1">Stacking is supported!</p>
            <p className="text-sm text-blue-700">1 Code = Starter Plan<br/>2 Codes = Pro Plan<br/>3+ Codes = Unlimited Agency Plan</p>
          </div>
          <form onSubmit={handleRedeem} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">AppSumo Code</label>
              <input id="code" name="code" type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono tracking-wide" placeholder="SMARTLINK-XXXXXXXX" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-all">
              {isLoading ? 'Verifying Code...' : 'Redeem Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
