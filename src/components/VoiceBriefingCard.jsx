import { useState, useEffect, useRef } from 'react';
import { Mic, Play, Pause, Volume2, VolumeX, Sparkles, Shield, TrendingUp, Globe, Bot } from 'lucide-react';

export default function VoiceBriefingCard({ stats, user }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);

  const userName = user?.name ? user.name.split(' ')[0] : (lang === 'ar' ? 'المسوّق' : 'Marketer');
  const totalClicks = stats?.totalClicks || 0;
  const botClicks = stats?.botClicks || 0;
  const savedAdSpend = stats?.savedAdSpend || Math.round(botClicks * 0.75);
  const topCountry = stats?.topCountries?.[0]?.country || (lang === 'ar' ? 'غير محدد' : 'Global');
  const mobileShare = stats?.mobilePercentage || 0;

  // Generate briefing text based on real stats
  const briefingEn = totalClicks > 0
    ? `Good day ${userName}. Here is your autonomous marketing briefing. Across your active campaigns, you generated ${totalClicks.toLocaleString()} total clicks. Our Traffic Shield identified and blocked ${botClicks.toLocaleString()} automated bot clicks, protecting approximately $${savedAdSpend.toLocaleString()} of your ad budget. Your top audience is in ${topCountry}, with ${mobileShare}% browsing on mobile. Recommendation: Keep Auto-Shield active and consider routing mobile traffic directly to dedicated checkout pages.`
    : `Welcome ${userName}. Your Autonomous AI Marketing Agent is ready. You currently have ${stats?.totalLinks || 0} links tracked. Share your protected smart links in your campaigns, and I will filter out datacenter bots and deliver real-time voice intelligence on your ROAS.`;

  const briefingAr = totalClicks > 0
    ? `أهلاً بك يا ${userName}. إليك إحاطتك التسويقية الذكية. سجلت حملاتك ${totalClicks.toLocaleString()} نقرة إجمالية. قام درع الحماية الذكي بحجب ${botClicks.toLocaleString()} نقرة وهمية من البوتات ومراكز البيانات، مما وفر لميزانيتك الإعلانية ما يقارب ${savedAdSpend.toLocaleString()} دولار. الجمهور الأكثر تفاعلاً يقع في ${topCountry}، مع نسبة تصفح عبر الهاتف تبلغ ${mobileShare}%. نصيحة الوكيل: استمر في تفعيل درع الحماية ووجّه حركة الموبايل لصفحات الشراء المباشرة.`
    : `أهلاً بك يا ${userName}. وكيلك التسويقي بالذكاء الاصطناعي جاهز. لديك حالياً ${stats?.totalLinks || 0} روابط. شارك روابطك المحمية في حملاتك وسأقوم بحجب نقرات البوتات وتزويدك بتقرير صوتي ذكي عن العائد الإعلاني.`;

  const activeBriefing = lang === 'ar' ? briefingAr : briefingEn;

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(activeBriefing);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Find best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice = voices.find(v => 
        lang === 'ar' ? v.lang.startsWith('ar') : (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')))
      );
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleLanguageChange = (newLang) => {
    if (isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setLang(newLang);
  };

  const bars = Array.from({ length: 24 }, (_, i) => ({
    h: 20 + ((i * 31) % 65),
    d: (i * 0.06).toFixed(2)
  }));

  return (
    <div className="bg-gradient-to-br from-[#0E1322] via-[#121829] to-[#1a152e] border border-violet-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden mb-8 text-white backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">AI Voice Marketing Agent</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Live Briefing
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Autonomous performance synthesis & budget leak detection</p>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('ar')}
            className={`px-3 py-1 rounded-lg text-xs font-bold font-cairo transition-all ${lang === 'ar' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Player and Waveform Row */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause spoken briefing' : 'Play spoken briefing'}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-600/40 active:scale-95 transition-all tactile-press"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </button>

          {/* Equalizer Audio Waves */}
          <div className="flex-1">
            <div className="flex items-center justify-between h-9 gap-1 sm:gap-1.5 px-2">
              {bars.map((b, i) => (
                <span
                  key={i}
                  className="block w-1 sm:w-1.5 rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${b.h}%` : '20%',
                    background: isPlaying
                      ? 'linear-gradient(to top, #3B82F6, #8B5CF6)'
                      : 'rgba(255, 255, 255, 0.15)',
                    animation: isPlaying ? `sl-wave 1.15s ease-in-out infinite` : 'none',
                    animationDelay: `${b.d}s`
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium px-2 mt-2">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`}></span>
                {isPlaying ? (lang === 'ar' ? 'جاري التحدث...' : 'Playing briefing...') : (lang === 'ar' ? 'جاهز للاستماع' : 'Click to listen')}
              </span>
              <span>{lang === 'ar' ? 'صوت عالي الدقة' : 'Voice Agent v2'}</span>
            </div>
          </div>
        </div>

        {/* Spoken Text Transcript */}
        <div className="mt-4 pt-4 border-t border-white/10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <p className="text-xs font-bold text-violet-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'النص المقروء:' : 'Spoken Briefing Transcript:'}
          </p>
          <p className="text-sm text-gray-200 leading-relaxed font-medium">
            "{activeBriefing}"
          </p>
        </div>
      </div>

      {/* Fast Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{lang === 'ar' ? 'البوتات المحجوبة' : 'Bots Blocked'}</p>
            <p className="text-sm font-black text-white truncate">{botClicks.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2.5">
          <TrendingUp className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{lang === 'ar' ? 'الوفر الإعلاني' : 'Protected Spend'}</p>
            <p className="text-sm font-black text-emerald-400 truncate">${savedAdSpend.toLocaleString()}</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{lang === 'ar' ? 'أعلى دولة' : 'Top Origin'}</p>
            <p className="text-sm font-black text-white truncate">{topCountry}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
