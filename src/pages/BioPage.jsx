import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, ExternalLink, LinkIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const themes = {
  default: 'bg-gradient-to-br from-gray-50 to-gray-100',
  dark: 'bg-gradient-to-br from-gray-900 to-gray-800',
  gradient: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
  minimal: 'bg-white',
  neon: 'bg-black',
  ocean: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  sunset: 'bg-gradient-to-br from-orange-500 to-pink-600',
  forest: 'bg-gradient-to-br from-green-600 to-teal-600'
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
      
      // Track page view
      trackPageView(username);
    } catch (err) {
      console.error('Error loading bio page:', err);
      setError(err.response?.data?.error || 'Bio page not found');
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async (username) => {
    try {
      await axios.post(`${API_URL}/api/bio/${username}/view`);
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  };

  const trackLinkClick = async (linkIndex) => {
    try {
      await axios.post(`${API_URL}/api/bio/${username}/click`, {
        linkIndex
      });
    } catch (err) {
      console.error('Failed to track click:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !bioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <LinkIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <span>Go to Home</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const isDark = ['dark', 'neon', 'gradient', 'ocean', 'sunset', 'forest'].includes(bioData.theme);

  return (
    <div className={`min-h-screen ${themes[bioData.theme] || themes.default} transition-colors duration-500`}>
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center">
          
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            {bioData.avatar ? (
              <img
                src={bioData.avatar}
                alt={bioData.displayName}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto object-cover border-4 border-white/30 dark:border-white/20 shadow-2xl ring-4 ring-white/10"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/160?text=Avatar';
                }}
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto bg-white/20 dark:bg-white/10 backdrop-blur-xl flex items-center justify-center text-6xl border-4 border-white/30 shadow-2xl">
                👤
              </div>
            )}
            {/* Online Badge */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white/50"></div>
          </div>

          {/* Display Name */}
          <h1
            className={`text-4xl sm:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {bioData.displayName}
          </h1>

          {/* Username */}
          <p
            className={`text-lg sm:text-xl mb-6 font-medium ${
              isDark ? 'text-white/70' : 'text-gray-600'
            }`}
          >
            @{bioData.username}
          </p>

          {/* Bio */}
          {bioData.bio && (
            <p
              className={`text-base sm:text-lg mb-12 max-w-xl mx-auto leading-relaxed ${
                isDark ? 'text-white/80' : 'text-gray-700'
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
                  onClick={() => trackLinkClick(index)}
                  className={`group block px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-semibold transition-all hover:scale-105 hover:shadow-2xl transform ${
                    isDark
                      ? 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/20'
                      : 'bg-white/80 backdrop-blur-xl text-gray-900 hover:bg-white shadow-lg border border-gray-200/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {link.icon && (
                        <span className="text-2xl sm:text-3xl flex-shrink-0">{link.icon}</span>
                      )}
                      <span className="text-base sm:text-lg truncate">{link.title}</span>
                    </div>
                    <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </a>
              ))
            ) : (
              <div
                className={`py-12 px-6 rounded-2xl ${
                  isDark
                    ? 'bg-white/5 backdrop-blur-xl border border-white/10'
                    : 'bg-white/50 backdrop-blur-xl border border-gray-200/50'
                }`}
              >
                <LinkIcon className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                <p
                  className={`text-sm ${
                    isDark ? 'text-white/50' : 'text-gray-500'
                  }`}
                >
                  No links available yet
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          {bioData.socialLinks && bioData.socialLinks.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
              {bioData.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-white/80 hover:bg-white text-gray-900 shadow-md hover:shadow-lg'
                  }`}
                  title={social.platform}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          )}

          {/* Stats (if available) */}
          {bioData.stats && (
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
              <div
                className={`p-4 rounded-xl ${
                  isDark
                    ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg'
                }`}
              >
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {bioData.stats.views || 0}
                </p>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Views
                </p>
              </div>
              <div
                className={`p-4 rounded-xl ${
                  isDark
                    ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg'
                }`}
              >
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {bioData.stats.clicks || 0}
                </p>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Clicks
                </p>
              </div>
              <div
                className={`p-4 rounded-xl col-span-2 sm:col-span-1 ${
                  isDark
                    ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg'
                }`}
              >
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {bioData.customLinks?.length || 0}
                </p>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Links
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 sm:mt-20">
            <a
              href="/"
              className={`inline-flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 ${
                isDark ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Create your own with Smart Link</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}