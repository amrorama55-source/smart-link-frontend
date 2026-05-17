import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Reorder, AnimatePresence } from 'framer-motion';
import { themes as themeData } from '../utils/bioThemes';
import { useAuth } from '../context/AuthContext';
import { Trash2, Eye, Save, Check, X, Loader, GripVertical, Copy, Upload, User, List, Palette, Share2, Lock, Crown, AlertTriangle, ExternalLink, Sparkles, Zap, Link2, Mail, Type, FlaskConical } from 'lucide-react';
import BioPagePreview from './BioPagePreview';
import { useToast } from '../context/ToastProvider';

const themes = Object.values(themeData);

export default function BioEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [stripeStatus, setStripeStatus] = useState({ status: 'not_started' });
  const [stripeLoading, setStripeLoading] = useState(false);
  const [showOnboardingHints, setShowOnboardingHints] = useState(false);
  const [testCheckoutLoading, setTestCheckoutLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, warning, error: showError, info } = useToast();
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  const [bioData, setBioData] = useState({
    username: '', displayName: '', bio: '', avatar: '',
    theme: 'default', socialLinks: [], customLinks: [], blocks: [], aiChatbot: { enabled: false }, isPublic: true
  });

  const userPlan = user?.plan || 'free';
  const isBusiness = userPlan === 'business' || (userPlan === 'trial' && new Date(user?.trialEndsAt) > new Date()) || user?.role === 'admin';
  const premiumThemeList = ['glass', 'sunset', 'sea', 'forest', 'cyber', 'luxury', 'rose', 'nordic', 'aurora', 'lavender', 'neon'];

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [originalUsername, setOriginalUsername] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    loadBioSettings();
    loadStripeStatus();

    const hintsDismissed = localStorage.getItem('bio_editor_onboarding_dismissed') === 'true';
    if (!hintsDismissed) {
      setShowOnboardingHints(true);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stripe_return') === 'true' || params.get('stripe_refresh') === 'true') {
      (async () => {
        const status = await loadStripeStatus();
        if (status === 'active') {
          success('Stripe connected successfully. You can sell now.');
        } else if (status === 'pending_verification') {
          warning('Stripe connected, but verification is still pending.');
        } else {
          info('Stripe onboarding started. Complete setup to receive payouts.');
        }
      })();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [success, warning, info]);

  const loadBioSettings = async () => {
    try {
      const { data } = await api.get('/bio/settings');
      const fetchedUsername = data.bioPage.username || '';
      setBioData({
        username: fetchedUsername,
        displayName: data.bioPage.displayName || '',
        bio: data.bioPage.bio || '',
        avatar: data.bioPage.avatar || '',
        theme: data.bioPage.theme || 'default',
        socialLinks: data.bioPage.socialLinks || [],
        customLinks: (data.bioPage.customLinks || []).map(link => ({
          ...link, id: link._id || Math.random().toString(36).substr(2, 9)
        })),
        blocks: (data.bioPage.blocks || []).map(block => ({
          ...block, id: block._id || Math.random().toString(36).substr(2, 9)
        })),
        aiChatbot: data.bioPage.aiChatbot || { enabled: false },
        isPublic: data.bioPage.isPublic !== undefined ? data.bioPage.isPublic : true
      });
      setOriginalUsername(fetchedUsername);
      if (fetchedUsername) setUsernameAvailable(true);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadStripeStatus = async () => {
    try {
      const { data } = await api.get('/payments/onboarding/status');
      setStripeStatus(data);
      return data?.status;
    } catch (error) {
      console.error('Stripe status load failed:', error);
      return null;
    }
  };

  const handleStripeConnect = async () => {
    setStripeLoading(true);
    try {
      const { data } = await api.post('/payments/onboarding');
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      showError('Unable to open Stripe right now. Please try again.');
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to start Stripe onboarding');
      setStripeLoading(false);
    }
  };

  const handleDismissHints = () => {
    localStorage.setItem('bio_editor_onboarding_dismissed', 'true');
    setShowOnboardingHints(false);
  };

  const handleTestCheckout = async () => {
    const usernameToUse = (originalUsername || bioData.username || '').trim();
    if (!usernameToUse) {
      warning('Save your username first before testing checkout.');
      return;
    }

    const testablePaywall = bioData.blocks.find((block) =>
      block.type === 'paywall' && (block._id || block.id)
    );
    const blockId = testablePaywall?._id || testablePaywall?.id;

    if (!blockId) {
      info('Add and save at least one Paywall block to test checkout.');
      return;
    }

    if (stripeStatus?.status !== 'active') {
      warning('Connect and verify Stripe first to run a test checkout.');
      return;
    }

    setTestCheckoutLoading(true);
    try {
      const returnUrl = `${window.location.origin}/u/${usernameToUse}`;
      const { data } = await api.post(`/payments/checkout/${usernameToUse}/${blockId}`, { returnUrl });
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      showError('Failed to start test checkout.');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to start test checkout.');
    } finally {
      setTestCheckoutLoading(false);
    }
  };

  const compressImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > 500) { h = h * 500 / w; w = 500; }
        if (h > 500) { w = w * 500 / h; h = 500; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image too large (Max 5MB)'); return; }
    try {
      const compressed = await compressImage(file);
      setBioData(prev => ({ ...prev, avatar: compressed }));
    } catch { alert("Failed to process image"); }
  };

  const checkUsername = async (username) => {
    if (!username || username.length < 3) { setUsernameAvailable(null); setCheckingUsername(false); return; }
    if (username === originalUsername) { setUsernameAvailable(true); setCheckingUsername(false); return; }
    try {
      const { data } = await api.get(`/bio/check-username/${username}`);
      setUsernameAvailable(data.available);
    } catch (e) { console.error(e); }
    finally { setCheckingUsername(false); }
  };

  const handleUsernameChange = (value) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setBioData({ ...bioData, username: clean });
    setCheckingUsername(true); setUsernameAvailable(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => checkUsername(clean), 500);
  };

  const handleSave = async () => {
    if (!bioData.username || bioData.username.length < 3) return alert('Username too short');
    if (usernameAvailable === false) return alert('Username taken');
    if (!localStorage.getItem('token')) return alert('Session expired. Please log in again.');
    setSaving(true);
    try {
      await api.put('/bio/settings', {
        ...bioData,
        customLinks: bioData.customLinks.map((link, i) => ({
          title: link.title || '', url: link.url || '', icon: link.icon || '🔗',
          order: i, isActive: link.isActive !== undefined ? link.isActive : true
        })),
        blocks: bioData.blocks.map((block, i) => ({
          type: block.type || 'link',
          title: block.title || '',
          url: block.url || '',
          content: block.content || '',
          icon: block.icon || '',
          order: i,
          isActive: block.isActive !== undefined ? block.isActive : true,
          settings: block.settings || {}
        }))
      });
      setOriginalUsername(bioData.username);
      alert('Profile updated! 🚀');
    } catch (error) {
      const err = error.response?.data;
      alert(`Save failed (${error.response?.status}): ${err?.message || err?.error || error.message}`);
    } finally { setSaving(false); }
  };

  const handleCopyLink = () => {
    if (!bioData.username) return alert('Please set a username first!');
    navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/u/${bioData.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [generating, setGenerating] = useState(false);

  const handleAIGenerate = async () => {
    const prompt = window.prompt("What is your professional role or goal? (e.g. 'Freelance Photographer', 'Crypto Influencer', 'Fitness Coach')");
    if (!prompt) return;

    setGenerating(true);
    try {
      const { data } = await api.post('/ai/generate-page', { prompt });
      if (data.success) {
        const gen = data.data;
        setBioData(prev => ({
          ...prev,
          displayName: gen.displayName || prev.displayName,
          bio: gen.bio || prev.bio,
          theme: gen.theme || prev.theme,
          blocks: gen.blocks.map((b, i) => ({
            ...b,
            id: Math.random().toString(36).substr(2, 9),
            order: i,
            isActive: true
          }))
        }));
        alert('AI has magic-crafted your page! ✨ Review and save your changes.');
      }
    } catch (err) {
      alert('AI Generation failed: ' + (err.response?.data?.message || err.response?.data?.error || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleShareLink = async () => {
    if (!bioData.username) return alert('Please set a username first!');
    const url = `${window.location.protocol}//${window.location.host}/u/${bioData.username}`;
    if (navigator.share) {
      try { await navigator.share({ title: bioData.displayName || 'My Smart Link', text: bioData.bio || '', url }); }
      catch (e) { console.error(e); }
    } else { navigator.clipboard.writeText(url); alert('Copied! 📋'); }
  };

  const addBlock = (type = 'link') => {
    if (type === 'paywall' && stripeStatus?.status !== 'active') {
      const shouldConnect = window.confirm('Connect Stripe first to enable paywall sales. Connect now?');
      if (shouldConnect) handleStripeConnect();
      return;
    }

    const newBlock = {
      type,
      title: type === 'newsletter' ? 'Join my Newsletter' : '',
      url: '',
      content: type === 'newsletter' ? 'Stay updated with my latest news.' : '',
      icon: type === 'newsletter' ? '📧' : type === 'paywall' ? '🔐' : type === 'header' ? '' : '🔗',
      order: bioData.blocks.length,
      isActive: true,
      settings: type === 'paywall' ? { price: '5.00', currency: 'USD' } : {},
      id: Math.random().toString(36).substr(2, 9)
    };
    setBioData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const removeBlock = (i) => setBioData(prev => ({ ...prev, blocks: prev.blocks.filter((_, idx) => idx !== i) }));

  const updateBlock = (i, field, value) => {
    const updated = [...bioData.blocks];
    updated[i] = { ...updated[i], [field]: value };
    setBioData(prev => ({ ...prev, blocks: updated }));
  };

  const updateBlockSettings = (i, setting, value) => {
    const updated = [...bioData.blocks];
    updated[i] = { ...updated[i], settings: { ...(updated[i].settings || {}), [setting]: value } };
    setBioData(prev => ({ ...prev, blocks: updated }));
  };

  const addSocialLink = () => {
    setBioData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'instagram', url: '' }]
    }));
  };

  const updateSocialLink = (i, field, value) => {
    const updated = [...bioData.socialLinks];
    updated[i] = { ...updated[i], [field]: value };
    setBioData({ ...bioData, socialLinks: updated });
  };

  const removeSocialLink = (i) => {
    setBioData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, idx) => idx !== i) }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950"><Navbar />
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Just a sec...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pb-24 lg:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Profile Editor</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Customize your bio page and manage your links</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all">
            {saving ? <Loader className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>

        {showOnboardingHints && (
          <div className="mb-6 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-gray-800 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-32 h-32 text-blue-600" />
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Monetization Quick Start</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Follow these steps to start selling on your bio page</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-black">01</span>
                      <p className="text-sm font-extrabold text-gray-800 dark:text-gray-200">Connect Stripe</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Go to the <span className="font-bold text-gray-700 dark:text-gray-300">Bio Blocks</span> section below and link your bank account securely.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-black">02</span>
                      <p className="text-sm font-extrabold text-gray-800 dark:text-gray-200">Add Paywall</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Add a "Paywall" block. Set your price and paste the secret link users will buy access to.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-black">03</span>
                      <p className="text-sm font-extrabold text-gray-800 dark:text-gray-200">Receive Payouts</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Save your changes. Money from sales is sent <span className="font-bold text-emerald-600">directly to your bank account</span>.</p>
                  </div>
                </div>
              </div>
              <button onClick={handleDismissHints} className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold transition-all text-sm shadow-sm border border-gray-200 dark:border-gray-600">
                Dismiss Guide
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">

            {/* Mobile Tabs */}
            <div className="lg:hidden flex bg-white dark:bg-gray-800/80 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 sticky top-20 z-30">
              {[{ id: 'identity', label: 'Identity', icon: User }, { id: 'links', label: 'Links', icon: List }, { id: 'appearance', label: 'Theme', icon: Palette }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <tab.icon className="w-4 h-4" />{tab.label}
                </button>
              ))}
            </div>

            {/* IDENTITY */}
            <div className={`${activeTab === 'identity' ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Identity
                </h2>
                <button
                  onClick={handleAIGenerate}
                  disabled={generating}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  {generating ? <Loader className="w-3 h-3 animate-spin" /> : '✨ Magic AI Builder'}
                </button>
              </div>

              {/* YOUR SMART LINK */}
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-blue-800 dark:text-blue-300">
                  🚀 Your Smart Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-blue-200 dark:border-blue-800 text-gray-600 dark:text-gray-300 text-sm font-medium font-mono truncate select-all">
                    {window.location.host}/u/{bioData.username || 'username'}
                  </div>

                  {/* Copy */}
                  <button onClick={handleCopyLink}
                    className={`p-2.5 rounded-lg shadow-sm transition-all active:scale-95 flex-shrink-0 ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    title="Copy Link">
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>

                  {/* Share */}
                  <button onClick={handleShareLink}
                    className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm transition-all active:scale-95 flex-shrink-0"
                    title="Share Link">
                    <Share2 className="w-5 h-5" />
                  </button>

                  {/* ✅ Preview — Eye مائلة -20deg للشمال */}
                  {bioData.username && (
                    <button
                      onClick={() => {
                        if (!originalUsername) {
                          alert('⚠️ Please click "Save Changes" first to create your public page!');
                          return;
                        }
                        if (bioData.username !== originalUsername) {
                          alert('⚠️ You changed your username. Please save your changes first to view the new link!');
                          return;
                        }
                        window.open(`/u/${originalUsername}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="p-2.5 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg shadow-sm transition-all active:scale-95 flex-shrink-0 flex items-center gap-1"
                      title="Preview Live Page">
                      <Eye className="w-4 h-4" style={{ transform: 'rotate(-20deg)' }} />
                      <span className="text-sm font-bold">Preview</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}>
                      {bioData.avatar ? <img src={bioData.avatar} className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-gray-400" />}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Upload Image
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Display Name</label>
                    <input type="text" value={bioData.displayName} onChange={e => setBioData({ ...bioData, displayName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                      <input type="text" value={bioData.username} onChange={e => handleUsernameChange(e.target.value)}
                        className="w-full pl-7 p-2.5 rounded-xl border border-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="username" />
                    </div>
                    {bioData.username && (
                      <p className={`text-xs mt-1 font-bold ${checkingUsername ? 'text-blue-500' : usernameAvailable === true ? 'text-green-600 dark:text-green-400' : usernameAvailable === false ? 'text-red-600 dark:text-red-400' : 'hidden'}`}>
                        {checkingUsername ? <span className="flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Checking...</span>
                          : usernameAvailable === true ? '✓ Available' : '✗ Taken'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea value={bioData.bio} onChange={e => setBioData({ ...bioData, bio: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={3} placeholder="Tell the world about yourself..." />
                </div>

                {/* SOCIAL LINKS (Top Icons) */}
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-gray-900 dark:text-white">Social Icons (Top Banner)</label>
                    <button onClick={addSocialLink} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-bold transition-colors">+ Add Social</button>
                  </div>
                  <div className="space-y-3">
                    {bioData.socialLinks.map((link, i) => (
                      <div key={i} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-800/50 p-2 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <select value={link.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} className="w-1/3 p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500">
                          <option value="instagram">Instagram</option>
                          <option value="twitter">X / Twitter</option>
                          <option value="tiktok">TikTok</option>
                          <option value="snapchat">Snapchat</option>
                          <option value="youtube">YouTube</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="email">Email</option>
                          <option value="website">Website</option>
                        </select>
                        <input value={link.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} className="w-full text-sm p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
                        <button onClick={() => removeSocialLink(i)} className="p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {bioData.socialLinks.length === 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">No social icons added yet. Click "+ Add Social" to link your X/Twitter, Instagram, etc.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCKS (Monetization & Links) */}
            <div className={`${activeTab === 'links' ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <div className={`mb-5 p-4 rounded-xl border ${
                stripeStatus?.status === 'active'
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
                  : 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/30'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Creator Payout System</p>
                    {stripeStatus?.status === 'active' ? (
                      <p className="text-xs mt-1 text-green-700 dark:text-green-400 font-medium leading-relaxed">
                        ✅ Your Stripe account is active. Sales revenue will be deposited directly to your bank account.
                      </p>
                    ) : stripeStatus?.status === 'pending_verification' ? (
                      <p className="text-xs mt-1 text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium leading-relaxed">
                        <AlertTriangle className="w-3 h-3" />
                        Verification in progress. You can still set up your shop while Stripe verifies your details.
                      </p>
                    ) : (
                      <p className="text-xs mt-1 text-purple-700 dark:text-purple-400 font-medium leading-relaxed">
                        We use <span className="font-bold">Stripe</span> for secure, direct payouts. Connect your account to start selling digital products.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleStripeConnect}
                    disabled={stripeLoading}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                      stripeStatus?.status === 'active'
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100'
                        : 'bg-[#635BFF] hover:bg-[#4B45D6] text-white'
                    }`}
                  >
                    {stripeLoading ? <Loader className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                    {stripeStatus?.status === 'active' ? 'Open Stripe' : 'Connect Stripe'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                  <List className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Bio Blocks
                </h2>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => addBlock('link')} className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-xs">
                    <Link2 className="w-4 h-4" /> Link
                  </button>
                  <button onClick={() => addBlock('newsletter')} className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold border border-green-100 dark:border-green-800/50 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all text-xs">
                    <Mail className="w-4 h-4" /> Newsletter
                  </button>
                  <button onClick={() => addBlock('paywall')} className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl font-bold border border-purple-100 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all text-xs">
                    <Lock className="w-4 h-4" /> Paywall
                  </button>
                  <button onClick={() => addBlock('header')} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-xs">
                    <Type className="w-4 h-4" /> Header
                  </button>
                  <button
                    onClick={handleTestCheckout}
                    disabled={testCheckoutLoading}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl font-bold border border-amber-100 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all text-xs"
                  >
                    {testCheckoutLoading ? <Loader className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
                    Test Checkout
                  </button>
                </div>
              </div>

              <Reorder.Group axis="y" values={bioData.blocks} onReorder={(newOrder) => setBioData({ ...bioData, blocks: newOrder })} className="space-y-4">
                {bioData.blocks.map((block, i) => (
                  <Reorder.Item key={block.id} value={block}>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 flex items-start gap-3 hover:border-blue-500 transition-all group">
                      <div className="mt-2 text-gray-400 cursor-grab active:cursor-grabbing"><GripVertical className="w-5 h-5" /></div>

                      <div className="flex-1 space-y-3">
                        {/* Header & Icon */}
                        <div className="flex gap-2">
                          {block.type !== 'header' && (
                            <input value={block.icon} onChange={e => updateBlock(i, 'icon', e.target.value)}
                              className="w-12 text-center p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-xl focus:ring-2 focus:ring-blue-500" placeholder="🔗" />
                          )}
                          <input value={block.title} onChange={e => updateBlock(i, 'title', e.target.value)}
                            className={`flex-1 p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 ${block.type === 'header' ? 'text-lg' : 'text-sm'}`}
                            placeholder={block.type === 'header' ? 'Section Header' : 'Block Title'} />
                          <div className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="text-[9px] font-black uppercase opacity-40">{block.type}</span>
                          </div>
                        </div>

                        {/* Block-Specific Fields */}
                        {block.type === 'link' || block.type === 'paywall' ? (
                          <input value={block.url} onChange={e => updateBlock(i, 'url', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500" placeholder="https://" />
                        ) : null}

                        {block.type === 'newsletter' ? (
                          <textarea value={block.content} onChange={e => updateBlock(i, 'content', e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                            rows={2} placeholder="Newsletter description..." />
                        ) : null}

                        {block.type === 'paywall' ? (
                          <div className="flex flex-col gap-3 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">Stripe Digital Product</span>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-1/2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Price</label>
                                <input type="number" min="0" step="0.5" value={block.settings?.price || ''} onChange={e => updateBlockSettings(i, 'price', e.target.value)}
                                  className="w-full p-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 dark:text-white text-xs font-mono focus:ring-2 focus:ring-purple-500"
                                  placeholder="5.00" />
                              </div>
                              <div className="w-1/2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Currency</label>
                                <select value={block.settings?.currency || 'USD'} onChange={e => updateBlockSettings(i, 'currency', e.target.value)}
                                  className="w-full p-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 dark:text-white text-xs font-mono focus:ring-2 focus:ring-purple-500">
                                  <option value="USD">USD ($)</option>
                                  <option value="EUR">EUR (€)</option>
                                  <option value="GBP">GBP (£)</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Secret Content / Link</label>
                              <input type="text" value={block.settings?.secretContent || ''} onChange={e => updateBlockSettings(i, 'secretContent', e.target.value)}
                                className="w-full p-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 dark:text-white text-xs font-mono focus:ring-2 focus:ring-purple-500"
                                placeholder="https://..." />
                              <p className="text-[9px] text-gray-500 italic mt-1">
                                💡 Tip: This will only be revealed AFTER successful payment.
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => updateBlock(i, 'isActive', !block.isActive)}
                          className={`p-2 rounded-lg transition-colors ${block.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-50'}`}>
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => removeBlock(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}

                {bioData.blocks.length === 0 && bioData.customLinks.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    <p className="text-sm text-gray-500">No blocks yet. Use the buttons above to add your first block! 🚀</p>
                  </div>
                )}

                {/* Legacy Links Support (Hidden but existing) */}
                {bioData.customLinks.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Legacy Links ({bioData.customLinks.length})</p>
                    <div className="space-y-2 opacity-60 grayscale-[0.5]">
                      {bioData.customLinks.map((link, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-xs">
                          <span>{link.icon}</span>
                          <span className="font-bold">{link.title}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => {
                      // Migrate legacy links to blocks
                      const migrated = bioData.customLinks.map((l, idx) => ({
                        type: 'link', title: l.title, url: l.url, icon: l.icon, order: bioData.blocks.length + idx, isActive: l.isActive, id: Math.random().toString(36).substr(2, 9)
                      }));
                      setBioData(prev => ({ ...prev, blocks: [...prev.blocks, ...migrated], customLinks: [] }));
                    }} className="mt-3 text-[10px] text-blue-600 font-bold hover:underline">Migrate all to new system</button>
                  </div>
                )}
              </Reorder.Group>
            </div>
            {/* APPEARANCE */}
            <div className={`${activeTab === 'appearance' ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <h2 className="font-bold mb-4 text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Appearance
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {themes.map(t => {
                  const isLocked = premiumThemeList.includes(t.id) && !isBusiness;
                  return (
                    <button key={t.id}
                      onClick={() => {
                        if (isLocked) {
                          if (window.confirm('This premium theme is exclusive to Business Elite members. Would you like to view our pricing plans and upgrade?')) {
                            navigate('/pricing');
                          }
                          return;
                        }
                        setBioData({ ...bioData, theme: t.id });
                      }}
                      className={`group relative p-1 rounded-xl border-2 transition-all ${bioData.theme === t.id ? 'border-blue-600 dark:border-blue-400 scale-105 shadow-lg' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'} ${isLocked ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                      <div className="h-12 rounded-lg shadow-inner border border-black/5 flex items-center justify-center overflow-hidden"
                        style={{ background: t.variables['--bio-bg'] }}>
                        {isLocked && <Lock className="w-4 h-4 text-white drop-shadow-md z-10" />}
                        <div className="w-1/2 h-4 rounded-sm" style={{ backgroundColor: t.variables['--bio-card-bg'], border: `1px solid ${t.variables['--bio-card-border']}` }}></div>
                      </div>
                      <p className="text-xs text-center mt-1.5 font-bold text-gray-600 dark:text-gray-400 truncate px-1 flex items-center justify-center gap-1">
                        {t.name}
                        {isLocked && <Crown className="w-3 h-3 text-amber-500" />}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PREVIEW (Desktop) */}
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
                <button onClick={() => setShowMobilePreview(false)} className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-900 p-4 flex items-center justify-center">
                <div className="w-full max-w-[380px] h-[80vh] bg-white rounded-[2.5rem] overflow-y-auto no-scrollbar relative border-8 border-gray-800 shadow-2xl">
                  <BioPagePreview previewData={bioData} />
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* MOBILE BOTTOM BAR */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-40">
          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={() => setShowMobilePreview(true)}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2">
              {/* ✅ Eye مائلة -20deg */}
              <Eye className="w-5 h-5" style={{ transform: 'rotate(-20deg)' }} />
              Preview
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
              {saving ? <Loader className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}