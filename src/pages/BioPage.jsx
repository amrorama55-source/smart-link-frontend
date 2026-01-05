import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const themes = {
  default: 'bg-white',
  dark: 'bg-gray-900',
  gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
  minimal: 'bg-gray-50',
  neon: 'bg-black'
};

export default function BioPage() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [bioData, setBioData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBioPage();
  }, [username]);

  const loadBioPage = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/bio/${username}`);
      setBioData(data.bioPage);
    } catch (err) {
      console.error('Error loading bio page:', err);
      setError(err.response?.data?.error || 'Bio page not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh]flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !bioData) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  const isDark = ['dark', 'neon', 'gradient'].includes(bioData.theme);

  return (
    <div className={`min-h-screen ${themes[bioData.theme] || themes.default}`}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          {/* Avatar */}
          {bioData.avatar ? (
            <img
              src={bioData.avatar}
              alt={bioData.displayName}
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white/20 shadow-xl"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/128?text=Avatar';
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gray-200 flex items-center justify-center text-5xl">
              👤
            </div>
          )}

          {/* Display Name */}
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {bioData.displayName}
          </h1>

          {/* Bio */}
          {bioData.bio && (
            <p
              className={`text-lg mb-8 max-w-xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {bioData.bio}
            </p>
          )}

          {/* Custom Links */}
          <div className="space-y-4 max-w-xl mx-auto mt-12">
            {bioData.customLinks && bioData.customLinks.length > 0 ? (
              bioData.customLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block px-8 py-5 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg transform ${
                    isDark
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : bioData.theme === 'gradient'
                      ? 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {link.icon && (
                      <span className="text-2xl">{link.icon}</span>
                    )}
                    <span className="text-lg">{link.title}</span>
                    <ExternalLink className="w-5 h-5 opacity-50" />
                  </div>
                </a>
              ))
            ) : (
              <p
                className={`text-sm py-8 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                No links available
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-16">
            <p
              className={`text-sm ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Powered by{' '}
              <a href="/" className="font-medium hover:underline">
                Smart Link
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
