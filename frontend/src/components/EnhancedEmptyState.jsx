import { Link2, Target, Globe, TrendingUp, Globe2, Plus, Zap, Shield, BarChart3 } from 'lucide-react';

export default function EnhancedEmptyState({ onCreateLink }) {
  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Main Empty State Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-12 text-center mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Link2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Welcome to Smart Links! 👋
        </h3>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          You haven't created any links yet. Let's get started!
          Smart links are powerful tools that help you manage, track, and optimize your URLs.
        </p>
        <button
          onClick={onCreateLink}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
          Create Your First Smart Link
        </button>
      </div>

      {/* Tutorial Guide */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6 sm:p-8 mb-8">
        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🎯 How to Create a Smart Link in 5 Easy Steps
        </h4>
        
        <div className="space-y-4">
          
          {/* Step 1 - Basic */}
          <div className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h5 className="font-bold text-gray-900 dark:text-white">Basic Tab - Add Your URL</h5>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter the destination URL where you want people to go. Add a title, description, and tags to organize your links.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                  Required
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  Takes 30 seconds
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 - Advanced */}
          <div className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h5 className="font-bold text-gray-900 dark:text-white">Advanced Tab - A/B Testing</h5>
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test multiple destination URLs to find which one performs best. Perfect for optimizing campaigns!
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                💡 Example: Test homepage vs landing page to see which converts better
              </div>
            </div>
          </div>

          {/* Step 3 - Targeting */}
          <div className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-pink-200 dark:border-pink-700 hover:shadow-lg transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <h5 className="font-bold text-gray-900 dark:text-white">Targeting Tab - Geo & Device Rules</h5>
                <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs font-bold rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send users to different URLs based on their country or device type. Great for international campaigns!
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                💡 Example: US visitors → English site, France → French site
              </div>
            </div>
          </div>

          {/* Step 4 - Tracking */}
          <div className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h5 className="font-bold text-gray-900 dark:text-white">Tracking Tab - Analytics Pixels</h5>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add Facebook Pixel, Google Analytics, or TikTok Pixel to track conversions and user behavior.
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                💡 Example: Track purchases from your Facebook ads
              </div>
            </div>
          </div>

          {/* Step 5 - Custom Domain */}
          <div className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-shadow">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              5
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Globe2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h5 className="font-bold text-gray-900 dark:text-white">Custom Domain Tab - Brand Your Links</h5>
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use your own domain (like go.yourbrand.com) instead of our short link for better branding and trust.
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                💡 Example: go.nike.com/summer-sale instead of s.link/xyz123
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h5 className="font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create powerful smart links in seconds with our intuitive step-by-step interface
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h5 className="font-bold text-gray-900 dark:text-white mb-2">Advanced Analytics</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track every click, conversion, and user interaction with detailed analytics
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h5 className="font-bold text-gray-900 dark:text-white mb-2">Secure & Reliable</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enterprise-grade security with password protection and link expiration
          </p>
        </div>

      </div>

      {/* CTA Bottom */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 text-center shadow-xl">
        <h4 className="text-2xl font-bold text-white mb-3">
          Ready to Get Started? 🚀
        </h4>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of marketers, businesses, and creators using smart links to boost their campaigns
        </p>
        <button
          onClick={onCreateLink}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
          Create Your First Link Now
        </button>
      </div>

    </div>
  );
}