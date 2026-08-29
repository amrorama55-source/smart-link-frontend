import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

export default function UtmBuilder() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [name, setName] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (!url) {
        setGeneratedUrl('');
        return;
      }
      
      let base = url;
      if (!base.startsWith('http://') && !base.startsWith('https://')) {
        base = 'https://' + base;
      }
      
      const parsedUrl = new URL(base);
      if (source) parsedUrl.searchParams.set('utm_source', source);
      if (medium) parsedUrl.searchParams.set('utm_medium', medium);
      if (name) parsedUrl.searchParams.set('utm_campaign', name);
      if (term) parsedUrl.searchParams.set('utm_term', term);
      if (content) parsedUrl.searchParams.set('utm_content', content);
      
      setGeneratedUrl(parsedUrl.toString());
    } catch (e) {
      // If invalid URL during typing, just append it manually for preview
      let queryStr = [];
      if (source) queryStr.push(`utm_source=${encodeURIComponent(source)}`);
      if (medium) queryStr.push(`utm_medium=${encodeURIComponent(medium)}`);
      if (name) queryStr.push(`utm_campaign=${encodeURIComponent(name)}`);
      if (term) queryStr.push(`utm_term=${encodeURIComponent(term)}`);
      if (content) queryStr.push(`utm_content=${encodeURIComponent(content)}`);
      
      const q = queryStr.length > 0 ? `?${queryStr.join('&')}` : '';
      setGeneratedUrl(`${url}${url.includes('?') ? '&' : ''}${q}`);
    }
  }, [url, source, medium, name, term, content]);

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free UTM Link Builder",
    "description": "Generate custom campaign tracking URLs with our free UTM builder tool.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <SEO 
        title="Free UTM Link Builder | Campaign URL Generator Online"
        description="Build custom campaign tracking URLs with our free UTM builder tool. Generate trackable links for your marketing campaigns in seconds."
        keywords="utm builder, utm link generator, campaign url builder, utm tracking, google analytics url builder"
        schema={schema}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow-md">
              Start Tracking Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Free UTM Link Builder
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Generate properly formatted campaign URLs to track your marketing performance.
          </p>
        </div>

        {/* Builder Tool Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          
          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-2xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-purple-100 dark:bg-purple-900/30 blur-2xl opacity-50"></div>
            
            <div className="relative z-10 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Source <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="google, newsletter, facebook" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Medium <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="cpc, email, social" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="summer_sale, launch_2023" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Term <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="running+shoes" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Content <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="logolink, textlink" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="sticky top-24">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-8 h-full">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Generated URL</h3>
                
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[120px] flex flex-col justify-between mb-6 break-all">
                  <span className={`text-sm md:text-base transition-all ${generatedUrl ? 'text-gray-800 dark:text-gray-200 font-mono' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                    {generatedUrl || 'Fill out the fields to generate your URL...'}
                  </span>
                </div>

                <button 
                  onClick={copyToClipboard}
                  disabled={!generatedUrl}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all ${
                    !generatedUrl 
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                      : copied 
                        ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      Copy URL
                    </>
                  )}
                </button>

                {/* Sub-CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Want to track your UTM links with AI-powered analytics?
                  </p>
                  <Link to="/register" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center gap-1 group">
                    Try Smart Link for free
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Guide Section */}
        <article className="mt-24 max-w-4xl mx-auto prose prose-blue dark:prose-invert">
          <h2 className="text-3xl font-bold mb-6">Complete Guide to UTM Parameters</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            UTM (Urchin Tracking Module) parameters are five variants of URL parameters used by marketers to track the effectiveness of online marketing campaigns across traffic sources and publishing media.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-1 px-2 rounded text-sm">utm_source</span>
                Campaign Source
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identifies which site sent the traffic. This is a required parameter. It tells you exactly where the user came from before clicking your link.
                <br/><strong className="dark:text-gray-200">Examples:</strong> <code>google</code>, <code>facebook</code>, <code>newsletter_list</code>, <code>twitter</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 py-1 px-2 rounded text-sm">utm_medium</span>
                Campaign Medium
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identifies what type of link was used. Also required. This describes the marketing medium or delivery method of the campaign.
                <br/><strong className="dark:text-gray-200">Examples:</strong> <code>cpc</code> (cost per click), <code>social</code>, <code>email</code>, <code>affiliate</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 py-1 px-2 rounded text-sm">utm_campaign</span>
                Campaign Name
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identifies a specific product promotion or strategic campaign. Required in most analytics platforms. This helps group all traffic from a single initiative together.
                <br/><strong className="dark:text-gray-200">Examples:</strong> <code>spring_sale_2024</code>, <code>product_launch</code>, <code>black_friday</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 py-1 px-2 rounded text-sm">utm_term</span>
                Campaign Term
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optional parameter primarily used for tracking paid search keywords. If you're running search ads, use this to note the specific keyword that triggered the ad.
                <br/><strong className="dark:text-gray-200">Examples:</strong> <code>running+shoes</code>, <code>b2b+software</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 py-1 px-2 rounded text-sm">utm_content</span>
                Campaign Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optional parameter used for A/B testing and content-targeted ads. Use it to differentiate ads or links that point to the same URL. Perfect for distinguishing between different call-to-action buttons in the same email.
                <br/><strong className="dark:text-gray-200">Examples:</strong> <code>logolink</code>, <code>textlink</code>, <code>blue_button</code>, <code>header_link</code>.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Why Use a UTM Builder?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Building UTM links manually is prone to errors. A simple typo like using <code>utm_source=Google</code> in one place and <code>utm_source=google</code> in another can fracture your analytics data, making it difficult to get accurate reports.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Our Free UTM Link Builder ensures your parameters are always properly formatted, URL-encoded, and combined correctly. You can copy the exact link needed for your campaigns, ensuring your Google Analytics or other tracking platforms receive perfectly clean data.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
