import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Eye, Save, Check, X, Loader } from 'lucide-react';

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
  { id: 'default', name: 'Default', preview: 'bg-white' },
  { id: 'dark', name: 'Dark', preview: 'bg-gray-900' },
  { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'minimal', name: 'Minimal', preview: 'bg-gray-50' },
  { id: 'neon', name: 'Neon', preview: 'bg-black' }
];

export default function BioEditor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      alert('Bio page saved successfully!');
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
        { title: '', url: '', icon: '🔗', order: bioData.customLinks.length, isActive: true }
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

  const handlePreview = () => {
    if (!bioData.username) {
      alert('Please set a username first');
      return;
    }
    
    // فتح في تاب جديد بدلاً من التنقل
    window.open(`/@${bioData.username}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Link in Bio Editor</h1>
            <p className="text-gray-600 mt-2">Create your personal bio page</p>
          </div>

          <button
            onClick={handlePreview}
            disabled={!bioData.username}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Username * <span className="text-gray-400 text-xs">(letters, numbers, underscore only)</span>
                </label>
                <input
                  type="text"
                  value={bioData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className="input-field"
                  placeholder="yourusername"
                />
                {bioData.username && (
                  <div className="flex items-center gap-2 mt-2">
                    {checkingUsername && (
                      <>
                        <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                        <p className="text-sm text-gray-400">Checking username...</p>
                      </>
                    )}
                    {!checkingUsername && usernameAvailable === true && (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-600">Username is available</p>
                      </>
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                      <>
                        <X className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-red-600">Username is already taken</p>
                      </>
                    )}
                  </div>
                )}
                {bioData.username && (
                  <p className="mt-1 text-xs text-gray-500">
                    Your page will be: {window.location.origin}/@{bioData.username}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={bioData.displayName}
                  onChange={(e) => setBioData({ ...bioData, displayName: e.target.value })}
                  className="input-field"
                  placeholder="Your Name"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={bioData.bio}
                  onChange={(e) => setBioData({ ...bioData, bio: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Tell people about yourself..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={bioData.avatar}
                  onChange={(e) => setBioData({ ...bioData, avatar: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setBioData({ ...bioData, theme: theme.id })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        bioData.theme === theme.id
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-8 rounded ${theme.preview}`}></div>
                      <p className="text-xs mt-2 text-center">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Links */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Custom Links</h2>
                <button onClick={addCustomLink} className="btn-secondary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-3">
                {bioData.customLinks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No links yet. Add your first link!</p>
                ) : (
                  bioData.customLinks.map((link, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                            className="input-field"
                            placeholder="Link Title"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                            className="input-field"
                            placeholder="https://example.com"
                          />
                          <input
                            type="text"
                            value={link.icon || ''}
                            onChange={(e) => updateCustomLink(index, 'icon', e.target.value)}
                            className="input-field"
                            placeholder="Emoji icon (optional) 🔗"
                            maxLength={2}
                          />
                        </div>
                        <button
                          onClick={() => removeCustomLink(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
              className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              <div
                className={`rounded-lg overflow-hidden border-2 min-h-[500px] ${
                  themes.find((t) => t.id === bioData.theme)?.preview || 'bg-white'
                }`}
              >
                <div className="p-8 text-center">
                  {bioData.avatar ? (
                    <img
                      src={bioData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/20 shadow-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96?text=Avatar';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-3xl">
                      👤
                    </div>
                  )}
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      ['dark', 'neon', 'gradient'].includes(bioData.theme)
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}
                  >
                    {bioData.displayName || 'Your Name'}
                  </h3>
                  {bioData.bio && (
                    <p
                      className={`text-sm mb-6 max-w-md mx-auto ${
                        ['dark', 'neon', 'gradient'].includes(bioData.theme)
                          ? 'text-gray-300'
                          : 'text-gray-600'
                      }`}
                    >
                      {bioData.bio}
                    </p>
                  )}
                  <div className="space-y-3 max-w-md mx-auto mt-8">
                    {bioData.customLinks.length === 0 ? (
                      <p
                        className={`text-sm ${
                          ['dark', 'neon', 'gradient'].includes(bioData.theme)
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                      >
                        Your links will appear here
                      </p>
                    ) : (
                      bioData.customLinks.map((link, index) => (
                        <div
                          key={index}
                          className={`px-6 py-4 rounded-lg font-medium transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2 ${
                            ['dark', 'neon'].includes(bioData.theme)
                              ? 'bg-white text-gray-900 hover:bg-gray-100'
                              : bioData.theme === 'gradient'
                              ? 'bg-white/20 text-white backdrop-blur hover:bg-white/30'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {link.icon && <span className="text-lg">{link.icon}</span>}
                          <span>{link.title || 'Link Title'}</span>
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


