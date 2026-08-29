// src/components/LoadingButton.jsx
import React from 'react';

export default function LoadingButton({ loading, children, ...props }) {
  return (
    <button 
      {...props} 
      disabled={loading || props.disabled}
      className={`
        relative inline-flex items-center justify-center px-6 py-3 border border-transparent 
        text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 
        hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all 
        duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95
        ${props.className || ''}
      `}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin h-5 w-5 mr-3" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="font-semibold">Loading...</span>
        </>
      ) : (
        <span className="font-semibold">{children}</span>
      )}
    </button>
  );
}