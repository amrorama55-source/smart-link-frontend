import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Mail } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Last updated: December 27, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Introduction */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  We Respect Your Privacy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  At Smart Link, we're committed to protecting your personal data. 
                  This policy explains how we collect, use, and safeguard your information.
                </p>
              </div>
            </div>
          </div>

          {/* What We Collect */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Information You Provide:
                    </h3>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• Account details (name, email, password)</li>
                      <li>• Links and bio page content</li>
                      <li>• Payment information (via secure providers)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Automatically Collected:
                    </h3>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• Click data (device, browser, location)</li>
                      <li>• Analytics and usage statistics</li>
                      <li>• Cookies for better experience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use It */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  How We Use Your Data
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Provide and improve our service</li>
                  <li>• Generate analytics for your links</li>
                  <li>• Send important notifications</li>
                  <li>• Prevent fraud and abuse</li>
                  <li>• Comply with legal requirements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  We Keep Your Data Safe
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• SSL/HTTPS encryption</li>
                  <li>• Secure password hashing (bcrypt)</li>
                  <li>• Regular security audits</li>
                  <li>• Access controls and authentication</li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold">
                    🔒 We never sell your personal information
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Rights
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Access</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Request your data</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Correction</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Update information</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Deletion</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Delete your account</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Export</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Download your data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Questions? Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you have any questions about this privacy policy or how we handle your data:
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:privacy@smart-link.website" 
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                  >
                    <Mail className="w-4 h-4" />
                    smartlinkpro10@gmail.com
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We'll respond within 48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600 dark:text-gray-400">
              <p>🍪 We use cookies for better experience</p>
              <p>👶 Not for users under 13</p>
              <p>🌍 GDPR compliant</p>
              <p>🗑️ 30-day data deletion</p>
            </div>
          </div>

        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}