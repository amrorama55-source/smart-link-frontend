import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  Plus, Trash2, Eye, Save, Check, X, Loader, 
  Link2, Upload, GripVertical, ExternalLink,
  BarChart3, Copy, CheckCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const themes = [
  { id: 'default', name: 'Default', preview: 'bg-gradient-to-br from-gray-50 to-gray-100' },
  { id: 'dark', name: 'Dark', preview: 'bg-gradient-to-br from-gray-900 to-gray-800' },
  { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600' },
  { id: 'minimal', name: 'Minimal', preview: 'bg-white' },
  { id: 'neon', name: 'Neon', preview: 'bg-black' },
  { id: 'ocean', name: 'Ocean', preview: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
  { id: 'sunset', name: 'Sunset', preview: 'bg-gradient-to-br from-orange-500 to-pink-600' },
  { id: 'forest', name: 'Forest', preview: 'bg-gradient-to-br from-green-600 to-teal-600' }
];

const socialPlatforms = [
  { id: 'twitter', name: 'Twitter', icon: '𝕏', placeholder: 'https://twitter.com/username' },
  { id: 'instagram', name: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/username' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
  { id: 'github', name: 'GitHub', icon: '💻', placeholder: 'https://github.com/username' },
  { id: 'youtube', name: 'YouTube', icon: '📹', placeholder: 'https://youtube.com/@username' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@username' }
];

export default function BioEditor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bioData, setBioData] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatar: '',
    theme: 'default',
    socialLinks: [],
    customLinks: [],
    isPublic: true
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    loadBioSettings();
  }, []);

  const loadBioSettings = async () => {
    try {
      const { data } = await api.get('/api/bio/settings');
      setBioData({
        username: data.bioPage.username || '',
        displayName: data.bioPage.displayName || '',
        bio: data.bioPage.bio || '',
        avatar: data.bioPage.avatar || '',
        theme: data.bioPage.theme || 'default',
        socialLinks: data.bioPage.socialLinks || [],
        customLinks: data.bioPage.customLinks || [],
        isPublic: data.bioPage.isPublic !== undefined ? data.bioPage.isPublic : true
      });
    } catch (error) {
      console.error('Error loading bio settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }

    try {
      const { data } = await api.get(`/api/bio/check-username/${username}`);
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (value) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setBioData({ ...bioData, username: cleanValue });
    setCheckingUsername(true);
    setUsernameAvailable(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      checkUsername(cleanValue);
    }, 500);
  };

  const handleSave = async () => {
    if (!bioData.username || bioData.username.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    if (usernameAvailable === false) {
      alert('Username is not available');
      return;
    }

    setSaving(true);
    try {
      await api.put('/api/bio/settings', bioData);
      alert('Bio page saved successfully! 🎉');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addCustomLink = () => {
    setBioData({
      ...bioData,
      customLinks: [
        ...bioData.customLinks,
        { 
          title: '', 
          url: '', 
          icon: '🔗', 
          order: bioData.customLinks.length, 
          isActive: true 
        }
      ]
    });
  };

  const removeCustomLink = (index) => {
    setBioData({
      ...bioData,
      customLinks: bioData.customLinks.filter((_, i) => i !== index)
    });
  };

  const updateCustomLink = (index, field, value) => {
    const updated = [...bioData.customLinks];
    updated[index] = { ...updated[index], [field]: value };
    setBioData({ ...bioData, customLinks: updated });
  };

  const addSocialLink = (platform) => {
    const exists = bioData.socialLinks.find(s => s.platform === platform.id);
    if (exists) return;

    setBioData({
      ...bioData,
      socialLinks: [
        ...bioData.socialLinks,
        { platform: platform.id, url: '', icon: platform.icon }
      ]
    });
  };

  const removeSocialLink = (platform) => {
    setBioData({
      ...bioData,
      socialLinks: bioData.socialLinks.filter(s => s.platform !== platform)
    });
  };

  const updateSocialLink = (platform, url) => {
    const updated = bioData.socialLinks.map(s =>
      s.platform === platform ? { ...s, url } : s
    );
    setBioData({ ...bioData, socialLinks: updated });
  };

  const copyBioLink = () => {
    const link = `${window.location.origin}/@${bioData.username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreview = () => {
    if (!bioData.username) {
      alert('Please set a username first');
      return;
    }
    window.open(`/@${bioData.username}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your bio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Link in Bio Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create your personal bio page like Linktree
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePreview}
                disabled={!bioData.username}
                className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={copyBioLink}
                disabled={!bioData.username}
                className="px-4 py-2 border-2 border-blue-600 dark:border-blue-500 rounded-xl font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bio Link Display */}
          {bioData.username && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Bio Page URL:</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 truncate">
                    {window.location.origin}/@{bioData.username}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Editor Section */}
          <div className="space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <span>📝</span> Basic Information
              </h2>

              {/* Username */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Username * 
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">
                    (letters, numbers, underscore only)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    @
                  </span>
                  <input
                    type="text"
                    value={bioData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="yourusername"
                  />
                </div>
                {bioData.username && (
                  <div className="mt-2">
                    {checkingUsername && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Checking availability...</span>
                      </div>
                    )}
                    {!checkingUsername && usernameAvailable === true && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        <span>✨ Username is available!</span>
                      </div>
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                        <X className="w-4 h-4" />
                        <span>Username is already taken</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Display Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Display Name
                </label>
                <input
                  type="text"
                  value={bioData.displayName}
                  onChange={(e) => setBioData({ ...bioData, displayName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="Your Name"
                />
              </div>

              {/* Bio */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  value={bioData.bio}
                  onChange={(e) => setBioData({ ...bioData, bio: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all"
                  rows={4}
                  placeholder="Tell people about yourself..."
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  {bioData.bio.length}/200
                </p>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={bioData.avatar}
                  onChange={(e) => setBioData({ ...bioData, avatar: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <span>🎨</span> Theme
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setBioData({ ...bioData, theme: theme.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      bioData.theme === theme.id
                        ? 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-200 dark:ring-blue-900/50 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-full h-16 rounded-lg ${theme.preview} shadow-inner`}></div>
                    <p className="text-xs font-medium mt-2 text-center text-gray-700 dark:text-gray-300">
                      {theme.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <span>🌐</span> Social Links
              </h2>
              
              <div className="space-y-3 mb-4">
                {socialPlatforms.map((platform) => {
                  const existing = bioData.socialLinks.find(s => s.platform === platform.id);
                  
                  return (
                    <div key={platform.id} className="flex items-center gap-3">
                      <button
                        onClick={() => existing ? removeSocialLink(platform.id) : addSocialLink(platform)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                          existing
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {platform.icon}
                      </button>
                      
                      {existing ? (
                        <input
                          type="url"
                          value={existing.url}
                          onChange={(e) => updateSocialLink(platform.id, e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder={platform.placeholder}
                        />
                      ) : (
                        <span className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                          Add {platform.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🔗</span> Custom Links
                </h2>
                <button 
                  onClick={addCustomLink} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Link</span>
                </button>
              </div>

              <div className="space-y-4">
                {bioData.customLinks.length === 0 ? (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                    <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                      No links yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Add your first custom link!
                    </p>
                  </div>
                ) : (
                  bioData.customLinks.map((link, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-5 h-5" />
                        </button>
                        
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={link.icon || ''}
                            onChange={(e) => updateCustomLink(index, 'icon', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl"
                            placeholder="🔗"
                            maxLength={2}
                          />
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Link Title"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://example.com"
                          />
                        </div>
                        
                        <button
                          onClick={() => removeCustomLink(index)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || usernameAvailable === false || !bioData.username}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Bio Page</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </h2>
                <button
                  onClick={handlePreview}
                  disabled={!bioData.username}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div
                className={`rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 min-h-[500px] ${
                  themes.find((t) => t.id === bioData.theme)?.preview || 'bg-white'
                } shadow-inner`}
              >
                <div className="p-8 text-center">
                  {/* Avatar Preview */}
                  {bioData.avatar ? (
                    <img
                      src={bioData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/20 shadow-xl"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96?text=Avatar';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 backdrop-blur-xl flex items-center justify-center text-3xl border-4 border-white/30">
                      👤
                    </div>
                  )}

                  {/* Name & Username */}
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      ['dark', 'neon', 'gradient', 'ocean', 'sunset', 'forest'].includes(bioData.theme)
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}
                  >
                    {bioData.displayName || 'Your Name'}
                  </h3>
                  
                  {bioData.username && (
                    <p
                      className={`text-sm mb-4 font-medium ${
                        ['dark', 'neon', 'gradient', 'ocean', 'sunset', 'forest'].includes(bioData.theme)
                          ? 'text-white/60'
                          : 'text-gray-600'
                      }`}
                    >
                      @{bioData.username}
                    </p>
                  )}

                  {/* Bio Preview */}
                  {bioData.bio && (
                    <p
                      className={`text-sm mb-6 max-w-md mx-auto leading-relaxed ${
                        ['dark', 'neon', 'gradient', 'ocean', 'sunset', 'forest'].includes(bioData.theme)
                          ? 'text-white/70'
                          : 'text-gray-700'
                      }`}
                    >
                      {bioData.bio}
                    </p>
                  )}

                  {/* Links Preview */}
                  <div className="space-y-3 max-w-md mx-auto mt-8">
                    {bioData.customLinks.length === 0 ? (
                      <p
                        className={`text-sm py-6 ${
                          ['dark', 'neon', 'gradient', 'ocean', 'sunset', 'forest'].includes(bioData.theme)
                            ? 'text-white/40'
                            : 'text-gray-500'
                        }`}
                      >
                        Your links will appear here
                      </p>
                    ) : (
                      bioData.customLinks.map((link, index) => (
                        <div
                          key={index}
                          className={`px-6 py-4 rounded-xl font-medium transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 ${
                            ['dark', 'neon'].includes(bioData.theme)
                              ? 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/20'
                              : ['gradient', 'ocean', 'sunset', 'forest'].includes(bioData.theme)
                              ? 'bg-white/20 text-white backdrop-blur hover:bg-white/30 border border-white/30'
                              : 'bg-white/80 backdrop-blur text-gray-900 hover:bg-white shadow-md border border-gray-200/50'
                          }`}
                        >
                          {link.icon && <span className="text-lg">{link.icon}</span>}
                          <span className="text-sm">{link.title || 'Link Title'}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


