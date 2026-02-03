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
// ✅ FIXED validateForm - في Links.jsx
// استبدل الـ function الحالية بهذه النسخة المحسّنة

const validateForm = () => {
  const newErrors = {};

  console.log('🔍 ===== VALIDATION START =====');

  // ========================================
  // ✅ Original URL validation - SOLUTION 3 (Smart Fallback)
  // ========================================
  if (!editingLink) {
    const hasValidABTest = linkData.abTest?.enabled && 
                          linkData.abTest.variants?.length >= 2 &&
                          linkData.abTest.variants.every(v => v.name?.trim() && v.url?.trim());

    // ✅ Check if ANY targeting is configured
    const hasGeoTargeting = linkData.geoRules && linkData.geoRules.some(r => 
      r.countries?.length > 0 && r.targetUrl?.trim()
    );
    const hasDeviceTargeting = linkData.deviceRules && (
      linkData.deviceRules.mobile?.trim() ||
      linkData.deviceRules.desktop?.trim() ||
      linkData.deviceRules.tablet?.trim()
    );
    const hasAnyTargeting = hasGeoTargeting || hasDeviceTargeting || hasValidABTest;

    const trimmedUrl = (linkData.originalUrl || '').trim();
    
    console.log('📋 Checking Original URL:', {
      hasValidABTest,
      hasGeoTargeting,
      hasDeviceTargeting,
      hasAnyTargeting,
      originalUrl: trimmedUrl,
      isEmpty: !trimmedUrl
    });

    // ✅ FLEXIBLE LOGIC (Solution 3):
    // - If NO targeting → Original URL REQUIRED
    // - If targeting exists → Original URL OPTIONAL (recommended as fallback)

    if (!trimmedUrl && !hasAnyTargeting) {
      newErrors.originalUrl = 'Original URL is required (or configure targeting rules)';
      console.log('❌ Original URL Error: Required when no targeting');
    } else if (trimmedUrl) {
      try {
        const url = new URL(trimmedUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.originalUrl = 'URL must start with http:// or https://';
          console.log('❌ Original URL Error: Invalid protocol');
        }
      } catch {
        newErrors.originalUrl = 'Invalid URL format. Example: https://example.com';
        console.log('❌ Original URL Error: Invalid format');
      }
    }

    // ⚠️ Log warning (not error) if targeting exists but no URL
    if (!trimmedUrl && hasAnyTargeting) {
      console.log('⚠️ Warning: Targeting configured without fallback URL');
      // This is allowed but not recommended
    }

    // Custom alias validation
    if (linkData.customAlias && linkData.customAlias.trim()) {
      const alias = linkData.customAlias.trim();
      if (!/^[a-zA-Z0-9-_]{3,50}$/.test(alias)) {
        newErrors.customAlias = 'Use 3-50 alphanumeric characters, hyphens, or underscores';
        console.log('❌ Custom Alias Error');
      }
    }
  }

  // ========================================
  // ✅ A/B Testing validation
  // ========================================
  if (linkData.abTest?.enabled) {
    console.log('📋 Checking A/B Test:', {
      variantsCount: linkData.abTest.variants?.length || 0
    });

    if (!linkData.abTest.variants || linkData.abTest.variants.length < 2) {
      newErrors.abTest = 'A/B testing requires at least 2 variants';
      console.log('❌ A/B Test Error: Need 2+ variants');
    } else {
      const invalidVariants = linkData.abTest.variants.filter(v => {
        const hasName = v.name && v.name.trim().length > 0;
        const hasUrl = v.url && v.url.trim().length > 0;
        return !hasName || !hasUrl;
      });
      
      if (invalidVariants.length > 0) {
        newErrors.abTest = 'All variants must have a name and URL';
        console.log('❌ A/B Test Error: Incomplete variants');
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
          console.log('❌ A/B Test Error: Invalid URLs');
        }
      }

      if (linkData.abTest.splitMethod === 'weighted' && !newErrors.abTest) {
        const totalWeight = linkData.abTest.variants.reduce((sum, v) => {
          const weight = parseFloat(v.weight) || 0;
          return sum + weight;
        }, 0);

        if (totalWeight === 0) {
          newErrors.abTest = 'At least one variant must have weight > 0';
          console.log('❌ A/B Test Error: Zero weight');
        }
      }
    }
  }

  // ========================================
  // ✅ Geotargeting validation - FIXED
  // ========================================
  if (linkData.geoRules && linkData.geoRules.length > 0) {
    console.log('📋 Checking Geo Rules:', {
      totalRules: linkData.geoRules.length,
      rules: linkData.geoRules.map((r, i) => ({
        index: i,
        countriesCount: r.countries?.length || 0,
        hasUrl: !!(r.targetUrl && r.targetUrl.trim())
      }))
    });

    const rulesWithData = linkData.geoRules.filter(r => {
      const hasCountries = r.countries && r.countries.length > 0;
      const hasUrl = r.targetUrl && r.targetUrl.trim().length > 0;
      return hasCountries || hasUrl;
    });
    
    console.log('📋 Rules with data:', rulesWithData.length);

    if (rulesWithData.length > 0) {
      const incompleteRules = rulesWithData.filter(r => {
        const hasCountries = r.countries && r.countries.length > 0;
        const hasUrl = r.targetUrl && r.targetUrl.trim().length > 0;
        return !hasCountries || !hasUrl;
      });
      
      if (incompleteRules.length > 0) {
        newErrors.geoRules = 'Each geo rule must have BOTH countries AND target URL. Please fill both fields or remove the rule.';
        console.log('❌ Geo Rules Error: Incomplete rules', {
          incompleteCount: incompleteRules.length,
          details: incompleteRules.map((r, i) => ({
            index: i,
            hasCountries: !!(r.countries && r.countries.length > 0),
            hasUrl: !!(r.targetUrl && r.targetUrl.trim())
          }))
        });
      } else {
        const badGeoUrls = rulesWithData.filter(r => {
          try {
            const url = new URL(r.targetUrl.trim());
            return !['http:', 'https:'].includes(url.protocol);
          } catch {
            return true;
          }
        });
        
        if (badGeoUrls.length > 0) {
          newErrors.geoRules = 'All geo rule URLs must be valid and start with http:// or https://';
          console.log('❌ Geo Rules Error: Invalid URLs');
        }
      }
    }
  }

  // ========================================
  // ✅ Device targeting validation
  // ========================================
  if (linkData.deviceRules) {
    const deviceUrls = [
      { key: 'mobile', url: linkData.deviceRules.mobile },
      { key: 'desktop', url: linkData.deviceRules.desktop },
      { key: 'tablet', url: linkData.deviceRules.tablet }
    ].filter(d => d.url && d.url.trim().length > 0);

    console.log('📋 Checking Device Rules:', {
      urlsProvided: deviceUrls.length
    });

    if (deviceUrls.length > 0) {
      const badDeviceUrls = deviceUrls.filter(d => {
        try {
          const url = new URL(d.url.trim());
          return !['http:', 'https:'].includes(url.protocol);
        } catch {
          return true;
        }
      });
      
      if (badDeviceUrls.length > 0) {
        newErrors.deviceRules = 'All device URLs must be valid (start with http:// or https://)';
        console.log('❌ Device Rules Error: Invalid URLs');
      }
    }
  }

  // ========================================
  // ✅ Schedule validation
  // ========================================
  if (linkData.schedule?.enabled) {
    console.log('📋 Checking Schedule:', {
      hasStartDate: !!linkData.schedule.startDate,
      hasEndDate: !!linkData.schedule.endDate
    });

    if (!linkData.schedule.startDate || !linkData.schedule.endDate) {
      newErrors.schedule = 'Start and end dates are required when scheduling is enabled';
      console.log('❌ Schedule Error: Missing dates');
    } else {
      const start = new Date(linkData.schedule.startDate);
      const end = new Date(linkData.schedule.endDate);
      
      if (start >= end) {
        newErrors.schedule = 'End date must be after start date';
        console.log('❌ Schedule Error: Invalid date range');
      }

      if (linkData.schedule.redirectAfterExpiry && linkData.schedule.redirectAfterExpiry.trim()) {
        try {
          const url = new URL(linkData.schedule.redirectAfterExpiry.trim());
          if (!['http:', 'https:'].includes(url.protocol)) {
            newErrors.schedule = 'Redirect URL must be valid';
            console.log('❌ Schedule Error: Invalid redirect URL');
          }
        } catch {
          newErrors.schedule = 'Redirect URL must be valid';
          console.log('❌ Schedule Error: Invalid redirect URL format');
        }
      }
    }
  }

  // ========================================
  // ✅ Pixels validation
  // ========================================
  if (linkData.pixels && linkData.pixels.length > 0) {
    console.log('📋 Checking Pixels:', {
      totalPixels: linkData.pixels.length
    });

    const pixelsWithData = linkData.pixels.filter(p => 
      (p.platform && p.platform.trim()) || 
      (p.pixelId && p.pixelId.trim())
    );
    
    if (pixelsWithData.length > 0) {
      const incompletePixels = pixelsWithData.filter(p => {
        const hasPlatform = p.platform && p.platform.trim().length > 0;
        const hasPixelId = p.pixelId && p.pixelId.trim().length > 0;
        return !hasPlatform || !hasPixelId;
      });
      
      if (incompletePixels.length > 0) {
        newErrors.pixels = 'All pixels must have both platform and pixel ID';
        console.log('❌ Pixels Error: Incomplete pixels');
      }
    }
  }

  // ========================================
  // ✅ Final Summary
  // ========================================
  console.log('❌ Validation Errors Found:', newErrors);
  console.log('🔍 ===== VALIDATION END =====');
  console.log('✅ Validation Result:', Object.keys(newErrors).length === 0 ? 'PASSED' : 'FAILED');
  console.log('');

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // ========================================
  // ✅ FIXED SUBMIT HANDLER
  // ========================================
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('📤 Starting Submit...', {
    originalUrl: linkData.originalUrl,
    abTestEnabled: linkData.abTest?.enabled,
    geoRulesCount: linkData.geoRules?.length || 0,
    pixelsCount: linkData.pixels?.length || 0
  });

  if (!validateForm()) {
    addToast('Please fix all validation errors', 'error');
    return;
  }

  setSubmitting(true);

  try {
    // ========================================
    // ✅ Build clean payload
    // ========================================
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

    // ========================================
    // ✅ A/B Testing - CLEANED
    // ========================================
    if (linkData.abTest?.enabled && linkData.abTest.variants && linkData.abTest.variants.length >= 2) {
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
        console.log('✅ A/B Test Added:', payload.abTest);
      }
    } else if (editingLink) {
      payload.abTest = { enabled: false, variants: [] };
    }

    // ========================================
    // ✅ Geotargeting - COMPLETELY CLEANED
    // ========================================
    if (linkData.geoRules && linkData.geoRules.length > 0) {
      // ✅ فقط القواعد الكاملة
      const validGeoRules = linkData.geoRules
        .filter(r => 
          r.countries && 
          r.countries.length > 0 && 
          r.targetUrl && 
          r.targetUrl.trim()
        )
        .map(r => ({
          countries: r.countries,
          targetUrl: r.targetUrl.trim(),
          priority: r.priority || 0
        }));

      if (validGeoRules.length > 0) {
        payload.geoRules = validGeoRules;
        console.log('✅ Geo Rules Added:', payload.geoRules);
      }
    }

    // ========================================
    // ✅ Device targeting - CLEANED
    // ========================================
    if (linkData.deviceRules) {
      const hasDeviceRules = 
        (linkData.deviceRules.mobile && linkData.deviceRules.mobile.trim()) ||
        (linkData.deviceRules.desktop && linkData.deviceRules.desktop.trim()) ||
        (linkData.deviceRules.tablet && linkData.deviceRules.tablet.trim());

      if (hasDeviceRules) {
        payload.deviceRules = {
          mobile: linkData.deviceRules.mobile?.trim() || '',
          desktop: linkData.deviceRules.desktop?.trim() || '',
          tablet: linkData.deviceRules.tablet?.trim() || ''
        };
        console.log('✅ Device Rules Added:', payload.deviceRules);
      }
    }

    // ========================================
    // ✅ Scheduling - CLEANED
    // ========================================
    if (linkData.schedule?.enabled) {
      if (linkData.schedule.startDate && linkData.schedule.endDate) {
        payload.schedule = {
          enabled: true,
          startDate: linkData.schedule.startDate,
          endDate: linkData.schedule.endDate,
          redirectAfterExpiry: linkData.schedule.redirectAfterExpiry?.trim() || ''
        };
        console.log('✅ Schedule Added:', payload.schedule);
      }
    }

    // ========================================
    // ✅ Pixels - COMPLETELY CLEANED
    // ========================================
    if (linkData.pixels && linkData.pixels.length > 0) {
      // ✅ فقط الـ pixels الكاملة
      const validPixels = linkData.pixels
        .filter(p => 
          p.platform && 
          p.platform.trim() && 
          p.pixelId && 
          p.pixelId.trim()
        )
        .map(p => ({
          platform: p.platform.trim(),
          pixelId: p.pixelId.trim(),
          event: p.event || 'PageView'
        }));

      if (validPixels.length > 0) {
        payload.pixels = validPixels;
        console.log('✅ Pixels Added:', payload.pixels);
      }
    }

    // ========================================
    // ✅ Final Payload Log
    // ========================================
    console.log('📦 Final Payload:', JSON.stringify(payload, null, 2));

    // ========================================
    // ✅ Submit to Backend
    // ========================================
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
  if (updatedPixels[index]) {
    updatedPixels[index] = {
      ...updatedPixels[index],
      [field]: value
    };
    setLinkData({
      ...linkData,
      pixels: updatedPixels
    });
  }
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading your links...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 mb-20 md:mb-0">
        
        {/* Header — clear, not corporate */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 tracking-tight">
                  Your links
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  One place for all your short links
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="w-full sm:w-auto min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base active:scale-[0.98] touch-manipulation"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>New link</span>
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
          /* Empty State — friendly, human */
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-7 h-7 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No links yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Paste a URL and get a short link. You can add targeting and analytics later.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="w-full sm:w-auto min-h-[48px] px-5 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] touch-manipulation"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create your first link
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