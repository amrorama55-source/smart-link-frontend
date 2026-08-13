import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link as LinkIcon, Type, Palette, Maximize, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import SEO from '../../components/SEO';

const QrCodeGenerator = () => {
  const [text, setText] = useState('https://by-smartlink.com');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#0f172a'); // default slate-900
  const [size, setSize] = useState(256);
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-canvas');
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartlink-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const presetColors = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
    { name: 'Midnight', fg: '#ffffff', bg: '#0f172a' },
    { name: 'Brand', fg: '#ffffff', bg: '#3b82f6' },
    { name: 'Forest', fg: '#ffffff', bg: '#059669' },
    { name: 'Sunset', fg: '#ffffff', bg: '#ea580c' },
    { name: 'Grape', fg: '#ffffff', bg: '#7e22ce' },
  ];

  const applyPreset = (preset) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  };

  // Schema for WebApplication tool
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free QR Code Generator",
    "url": "https://by-smartlink.com/tools/qr-code-generator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Create custom QR codes instantly. Customize colors, size, and download as PNG for free."
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <SEO 
        title="Free QR Code Generator Online | Create QR Codes Instantly"
        description="Generate unlimited high-quality QR codes for free. Customize colors and size. Instantly download as PNG. No signup required."
        schema={schema}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo-v1.svg" alt="Smart Link Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Smart Link</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/register" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">
              Create Account
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-sm shadow-blue-500/20 hover:shadow-blue-500/40">
              Try Advanced Features
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            100% Free Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Free QR Code Generator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Create beautiful, custom QR codes in seconds. Enter your link, customize the look, and download instantly. No sign-up required.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-800 p-6 md:p-8 backdrop-blur-sm">
              
              {/* Input Section */}
              <div className="space-y-4 mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <LinkIcon className="w-4 h-4" />
                  Your Link or Text
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com or any text..."
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              {/* Customization Grid */}
              <div className="grid sm:grid-cols-2 gap-8">
                
                {/* Colors */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Palette className="w-4 h-4" />
                    Colors
                  </label>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Code Color</label>
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">Color Presets</label>
                      <div className="flex flex-wrap gap-4">
                        {presetColors.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            style={{ background: `linear-gradient(135deg, ${preset.fg} 0%, ${preset.bg} 100%)` }}
                            title={preset.name}
                          >
                            <span 
                              className="w-4 h-4 rounded-sm shadow-sm border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: preset.fg }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Maximize className="w-4 h-4" />
                    Size Output
                  </label>
                  
                  <div className="space-y-4">
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="128"
                        max="1024"
                        step="32"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-blue-500 [&::-webkit-slider-thumb]:transition-colors"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>128px</span>
                      <span>{size} x {size} px</span>
                      <span>1024px</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Value Props */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-6 h-6 text-green-500 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Privacy First</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Generated locally in your browser. We don't save your data.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <Zap className="w-6 h-6 text-yellow-500 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Instant</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">No waiting. See your changes in real-time as you type.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <Globe className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Never Expires</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Static QR codes generated here will work forever.</p>
              </div>
            </div>
          </div>

          {/* Preview & Download */}
          <div className="lg:col-span-5 relative">
            {/* Decorative blob */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[3rem] blur-3xl opacity-20 dark:opacity-30"></div>
            
            <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              
              <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold">Live Preview</h2>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-8 overflow-hidden flex items-center justify-center transition-all duration-300">
                {/* Visual Preview scale to fit container if large */}
                <div style={{ transform: size > 256 ? `scale(${256/size})` : 'scale(1)', transformOrigin: 'center' }}>
                  <QRCodeCanvas
                    id="qr-canvas"
                    value={text || 'https://by-smartlink.com'}
                    size={size}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              
              <button
                onClick={handleDownload}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1"
              >
                <Download className="w-6 h-6" />
                Download PNG
              </button>
              
              <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
                Downloads a high-quality {size}x{size} PNG image
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* SEO Content Section */}
      <section className="bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 py-16 lg:py-24 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate dark:prose-invert lg:prose-lg">
          <h2 className="text-3xl font-bold text-center mb-12">How to Use Our Free QR Code Generator</h2>
          
          <div className="grid sm:grid-cols-3 gap-8 not-prose mb-16">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-4">1</div>
              <h4 className="font-bold mb-2 text-slate-900 dark:text-white">Enter Content</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Type or paste any URL, text, email, or phone number into the input field.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-4">2</div>
              <h4 className="font-bold mb-2 text-slate-900 dark:text-white">Customize</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Adjust the colors to match your brand and set the perfect output size for your needs.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-4">3</div>
              <h4 className="font-bold mb-2 text-slate-900 dark:text-white">Download</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Click download to get your high-resolution PNG file instantly, ready to use anywhere.</p>
            </div>
          </div>

          <h3>What is a QR Code?</h3>
          <p>
            A QR (Quick Response) code is a two-dimensional barcode that can be scanned by digital devices, such as smartphones, using their built-in cameras. They can store various types of information, most commonly URLs, text, contact information, and Wi-Fi credentials.
          </p>

          <h3>Why use our generator?</h3>
          <p>
            Our tool creates static QR codes completely free of charge. Unlike many other generators, we don't force you to sign up, we don't display ads, and your QR codes will never expire. Furthermore, all generation happens directly in your browser, ensuring your data remains private and secure.
          </p>
          
          <h3>Best practices for QR Codes</h3>
          <ul>
            <li><strong>Contrast is key:</strong> Ensure there is a high contrast between the QR code color and the background color. Dark codes on light backgrounds work best for scanning reliability.</li>
            <li><strong>Size matters:</strong> For printed materials, ensure the QR code is at least 2x2 cm (0.8x0.8 inches) to guarantee it can be easily scanned by most devices.</li>
            <li><strong>Test before printing:</strong> Always test your downloaded QR code with multiple devices and scanning apps before committing to a large print run.</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need advanced QR codes with analytics?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Track scans, edit destination URLs anytime, manage campaigns, and integrate with your existing workflow using Smart Link's complete link management platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Try Smart Link for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-700/50 hover:bg-blue-700/80 text-white font-semibold rounded-xl backdrop-blur-sm transition-colors border border-blue-500/30"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default QrCodeGenerator;
