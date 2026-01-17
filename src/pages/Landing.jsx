import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Moon, Sun } from 'lucide-react';

const translations = {
  ar: {
    login: 'تسجيل الدخول',
    start: 'ابدأ مجاناً',
    beta: '🎉 الآن في نسخة تجريبية (Beta)',
    'hero-title-1': 'كل روابطك في مكان واحد',
    'hero-title-2': '— برابط ذكي واحد',
    'hero-subtitle': 'أنشئ صفحة Bio احترافية، شاركها برابط أو QR، وتابع التفاعل بسهولة — بدون أدوات معقدة.',
    'cta-primary': 'جرّب الآن مجاناً',
    'cta-secondary': 'شاهد كيف يعمل',
    'no-credit-card': '✨ لا بطاقة ائتمان • إعداد خلال دقائق',
    'card-1-title': 'متابعة التفاعل',
    'card-1-desc': '1,234 نقرة هذا الشهر',
    'card-2-title': 'صفحة Bio جاهزة',
    'card-2-desc': 'جميع روابطك في مكان واحد',
    'card-3-title': 'QR Code ذكي',
    'card-3-desc': 'شاركه في أي مكان',
    'problem-title': 'روابطك كثيرة؟ جمهورك ضايع؟',
    'problem-desc': 'بدل ما تشارك عشرات الروابط في أماكن مختلفة، Smart Link يجمعها في صفحة واحدة ذكية، ويعطيك نظرة واضحة عن تفاعل جمهورك.',
    'value-title': 'بس رابط واحد… والباقي يصير أوضح',
    'value-subtitle': 'لا تعقيد، لا فوضى — فقط النتائج',
    'feature-1-title': '🎯 وضوح',
    'feature-1-desc': 'اعرف أي رابط يهتم به جمهورك فعلاً — مو بس أرقام، قرارات واضحة.',
    'feature-2-title': '⚡ بساطة',
    'feature-2-desc': 'أنشئ وشارك خلال دقائق بدون إعدادات معقدة أو دورات تدريبية.',
    'feature-3-title': '📱 مرونة',
    'feature-3-desc': 'شارك رابطك أو QR في أي مكان: Bio، كرت، مطعم، إعلان — حيث ما تبغى.',
    'how-title': 'كيف يعمل؟',
    'how-subtitle': 'بسيط جداً — ما يحتاج شرح',
    'step-1-title': 'أنشئ حسابك',
    'step-1-desc': 'تسجيل بسيط وسريع',
    'step-2-title': 'أضف روابطك',
    'step-2-desc': 'في صفحة Bio واحدة',
    'step-3-title': 'شارك الرابط',
    'step-3-desc': 'أو QR في أي مكان',
    'step-4-title': 'تابع التفاعل',
    'step-4-desc': 'بسهولة ووضوح',
    'usecase-title': 'مناسب لك إذا كنت…',
    'use-1-title': 'صانع محتوى',
    'use-1-desc': 'تبغى Bio مرتب وجذاب',
    'use-2-title': 'فريلانسر',
    'use-2-desc': 'تشارك أعمالك باحترافية',
    'use-3-title': 'مطعم أو كافيه',
    'use-3-desc': 'تستخدم QR للمنيو والروابط',
    'use-4-title': 'أي شخص',
    'use-4-desc': 'يريد رابط واحد ذكي بدل الفوضى',
    'beta-title': 'نطوّر Smart Link معاك',
    'beta-desc': 'Smart Link حالياً في نسخة تجريبية (Beta) نطوّرها مع مستخدمينا الأوائل بناءً على ملاحظاتهم.',
    'beta-feedback': 'رأيك يهمنا، وملاحظتك تصنع الفرق ✨',
    'final-cta-title': 'ابدأ الآن — مجاناً',
    'final-cta-subtitle': 'جرّب Smart Link اليوم وشوف الفرق بنفسك',
    'final-cta-button': 'أنشئ Smart Link الخاص بك',
    'no-commitment': '✨ لا التزام • ألغِ في أي وقت',
    'footer-desc': 'كل روابطك في مكان واحد',
    'footer-product': 'المنتج',
    'footer-features': 'الميزات',
    'footer-pricing': 'الأسعار',
    'footer-updates': 'التحديثات',
    'footer-support': 'الدعم',
    'footer-help': 'المساعدة',
    'footer-contact': 'تواصل معنا',
  },
  en: {
    login: 'Login',
    start: 'Get Started',
    beta: '🎉 Now in Beta',
    'hero-title-1': 'All your links in one place',
    'hero-title-2': '— with one smart link',
    'hero-subtitle': 'Create a professional Bio page, share it via link or QR, and track engagement easily — no complex tools needed.',
    'cta-primary': 'Try it free now',
    'cta-secondary': 'See how it works',
    'no-credit-card': '✨ No credit card • Set up in minutes',
    'card-1-title': 'Track Engagement',
    'card-1-desc': '1,234 clicks this month',
    'card-2-title': 'Bio Page Ready',
    'card-2-desc': 'All your links in one place',
    'card-3-title': 'Smart QR Code',
    'card-3-desc': 'Share it anywhere',
    'problem-title': 'Too many links? Lost audience?',
    'problem-desc': 'Instead of sharing dozens of links in different places, Smart Link gathers them in one smart page and gives you a clear view of your audience engagement.',
    'value-title': 'Just one link… and everything becomes clearer',
    'value-subtitle': 'No complexity, no chaos — just results',
    'feature-1-title': '🎯 Clarity',
    'feature-1-desc': 'Know which link your audience actually cares about — not just numbers, clear decisions.',
    'feature-2-title': '⚡ Simplicity',
    'feature-2-desc': 'Create and share in minutes without complex settings or training courses.',
    'feature-3-title': '📱 Flexibility',
    'feature-3-desc': 'Share your link or QR anywhere: Bio, card, restaurant, ad — wherever you want.',
    'how-title': 'How does it work?',
    'how-subtitle': 'Very simple — no explanation needed',
    'step-1-title': 'Create your account',
    'step-1-desc': 'Simple and fast registration',
    'step-2-title': 'Add your links',
    'step-2-desc': 'In one Bio page',
    'step-3-title': 'Share the link',
    'step-3-desc': 'Or QR anywhere',
    'step-4-title': 'Track engagement',
    'step-4-desc': 'Easily and clearly',
    'usecase-title': 'Perfect for you if you are…',
    'use-1-title': 'Content Creator',
    'use-1-desc': 'Want an organized and attractive Bio',
    'use-2-title': 'Freelancer',
    'use-2-desc': 'Share your work professionally',
    'use-3-title': 'Restaurant or Cafe',
    'use-3-desc': 'Use QR for menu and links',
    'use-4-title': 'Anyone',
    'use-4-desc': 'Wants one smart link instead of chaos',
    'beta-title': 'We develop Smart Link with you',
    'beta-desc': 'Smart Link is currently in Beta version, which we develop with our early users based on their feedback.',
    'beta-feedback': 'Your opinion matters, and your feedback makes a difference ✨',
    'final-cta-title': 'Start now — for free',
    'final-cta-subtitle': 'Try Smart Link today and see the difference yourself',
    'final-cta-button': 'Create your Smart Link',
    'no-commitment': '✨ No commitment • Cancel anytime',
    'footer-desc': 'All your links in one place',
    'footer-product': 'Product',
    'footer-features': 'Features',
    'footer-pricing': 'Pricing',
    'footer-updates': 'Updates',
    'footer-support': 'Support',
    'footer-help': 'Help',
    'footer-contact': 'Contact Us',
  }
};

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = lang === 'ar' || lang === 'ur' || lang === 'fa';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [lang, isRTL]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const t = (key) => translations[lang]?.[key] || key;

  const switchLanguage = (newLang) => {
    setLang(newLang);
    setMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [mobileMenuOpen]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* RESPONSIVE NAVIGATION */}
      <nav className={`${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </div>
              <span className={`text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden xs:inline`}>
                Smart Link
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Language Switcher */}
              <div className="inline-flex items-center bg-white dark:bg-gray-700 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => switchLanguage('ar')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    lang === 'ar'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => switchLanguage('en')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    lang === 'en'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
              
              {/* Auth Buttons */}
              <Link to="/login" className={`font-semibold transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                {t('login')}
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
              >
                {t('start')}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`menu-button p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className={`mobile-menu lg:hidden pb-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-2`}>
              <div className="pt-4 space-y-3">
                {/* Language Switcher Mobile */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => switchLanguage('ar')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      lang === 'ar'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      lang === 'en'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    English
                  </button>
                </div>

                {/* Auth Buttons Mobile */}
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-center py-3 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold shadow-lg"
                >
                  {t('start')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - RESPONSIVE */}
      <section className={`${darkMode ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900'} text-white py-12 sm:py-16 lg:py-32 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-right">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6 border border-white/30">
                <span>{t('beta')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6">
                <span>{t('hero-title-1')}</span><br/>
                <span className={darkMode ? 'text-blue-400' : 'text-blue-200'}>{t('hero-title-2')}</span>
              </h1>
              <p className={`text-base sm:text-xl lg:text-2xl ${darkMode ? 'text-gray-300' : 'text-blue-100'} mb-6 sm:mb-8 leading-relaxed px-4 lg:px-0`}>
                {t('hero-subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <Link 
                  to="/register" 
                  className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50'} px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-xl text-center`}
                >
                  {t('cta-primary')} 🚀
                </Link>
                <a 
                  href="#how-it-works" 
                  className={`${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600' : 'bg-white/10 hover:bg-white/20 border-white/30'} backdrop-blur-sm text-white border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all text-center`}
                >
                  {t('cta-secondary')}
                </a>
              </div>
              <p className={`text-xs sm:text-sm mt-3 sm:mt-4 ${darkMode ? 'text-gray-400' : 'text-blue-200'}`}>
                {t('no-credit-card')}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/10 border-white/20'} backdrop-blur-lg rounded-3xl p-8 border animate-float`}>
                <div className="space-y-5">
                  {[
                    { icon: 'M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z', title: t('card-1-title'), desc: t('card-1-desc'), bg: 'bg-blue-100', color: 'text-blue-600' },
                    { icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z', title: t('card-2-title'), desc: t('card-2-desc'), bg: 'bg-sky-100', color: 'text-sky-600' },
                    { icon: 'M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z', title: t('card-3-title'), desc: t('card-3-desc'), bg: 'bg-indigo-100', color: 'text-indigo-600' }
                  ].map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-lg hover:shadow-xl transition-shadow">
                      <div className={`w-14 h-14 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <svg className={`w-7 h-7 ${card.color}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={card.icon} clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-base mb-1">{card.title}</p>
                        <p className="text-sm text-gray-500">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - RESPONSIVE */}
      <section className={`py-12 sm:py-16 lg:py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6`}>
            {t('problem-title')}
          </h2>
          <p className={`text-base sm:text-lg lg:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-3xl mx-auto`}>
            {t('problem-desc')}
          </p>
        </div>
      </section>

      {/* Value Proposition - RESPONSIVE */}
      <section className={`py-12 sm:py-16 lg:py-20 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>
              {t('value-title')}
            </h2>
            <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('value-subtitle')}</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border hover:-translate-y-2`}>
                <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>{t(`feature-${num}-title`)}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-base sm:text-lg leading-relaxed`}>{t(`feature-${num}-desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - RESPONSIVE */}
      <section id="how-it-works" className={`py-12 sm:py-16 lg:py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>
              {t('how-title')}
            </h2>
            <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('how-subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white text-2xl sm:text-3xl font-bold shadow-lg">
                  {num}
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t(`step-${num}-title`)}</h3>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t(`step-${num}-desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases - RESPONSIVE */}
      <section className={`py-12 sm:py-16 lg:py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              {t('usecase-title')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all border`}>
                <div className="text-3xl sm:text-4xl mb-3">{['✨', '💼', '🍔', '🚀'][num - 1]}</div>
                <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t(`use-${num}-title`)}</h3>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t(`use-${num}-desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Notice - RESPONSIVE */}
      <section className={`py-12 sm:py-16 lg:py-20 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-sky-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-3xl p-8 sm:p-12 shadow-xl border`}>
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🎯</div>
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>
              {t('beta-title')}
            </h2>
            <p className={`text-base sm:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 leading-relaxed`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-bold">Smart Link</span> {t('beta-desc')}
            </p>
            <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('beta-feedback')}</p>
          </div>
        </div>
      </section>

      {/* Final CTA - RESPONSIVE */}
      <section className={`py-16 sm:py-20 lg:py-24 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900'} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            {t('final-cta-title')}
          </h2>
          <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-300' : 'text-blue-100'} mb-8 sm:mb-10`}>
            {t('final-cta-subtitle')}
          </p>
          <Link 
            to="/register" 
            className={`inline-block ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50'} px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all shadow-2xl`}
          >
            {t('final-cta-button')} 🚀
          </Link>
          <p className={`text-xs sm:text-sm mt-4 sm:mt-6 ${darkMode ? 'text-gray-400' : 'text-blue-200'}`}>
            {t('no-commitment')}
          </p>
        </div>
      </section>

      {/* Footer - RESPONSIVE */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg"></div>
                <span className="text-xl font-bold">Smart Link</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{t('footer-desc')}</p>
              <div className="flex gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4 text-sm sm:text-base">{t('footer-product')}</h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">{t('footer-features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('footer-pricing')}</a></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 text-sm sm:text-base">{t('footer-support')}</h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><a href="#help" className="hover:text-white transition-colors">{t('footer-help')}</a></li>
                <li><a href="mailto:support@smart-link.website" className="hover:text-white transition-colors">{t('footer-contact')}</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
              <div className="mt-6">
                <p className="text-gray-500 text-xs">© 2025 Smart Link</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 sm:pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">
                Made with ❤️ for a better web
              </p>
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap justify-center">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
                <a href="mailto:support@smart-link.website" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}