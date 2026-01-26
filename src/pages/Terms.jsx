import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';

export default function Terms() {
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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Last updated: January 2025
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Agreement */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Agreement to Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  By accessing and using Smart Link, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not use our service.
                </p>
              </div>
            </div>
          </div>

          {/* Your Responsibilities */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What You Can Do
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>✅ Create and share short links</li>
                  <li>✅ Build professional bio pages</li>
                  <li>✅ Track analytics for your links</li>
                  <li>✅ Use the service for personal or commercial purposes</li>
                  <li>✅ Export your data at any time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What You Cannot Do
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>❌ Share links to illegal, harmful, or malicious content</li>
                  <li>❌ Use the service for spam or phishing</li>
                  <li>❌ Attempt to hack, disrupt, or overload our systems</li>
                  <li>❌ Violate intellectual property rights</li>
                  <li>❌ Create multiple accounts to abuse free tiers</li>
                </ul>
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
                    ⚠️ Violations may result in account termination
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Availability */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Service Availability
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. 
                  We may need to perform maintenance, updates, or emergency repairs.
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                  <p>• We're currently in Beta - expect occasional bugs and updates</p>
                  <p>• We reserve the right to modify or discontinue features</p>
                  <p>• We'll notify you of major changes via email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account & Billing */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Account & Billing
                </h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Account Security</h3>
                    <p className="text-sm">You're responsible for maintaining the security of your account and password.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Free Service</h3>
                    <p className="text-sm">Smart Link is currently 100% free. We may introduce paid features in the future.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cancellation</h3>
                    <p className="text-sm">You can delete your account at any time. Your data will be removed within 30 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Limitation of Liability
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Smart Link is provided "as is" without warranties of any kind. We are not liable for 
                any damages arising from your use of the service, including loss of data, profits, 
                or business opportunities.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Questions About These Terms?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about our Terms of Service, please contact us:
            </p>
            <a 
              href="mailto:support@smart-link.website" 
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
             smartlinkpro10@gmail.com
            </a>
          </div>

        </div>

        {/* Back Button */}
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