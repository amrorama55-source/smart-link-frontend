import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Reorder, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Eye, Save, Check, X, Loader,
  Link2, GripVertical, ExternalLink, Copy, CheckCircle, Image, Upload
} from 'lucide-react';
import BioPagePreview from './BioPagePreview';

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
  { id: 'default', name: 'Gravatar Light', preview: 'bg-[#f3f4f6]' },
  { id: 'dark', name: 'Dark Mode', preview: 'bg-[#1e1e1e]' },
  { id: 'blue', name: 'Soft Blue', preview: 'bg-blue-50' },
  { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' },
  { id: 'midnight', name: 'Midnight', preview: 'bg-slate-900' },
];

export default function BioEditor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false); // Moved up

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
        customLinks: (data.bioPage.customLinks || []).map(link => ({
          ...link,
          id: link._id || Math.random().toString(36).substr(2, 9)
        })),
        isPublic: data.bioPage.isPublic !== undefined ? data.bioPage.isPublic : true
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      alert('Image too large (Max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBioData(prev => ({ ...prev, avatar: reader.result })); // Save Base64
    };
    reader.readAsDataURL(file);
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
      console.error(error);
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
    debounceRef.current = setTimeout(() => { checkUsername(cleanValue); }, 500);
  };

  const handleSave = async () => {
    if (!bioData.username || bioData.username.length < 3) return alert('Username too short');
    if (usernameAvailable === false) return alert('Username taken');

    setSaving(true);
    try {
      const dataToSave = {
        ...bioData,
        customLinks: bioData.customLinks.map((link, index) => ({ ...link, order: index }))
      };
      await api.put('/api/bio/settings', dataToSave);
      alert('Profile updated! 🚀');
    } catch (error) {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addCustomLink = () => {
    setBioData({
      ...bioData,
      customLinks: [
        ...bioData.customLinks,
        { title: '', url: '', icon: '🔗', order: bioData.customLinks.length, isActive: true, id: Math.random().toString(36).substr(2, 9) }
      ]
    });
  };

  const removeCustomLink = (index) => {
    setBioData({ ...bioData, customLinks: bioData.customLinks.filter((_, i) => i !== index) });
  };

  const updateCustomLink = (index, field, value) => {
    const updated = [...bioData.customLinks];
    updated[index] = { ...updated[index], [field]: value };
    setBioData({ ...bioData, customLinks: updated });
  };

  const handleReorder = (newOrder) => {
    setBioData({ ...bioData, customLinks: newOrder });
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Editor</h1>

          <div className="flex gap-3">
            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowMobilePreview(true)}
              className="lg:hidden px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all">
              {saving ? <Loader className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* EDITOR COLUMN */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="font-bold mb-4 text-gray-900 dark:text-white text-lg">Identity</h2>
              <div className="space-y-5">

                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {bioData.avatar ? (
                        <img src={bioData.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">Change</div>
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Upload Image
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Max size 5MB. JPG, PNG, GIF.</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Display Name</label>
                    <input type="text" value={bioData.displayName} onChange={e => setBioData({ ...bioData, displayName: e.target.value })} className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                      <input type="text" value={bioData.username} onChange={e => handleUsernameChange(e.target.value)} className="w-full pl-7 p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="username" />
                    </div>
                    {bioData.username && (
                      <p className={`text-[10px] mt-1 font-bold ${usernameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                        {usernameAvailable ? '✓ Available' : '✗ Taken'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Bio</label>
                  <textarea value={bioData.bio} onChange={e => setBioData({ ...bioData, bio: e.target.value })} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Tell the world about yourself..." />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Verified Links</h2>
                <button onClick={addCustomLink} className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200 transition-colors">+ Add New</button>
              </div>
              <Reorder.Group axis="y" values={bioData.customLinks} onReorder={handleReorder} className="space-y-3">
                {bioData.customLinks.map((link, i) => (
                  <Reorder.Item key={link.id} value={link}>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 flex items-start gap-3 group hover:border-blue-300 transition-colors">
                      <div className="mt-2 text-gray-400 cursor-grab active:cursor-grabbing"><GripVertical className="w-5 h-5" /></div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input value={link.icon} onChange={e => updateCustomLink(i, 'icon', e.target.value)} className="w-12 text-center p-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-xl" placeholder="🔗" />
                          <input value={link.title} onChange={e => updateCustomLink(i, 'title', e.target.value)} className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white font-medium" placeholder="Link Title" />
                        </div>
                        <input value={link.url} onChange={e => updateCustomLink(i, 'url', e.target.value)} className="w-full p-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-sm" placeholder="https://" />
                      </div>
                      <button onClick={() => removeCustomLink(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="font-bold mb-4 text-gray-900 dark:text-white text-lg">Appearance</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {themes.map(t => (
                  <button key={t.id} onClick={() => setBioData({ ...bioData, theme: t.id })} className={`group relative p-1 rounded-xl border-2 transition-all ${bioData.theme === t.id ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-200'}`}>
                    <div className={`h-12 rounded-lg ${t.preview} shadow-sm group-hover:shadow-md transition-shadow`}></div>
                    <p className="text-[10px] text-center mt-1.5 font-medium dark:text-gray-400">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PREVIEW COLUMN (Desktop) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-8">
              <div className="bg-[#121212] rounded-[3.5rem] p-3 border-[10px] border-[#2a2a2a] shadow-2xl relative overflow-hidden max-w-[380px] mx-auto ring-1 ring-black">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#2a2a2a] rounded-b-2xl z-20"></div>
                <div className="h-[780px] w-full bg-white rounded-[2.5rem] overflow-y-auto no-scrollbar relative">
                  <BioPagePreview previewData={bioData} />
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm font-medium">Live Pixel-Perfect Preview</p>
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE PREVIEW MODAL */}
        <AnimatePresence>
          {showMobilePreview && (
            <div className="fixed inset-0 z-50 lg:hidden bg-black/90 backdrop-blur-sm flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
                <h3 className="text-white font-bold">Live Preview</h3>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto bg-gray-900 p-4 flex items-center justify-center">
                <div className="w-full max-w-[380px] h-[90vh] bg-white rounded-[2.5rem] overflow-y-auto no-scrollbar relative border-8 border-gray-800 shadow-2xl">
                  <BioPagePreview previewData={bioData} />
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}