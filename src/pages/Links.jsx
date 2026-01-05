// src/pages/Links.jsx
import { useState, useEffect } from 'react';
import { getLinks, createLink, deleteLink } from '../services/api';
import { SHORT_URL_BASE } from '../config';
import Navbar from '../components/Navbar';
import QRCode from 'qrcode';
import {
  Link2,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  QrCode,
  CheckCircle,
  X,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Links() {
  // State Management
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLink, setNewLink] = useState({
    originalUrl: '',
    title: '',
    customAlias: '',
    abTest: {
      enabled: false,
      splitMethod: 'weighted',
      variants: []
    }
  });
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Effects
  useEffect(() => {
    loadLinks();
  }, []);

  // API Handlers
  const loadLinks = async () => {
    try {
      const data = await getLinks();
      setLinks(data.links);
    } catch (error) {
      console.error('Failed to load links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const linkData = {
        originalUrl: newLink.originalUrl,
        title: newLink.title,
        customAlias: newLink.customAlias
      };

      if (newLink.abTest.enabled && newLink.abTest.variants.length >= 2) {
        linkData.abTest = {
          enabled: true,
          splitMethod: newLink.abTest.splitMethod,
          variants: newLink.abTest.variants.filter(v => v.url && v.name)
        };
      }

      await createLink(linkData);
      setShowCreateModal(false);
      setNewLink({
        originalUrl: '',
        title: '',
        customAlias: '',
        abTest: {
          enabled: false,
          splitMethod: 'weighted',
          variants: []
        }
      });
      setShowAdvanced(false);
      loadLinks();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create link');
    }
  };

  const handleDelete = async (shortCode) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteLink(shortCode);
      loadLinks();
    } catch {
      alert('Failed to delete link');
    }
  };

  // A/B Testing Handlers
  const addVariant = () => {
    setNewLink({
      ...newLink,
      abTest: {
        ...newLink.abTest,
        variants: [
          ...newLink.abTest.variants,
          { url: '', name: `Variant ${newLink.abTest.variants.length + 1}`, weight: 50 }
        ]
      }
    });
  };

  const removeVariant = (index) => {
    setNewLink({
      ...newLink,
      abTest: {
        ...newLink.abTest,
        variants: newLink.abTest.variants.filter((_, i) => i !== index)
      }
    });
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...newLink.abTest.variants];
    updatedVariants[index][field] = value;
    setNewLink({
      ...newLink,
      abTest: {
        ...newLink.abTest,
        variants: updatedVariants
      }
    });
  };

  // Utility Functions
  const copyToClipboard = (text, code) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const showQRCode = async (shortCode) => {
    try {
      const url = `${SHORT_URL_BASE}/${shortCode}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2
      });
      setSelectedQR({ shortCode, url, qrDataUrl });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const closeQRModal = () => setSelectedQR(null);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Manage your short links
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Create and manage all your links
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Create Link
          </button>
        </div>

        {/* Links List */}
        {links.length > 0 ? (
          <div className="grid gap-4 sm:gap-6">
            {links.map((link) => (
              <div
                key={link.shortCode}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  {/* Link Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {link.title || 'Untitled Link'}
                      </h3>
                      {link.abTest?.enabled && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          A/B Test
                        </span>
                      )}
                    </div>

                    {/* Original URL */}
                    <div className="mb-3 text-sm">
                      <span className="text-gray-500 dark:text-gray-400 mr-1">Original:</span>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {link.originalUrl}
                      </a>
                    </div>

                    {/* A/B Test Variants Display */}
                    {link.abTest?.enabled && link.abTest.variants?.length > 0 && (
                      <div className="mb-3 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-lg border border-purple-200 dark:border-purple-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
                            <span className="text-white text-xs">🎯</span>
                          </div>
                          <p className="text-xs font-bold text-purple-700 dark:text-purple-400">
                            A/B Testing Active
                          </p>
                          <span className="ml-auto text-xs text-purple-600 dark:text-purple-400 font-medium">
                            {link.abTest.variants.length} variants
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          {link.abTest.variants.map((variant, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs bg-white dark:bg-gray-800/50 px-2.5 py-1.5 rounded-md">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                              <span className="font-semibold text-gray-900 dark:text-white min-w-[60px]">
                                {variant.name}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 truncate flex-1 text-[11px]">
                                {variant.url}
                              </span>
                              <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded font-bold text-[10px] flex-shrink-0">
                                {variant.weight}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Short URL */}
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <a
                        href={`${SHORT_URL_BASE}/${link.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1 break-all flex-1 min-w-0 text-sm sm:text-base"
                      >
                        {SHORT_URL_BASE}/{link.shortCode}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${SHORT_URL_BASE}/${link.shortCode}`,
                            link.shortCode
                          )
                        }
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Copy link"
                      >
                        {copiedCode === link.shortCode ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{link.totalClicks}</span>
                        <span>clicks</span>
                      </div>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 justify-end">
                    <button
                      onClick={() => showQRCode(link.shortCode)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-700 dark:text-gray-300"
                      aria-label="Show QR code"
                      title="Show QR Code"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Delete link"
                      title="Delete Link"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center py-12 px-4">
            <Link2 className="w-12 h-12 sm:w-14 sm:h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">No links yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors min-h-[44px]"
            >
              Create Link
            </button>
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Create Short Link</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Original URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/your-long-url"
                  value={newLink.originalUrl}
                  onChange={(e) =>
                    setNewLink({ ...newLink, originalUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="My awesome link"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  className="w-full px-4 py-2 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Custom Alias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Alias (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm flex-shrink-0 whitespace-nowrap">{SHORT_URL_BASE}/</span>
                  <input
                    type="text"
                    placeholder="my-link"
                    value={newLink.customAlias}
                    onChange={(e) =>
                      setNewLink({ ...newLink, customAlias: e.target.value })
                    }
                    className="flex-1 px-4 py-2 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  3-20 characters, letters, numbers, and hyphens only
                </p>
              </div>

              {/* Advanced Options Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Advanced: A/B Testing</span>
                </div>
                {showAdvanced ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* A/B Testing Section */}
              {showAdvanced && (
                <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-4 bg-purple-50/30 dark:bg-purple-900/10">
                  {/* Enable Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 dark:text-purple-400 text-lg">🎯</span>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white block">
                          Enable A/B Testing
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Test multiple URLs
                        </p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() =>
                        setNewLink({
                          ...newLink,
                          abTest: {
                            ...newLink.abTest,
                            enabled: !newLink.abTest.enabled,
                            variants: !newLink.abTest.enabled ? [
                              { name: 'Variant A', url: '', weight: 50 },
                              { name: 'Variant B', url: '', weight: 50 }
                            ] : []
                          }
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex-shrink-0 ${
                        newLink.abTest.enabled
                          ? 'bg-purple-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          newLink.abTest.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {newLink.abTest.enabled && (
                    <>
                      {/* Split Method */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Split Method
                        </label>
                        <select
                          value={newLink.abTest.splitMethod}
                          onChange={(e) =>
                            setNewLink({
                              ...newLink,
                              abTest: {
                                ...newLink.abTest,
                                splitMethod: e.target.value
                              }
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="weighted">Weighted (by percentage)</option>
                          <option value="random">Random (50/50)</option>
                        </select>
                      </div>

                      {/* Variants */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Variants (min. 2)
                          </label>
                          <button
                            type="button"
                            onClick={addVariant}
                            className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors flex items-center gap-1"
                          >
                            <span>+</span> Add Variant
                          </button>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {newLink.abTest.variants.map((variant, index) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <input
                                  type="text"
                                  value={variant.name}
                                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                                  placeholder="Variant name"
                                />
                                {newLink.abTest.variants.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="ml-2 p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              <input
                                type="url"
                                value={variant.url}
                                onChange={(e) => updateVariant(index, 'url', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                                placeholder="https://example.com"
                              />

                              {newLink.abTest.splitMethod === 'weighted' && (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={variant.weight}
                                    onChange={(e) =>
                                      updateVariant(index, 'weight', parseInt(e.target.value) || 0)
                                    }
                                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  />
                                  <span className="text-xs text-gray-600 dark:text-gray-400">% weight</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {newLink.abTest.variants.length < 2 && (
                          <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              <span>⚠️</span>
                              You need at least 2 variants to enable A/B testing
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors min-h-[44px]"
                >
                  Create Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={closeQRModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-4 sm:p-6 text-center relative max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">QR Code</h2>
              <button
                onClick={closeQRModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close QR code modal"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <img
              src={selectedQR.qrDataUrl}
              alt="QR Code"
              className="mx-auto mb-4 w-48 h-48 sm:w-64 sm:h-64"
            />

            <p className="text-xs sm:text-sm mb-4 break-all text-gray-700 dark:text-gray-300 px-2">
              {selectedQR.url}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => copyToClipboard(selectedQR.url, selectedQR.shortCode)}
                className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors min-h-[44px]"
              >
                Copy Link
              </button>
              <a
                href={selectedQR.qrDataUrl}
                download={`qr-${selectedQR.shortCode}.png`}
                className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center min-h-[44px]"
              >
                Download QR
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
