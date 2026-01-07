import { useState, useEffect } from 'react';
import { getLinks, createLink, updateLink, deleteLink } from '../services/api';
import { SHORT_URL_BASE } from '../config';
import { validateUrl, validateCustomAlias, sanitizeInput } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import ConversionTracking from '../components/ConversionTracking';
import CustomDomain from '../components/CustomDomain'; 
import LoadingButton from '../components/LoadingButton';
import QRCode from 'qrcode';
import {
  Link2, Plus, Trash2, Copy, ExternalLink, QrCode, CheckCircle, X,
  Edit3, TrendingUp, Target, Globe2, Calendar, Shield, Zap
} from 'lucide-react';

// Import components
import LinkModal from '../components/LinkModal';
import QRCodeModal from '../components/QRCodeModal';
import LinkCard from '../components/LinkCard';

export default function EnhancedLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();
  
  const [linkData, setLinkData] = useState({
    originalUrl: '',
    title: '',
    customAlias: '',
    description: '',
    tags: [],
    expiresAt: '',
    password: '',
    
    // A/B Testing
    abTest: {
      enabled: false,
      splitMethod: 'weighted',
      variants: [],
      autoOptimize: {
        enabled: false,
        minSampleSize: 100
      }
    },
    
    // Geotargeting
    geoRules: [],
    
    // Device Targeting
    deviceRules: {
      mobile: '',
      desktop: '',
      tablet: ''
    },
    
    // Scheduling
    schedule: {
      enabled: false,
      startDate: '',
      endDate: '',
      redirectAfterExpiry: ''
    },
    
    // Pixels
    pixels: []
  });

  const [errors, setErrors] = useState({});
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const data = await getLinks();
      setLinks(data.links);
    } catch (error) {
      console.error('Failed to load links:', error);
      addToast('Failed to load links', 'error');
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
      description: '',
      tags: [],
      expiresAt: '',
      password: '',
      abTest: {
        enabled: false,
        splitMethod: 'weighted',
        variants: [],
        autoOptimize: { enabled: false, minSampleSize: 100 }
      },
      geoRules: [],
      deviceRules: { mobile: '', desktop: '', tablet: '' },
      schedule: { enabled: false, startDate: '', endDate: '', redirectAfterExpiry: '' },
      pixels: []
    });
    setErrors({});
    setActiveTab('basic');
    setShowAdvancedFeatures(false);
    setShowModal(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setLinkData({
      originalUrl: link.originalUrl,
      title: link.title || '',
      customAlias: '',
      description: link.description || '',
      tags: link.tags || [],
      expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : '',
      password: '',
      abTest: link.abTest?.enabled ? {
        enabled: true,
        splitMethod: link.abTest.splitMethod || 'weighted',
        variants: link.abTest.variants || [],
        autoOptimize: link.abTest.autoOptimize || { enabled: false, minSampleSize: 100 }
      } : {
        enabled: false,
        splitMethod: 'weighted',
        variants: [],
        autoOptimize: { enabled: false, minSampleSize: 100 }
      },
      geoRules: link.geoRules || [],
      deviceRules: link.deviceRules || { mobile: '', desktop: '', tablet: '' },
      schedule: link.schedule || { enabled: false, startDate: '', endDate: '', redirectAfterExpiry: '' },
      pixels: link.pixels || []
    });
    setErrors({});
    setActiveTab('basic');
    setShowAdvancedFeatures(
      link.abTest?.enabled || 
      link.geoRules?.length > 0 || 
      link.deviceRules?.mobile || 
      link.schedule?.enabled ||
      link.pixels?.length > 0
    );
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!editingLink) {
      if (!linkData.originalUrl) {
        newErrors.originalUrl = 'URL is required';
      } else if (!validateUrl(linkData.originalUrl)) {
        newErrors.originalUrl = 'Please enter a valid HTTP/HTTPS URL';
      }

      if (linkData.customAlias) {
        const aliasValidation = validateCustomAlias(linkData.customAlias);
        if (!aliasValidation.isValid) {
          newErrors.customAlias = aliasValidation.error;
        }
      }
    }

    // A/B Testing validation
    if (linkData.abTest.enabled) {
      if (linkData.abTest.variants.length < 2) {
        newErrors.abTest = 'A/B testing requires at least 2 variants';
      } else {
        const invalidVariants = linkData.abTest.variants.filter(v => !v.url || !v.name);
        if (invalidVariants.length > 0) {
          newErrors.abTest = 'All variants must have a name and URL';
        }

        if (linkData.abTest.splitMethod === 'weighted') {
          const totalWeight = linkData.abTest.variants.reduce((sum, v) => sum + (Number(v.weight) || 0), 0);
          if (Math.abs(totalWeight - 100) > 0.1) {
            newErrors.abTest = 'Variant weights must sum to 100%';
          }
        }
      }
    }

    // Geotargeting validation
    if (linkData.geoRules.length > 0) {
      const invalidRules = linkData.geoRules.filter(r => !r.targetUrl || r.countries.length === 0);
      if (invalidRules.length > 0) {
        newErrors.geoRules = 'All geo rules must have countries and target URL';
      }
    }

    // Schedule validation
    if (linkData.schedule.enabled) {
      if (!linkData.schedule.startDate || !linkData.schedule.endDate) {
        newErrors.schedule = 'Start and end dates are required';
      } else if (new Date(linkData.schedule.startDate) >= new Date(linkData.schedule.endDate)) {
        newErrors.schedule = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please fix validation errors', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: sanitizeInput(linkData.title, 200),
        description: sanitizeInput(linkData.description, 1000),
        tags: linkData.tags,
        expiresAt: linkData.expiresAt || null,
      };

      if (!editingLink) {
        payload.originalUrl = linkData.originalUrl;
        payload.customAlias = linkData.customAlias;
      }

      if (linkData.password) {
        payload.password = linkData.password;
      }

      if (linkData.abTest.enabled && linkData.abTest.variants.length >= 2) {
        payload.abTest = {
          enabled: true,
          splitMethod: linkData.abTest.splitMethod,
          variants: linkData.abTest.variants.filter(v => v.url && v.name),
          autoOptimize: linkData.abTest.autoOptimize
        };
      } else if (editingLink) {
        payload.abTest = { enabled: false, variants: [] };
      }

      if (linkData.geoRules.length > 0) {
        payload.geoRules = linkData.geoRules.filter(r => r.countries.length > 0 && r.targetUrl);
      }

      if (linkData.deviceRules.mobile || linkData.deviceRules.desktop || linkData.deviceRules.tablet) {
        payload.deviceRules = linkData.deviceRules;
      }

      if (linkData.schedule.enabled) {
        payload.schedule = linkData.schedule;
      }

      if (linkData.pixels.length > 0) {
        payload.pixels = linkData.pixels.filter(p => p.platform && p.pixelId);
      }

      if (editingLink) {
        await updateLink(editingLink.shortCode, payload);
        addToast('Link updated successfully!', 'success');
      } else {
        await createLink(payload);
        addToast('Link created successfully!', 'success');
      }

      setShowModal(false);
      setEditingLink(null);
      loadLinks();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save link';
      addToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (shortCode) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      await deleteLink(shortCode);
      addToast('Link deleted successfully', 'success');
      loadLinks();
    } catch (error) {
      addToast('Failed to delete link', 'error');
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
            weight: Math.floor(100 / (linkData.abTest.variants.length + 1))
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

  // Geotargeting Handlers
  const addGeoRule = () => {
    setLinkData({
      ...linkData,
      geoRules: [
        ...linkData.geoRules,
        { countries: [], targetUrl: '', priority: 0 }
      ]
    });
  };

  const removeGeoRule = (index) => {
    setLinkData({
      ...linkData,
      geoRules: linkData.geoRules.filter((_, i) => i !== index)
    });
  };

  const updateGeoRule = (index, field, value) => {
    const updatedRules = [...linkData.geoRules];
    updatedRules[index][field] = value;
    setLinkData({
      ...linkData,
      geoRules: updatedRules
    });
  };

  // Pixels Handlers
  const addPixel = () => {
    setLinkData({
      ...linkData,
      pixels: [
        ...linkData.pixels,
        { platform: 'facebook', pixelId: '', event: 'PageView' }
      ]
    });
  };

  const removePixel = (index) => {
    setLinkData({
      ...linkData,
      pixels: linkData.pixels.filter((_, i) => i !== index)
    });
  };

  const updatePixel = (index, field, value) => {
    const updatedPixels = [...linkData.pixels];
    updatedPixels[index][field] = value;
    setLinkData({
      ...linkData,
      pixels: updatedPixels
    });
  };

  // Utility Functions
  const copyToClipboard = (text, code) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    addToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const showQRCode = async (shortCode) => {
    try {
      const url = `${SHORT_URL_BASE}/${shortCode}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      });
      setSelectedQR({ shortCode, url, qrDataUrl });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      addToast('Failed to generate QR code', 'error');
    }
  };

  const downloadQRCode = () => {
    if (!selectedQR) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${selectedQR.shortCode}.png`;
    link.href = selectedQR.qrDataUrl;
    link.click();
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your links...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Your Links
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage all your smart links
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Smart Link
            </button>
          </div>
        </div>

        {/* Links List */}
        {links.length > 0 ? (
          <div className="grid gap-6">
            {links.map((link) => (
              <LinkCard
                key={link.shortCode}
                link={link}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onShowQR={showQRCode}
                onCopy={copyToClipboard}
                copiedCode={copiedCode}
                onReload={loadLinks}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No links yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Create your first smart link with A/B testing, geotargeting, and advanced analytics
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Smart Link
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <LinkModal
          show={showModal}
          onClose={() => setShowModal(false)}
          linkData={linkData}
          setLinkData={setLinkData}
          editingLink={editingLink}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showAdvancedFeatures={showAdvancedFeatures}
          setShowAdvancedFeatures={setShowAdvancedFeatures}
          handleSubmit={handleSubmit}
          submitting={submitting}
          errors={errors}
          addVariant={addVariant}
          removeVariant={removeVariant}
          updateVariant={updateVariant}
          addGeoRule={addGeoRule}
          removeGeoRule={removeGeoRule}
          updateGeoRule={updateGeoRule}
          addPixel={addPixel}
          removePixel={removePixel}
          updatePixel={updatePixel}
        />
      )}

      {/* QR Code Modal */}
      {selectedQR && (
        <QRCodeModal
          selectedQR={selectedQR}
          onClose={() => setSelectedQR(null)}
          onDownload={downloadQRCode}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
}