import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Reorder, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Eye, Save, Check, X, Loader,
  Link2, GripVertical, ExternalLink, Copy, CheckCircle, Image, Upload,
  User, List, Palette, Layout
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

import { themes as themeData } from '../utils/bioThemes';

const themes = Object.values(themeData);

export default function BioEditor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mobile Tabs: 'identity' | 'links' | 'appearance'
  const [activeTab, setActiveTab] = useState('identity');

  const fileInputRef = useRef(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large (max 500px)
          const MAX_SIZE = 500;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG 0.7
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      alert('Image too large (Max 5MB)');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      setBioData(prev => ({ ...prev, avatar: compressedBase64 }));
    } catch (error) {
      console.error("Image compression failed", error);
      alert("Failed to process image");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Just a sec...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pb-24 lg:pb-0">
      <Navbar />

      {/* HEADER (Desktop Only) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
              Profile Editor
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Customize your bio page and manage your links
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            {saving ? <Loader className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* EDITOR COLUMN */}
          <div className="space-y-6">

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden flex bg-white dark:bg-gray-800/80 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 sticky top-20 z-30">
              {[
                { id: 'identity', label: 'Identity', icon: User },
                { id: 'links', label: 'Links', icon: List },
                { id: 'appearance', label: 'Theme', icon: Palette }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* IDENTITY SECTION */}
            <div className={`${activeTab === 'identity' ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <h2 className="font-bold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Identity
              </h2>
              <div className="space-y-5">
                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {bioData.avatar ? (
                        <img src={bioData.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Upload Image
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    </div>
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Display Name</label>
                    <input
                      type="text"
                      value={bioData.displayName}
                      onChange={e => setBioData({ ...bioData, displayName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                      <input
                        type="text"
                        value={bioData.username}
                        onChange={e => handleUsernameChange(e.target.value)}
                        className="w-full pl-7 p-2.5 rounded-xl border border-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="username"
                      />
                    </div>
                    {bioData.username && (
                      <p className={`text-xs mt-1 font-bold ${usernameAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {usernameAvailable ? '✓ Available' : '✗ Taken'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea
                    value={bioData.bio}
                    onChange={e => setBioData({ ...bioData, bio: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Tell the world about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* LINKS SECTION */}
            <div className={`${activeTab === 'links' ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                  <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Links
                </h2>
                <button
                  onClick={addCustomLink}
                  className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                  + Add New
                </button>
              </div>
              <Reorder.Group axis="y" values={bioData.customLinks} onReorder={handleReorder} className="space-y-3">
                {bioData.customLinks.map((link, i) => (
                  <Reorder.Item key={link.id} value={link}>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 flex items-start gap-3 group hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <div className="mt-2 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            value={link.icon}
                            onChange={e => updateCustomLink(i, 'icon', e.target.value)}
                            className="w-12 text-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="🔗"
                          />
                          <input
                            value={link.title}
                            onChange={e => updateCustomLink(i, 'title', e.target.value)}
                            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Link Title"
                          />
                        </div>
                        <input
                          value={link.url}
                          onChange={e => updateCustomLink(i, 'url', e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://"
                        />
                      </div>
                      <button
                        onClick={() => removeCustomLink(i)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            {/* APPEARANCE SECTION */}
            <div className={`${activeTab === 'appearance' ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <h2 className="font-bold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Appearance
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setBioData({ ...bioData, theme: t.id })}
                    className={`group relative p-1 rounded-xl border-2 transition-all ${bioData.theme === t.id ? 'border-blue-600 dark:border-blue-400 scale-105 shadow-lg' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                  >
                    <div
                      className={`h-12 rounded-lg shadow-inner border border-black/5 dark:border-white/10 group-hover:shadow-md transition-shadow flex items-center justify-center overflow-hidden`}
                      style={{
                        background: t.variables['--bio-bg'],
                      }}
                    >
                      {/* Sub-preview for Card */}
                      <div
                        className="w-1/2 h-4 rounded-sm shadow-sm"
                        style={{ backgroundColor: t.variables['--bio-card-bg'], border: `1px solid ${t.variables['--bio-card-border']}` }}
                      ></div>
                    </div>
                    <p className="text-xs text-center mt-1.5 font-bold text-gray-600 dark:text-gray-400 truncate px-1">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PREVIEW COLUMN (Desktop) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-24">
              <div className="bg-[#121212] rounded-[3.5rem] p-3 border-[10px] border-[#2a2a2a] shadow-2xl relative overflow-hidden max-w-[380px] mx-auto ring-1 ring-black">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#2a2a2a] rounded-b-2xl z-20"></div>
                <div className="h-[780px] w-full bg-white rounded-[2.5rem] overflow-y-auto no-scrollbar relative">
                  <BioPagePreview previewData={bioData} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE PREVIEW MODAL */}
        <AnimatePresence>
          {showMobilePreview && (
            <div className="fixed inset-0 z-50 lg:hidden bg-black/90 backdrop-blur-sm flex flex-col">
              <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
                <h3 className="text-white font-bold">Live Preview</h3>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-900 p-4 flex items-center justify-center">
                <div className="w-full max-w-[380px] h-[80vh] bg-white rounded-[2.5rem] overflow-y-auto no-scrollbar relative border-8 border-gray-800 shadow-2xl">
                  <BioPagePreview previewData={bioData} />
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* MOBILE FIXED BOTTOM BAR */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-40 safe-bottom">
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={() => setShowMobilePreview(true)}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold font-medium flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {saving ? <Loader className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}