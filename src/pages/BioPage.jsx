import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, Instagram, Twitter, Github, Linkedin, Globe, Share2, Copy, Eye, MoreHorizontal, Youtube, Mail, Ghost, Music } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

import { themes as themeData } from '../utils/bioThemes';

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music,
  snapchat: Ghost,
  email: Mail,
  website: Globe
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

      <div className="max-w-xl mx-auto px-4 -mt-8 w-full flex-1 pb-32 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4 pt-6">
          <div className="w-28 h-28 rounded-full p-1 bg-white/10 backdrop-blur-md shadow-2xl mx-auto overflow-hidden ring-2 ring-white/30">
            {bioData.avatar ? (
              <img
                src={bioData.avatar}
                alt={bioData.displayName}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-4xl">👤</div>
            )}
          </div>
        </div>

        {/* Name & Handle */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--bio-text-primary)' }}>
            {bioData.displayName || (previewData ? "Your Name" : "")}
          </h1>
          <p className="text-base font-semibold opacity-75" style={{ color: 'var(--bio-text-secondary)' }}>
            @{bioData.username}
          </p>
        </div>

        {/* Bio */}
        {bioData.bio && (
          <p className="text-[15px] font-medium leading-relaxed mb-6 max-w-sm mx-auto opacity-90" style={{ color: 'var(--bio-text-primary)' }}>
            {bioData.bio}
          </p>
        )}

        {/* Social Row - Moved up under bio */}
        {bioData.socialLinks && bioData.socialLinks.length > 0 && (
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            {bioData.socialLinks.map((s, i) => {
              const Icon = socialIcons[s.platform] || Globe;
              return (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  className="p-3 rounded-full transition-all transform hover:scale-110 hover:-translate-y-1 shadow-sm"
                  style={{
                    backgroundColor: 'var(--bio-link-bg)',
                    color: 'var(--bio-text-primary)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bio-link-hover-bg)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bio-link-bg)'}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        )}

        {/* Links List - Pill Shaped */}
        <div className="flex flex-col items-center space-y-4 w-full">
          {bioData.customLinks && bioData.customLinks.length > 0 ? (
            bioData.customLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackLinkClick(index)}
                className="group relative flex items-center p-1.5 rounded-full transition-all hover:shadow-lg w-full max-w-md hover:scale-[1.02] active:scale-[0.98] border-2"
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
                {/* Left Icon */}
                <div className="absolute left-1.5 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                  {link.icon || '🔗'}
                </div>

                {/* Centered Text */}
                <div className="flex-1 py-4 px-16 text-center">
                  <p className="font-bold text-[15px] truncate" style={{ color: 'var(--bio-text-primary)' }}>
                    {link.title || link.url}
                  </p>
                </div>

                {/* Right Icon - MoreHorizontal (3 dots) */}
                <div className="absolute right-4 flex items-center justify-center">
                  <MoreHorizontal className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--bio-text-primary)' }} />
                </div>
              </a>
            ))
          ) : (
            previewData && (
              <div className="p-6 border-2 border-dashed border-gray-300/50 rounded-xl text-center w-full">
                <p style={{ color: 'var(--bio-text-secondary)' }}>Add verified links</p>
              </div>
            )
          )}
        </div>

        {/* ✅ Powered by Smart Link Floating Footer */}
        <div className="fixed bottom-6 w-full mx-auto left-0 right-0 px-6 z-50 pointer-events-none flex justify-center pb-safe">
          <a
            href="https://www.by-smartlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(0,0,0,0.2)] pointer-events-auto border"
            style={{
              backgroundColor: 'var(--bio-card-bg)', // Using card-bg so it adapts to the current theme naturally
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'var(--bio-card-border)',
              color: 'var(--bio-text-primary)',
              textDecoration: 'none'
            }}
          >
            <img
              src="/logo-v1.svg"
              alt="Smart Link"
              className="w-5 h-5 rounded flex-shrink-0"
              style={{ display: 'block' }}
            />
            <span className="text-[14px] font-bold tracking-wide">
              Join <span className="opacity-70 mx-0.5">@{bioData.username}</span> on Smart Link
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}