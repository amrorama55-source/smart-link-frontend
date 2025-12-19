import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Plus, Trash2, GripVertical, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  useEffect(() => {
    loadBioSettings();
  }, []);

  const loadBioSettings = async () => {
    try {
      const { data } = await api.get('/api/bio/settings');
      setBioData(data.bioPage);
    } catch (error) {
      console.error('Error loading bio settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setCheckingUsername(true);
    try {
      const { data } = await api.get(`/api/bio/check-username/${username}`);
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSave = async () => {
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
        { 
          title: '', 
          url: '', 
          icon: '', 
          order: bioData.customLinks.length, 
          isActive: true 
        }
      ]
    });
  };

  const removeCustomLink = (index) => {
    const updated = bioData.customLinks.filter((_, i) => i !== index);
    setBioData({ ...bioData, customLinks: updated });
  };

  const updateCustomLink = (index, field, value) => {
    const updated = [...bioData.customLinks];
    updated[index][field] = value;
    setBioData({ ...bioData, customLinks: updated });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Link in Bio Editor</h1>
            <p className="text-gray-600 mt-2">Create your personal bio page</p>
          </div>
          {bioData.username && (
            <a
              href={`${API_URL}/api/bio/${bioData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bioData.username || ''}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase();
                        setBioData({ ...bioData, username: val });
                        checkUsername(val);
                      }}
                      className="input-field"
                      placeholder="yourusername"
                    />
                    {checkingUsername && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        Checking...
                      </span>
                    )}
                    {usernameAvailable === true && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                        ✓ Available
                      </span>
                    )}
                    {usernameAvailable === false && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600">
                        ✗ Taken
                      </span>
                    )}
                  </div>
                  {bioData.username && (
                    <p className="text-xs text-gray-500 mt-1">
                      Your page: smartlink.com/@{bioData.username}
                    </p>
                  )}
                </div>

                {/* Display Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={bioData.displayName || ''}
                    onChange={(e) => setBioData({ ...bioData, displayName: e.target.value })}
                    className="input-field"
                    placeholder="Your Name"
                  />
                </div>

                {/* Bio Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bioData.bio || ''}
                    onChange={(e) => setBioData({ ...bioData, bio: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Avatar Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={bioData.avatar || ''}
                    onChange={(e) => setBioData({ ...bioData, avatar: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Theme Selection Card */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Theme</h2>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setBioData({ ...bioData, theme: theme.id })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      bioData.theme === theme.id
                        ? 'border-blue-600 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-16 rounded ${theme.preview} mb-2`}></div>
                    <p className="text-sm font-medium text-gray-700">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Links Card */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Links</h2>
                <button 
                  onClick={addCustomLink} 
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-3">
                {bioData.customLinks.map((link, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded"
                      placeholder="Link Title"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded"
                      placeholder="https://..."
                    />
                    <button
                      onClick={() => removeCustomLink(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Remove link"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {bioData.customLinks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No links yet. Click "Add Link" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !bioData.username || usernameAvailable === false}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              <div className={`rounded-lg overflow-hidden border ${
                bioData.theme === 'dark' ? 'bg-gray-900' :
                bioData.theme === 'gradient' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                bioData.theme === 'minimal' ? 'bg-gray-50' :
                bioData.theme === 'neon' ? 'bg-black' :
                'bg-white'
              }`}>
                <div className="p-8 text-center">
                  {/* Avatar Preview */}
                  {bioData.avatar && (
                    <img
                      src={bioData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
                    />
                  )}
                  
                  {/* Display Name Preview */}
                  <h3 className={`text-2xl font-bold mb-2 ${
                    ['dark', 'neon', 'gradient'].includes(bioData.theme) 
                      ? 'text-white' 
                      : 'text-gray-900'
                  }`}>
                    {bioData.displayName || 'Your Name'}
                  </h3>
                  
                  {/* Bio Preview */}
                  {bioData.bio && (
                    <p className={`text-sm mb-6 ${
                      ['dark', 'neon', 'gradient'].includes(bioData.theme) 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                    }`}>
                      {bioData.bio}
                    </p>
                  )}
                  
                  {/* Links Preview */}
                  <div className="space-y-3">
                    {bioData.customLinks.map((link, index) => (
                      <div
                        key={index}
                        className={`px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105 cursor-pointer ${
                          ['dark', 'neon'].includes(bioData.theme)
                            ? 'bg-white text-gray-900'
                            : bioData.theme === 'gradient'
                            ? 'bg-white/20 text-white backdrop-blur'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {link.title || 'Link Title'}
                      </div>
                    ))}
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