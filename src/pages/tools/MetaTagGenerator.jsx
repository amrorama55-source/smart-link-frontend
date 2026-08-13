import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const MetaTagGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateTags();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateTags = () => {
    let tags = [];
    if (formData.title) tags.push(`<title>${formData.title}</title>`);
    if (formData.description) tags.push(`<meta name="description" content="${formData.description}">`);
    if (formData.keywords) tags.push(`<meta name="keywords" content="${formData.keywords}">`);
    if (formData.author) tags.push(`<meta name="author" content="${formData.author}">`);
    if (formData.viewport) tags.push(`<meta name="viewport" content="${formData.viewport}">`);
    if (formData.robots) tags.push(`<meta name="robots" content="${formData.robots}">`);
    
    // Open Graph
    if (formData.ogTitle || formData.title) tags.push(`<meta property="og:title" content="${formData.ogTitle || formData.title}">`);
    if (formData.ogDescription || formData.description) tags.push(`<meta property="og:description" content="${formData.ogDescription || formData.description}">`);
    if (formData.ogImage) tags.push(`<meta property="og:image" content="${formData.ogImage}">`);
    tags.push(`<meta property="og:type" content="website">`);

    // Twitter
    if (formData.twitterCard) tags.push(`<meta name="twitter:card" content="${formData.twitterCard}">`);
    if (formData.ogTitle || formData.title) tags.push(`<meta name="twitter:title" content="${formData.ogTitle || formData.title}">`);
    if (formData.ogDescription || formData.description) tags.push(`<meta name="twitter:description" content="${formData.ogDescription || formData.description}">`);
    if (formData.ogImage) tags.push(`<meta name="twitter:image" content="${formData.ogImage}">`);

    setGeneratedCode(tags.join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTitleColor = (length) => {
    if (length === 0) return 'text-gray-400 dark:text-gray-500';
    if (length < 30) return 'text-yellow-500';
    if (length <= 60) return 'text-green-500';
    return 'text-red-500';
  };

  const getDescriptionColor = (length) => {
    if (length === 0) return 'text-gray-400 dark:text-gray-500';
    if (length < 120) return 'text-yellow-500';
    if (length <= 160) return 'text-green-500';
    return 'text-red-500';
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Meta Tag Generator",
    "url": "https://by-smartlink.com/tools/meta-tag-generator",
    "description": "Generate perfect SEO meta tags for your website in seconds. Real-time Google search preview and simple copy-paste code.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      <SEO 
        title="Free Meta Tag Generator | SEO Meta Tags Creator Online"
        description="Create perfect HTML meta tags for SEO with our free generator tool. Real-time Google preview, character counters, and one-click copy. No signup required."
        keywords="meta tag generator, seo meta tags, html meta tags generator, og tag generator, twitter card generator"
        schema={schemaData}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/logo-v1.svg" alt="Smart Link Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">Smart Link</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/register" 
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight mb-6">
            Free Meta Tag Generator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            Generate perfectly optimized HTML meta tags for your website in seconds. Boost your SEO and improve click-through rates on search engines and social media.
          </p>
        </div>
      </div>

      {/* Main Tool Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Tag Settings
            </h2>
            
            <div className="space-y-6">
              {/* Basic Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Basic Meta Tags</h3>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Page Title</label>
                    <span className={`text-xs font-medium ${getTitleColor(formData.title.length)}`}>
                      {formData.title.length} / 60
                    </span>
                  </div>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Free Meta Tag Generator | SEO Tools"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description</label>
                    <span className={`text-xs font-medium ${getDescriptionColor(formData.description.length)}`}>
                      {formData.description.length} / 160
                    </span>
                  </div>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Briefly describe your page content to encourage clicks from search results..."
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords (Comma separated)</label>
                  <input 
                    type="text" 
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    placeholder="e.g. seo, meta tags, generator, html"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                    <input 
                      type="text" 
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe or Company Name"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Robots</label>
                    <select 
                      name="robots"
                      value={formData.robots}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="index, follow">Index, Follow (Recommended)</option>
                      <option value="index, nofollow">Index, No Follow</option>
                      <option value="noindex, follow">No Index, Follow</option>
                      <option value="noindex, nofollow">No Index, No Follow</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Social Tags (Open Graph & Twitter) */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Social Media Tags (Open Graph)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OG Title</label>
                    <input 
                      type="text" 
                      name="ogTitle"
                      value={formData.ogTitle}
                      onChange={handleInputChange}
                      placeholder="Leave blank to use Page Title"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter Card Type</label>
                    <select 
                      name="twitterCard"
                      value={formData.twitterCard}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="summary">Summary</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OG Description</label>
                  <textarea 
                    name="ogDescription"
                    value={formData.ogDescription}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Leave blank to use Meta Description"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL (OG & Twitter)</label>
                  <input 
                    type="url" 
                    name="ogImage"
                    value={formData.ogImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1200 x 630 pixels</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Code */}
          <div className="space-y-8">
            
            {/* Google Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/></svg>
                Google Search Preview
              </h2>
              
              <div className="bg-white dark:bg-[#202124] p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm font-sans">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-[#202124] dark:text-[#dadce0] truncate max-w-[280px] md:max-w-xs">Your Website Name</div>
                    <div className="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] truncate max-w-[280px] md:max-w-xs">https://yourwebsite.com</div>
                  </div>
                </div>
                <div className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1 truncate">
                  {formData.title || 'Your Page Title Will Appear Here'}
                </div>
                <div className="text-sm text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                  {formData.description || 'Your meta description will appear here. It should provide a concise summary of the page content to encourage users to click through to your website.'}
                </div>
              </div>
            </div>

            {/* Generated Code */}
            <div className="bg-gray-900 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors font-medium text-sm backdrop-blur-sm border border-indigo-500/30"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      Copy HTML
                    </>
                  )}
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                Generated Tags
              </h2>
              
              <div className="bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-gray-800">
                <pre className="text-gray-300 whitespace-pre-wrap word-break-all">
                  {generatedCode || '<!-- Start typing to generate meta tags -->'}
                </pre>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Educational Content Section */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg dark:prose-invert prose-indigo">
          <h2 className="text-3xl font-bold text-center mb-8">Ultimate Guide to SEO Meta Tags</h2>
          
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">What are Meta Tags?</h3>
              <p>
                Meta tags are snippets of HTML code that provide vital information about a web page to search engines and website visitors. They are placed in the <code>&lt;head&gt;</code> section of an HTML document and are completely invisible to regular users viewing the page content.
              </p>
              <p className="mt-2">
                Think of meta tags as a brief summary or "metadata" that tells search engine crawlers (like Googlebot) what your page is about, how to display it in search results, and how it should appear when shared on social media platforms.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Why are Meta Tags Important for SEO?</h3>
              <p>
                Despite the evolution of search engine algorithms, meta tags remain a crucial component of Technical and On-Page SEO. Here's why they matter:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>First Impressions:</strong> Your Title Tag and Meta Description form the core of your search snippet. They are your first opportunity to convince a user to click your link instead of a competitor's.</li>
                <li><strong>Click-Through Rate (CTR):</strong> A compelling meta description acts as organic ad copy. Higher CTRs can indirectly signal to search engines that your page is highly relevant, potentially boosting your rankings.</li>
                <li><strong>Context for Crawlers:</strong> Search engines rely on title tags to understand the primary topic of your page.</li>
                <li><strong>Social Sharing:</strong> Open Graph (OG) and Twitter Card tags ensure that when your link is shared on platforms like Facebook, Twitter, or LinkedIn, it displays a beautiful preview card with an image, title, and description, dramatically increasing engagement.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Best Practices for Writing Meta Tags</h3>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Title Tags:</strong> Keep them between 50-60 characters. Place your primary target keyword near the beginning, and include your brand name at the end.</li>
                <li><strong>Meta Descriptions:</strong> Aim for 150-160 characters. Write persuasively, include a call-to-action (CTA) if appropriate, and naturally weave in secondary keywords. Make sure every page has a unique description.</li>
                <li><strong>Avoid Keyword Stuffing:</strong> The meta keywords tag is largely ignored by modern search engines like Google. If you use it, stick to a few highly relevant terms. Focus your effort on writing natural, descriptive titles and descriptions instead.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want more than just Meta Tags?</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Generate smart links with built-in SEO analytics, custom domains, and detailed tracking.
          </p>
          <Link 
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
          >
            Try Smart Link for Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default MetaTagGenerator;
