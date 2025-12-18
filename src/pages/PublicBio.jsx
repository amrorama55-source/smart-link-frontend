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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Bio page not found</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const getThemeClasses = () => {
    switch (bioData.theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          subtext: 'text-gray-300',
          button: 'bg-white text-gray-900 hover:bg-gray-100'
        };
      case 'gradient':
        return {
          bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
          text: 'text-white',
          subtext: 'text-white/90',
          button: 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
        };
      case 'minimal':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
          button: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'
        };
      case 'neon':
        return {
          bg: 'bg-black',
          text: 'text-cyan-400',
          subtext: 'text-cyan-300',
          button: 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/50'
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
          button: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`min-h-screen ${theme.bg} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {bioData.avatar && (
            <img
              src={bioData.avatar}
              alt={bioData.displayName}
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white/20"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          <h1 className={`text-4xl font-bold mb-3 ${theme.text}`}>
            {bioData.displayName}
          </h1>
          
          {bioData.bio && (
            <p className={`text-lg ${theme.subtext} max-w-lg mx-auto`}>
              {bioData.bio}
            </p>
          )}

          {/* Social Links */}
          {bioData.socialLinks && bioData.socialLinks.length > 0 && (
            <div className="flex justify-center space-x-4 mt-6">
              {bioData.socialLinks.map((social, index) => {
                const Icon = socialIcons[social.platform] || Globe;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full ${theme.button} transition-all transform hover:scale-110`}
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
              className={`block w-full px-6 py-4 rounded-xl font-medium text-center transition-all transform hover:scale-105 hover:shadow-lg ${theme.button}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{link.title}</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className={`text-sm ${theme.subtext}`}>
            Powered by{' '}
            <a
              href="/"
              className={`font-medium ${theme.text} hover:underline`}
            >
              Smart Link
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}