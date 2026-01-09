import { useState, useEffect } from 'react';
import { getLinks, createLink, updateLink, deleteLink } from '../services/api';
import { SHORT_URL_BASE } from '../config';
import { validateUrl, validateCustomAlias, sanitizeInput } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import QRCode from 'qrcode';
import {
  Link2, Plus
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
        minSampleSize: 100,
        confidenceLevel: 0.95
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
        autoOptimize: { 
          enabled: false, 
          minSampleSize: 100,
          confidenceLevel: 0.95
        }
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
        autoOptimize: link.abTest.autoOptimize || { 
          enabled: false, 
          minSampleSize: 100,
          confidenceLevel: 0.95
        }
      } : {
        enabled: false,
        splitMethod: 'weighted',
        variants: [],
        autoOptimize: { 
          enabled: false, 
          minSampleSize: 100,
          confidenceLevel: 0.95
        }
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

  // ✅ Original URL validation - Fixed
  if (!editingLink) {
    const hasValidABTest = linkData.abTest?.enabled && 
                          linkData.abTest.variants?.length >= 2 &&
                          linkData.abTest.variants.every(v => v.name?.trim() && v.url?.trim());

    if (!hasValidABTest) {
      const trimmedUrl = (linkData.originalUrl || '').trim();
      
      if (!trimmedUrl) {
        newErrors.originalUrl = 'URL is required (or enable A/B Testing with at least 2 valid variants)';
      } else {
        try {
          const url = new URL(trimmedUrl);
          if (!['http:', 'https:'].includes(url.protocol)) {
            newErrors.originalUrl = 'URL must start with http:// or https://';
          }
        } catch {
          newErrors.originalUrl = 'Invalid URL format';
        }
      }
    } else {
      const trimmedUrl = (linkData.originalUrl || '').trim();
      if (trimmedUrl) {
        try {
          const url = new URL(trimmedUrl);
          if (!['http:', 'https:'].includes(url.protocol)) {
            newErrors.originalUrl = 'URL must start with http:// or https://';
          }
        } catch {
          newErrors.originalUrl = 'Invalid URL format';
        }
      }
    }

    // Custom alias validation
    if (linkData.customAlias && linkData.customAlias.trim()) {
      const alias = linkData.customAlias.trim();
      if (!/^[a-zA-Z0-9-_]{3,50}$/.test(alias)) {
        newErrors.customAlias = 'Use 3-50 alphanumeric characters, hyphens, or underscores';
      }
    }
  }

  // ✅ A/B Testing validation
  if (linkData.abTest?.enabled) {
    if (!linkData.abTest.variants || linkData.abTest.variants.length < 2) {
      newErrors.abTest = 'A/B testing requires at least 2 variants';
    } else {
      const invalidVariants = linkData.abTest.variants.filter(v => {
        const hasName = v.name && v.name.trim().length > 0;
        const hasUrl = v.url && v.url.trim().length > 0;
        return !hasName || !hasUrl;
      });
      
      if (invalidVariants.length > 0) {
        newErrors.abTest = 'All variants must have a name and URL';
      } else {
        const badUrls = linkData.abTest.variants.filter(v => {
          try {
            const url = new URL(v.url.trim());
            return !['http:', 'https:'].includes(url.protocol);
          } catch {
            return true;
          }
        });
        
        if (badUrls.length > 0) {
          newErrors.abTest = 'All variant URLs must be valid (start with http:// or https://)';
        }
      }

      if (linkData.abTest.splitMethod === 'weighted' && !newErrors.abTest) {
        const totalWeight = linkData.abTest.variants.reduce((sum, v) => {
          const weight = parseFloat(v.weight) || 0;
          return sum + weight;
        }, 0);

        if (totalWeight === 0) {
          newErrors.abTest = 'At least one variant must have weight > 0';
        } else if (totalWeight > 200) {
          newErrors.abTest = 'Total weight seems too high. Try "Auto-Fix Weights" button.';
        } else if (totalWeight < 50) {
          newErrors.abTest = 'Total weight seems too low. Try "Auto-Fix Weights" button.';
        }
      }
    }
  }

  // ✅ Geotargeting validation - FIXED
  if (linkData.geoRules && linkData.geoRules.length > 0) {
    // Filter out completely empty rules
    const nonEmptyRules = linkData.geoRules.filter(r => 
      (r.countries && r.countries.length > 0) || 
      (r.targetUrl && r.targetUrl.trim().length > 0)
    );
    
    // Only validate if there are rules with some data
    if (nonEmptyRules.length > 0) {
      const invalidRules = nonEmptyRules.filter(r => {
        const hasCountries = r.countries && r.countries.length > 0;
        const hasUrl = r.targetUrl && r.targetUrl.trim().length > 0;
        return !hasCountries || !hasUrl;
      });
      
      if (invalidRules.length > 0) {
        newErrors.geoRules = 'All geo rules must have both countries and target URL';
      } else {
        const badGeoUrls = nonEmptyRules.filter(r => {
          try {
            const url = new URL(r.targetUrl.trim());
            return !['http:', 'https:'].includes(url.protocol);
          } catch {
            return true;
          }
        });
        
        if (badGeoUrls.length > 0) {
          newErrors.geoRules = 'All geo rule URLs must be valid';
        }
      }
    }
  }

  // ✅ Device targeting validation - FIXED
  if (linkData.deviceRules?.mobile || linkData.deviceRules?.desktop || linkData.deviceRules?.tablet) {
    const deviceUrls = [
      { key: 'mobile', url: linkData.deviceRules.mobile },
      { key: 'desktop', url: linkData.deviceRules.desktop },
      { key: 'tablet', url: linkData.deviceRules.tablet }
    ].filter(d => d.url && d.url.trim());

    const badDeviceUrls = deviceUrls.filter(d => {
      try {
        const url = new URL(d.url.trim());
        return !['http:', 'https:'].includes(url.protocol);
      } catch {
        return true;
      }
    });
    
    if (badDeviceUrls.length > 0) {
      newErrors.deviceRules = 'All device URLs must be valid';
    }
  }

  // ✅ Schedule validation - FIXED
  if (linkData.schedule?.enabled) {
    if (!linkData.schedule.startDate || !linkData.schedule.endDate) {
      newErrors.schedule = 'Start and end dates are required';
    } else {
      const start = new Date(linkData.schedule.startDate);
      const end = new Date(linkData.schedule.endDate);
      
      if (start >= end) {
        newErrors.schedule = 'End date must be after start date';
      }

      if (linkData.schedule.redirectAfterExpiry && linkData.schedule.redirectAfterExpiry.trim()) {
        try {
          const url = new URL(linkData.schedule.redirectAfterExpiry.trim());
          if (!['http:', 'https:'].includes(url.protocol)) {
            newErrors.schedule = 'Redirect URL must be valid';
          }
        } catch {
          newErrors.schedule = 'Redirect URL must be valid';
        }
      }
    }
  }

  // ✅ Pixels validation
  if (linkData.pixels && linkData.pixels.length > 0) {
    const invalidPixels = linkData.pixels.filter(p => {
      const hasPlatform = p.platform && p.platform.trim().length > 0;
      const hasPixelId = p.pixelId && p.pixelId.trim().length > 0;
      return !hasPlatform || !hasPixelId;
    });
    
    if (invalidPixels.length > 0) {
      newErrors.pixels = 'All pixels must have platform and pixel ID';
    }
  }

  console.log('🔍 Validation Result:', {
    hasErrors: Object.keys(newErrors).length > 0,
    errors: newErrors
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // ========================================
  // ✅ FIXED SUBMIT HANDLER
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📤 Submitting Link:', {
      originalUrl: linkData.originalUrl,
      abTestEnabled: linkData.abTest?.enabled,
      variants: linkData.abTest?.variants?.map(v => ({
        name: v.name,
        url: v.url,
        weight: v.weight
      }))
    });

    if (!validateForm()) {
      addToast('Please fix all validation errors', 'error');
      return;
    }

    setSubmitting(true);

    try {
      // ✅ Build clean payload
      const payload = {
        title: (linkData.title || '').trim(),
        description: (linkData.description || '').trim(),
        tags: linkData.tags || [],
        expiresAt: linkData.expiresAt || null,
      };

      // Add fields for new links only
      if (!editingLink) {
        payload.originalUrl = linkData.originalUrl.trim();
        if (linkData.customAlias && linkData.customAlias.trim()) {
          payload.customAlias = linkData.customAlias.trim();
        }
      }

      // Password
      if (linkData.password && linkData.password.trim()) {
        payload.password = linkData.password;
      }

      // ✅ A/B Testing - CRITICAL
      if (linkData.abTest?.enabled && linkData.abTest.variants && linkData.abTest.variants.length >= 2) {
        // Filter and clean variants
        const cleanVariants = linkData.abTest.variants
          .filter(v => v.name && v.name.trim() && v.url && v.url.trim())
          .map(v => ({
            name: v.name.trim(),
            url: v.url.trim(),
            weight: parseFloat(v.weight) || 50
          }));

        if (cleanVariants.length >= 2) {
          payload.abTest = {
            enabled: true,
            splitMethod: linkData.abTest.splitMethod || 'weighted',
            variants: cleanVariants,
            autoOptimize: {
              enabled: linkData.abTest.autoOptimize?.enabled || false,
              minSampleSize: linkData.abTest.autoOptimize?.minSampleSize || 100,
              confidenceLevel: linkData.abTest.autoOptimize?.confidenceLevel || 0.95
            }
          };

          console.log('✅ Sending A/B Test:', payload.abTest);
        }
      } else if (editingLink) {
        // Disable A/B testing if editing
        payload.abTest = { enabled: false, variants: [] };
      }

      // Geotargeting
      if (linkData.geoRules && linkData.geoRules.length > 0) {
        payload.geoRules = linkData.geoRules
          .filter(r => r.countries.length > 0 && r.targetUrl && r.targetUrl.trim())
          .map(r => ({
            countries: r.countries,
            targetUrl: r.targetUrl.trim(),
            priority: r.priority || 0
          }));
      }

      // Device targeting
      if (linkData.deviceRules?.mobile || linkData.deviceRules?.desktop || linkData.deviceRules?.tablet) {
        payload.deviceRules = {
          mobile: linkData.deviceRules.mobile?.trim() || '',
          desktop: linkData.deviceRules.desktop?.trim() || '',
          tablet: linkData.deviceRules.tablet?.trim() || ''
        };
      }

      // Scheduling
      if (linkData.schedule?.enabled) {
        payload.schedule = {
          enabled: true,
          startDate: linkData.schedule.startDate,
          endDate: linkData.schedule.endDate,
          redirectAfterExpiry: linkData.schedule.redirectAfterExpiry?.trim() || ''
        };
      }

      // Pixels
      if (linkData.pixels && linkData.pixels.length > 0) {
        payload.pixels = linkData.pixels
          .filter(p => p.platform && p.pixelId && p.pixelId.trim())
          .map(p => ({
            platform: p.platform,
            pixelId: p.pixelId.trim(),
            event: p.event || 'PageView'
          }));
      }

      console.log('📦 Final Payload:', JSON.stringify(payload, null, 2));

      // Submit
      if (editingLink) {
        await updateLink(editingLink.shortCode, payload);
        addToast('Link updated successfully! 🎉', 'success');
      } else {
        await createLink(payload);
        addToast('Link created successfully! 🎉', 'success');
      }

      setShowModal(false);
      setEditingLink(null);
      loadLinks();
    } catch (error) {
      console.error('❌ Submit Error:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to save link';
      
      // Show specific variant error if available
      if (error.response?.data?.variantIndex !== undefined) {
        const variantIndex = error.response.data.variantIndex;
        const variantName = linkData.abTest?.variants?.[variantIndex]?.name || `Variant ${variantIndex + 1}`;
        addToast(`${variantName}: ${errorMessage}`, 'error');
      } else {
        addToast(errorMessage, 'error');
      }
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

  // ========================================
  // ✅ A/B TESTING HANDLERS - IMPROVED
  // ========================================
  const addVariant = () => {
    const currentVariants = linkData.abTest?.variants || [];
    const newVariantCount = currentVariants.length + 1;
    
    // Calculate equal weights
    const equalWeight = Math.floor(100 / newVariantCount);
    const remainder = 100 - (equalWeight * newVariantCount);
    
    // Adjust existing variants
    const adjustedVariants = currentVariants.map((v, i) => ({
      ...v,
      weight: i === 0 ? equalWeight + remainder : equalWeight
    }));
    
    // Add new variant
    const newVariant = { 
      name: `Variant ${String.fromCharCode(65 + currentVariants.length)}`, 
      url: '', 
      weight: equalWeight
    };

    setLinkData({
      ...linkData,
      abTest: {
        ...linkData.abTest,
        variants: [...adjustedVariants, newVariant]
      }
    });

    console.log('➕ Added variant:', {
      totalVariants: newVariantCount,
      weights: [...adjustedVariants, newVariant].map(v => v.weight)
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = (linkData.abTest?.variants || []).filter((_, i) => i !== index);
    
    if (updatedVariants.length > 0) {
      // Redistribute weights equally
      const equalWeight = Math.floor(100 / updatedVariants.length);
      const remainder = 100 - (equalWeight * updatedVariants.length);
      
      const redistributedVariants = updatedVariants.map((v, i) => ({
        ...v,
        weight: i === 0 ? equalWeight + remainder : equalWeight
      }));
      
      setLinkData({
        ...linkData,
        abTest: {
          ...linkData.abTest,
          variants: redistributedVariants
        }
      });

      console.log('➖ Removed variant:', {
        remainingVariants: redistributedVariants.length,
        weights: redistributedVariants.map(v => v.weight)
      });
    } else {
      setLinkData({
        ...linkData,
        abTest: {
          ...linkData.abTest,
          variants: []
        }
      });
    }
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...(linkData.abTest?.variants || [])];
    
    if (updatedVariants[index]) {
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value
      };
      
      setLinkData({
        ...linkData,
        abTest: {
          ...linkData.abTest,
          variants: updatedVariants
        }
      });

      console.log(`🔄 Updated variant ${index} ${field}:`, value);
    }
  };

  // Geotargeting Handlers
  const addGeoRule = () => {
    setLinkData({
      ...linkData,
      geoRules: [
        ...(linkData.geoRules || []),
        { countries: [], targetUrl: '', priority: 0 }
      ]
    });
  };

  const removeGeoRule = (index) => {
    setLinkData({
      ...linkData,
      geoRules: (linkData.geoRules || []).filter((_, i) => i !== index)
    });
  };

  const updateGeoRule = (index, field, value) => {
    const updatedRules = [...(linkData.geoRules || [])];
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
        ...(linkData.pixels || []),
        { platform: 'facebook', pixelId: '', event: 'PageView' }
      ]
    });
  };

  const removePixel = (index) => {
    setLinkData({
      ...linkData,
      pixels: (linkData.pixels || []).filter((_, i) => i !== index)
    });
  };

  const updatePixel = (index, field, value) => {
    const updatedPixels = [...(linkData.pixels || [])];
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

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 mb-20 md:mb-0">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Your Links
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Create and manage all your smart links
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="w-full sm:w-auto min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Smart Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Links List */}
        {links.length > 0 ? (
          <div className="grid gap-4 sm:gap-5 md:gap-6">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Link2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              No links yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto px-4">
              Create your first smart link with A/B testing, geotargeting, and advanced analytics
            </p>
            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
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