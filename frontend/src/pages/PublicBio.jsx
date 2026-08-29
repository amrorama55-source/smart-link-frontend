import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink, Instagram, Twitter, Github, Linkedin, Globe } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  website: Globe
};

import { themes } from '../utils/bioThemes';

export default function PublicBio() {
  const { username } = useParams();
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadBioPage();
  }, [username]);

  const loadBioPage = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/bio/${username}`);
      setBioData(data.bioPage);
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Bio page not found</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const currentTheme = themes[bioData.theme] || themes.default;

  return (
  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-500`}
      style={{
        ...currentTheme.variables,
        background: currentTheme.variables['--bio-bg']
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          {bioData.avatar && (
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm shadow-xl mx-auto overflow-hidden border-4 border-white/30">
                <img
                  src={bioData.avatar}
                  alt={bioData.displayName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight`} style={{ color: 'var(--bio-text-primary)' }}>
            {bioData.displayName}
          </h1>

          {bioData.bio && (
            <p className={`text-lg sm:text-xl font-medium opacity-90 max-w-lg mx-auto leading-relaxed`} style={{ color: 'var(--bio-text-primary)' }}>
              {bioData.bio}
            </p>
          )}

          {/* Social Links */}
          {bioData.socialLinks && bioData.socialLinks.length > 0 && (
            <div className="flex justify-center flex-wrap gap-4 mt-8">
              {bioData.socialLinks.map((social, index) => {
                const Icon = socialIcons[social.platform] || Globe;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3.5 rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-md`}
                    style={{ backgroundColor: 'var(--bio-link-bg)', color: 'var(--bio-text-primary)' }}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Links */}
        <div className="space-y-4">
          {bioData.customLinks && bioData.customLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full px-6 py-4 rounded-2xl font-bold text-center transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg border-2`}
              style={{
                backgroundColor: 'var(--bio-link-bg)',
                borderColor: 'var(--bio-link-border)',
                color: 'var(--bio-text-primary)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 flex justify-center text-xl">{link.icon || '🔗'}</span>
                <span className="flex-1">{link.title || link.url}</span>
                <ExternalLink className="w-5 h-5 opacity-40" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className={`text-sm font-medium opacity-60`} style={{ color: 'var(--bio-text-primary)' }}>
            Powered by{' '}
            <a
              href="/"
              className={`font-bold hover:underline`}
              style={{ color: 'var(--bio-text-primary)' }}
            >
              Smart Link
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
