import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Plus, Trash2, GripVertical, Eye } from 'lucide-react';

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

  const debounceRef = useRef(null); // ✅ debounce ref

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

  // ✅ فحص اليوزرنيم (API)
  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
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

  // ✅ debounce wrapper
  const handleUsernameChange = (value) => {
    setBioData({ ...bioData, username: value });

    setUsernameAvailable(null);
    setCheckingUsername(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkUsername(value);
    }, 500);
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
        { title: '', url: '', icon: '', order: bioData.customLinks.length, isActive: true }
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Link in Bio Editor</h1>
            <p className="text-gray-600 mt-2">Create your personal bio page</p>
          </div>

          {bioData.username && (
            <a
              href={`${API_URL}/api/bio/${bioData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username *
                </label>

                <input
                  type="text"
                  value={bioData.username}
                  onChange={(e) =>
                    handleUsernameChange(e.target.value.toLowerCase())
                  }
                  className="input-field"
                  placeholder="yourusername"
                />

                {/* ✅ الحالة تحت الحقل */}
                {bioData.username && (
                  <p
                    className={`mt-1 text-sm ${
                      checkingUsername
                        ? 'text-gray-400'
                        : usernameAvailable === true
                        ? 'text-green-600'
                        : usernameAvailable === false
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {checkingUsername && 'Checking username...'}
                    {usernameAvailable === true && 'Username is available ✓'}
                    {usernameAvailable === false && 'Username is already taken ✗'}
                  </p>
                )}
              </div>

              {/* Display Name */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={bioData.displayName}
                  onChange={(e) =>
                    setBioData({ ...bioData, displayName: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              {/* Bio */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={bioData.bio}
                  onChange={(e) =>
                    setBioData({ ...bioData, bio: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                />
              </div>

              {/* Avatar */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={bioData.avatar}
                  onChange={(e) =>
                    setBioData({ ...bioData, avatar: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving || usernameAvailable === false}
              className="w-full btn-primary disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Preview (كما هو بدون تغيير) */}
          {/* 👈 نفس كود المعاينة تبعك، لم نلمسه */}
        </div>
      </div>
    </div>
  );
}

