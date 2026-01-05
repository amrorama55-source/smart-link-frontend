// src/pages/Links.jsx
import { useState, useEffect } from 'react';
import { getLinks, createLink, updateLink, deleteLink } from '../services/api';
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
  ChevronUp,
  Edit3
} from 'lucide-react';

export default function Links() {
  // State Management
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [linkData, setLinkData] = useState({
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

  const openCreateModal = () => {
    setEditingLink(null);
    setLinkData({
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
    setShowModal(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setLinkData({
      originalUrl: link.originalUrl,
      title: link.title || '',
      customAlias: '',
      abTest: link.abTest?.enabled ? {
        enabled: true,
        splitMethod: link.abTest.splitMethod || 'weighted',
        variants: link.abTest.variants || []
      } : {
        enabled: false,
        splitMethod: 'weighted',
        variants: []
      }
    });
    setShowAdvanced(link.abTest?.enabled || false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: linkData.title,
      };

      if (!editingLink) {
        payload.originalUrl = linkData.originalUrl;
        payload.customAlias = linkData.customAlias;
      }

      if (linkData.abTest.enabled && linkData.abTest.variants.length >= 2) {
        payload.abTest = {
          enabled: true,
          splitMethod: linkData.abTest.splitMethod,
          variants: linkData.abTest.variants.filter(v => v.url && v.name)
        };
      } else if (editingLink) {
        payload.abTest = {
          enabled: false,
          variants: []
        };
      }

      if (editingLink) {
        await updateLink(editingLink.shortCode, payload);
      } else {
        await createLink(payload);
      }

      setShowModal(false);
      setEditingLink(null);
      loadLinks();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save link');
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
    setLinkData({
      ...linkData,
      abTest: {
        ...linkData.abTest,
        variants: [
          ...linkData.abTest.variants,
          { 
            url: '', 
            name: `Variant ${String.fromCharCode(65 + linkData.abTest.variants.length)}`, 
            weight: 50 
          }
        ]
      }
    });
  };

  const removeVariant = (index) => {
    setLinkData({
      ...linkData,
      abTest: {
        ...linkData.abTest,
        variants: linkData.abTest.variants.filter((_, i) => i !== index)
      }
    });
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...linkData.abTest.variants];
    updatedVariants[index][field] = value;
    setLinkData({
      ...linkData,
      abTest: {
        ...linkData.abTest,
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
              Your Links
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Create and manage all your short links
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
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
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
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

                    {/* A/B Test Variants */}
                    {link.abTest?.enabled && link.abTest.variants?.length > 0 && (
                      <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                            {link.abTest.variants.length} Variants
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {link.abTest.variants.map((variant, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs bg-white dark:bg-gray-800/50 px-2.5 py-1.5 rounded">
                              <span className="font-semibold text-gray-900 dark:text-white min-w-[70px]">
                                {variant.name}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                                {variant.url}
                              </span>
                              <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded font-bold">
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
                        onClick={() => copyToClipboard(`${SHORT_URL_BASE}/${link.shortCode}`, link.shortCode)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition flex-shrink-0"
                      >
                        {copiedCode === link.shortCode ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{link.totalClicks} clicks</span>
                      <span>•</span>
                      <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => openEditModal(link)}
                      className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded transition"
                      title="Edit"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => showQRCode(link.shortCode)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition text-gray-700 dark:text-gray-300"
                      title="QR Code"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition"
                      title="Delete"
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
            <Link2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No links yet</p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Link
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {editingLink ? 'Edit Link' : 'Create New Link'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editingLink ? 'Update your link details' : 'Shorten and customize your URL'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Original URL - Only for create */}
              {!editingLink && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Link2 className="w-4 h-4" />
                    Original URL
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/your-long-url"
                    value={linkData.originalUrl}
                    onChange={(e) =>
                      setLinkData({ ...linkData, originalUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <Edit3 className="w-4 h-4" />
                  Title
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Link"
                  value={linkData.title}
                  onChange={(e) =>
                    setLinkData({ ...linkData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
              </div>

              {/* Custom Alias */}
              {!editingLink && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Link2 className="w-4 h-4" />
                    Custom Alias
                    <span className="text-xs font-normal text-gray-500">(Optional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-l-xl border-2 border-r-0 border-gray-300 dark:border-gray-600 text-sm font-medium">
                      {SHORT_URL_BASE}/
                    </span>
                    <input
                      type="text"
                      placeholder="my-link"
                      value={linkData.customAlias}
                      onChange={(e) =>
                        setLinkData({ ...linkData, customAlias: e.target.value })
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* A/B Testing Section Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-200 border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-gray-900 dark:text-white block">
                      A/B Testing
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Test multiple variants to optimize performance
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {linkData.abTest.enabled && (
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                      Active
                    </span>
                  )}
                  {showAdvanced ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
              </button>

              {/* A/B Testing Content */}
              {showAdvanced && (
                <div className="border-2 border-purple-200 dark:border-purple-800 rounded-xl p-5 space-y-5 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 shadow-inner">
                  {/* Enable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-white block">
                          Enable A/B Testing
                        </label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Split traffic between variants
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLinkData({
                          ...linkData,
                          abTest: {
                            ...linkData.abTest,
                            enabled: !linkData.abTest.enabled,
                            variants: !linkData.abTest.enabled
                              ? [
                                  { name: 'Variant A', url: '', weight: 50 },
                                  { name: 'Variant B', url: '', weight: 50 }
                                ]
                              : []
                          }
                        })
                      }
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-md ${
                        linkData.abTest.enabled
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                          linkData.abTest.enabled
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {linkData.abTest.enabled && (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            Variants
                          </span>
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">
                            Min. 2
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={addVariant}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Plus className="w-4 h-4" />
                          Add Variant
                        </button>
                      </div>

                      <div className="space-y-3">
                        {linkData.abTest.variants.map((variant, index) => (
                          <div
                            key={index}
                            className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) =>
                                  updateVariant(index, 'name', e.target.value)
                                }
                                placeholder="Variant Name"
                                className="text-sm font-bold bg-transparent border-b-2 border-purple-300 dark:border-purple-700 focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none text-gray-900 dark:text-white px-2 py-1 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remove variant"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <input
                              type="url"
                              value={variant.url}
                              onChange={(e) =>
                                updateVariant(index, 'url', e.target.value)
                              }
                              placeholder="https://example.com/variant"
                              className="w-full px-4 py-2.5 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-3 transition-all"
                            />
                            
                            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                              <label className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                                Weight:
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={variant.weight}
                                onChange={(e) =>
                                  updateVariant(index, 'weight', parseInt(e.target.value) || 0)
                                }
                                className="w-20 px-3 py-2 text-sm font-bold border-2 border-purple-300 dark:border-purple-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center transition-all"
                              />
                              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">%</span>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 ml-2">
                                <div
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${variant.weight}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  {editingLink ? '✓ Update Link' : '+ Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                QR Code
              </h3>
              <button
                onClick={() => setSelectedQR(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4">
              <img
                src={selectedQR.qrDataUrl}
                alt="QR Code"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 break-all">
              {selectedQR.url}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}