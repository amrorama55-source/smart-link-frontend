import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../utils/plans';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Link2, Menu, X, Moon, Sun, ChevronRight, ChevronLeft,
  BarChart3, Globe, Smartphone, Target, TrendingUp,
  Eye, MousePointerClick, Calendar, Zap, Shield,
  QrCode, CheckCircle, ArrowRight, ArrowLeft, Sparkles,
  Users, Clock, Lock, Code, Star, Quote, Copy, Play, Layout, Settings
} from 'lucide-react';
import SEO from '../components/SEO';

function VideoDemo() {
  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-gray-200/20 dark:border-white/10 bg-gray-950">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
        </div>
        <div className="ml-4 flex-1 bg-gray-800 rounded h-6 flex items-center px-3 text-xs text-gray-400 font-medium">
          sp.link/dashboard
        </div>
      </div>
      <div className="relative aspect-video">
        <video
          src="/marketing-demo.mp4"
          poster="/og-image.png"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          aria-label="Smart Link Platform Demo Video"
        />
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "إنشاء روابط ذكية", desc: "الصق الرابط، خصص الاسم المختصر، وأضف التصنيفات.", icon: Link2 },
    { title: "الاستهداف الذكي", desc: "وجّه المستخدمين حسب الجهاز أو الموقع الجغرافي.", icon: Target },
    { title: "بناء صفحة البايو", desc: "اسحب وأفلت الروابط، اختر القالب، وانشر.", icon: Layout },
    { title: "تتبّع التحليلات", desc: "رؤى فورية عن النقرات والموقع ونظام التشغيل.", icon: BarChart3 }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900/50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            كل ما تحتاجه في منصة واحدة
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            جولة سريعة في كيفية عمل سمارت لينك لإدارة وتحسين تواجدك الرقمي.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer border ${step === i ? 'bg-white dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700' : 'border-transparent opacity-60 hover:opacity-100'}`}
                onClick={() => setStep(i)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white dark:text-gray-900 font-bold flex-shrink-0 bg-gray-900 dark:bg-white`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{s.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 h-96 flex flex-col justify-center items-center text-center overflow-hidden relative">
             <AnimatePresence mode="wait">
               <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-sm">
                 {step === 0 && (
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-right">الصق وأنشئ</p>
                     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 text-left mb-4 text-sm overflow-hidden whitespace-nowrap font-mono text-gray-500">https://myshop.com/super-sale</div>
                     <div className="flex gap-2 items-center mb-4 text-right justify-start flex-row-reverse">
                       <span className="text-sm text-gray-600 dark:text-gray-300">الاسم المختصر:</span>
                       <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold">summer-sale</span>
                     </div>
                     <button className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded font-bold text-sm">إنشاء رابط ذكي</button>
                   </div>
                 )}
                 {step === 1 && (
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-right">إضافة قواعد الاستهداف</p>
                     <div className="space-y-3">
                       <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex-row-reverse">
                         <Smartphone className="w-4 h-4 text-gray-400" />
                         <div className="flex-1 text-right">
                           <p className="text-sm font-bold text-gray-900 dark:text-white">iOS</p>
                           <p className="text-xs text-gray-500">App Store</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex-row-reverse">
                         <Globe className="w-4 h-4 text-gray-400" />
                         <div className="flex-1 text-right">
                           <p className="text-sm font-bold text-gray-900 dark:text-white">فرنسا</p>
                           <p className="text-xs text-gray-500">/fr-fr</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
                 {step === 2 && (
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-right">تصميم صفحة البايو</p>
                     <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3"></div>
                     <p className="font-bold text-gray-900 dark:text-white text-sm">Sarah Creator</p>
                     <p className="text-xs text-gray-500 mb-4">@sarah_designs</p>
                     <div className="space-y-2">
                       <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                       <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                     </div>
                   </div>
                 )}
                 {step === 3 && (
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-right">تحليل النتائج</p>
                     <div className="flex items-end h-24 gap-2 mb-4 justify-between">
                       {[30, 50, 40, 70, 90, 60].map((h, i) => (
                         <div key={i} className="w-8 bg-blue-500 rounded-t" style={{ height: `${h}%` }}></div>
                       ))}
                     </div>
                     <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4 flex-row-reverse">
                       <div className="text-right">
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">12.5k</p>
                         <p className="text-xs text-gray-500">النقرات</p>
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">iOS</p>
                         <p className="text-xs text-gray-500">أفضل جهاز</p>
                       </div>
                     </div>
                   </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqs = [
    { q: "لماذا أحتاج سمارت لينك إذا كان لدي مختصر روابط؟", a: "مختصرات الروابط التقليدية تحسب النقرات فقط. سمارت لينك يذهب أعمق بتتبّع بيانات نظام التشغيل والموقع الجغرافي ومصدر الزيارات حتى تكشف النية الحقيقية وراء حركة مرورك." },
    { q: "كيف يزيد استهداف الأجهزة (iOS/Android) من التحويلات؟", a: "بدلاً من إرباك المستخدمين بزرين، تنشئ رابط ذكي واحد. نكتشف جهازهم فوراً ونوجّه مستخدمي iOS لمتجر آبل وأندرويد لغوغل بلاي." },
    { q: "هل يمكنني تتبّع نقرات الروابط مجاناً؟", a: "نعم! نؤمن أن التحليلات العميقة يجب أن تكون متاحة للجميع. تحصل على تحليلات فورية لجميع روابطك مجاناً تماماً." },
    { q: "هل يمكنني استخدام نطاقي المخصص؟", a: "بالتأكيد. يمكنك ربط نطاقك الخاص للحفاظ على هوية علامتك التجارية." },
    { q: "كيف أنشئ رابط بايو مجاني؟", a: "سجّل حسابك، اختر اسم المستخدم، والصق روابطك. يمكنك تخصيص صفحة البايو بالقوالب والنشر خلال أقل من دقيقتين." }
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-gray-950 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">الأسئلة الشائعة</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">كل ما تحتاج معرفته عن سمارت لينك.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50">
              <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="w-full flex items-center justify-between p-6 text-right focus:outline-none flex-row-reverse">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex-1 mr-4">{faq.q}</h3>
                <ChevronLeft className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openFAQ === i ? '-rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {openFAQ === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 text-base leading-relaxed text-right border-t border-gray-100 dark:border-gray-800 mx-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPageAR() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();

  const SUCCESS_URL = 'https://www.by-smartlink.com/success';

  const navigate = useNavigate();
  const handleStartTrial = () => {
    navigate('/register?trial=true');
  };

  const buildCheckoutUrl = (baseUrl, userId) => {
    if (!baseUrl) return null;
    const url = new URL(baseUrl);
    if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
    url.searchParams.set('checkout[success_url]', SUCCESS_URL);
    return url.toString();
  };

  const handleCheckout = (plan, yearly) => {
    if (plan.id === 'free') { navigate('/register'); return; }
    if (plan.id === 'trial') { navigate('/register?trial=true'); return; }
    if (!user) { navigate('/register?redirect=pricing'); return; }
    const rawUrl = yearly ? plan.checkoutUrl.yearly : plan.checkoutUrl.monthly;
    const checkoutUrl = buildCheckoutUrl(rawUrl, user?._id || user?.id);
    if (!checkoutUrl) { alert('Checkout link not available'); return; }
    window.location.href = checkoutUrl;
  };

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-cairo transition-colors duration-300">
      <SEO
        title="سمارت لينك — البنية التحتية للتسويق للمبدعين والمسوقين"
        description="اختصر الروابط، أنشئ صفحة البايو، تتبّع كل نقرة، وبِع منتجاتك الرقمية. المنصة المتكاملة بديل ClickMagick و Linktree."
      />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/[0.06]' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/ar" className="flex items-center gap-2">
              <img src="/logo-v1.svg" alt="Smart Link" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">سمارت لينك</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 pt-1">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">المميزات</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">كيف يعمل</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">الأسعار</a>
            </div>
            
            {/* Actions */}
            <div className="hidden md:flex items-center gap-4 pt-1">
              <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-sans">English</Link>
              <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-200">تسجيل الدخول</Link>
              <Link to="/register" className="text-sm font-semibold px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity">ابدأ مجاناً</Link>
            </div>
            
            <div className="md:hidden flex items-center gap-2">
               <button onClick={toggleDarkMode} className="p-2 text-gray-500">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-500">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col gap-4 p-4">
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium">المميزات</a>
                  <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium">كيف يعمل</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300 font-medium">الأسعار</a>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-500 font-sans">English</Link>
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                  <Link to="/login" className="text-gray-900 dark:text-white font-semibold">تسجيل الدخول</Link>
                  <Link to="/register" className="text-center py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold">ابدأ مجاناً</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" /> بنية تحتية للتسويق
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
                <span className="block">رابط واحد.</span>
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">إمكانيات بلا حدود.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                اختصر الروابط، أنشئ صفحة البايو، تتبّع كل نقرة — وبِع منتجاتك الرقمية. المنصة المتكاملة للمبدعين والمسوقين.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/register">
                  <button className="w-full sm:w-auto px-7 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                    ابدأ مجاناً <ArrowLeft className="w-4 h-4" />
                  </button>
                </Link>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-7 py-3.5 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors font-semibold text-sm flex justify-center items-center gap-2">
                  شاهد كيف يعمل <Play className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /><span>بدون بطاقة ائتمان</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /><span>مجاني للأبد</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /><span>جاهز خلال دقيقتين</span></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="relative hidden sm:block">
              <VideoDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-sm font-medium mb-4">المميزات الأساسية</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">أدوات متقدمة لنجاح حملاتك</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">كل ما تحتاجه لإدارة الروابط وتتبع الجمهور وتنمية أعمالك.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'درع حماية المرور المتقدم', desc: 'قلّل هدر الميزانية الإعلانية من خلال فلترة الزيارات الآلية. نظام فلترة متعدد الإشارات يضمن تركيز ميزانيتك على التفاعل الحقيقي.' },
              { icon: Zap, title: 'التحسين التلقائي', desc: 'خوارزمية الأداء لدينا توجّه حركة المرور تلقائياً للنسخة الأفضل أداءً في اختبارات A/B، مما يزيد كفاءة التحويل.' },
              { icon: BarChart3, title: 'تحليلات الكفاءة', desc: 'رؤى فورية لحملاتك. شاهد بالضبط كم تم تقليل الهدر الإعلاني وكم تم استرداد الأداء.' },
              { icon: Smartphone, title: 'استهداف الأجهزة بدقة', desc: 'وجّه مستخدمي iOS لمتجر آبل وأندرويد لغوغل بلاي فوراً. أزل الاحتكاك وتأكد أن كل مستخدم يصل للوجهة الصحيحة.' },
              { icon: Globe, title: 'حماية الحملات العالمية', desc: 'أعد توجيه المستخدمين حسب البلد أو اللغة بزمن صفر. حافظ على تحويلات عالية وملاءمة محلية.' },
              { icon: Code, title: 'واجهة برمجية للمؤسسات', desc: 'ادمج محرك حماية الأداء مباشرة في سير عملك أو منتجك لتوفير قيمة مضافة لعملائك.' }
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
            
            {/* Creator Paywall Feature - Spans 2 cols on lg, 1 on md */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group p-8 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-200 dark:border-blue-500/20 transition-all duration-300 lg:col-span-1 md:col-span-2 relative overflow-hidden flex flex-col">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">جدار الدفع للمبدعين</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                بِع المنتجات الرقمية والأدلة الحصرية أو الروابط المميزة مباشرة من صفحة البايو. ابدأ بالربح من جمهورك فوراً.
              </p>
              <div className="mt-auto p-4 bg-white dark:bg-gray-900 rounded-xl border border-blue-100 dark:border-blue-500/10">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">مدعوم بأمان من Stripe</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">نستخدم Stripe لمعالجة المدفوعات. أموالك محمية وتُحوّل مباشرة لحسابك البنكي.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Creator Monetization Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">لصنّاع المحتوى</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">حوّل صفحة البايو إلى مصدر دخل</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">بدون برمجة. بدون إعداد معقد. فقط أضف سعراً لمحتواك وابدأ بالربح — متابعوك يدفعون مباشرة من رابط البايو.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { title: 'ربط حسابك البنكي', desc: 'اربط حسابك على Stripe بسهولة من خلال لوحة التحكم الآمنة.' },
              { title: 'إنشاء منتجك', desc: 'أضف قسم "جدار الدفع"، حدد السعر، واربط محتواك السري.' },
              { title: 'استلام الأرباح', desc: 'جمهورك يدفع بأمان عبر Stripe. الأموال تُحوّل لحسابك فوراً.' }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-right">
                <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold flex items-center justify-center mb-6">{i + 1}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">ماذا يمكنك أن تبيع؟</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[ { e: '📄', l: 'أدلة PDF' }, { e: '🎥', l: 'فيديوهات حصرية' }, { e: '🔗', l: 'روابط سرية' }, { e: '💻', l: 'قوالب وأدوات' }, { e: '🎵', l: 'ملفات صوتية' }, { e: '📸', l: 'بريستات' }, { e: '📚', l: 'كتب إلكترونية' }, { e: '🌟', l: 'وصول مميز' } ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-xl">{item.e}</span><span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.l}</span>
                </div>
              ))}
            </div>
            <Link to="/register">
              <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity">ابدأ البيع مجاناً</button>
            </Link>
            <p className="mt-4 text-xs text-gray-500">نأخذ 5% فقط من كل عملية بيع. تحتفظ بـ 95%.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">ماذا يقول المستخدمون</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
             {[
              { quote: "Tested SmartLink today, quick honest review. Setup was simple, the dashboard is clean, and everythin...", author: "Karl Beismann", role: "@karlbeis", link: "https://x.com/karlbeis" },
              { quote: "Makes sharing one link for multiple destinations feel easy and tidy, that’s useful for campaigns or social bios.", author: "Vineer", role: "@vineerpasam", link: "https://x.com/vineerpasam" },
              { quote: "It's a solid tool for creators and businesses who want real data instead of guesses. Clean dashboard and real-time link tracking. Good for link-in-bio pages and short links.", author: "Chandan H", role: "@_Chandan_17", link: "https://x.com/_Chandan_17" }
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 text-left hover:shadow-lg transition-shadow" dir="ltr">
                <div className="flex gap-1 mb-4 text-yellow-500">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-sans">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t.author}</p>
                  <a href={t.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{t.role}</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-950 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">خطط مرنة لكل مرحلة</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">ابدأ مجاناً، ترقّى مع نموك. بدون رسوم خفية، إلغاء في أي وقت.</p>
            <div className="flex items-center justify-center gap-4">
<button
  onClick={() => setIsYearly(!isYearly)}
style={{
  width: 56,
  height: 30,
  borderRadius: 20,
  backgroundColor: isYearly ? '#3b82f6' : '#6b7280',
  position: 'relative',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',  // ← هاد هو المهم
  boxSizing: 'border-box',
}}
>
  <motion.div
    animate={{ x: isYearly ? 22 : 0 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    style={{  // الثامب
   width: 22,
  height: 22,
  borderRadius: '50%',
  backgroundColor: 'white',
  position: 'absolute',
  top: 3,              // ← رقم ثابت (height 28 - thumb 22 = 6 ÷ 2 = 3)
  left: 3,
}}
  />
</button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>سنوي</span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">وفّر 25%</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan, i) => {
              // Map English plan names to Arabic equivalents for display
              const arName = plan.id === 'free' ? 'المبتدئ' : plan.id === 'pro' ? 'المبدع المحترف' : 'الأعمال المتقدم';
              const arDesc = plan.id === 'free' ? 'مثالي للتجربة والمشاريع الشخصية' : plan.id === 'pro' ? 'حقّق أقصى عائد مع ذكاء الأرباح' : 'محرك ذكاء اصطناعي للوكالات المحترفة';
              const arFeatures = plan.id === 'free' ? [
                '5 روابط ذكية/شهر', 'تحليلات نقرات أساسية', 'منشئ صفحة بايو متميز', 'جدار دفع للمبدعين (Stripe Connect)', 'رسوم المنصة: 5% لكل عملية بيع', 'أكواد QR ثابتة', 'حماية SSL قياسية'
              ] : plan.id === 'pro' ? [
                'كل مميزات المبتدئ', 'لوحة ذكاء الأرباح', 'الدرع التلقائي (حماية البوتات)', 'استرداد الإيرادات (اللغة)', 'نطاقات مخصصة موثقة', 'استهداف أجهزة متقدم', 'استهداف جغرافي (مستوى الدولة)', 'روابط ذكية غير محدودة'
              ] : [
                'كل مميزات المحترف', 'اختبار A/B تلقائي بالذكاء الاصطناعي', 'تتبّع التحويلات وعائد الاستثمار', 'حماية متقدمة من الاحتيال الإعلاني', 'استهداف حسب المدينة ومزود الخدمة', 'بكسلات إعادة استهداف مميزة', 'مدير حساب شخصي'
              ];
              const arCta = plan.id === 'free' ? 'ابدأ مجاناً' : plan.id === 'pro' ? 'فتح قوة المحترف' : 'الترقية للمتقدم';
              return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative p-8 rounded-2xl flex flex-col ${plan.popular ? 'bg-gray-900 dark:bg-gray-800 text-white border-2 border-blue-500 shadow-xl scale-100 md:scale-[1.02] z-10' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full w-max">الأكثر شعبية</div>}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{arName}</h3>
                  <p className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>{arDesc}</p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                  <span className={`text-sm font-medium ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/شهر</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {arFeatures.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className={`w-4 h-4 mt-0.5 ${plan.popular ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout(plan, isYearly)} className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors mb-3 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  {arCta}
                </button>
                {plan.trialAvailable && (
                  <button onClick={handleStartTrial} className="w-full py-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                    جرّب مجاناً لمدة {plan.trialDays} أيام
                  </button>
                )}
                {plan.id !== 'free' && <p className={`text-center mt-3 text-xs ${plan.popular ? 'text-gray-500' : 'text-gray-400'}`}>إلغاء في أي وقت، بدون أسئلة</p>}
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/40 via-gray-900 to-indigo-900/40 dark:from-blue-900/20 dark:via-gray-950 dark:to-indigo-900/20 opacity-80"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">مستعد للتسويق بذكاء؟</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">انضم لأكثر من 10,000 مبدع وشركة يستخدمون سمارت لينك لتحسين تواجدهم الرقمي.</p>
          <Link to="/register">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">ابدأ الآن — مجاناً</button>
          </Link>
          <p className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> بدون بطاقة ائتمان • إلغاء في أي وقت
          </p>
        </div>
      </section>

      {/* FAQ */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <FAQSection />
      </div>

      {/* About Us */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">مهمتنا: تمكين المؤسسين والمبدعين</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                سمارت لينك وُلد من فكرة بسيطة: أدوات التسويق الاحترافية لا يجب أن تكون محبوسة خلف اشتراكات مكلفة.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                سواء كنت مؤسس SaaS يطلق منتجه الأول، أو مسوّق يحسّن حملاته، أو مبدع يبني علامته — نوفر لك أدوات التحليلات والاستهداف التي تحتاجها للنجاح.
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-500"/> صُنع بحب من فريق عالمي متخصص</p>
            </div>
            <div className="space-y-6">
               {[
                { title: 'الخصوصية أولاً', desc: 'لا نتتبّع مستخدميك شخصياً. فقط بيانات نظيفة وقابلة للتنفيذ.', icon: Shield },
                { title: 'أداء في الحمض النووي', desc: 'روابط خفيفة تُحمّل بالمللي ثانية عبر العالم.', icon: Zap },
                { title: 'آمن وموثوق', desc: 'وقت تشغيل 99.9% مع أمان بمستوى المؤسسات لكل رابط.', icon: Lock }
              ].map((v, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0 text-gray-900 dark:text-white"><v.icon className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{v.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 pt-16 pb-8 border-t border-gray-100 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/ar" className="flex items-center gap-2 mb-4">
                <img src="/logo-v1.svg" alt="Smart Link" className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">سمارت لينك</span>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">منصة إدارة الروابط المتقدمة للمبدعين العصريين.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">المنتج</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/dashboard" className="hover:text-gray-900 dark:hover:text-white">لوحة التحكم</Link></li>
                <li><Link to="/pricing" className="hover:text-gray-900 dark:hover:text-white">الأسعار</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">الحلول</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/for-creators" className="hover:text-gray-900 dark:hover:text-white">للمبدعين</Link></li>
                <li><Link to="/for-marketers" className="hover:text-gray-900 dark:hover:text-white">للمسوقين</Link></li>
                <li><Link to="/for-ecommerce" className="hover:text-gray-900 dark:hover:text-white">للتجارة الإلكترونية</Link></li>
                <li><Link to="/for-affiliates" className="hover:text-gray-900 dark:hover:text-white">للمسوقين بالعمولة</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">الموارد</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/faq" className="hover:text-gray-900 dark:hover:text-white">الأسئلة الشائعة</Link></li>
                <li><Link to="/blog" className="hover:text-gray-900 dark:hover:text-white">المدونة</Link></li>
                <li><a href="mailto:support@by-smartlink.com" className="hover:text-gray-900 dark:hover:text-white">الدعم الفني</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 سمارت لينك. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-4 flex-row-reverse">
              <a href="https://www.uneed.best/tool/smart-link" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://www.uneed.best/EMBED3.png" alt="Uneed Embed Badge" className="h-10" />
              </a>
              <a href="https://www.saashub.com/smart-link-pro?utm_source=badge&utm_campaign=badge&utm_content=smart-link-pro&badge_variant=color&badge_kind=approved" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="Smart Link Pro badge" className="h-10" />
              </a>
              <div className="flex gap-4 mr-4">
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">سياسة الخصوصية</Link>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">شروط الخدمة</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
