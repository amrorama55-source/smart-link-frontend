import { SHORT_URL_BASE } from '../config';
import ConversionTracking from '../components/ConversionTracking';
import CustomDomain from '../components/CustomDomain';
import {
  Link2, Copy, ExternalLink, QrCode, CheckCircle,
  Edit3, Trash2, Target, Globe2, Calendar, Shield, Zap, TrendingUp
} from 'lucide-react';

export default function LinkCard({ 
  link, 
  onEdit, 
  onDelete, 
  onShowQR, 
  onCopy, 
  copiedCode,
  onReload 
}) {
  // ✅ FIXED: Generate correct short URL
  const getShortUrl = () => {
    // Priority 1: Use backend-provided shortUrl (most reliable)
    if (link.shortUrl) {
      return link.shortUrl;
    }
    
    // Priority 2: Custom domain (if verified)
    if (link.customDomain && link.domainVerification?.isVerified) {
      return `https://${link.customDomain}/${link.customAlias || link.shortCode}`;
    }
    
    // Priority 3: Use custom alias if available
    if (link.customAlias) {
      return `${SHORT_URL_BASE}/${link.customAlias}`;
    }
    
    // Priority 4: Default shortCode
    return `${SHORT_URL_BASE}/${link.shortCode}`;
  };

  const shortUrl = getShortUrl();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        
        {/* Link Content */}
        <div className="flex-1 min-w-0">
          
          {/* Title & Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {link.title || 'Untitled Link'}
            </h3>
            
            {/* Feature Badges */}
            {link.abTest?.enabled && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full flex items-center gap-1">
                <Target className="w-3 h-3" />
                A/B
              </span>
            )}
            {link.customDomain && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full flex items-center gap-1">
                <Globe2 className="w-3 h-3" />
                Custom
              </span>
            )}
            {link.schedule?.enabled && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Scheduled
              </span>
            )}
            {link.password && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Protected
              </span>
            )}
            {(link.geoRules?.length > 0 || link.deviceRules?.mobile) && (
              <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs font-semibold rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Smart
              </span>
            )}
          </div>

          {/* Description */}
          {link.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {link.description}
            </p>
          )}

          {/* Original URL */}
          {link.originalUrl && (
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
          )}

          {/* A/B Test Variants Preview */}
          {link.abTest?.enabled && link.abTest.variants?.length > 0 && (
            <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                  {link.abTest.variants.length} Variants • {link.abTest.splitMethod}
                </span>
              </div>
              <div className="space-y-1.5">
                {link.abTest.variants.slice(0, 2).map((variant, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-white dark:bg-gray-800/50 px-2.5 py-1.5 rounded">
                    <span className="font-semibold text-gray-900 dark:text-white min-w-[60px]">
                      {variant.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                      {variant.url}
                    </span>
                    <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded font-bold text-xs">
                      {variant.weight}%
                    </span>
                  </div>
                ))}
                {link.abTest.variants.length > 2 && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 text-center">
                    +{link.abTest.variants.length - 2} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Short URL - FIXED */}
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1 break-all flex-1 min-w-0 text-sm sm:text-base"
            >
              {shortUrl}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
            
            <button
              onClick={() => onCopy(shortUrl, link.shortCode)}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition flex-shrink-0 touch-target"
              aria-label="Copy link"
            >
              {copiedCode === link.shortCode ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <span className="font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {link.totalClicks} clicks
            </span>
            <span>•</span>
            <span>{new Date(link.createdAt).toLocaleDateString()}</span>
            {link.abTest?.enabled && link.abTest.winner && (
              <>
                <span>•</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  🏆 Winner: {link.abTest.winner.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2">
          <button
            onClick={() => onEdit(link)}
            className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded transition touch-target"
            title="Edit"
            aria-label="Edit link"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onShowQR(link.shortCode)}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition text-gray-700 dark:text-gray-300 touch-target"
            title="QR Code"
            aria-label="Show QR code"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(link.shortCode)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition touch-target"
            title="Delete"
            aria-label="Delete link"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Additional Components */}
      {link.abTest?.enabled && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <ConversionTracking shortCode={link.shortCode} />
        </div>
      )}
      
      {link.customDomain && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <CustomDomain link={link} onUpdate={onReload} />
        </div>
      )}
    </div>
  );
}