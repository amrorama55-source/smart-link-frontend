import { useState, useEffect } from 'react';
import { createLink, getLinks, deleteLink } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Link2, Copy, Trash2, ExternalLink, QrCode, Edit } from 'lucide-react';

export default function Links() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    tags: ''
  });
  const [creating, setCreating] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    loadLinks();
  }, []);

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

  const handleCreateLink = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const linkData = {
        originalUrl: formData.originalUrl,
        title: formData.title,
        customAlias: formData.customAlias || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      await createLink(linkData);
      
      setFormData({ originalUrl: '', customAlias: '', title: '', tags: '' });
      setShowCreateForm(false);
      loadLinks();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create link');
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleDelete = async (shortCode) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await deleteLink(shortCode);
      loadLinks();
    } catch (error) {
      alert('Failed to delete link');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Links</h1>
            <p className="text-gray-600 mt-2">Manage your short links</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Link</span>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL *
                </label>
                <input
                  type="url"
                  value={formData.originalUrl}
                  onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/very/long/url"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="My awesome link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Alias (optional)
                </label>
                <input
                  type="text"
                  value={formData.customAlias}
                  onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
                  className="input-field"
                  placeholder="my-custom-link"
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-20 characters, letters, numbers and hyphens only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-field"
                  placeholder="marketing, social, campaign"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma separated
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Links List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading links...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="card text-center py-12">
            <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-600 mb-6">Create your first short link to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create First Link
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {link.title || 'Untitled Link'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 break-all">{link.originalUrl}</p>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-mono bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                        {link.shortUrl}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{link.totalClicks} clicks</span>
                    </div>

                    {link.tags && link.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {link.tags.map((tag, idx) => (
                          <span
                            key={`${link.id}-tag-${idx}`}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(link.shortUrl)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      <Copy className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setSelectedQR(link)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Show QR Code"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>

                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Open link"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>

                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              QR Code
            </h3>
            <div className="flex justify-center mb-4">
              {selectedQR.qrCode ? (
                <img src={selectedQR.qrCode} alt="QR Code" className="w-64 h-64" />
              ) : (
                <p className="text-gray-500">QR Code not available</p>
              )}
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">
              {selectedQR.title || selectedQR.shortUrl}
            </p>
            <button
              onClick={() => setSelectedQR(null)}
              className="w-full btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}