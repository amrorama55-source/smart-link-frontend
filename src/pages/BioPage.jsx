import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, Instagram, Twitter, Github, Linkedin, Globe, CheckCircle, Share2, Copy, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

import { themes as themeData } from '../utils/bioThemes';

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
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    const shareData = {
      title: bioData.displayName || 'Check out my Smart Link',
      text: bioData.bio || 'Visit my bio page to see all my links!',
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const currentTheme = themeData[bioData.theme] || themeData.default;

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${previewData ? 'rounded-[2rem]' : ''} flex flex-col`}
      style={{
        ...currentTheme.variables,
        background: currentTheme.variables['--bio-bg'],
        backdropFilter: currentTheme.variables['--bio-backdrop'] || 'none'
      }}
    >
      {/* ✅ Floating Buttons: Copy + Share فقط (بدون Preview لأنه مو منطقي هنا) */}
      {!previewData && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-full shadow-lg transition-all active:scale-95 hover:scale-105"
            style={{
              backgroundColor: copied ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.3)'}`,
              color: copied ? '#22c55e' : 'var(--bio-text-primary)',
            }}
            aria-label="Copy Link"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full shadow-lg transition-all active:scale-95 hover:scale-105"
            style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'var(--bio-text-primary)',
            }}
            aria-label="Share Bio"
          >
            <Share2 className="w-4 h-4" />
          </button>

        </div>
      )}

      {/* Top Spacing */}
      <div className="h-32 w-full"></div>

      <div className="max-w-xl mx-auto px-4 -mt-16 w-full flex-1 pb-12">
        {/* Profile Card */}
        <div
          className="rounded-3xl shadow-xl p-8 border text-center relative overflow-hidden"
          style={{
            backgroundColor: 'var(--bio-card-bg)',
            borderColor: 'var(--bio-card-border)',
            color: 'var(--bio-text-primary)',
            boxShadow: 'var(--bio-shadow, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1))'
          }}
        >
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-36 h-36 rounded-full p-1.5 bg-white/20 backdrop-blur-sm shadow-lg mx-auto">
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--bio-text-primary)' }}>
              {bioData.displayName || (previewData ? "Your Name" : "")}
            </h1>
            <p className="text-lg font-medium" style={{ color: 'var(--bio-text-secondary)' }}>
              @{bioData.username}
            </p>
          </div>

          {/* Bio */}
          {bioData.bio && (
            <p className="text-base leading-relaxed mb-8 max-w-sm mx-auto opacity-90" style={{ color: 'var(--bio-text-primary)' }}>
              {bioData.bio}
            </p>
          )}

          {/* Links List */}
          <div className="space-y-3 text-left">
            {bioData.customLinks && bioData.customLinks.length > 0 ? (
              bioData.customLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick(index)}
                  className="group flex items-center p-3 rounded-xl transition-all border hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: 'var(--bio-link-bg)',
                    borderColor: 'var(--bio-link-border)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bio-link-hover-bg)';
                    if (currentTheme.id === 'minimal') e.currentTarget.style.color = 'var(--bio-link-hover-text)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bio-link-bg)';
                    if (currentTheme.id === 'minimal') e.currentTarget.style.color = 'var(--bio-text-primary)';
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mr-3 bg-white/10">
                    {link.icon || '🔗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: 'var(--bio-text-primary)' }}>{link.title || link.url}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--bio-text-secondary)' }}>{link.url}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 opacity-30 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--bio-text-primary)' }} />
                </a>
              ))
            ) : (
              previewData && (
                <div className="p-6 border-2 border-dashed border-gray-300/50 rounded-xl text-center">
                  <p style={{ color: 'var(--bio-text-secondary)' }}>Add verified links</p>
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
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    className="transition-all transform hover:scale-110"
                    style={{ color: 'var(--bio-text-secondary)' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--bio-text-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--bio-text-secondary)'}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* ✅ Powered by Smart Link Footer */}
        <div className="text-center mt-8">
          <a
            href="https://www.smart-link.website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--bio-text-secondary)',
              textDecoration: 'none'
            }}
          >
            <img
              src="/logo.svg"
              alt="Smart Link"
              className="w-4 h-4 rounded flex-shrink-0"
              style={{ display: 'block' }}
            />
            <span className="text-xs font-semibold opacity-70 tracking-wide">
              Powered by <span className="font-extrabold opacity-100">Smart Link</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}