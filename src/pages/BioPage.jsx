import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, Instagram, Twitter, Github, Linkedin, Globe, Share2, Copy, Eye, MoreHorizontal, Youtube, Mail, Ghost, Music, Send, Sparkles } from 'lucide-react';

import { themes as themeData } from '../utils/bioThemes';
import { API_URL } from '../config';
import { api } from '../services/api';

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
  const [successData, setSuccessData] = useState(null);

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

  useEffect(() => {
    if (previewData) return;
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const blockId = params.get('block_id');
    const sessionId = params.get('session_id');

    if (success === 'true' && blockId && sessionId && username) {
      verifyPurchase(username, blockId, sessionId);
    }
  }, [username, previewData]);

  const verifyPurchase = async (uname, bId, sId) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/payments/verify/${uname}/${bId}/${sId}`);
      if (data.success) {
        setSuccessData(data.secretContent);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to verify purchase');
    }
  };

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
      {!previewData && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">

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

      <div className="h-32 w-full"></div>

      <div className="max-w-xl mx-auto px-4 -mt-8 w-full flex-1 pb-32 text-center">
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

        <div className="mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--bio-text-primary)' }}>
            {bioData.displayName || (previewData ? "Your Name" : "")}
          </h1>
          <p className="text-base font-semibold opacity-75" style={{ color: 'var(--bio-text-secondary)' }}>
            @{bioData.username}
          </p>
        </div>

        {bioData.bio && (
          <p className="text-[15px] font-medium leading-relaxed mb-6 max-w-sm mx-auto opacity-90" style={{ color: 'var(--bio-text-primary)' }}>
            {bioData.bio}
          </p>
        )}

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

        <div className="flex flex-col items-center space-y-4 w-full">
          {[...(bioData.customLinks || []).map(l => ({ ...l, type: 'link', id: l._id || Math.random().toString(36).substr(2, 9) })), ...(bioData.blocks || [])]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((block, index) => {
                  if (block.type === 'header') {
                      return (
                          <h3 key={block.id || index} className="w-full text-left font-bold text-lg px-2 mt-4" style={{ color: 'var(--bio-text-primary)' }}>
                              {block.title}
                          </h3>
                      );
                  }

                  if (block.type === 'newsletter') {
                      return (
                          <div
                              key={block.id || index}
                              className="w-full p-6 rounded-3xl border-2 shadow-sm text-left space-y-4"
                              style={{
                                  backgroundColor: 'var(--bio-card-bg)',
                                  borderColor: 'var(--bio-link-border)',
                                  color: 'var(--bio-text-primary)'
                              }}
                          >
                              <div className="space-y-1">
                                  <h4 className="font-bold text-base">{block.title || "Join my Newsletter"}</h4>
                                  <p className="text-xs opacity-70">{block.content || "Stay updated with my latest news and exclusive content."}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                  <input 
                                      type="email" 
                                      placeholder="Enter your email" 
                                      className="w-full p-3 rounded-2xl text-sm border bg-white/5 border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
                                  />
                                  <button className="w-full p-3 bg-white text-black rounded-2xl text-sm font-bold shadow-md active:scale-95 transition-all">
                                      Subscribe
                                  </button>
                              </div>
                          </div>
                      );
                  }

                  // Standard Link / Paywall rendering
                  return (
                    <div
                      key={block.id || index}
                      onClick={async () => {
                        if (previewData) return;
                        if (block.type === 'paywall') {
                          try {
                            const res = await axios.post(`${API_URL}/api/payments/checkout/${username}/${block.id || block._id}`, {
                              returnUrl: window.location.href.split('?')[0]
                            });
                            window.location.href = res.data.url;
                          } catch (err) {
                            alert(err.response?.data?.error || 'Failed to start checkout');
                          }
                        } else if (block.url) {
                          trackLinkClick(index);
                          window.open(block.url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="group relative flex items-center p-1.5 rounded-full transition-all hover:shadow-lg w-full max-w-md hover:scale-[1.02] active:scale-[0.98] border-2 cursor-pointer"
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
                      <div className="absolute left-1.5 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                        {block.icon || (block.type === 'paywall' ? '🔐' : block.type === 'file' ? '📁' : '🔗')}
                      </div>

                      <div className="flex-1 py-4 px-16 text-center">
                        <p className="font-bold text-[15px] truncate" style={{ color: 'var(--bio-text-primary)' }}>
                          {block.title || block.url}
                        </p>
                      </div>

                      <div className="absolute right-4 flex items-center justify-center">
                        {block.type === 'paywall' ? (
                          <div className="text-[10px] font-bold bg-yellow-600/20 text-yellow-600 px-3 py-1.5 rounded-full uppercase tracking-wider">
                            {block.settings?.price ? `${block.settings?.price} ${block.settings?.currency || 'USD'}` : 'Buy'}
                          </div>
                        ) : (
                          <MoreHorizontal className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--bio-text-primary)' }} />
                        )}
                      </div>
                    </div>
                  );
              })
          }
          {(!bioData.customLinks || bioData.customLinks.length === 0) && (!bioData.blocks || bioData.blocks.length === 0) && previewData && (
            <div className="p-6 border-2 border-dashed border-gray-300/50 rounded-xl text-center w-full">
              <p style={{ color: 'var(--bio-text-secondary)' }}>Add verified links</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 w-full mx-auto left-0 right-0 px-6 z-50 pointer-events-none flex justify-center pb-safe">
          <a
            href="https://www.by-smartlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(0,0,0,0.2)] pointer-events-auto border"
            style={{
              backgroundColor: 'var(--bio-card-bg)', 
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

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl max-w-sm w-full text-center relative shadow-2xl animate-fade-in-up">
            <button onClick={() => setSuccessData(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="text-xl">✕</span>
            </button>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Sparkles className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Thank you for your purchase! Here is your exclusive content:</p>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 mb-6 max-h-40 overflow-y-auto custom-scrollbar text-left">
              {successData.startsWith('http') ? (
                <a href={successData} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold break-all hover:underline flex items-center gap-2">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  {successData}
                </a>
              ) : (
                <p className="text-gray-900 dark:text-white font-mono text-sm break-all">{successData}</p>
              )}
            </div>
            
            <button onClick={() => setSuccessData(null)} className="w-full py-3.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-bold transition-all active:scale-95 shadow-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}