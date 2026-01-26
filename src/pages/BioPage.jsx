import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, ExternalLink, LinkIcon, Instagram, Twitter, Github, Linkedin, Globe, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Gravatar-inspired themes (cleaner, card-based)
const themes = {
  default: 'bg-[#f3f4f6]', // Gravatar light gray
  dark: 'bg-[#1e1e1e]',
  blue: 'bg-blue-50',
  gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  midnight: 'bg-slate-900',
};

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
  youtube: Globe,
  tiktok: Globe
};

export default function BioPage({ previewData = null }) {
  const { username } = useParams();
  const [loading, setLoading] = useState(!previewData);
  const [bioData, setBioData] = useState(previewData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (previewData) {
      setBioData(previewData);
      setLoading(false);
      return;
    }
    if (username) {
      loadBioPage();
    }
  }, [username, previewData]);

  const loadBioPage = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/bio/${username}`);
      setBioData(data.bioPage);
      if (!previewData) trackPageView(username);
    } catch (err) {
      setError(err.response?.data?.error || 'Bio page not found');
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async (username) => {
    try { await axios.post(`${API_URL}/api/bio/${username}/view`); } catch (err) { }
  };

  const trackLinkClick = async (linkIndex) => {
    if (previewData) return;
    try { await axios.post(`${API_URL}/api/bio/${username}/click`, { linkIndex }); } catch (err) { }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !bioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
          <p className="text-gray-500 mb-4">{error || "This bio page doesn't exist"}</p>
        </div>
      </div>
    );
  }

  // Theme Logic
  const currentTheme = bioData.theme || 'default';
  const themeClass = themes[currentTheme] || themes.default;
  const isDark = ['dark', 'midnight', 'gradient'].includes(currentTheme);
  const cardClass = isDark ? 'bg-black/20 backdrop-blur-md border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900';

  return (
    <div className={`min-h-screen w-full ${themeClass} transition-colors duration-500 overflow-x-hidden ${previewData ? 'rounded-[2rem]' : ''} flex flex-col`}>

      {/* Top Banner / Cover Area (Optional, for now just spacing) */}
      <div className={`h-32 w-full ${isDark ? 'bg-white/5' : 'bg-gray-200/50'}`}></div>

      <div className="max-w-xl mx-auto px-4 -mt-16 w-full flex-1 pb-12">
        {/* Profile Card */}
        <div className={`rounded-3xl shadow-xl p-8 border ${cardClass} text-center relative overflow-hidden`}>

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className={`w-36 h-36 rounded-full p-1.5 ${isDark ? 'bg-black' : 'bg-white'} shadow-lg mx-auto`}>
              {bioData.avatar ? (
                <img
                  src={bioData.avatar}
                  alt={bioData.displayName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-5xl">👤</div>
              )}
            </div>
          </div>

          {/* Name & Handle */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">
              {bioData.displayName || (previewData ? "Your Name" : "")}
            </h1>
            <p className={`text-lg font-medium ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
              @{bioData.username}
            </p>
          </div>

          {/* Verified / Location / Bio */}
          {bioData.bio && (
            <p className={`text-base leading-relaxed mb-8 max-w-sm mx-auto ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
              {bioData.bio}
            </p>
          )}

          {/* Links List - Clean & Verified Style */}
          <div className="space-y-3 text-left">
            {bioData.customLinks && bioData.customLinks.length > 0 ? (
              bioData.customLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick(index)}
                  className={`group flex items-center p-3 rounded-xl transition-all border hover:shadow-md ${isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mr-3 ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                    {link.icon || '🔗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{link.title || link.url}</p>
                    <p className={`text-xs truncate ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{link.url}</p>
                  </div>
                  <CheckCircle className={`w-5 h-5 ${isDark ? 'text-white/20' : 'text-gray-300'} group-hover:text-blue-500 transition-colors`} />
                </a>
              ))
            ) : (
              previewData && (
                <div className="p-6 border-2 border-dashed border-gray-300/50 rounded-xl text-center">
                  <p className={isDark ? "text-white/50" : "text-gray-400"}>Add verified links</p>
                </div>
              )
            )}
          </div>

          {/* Social Row */}
          {bioData.socialLinks && bioData.socialLinks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200/20 flex justify-center gap-4">
              {bioData.socialLinks.map((s, i) => {
                const Icon = socialIcons[s.platform] || Globe;
                return (
                  <a key={i} href={s.url} target="_blank" className={`text-gray-400 hover:text-blue-500 transition-colors`}>
                    <Icon className="w-6 h-6" />
                  </a>
                )
              })}
            </div>
          )}

        </div>

        {/* Footer Branding */}
        <div className="text-center mt-8 opacity-50">
          <a href="/" className="text-xs font-bold tracking-widest uppercase hover:text-blue-500 transition-colors">
            <span className="text-blue-500">⚡</span> Smart Link
          </a>
        </div>

      </div>
    </div>
  );
}