import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PLANS } from '../utils/plans';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Link2, Menu, X, Moon, Sun, ChevronLeft,
  BarChart3, Globe, Smartphone, Target, Zap, Shield,
  CheckCircle, CheckCircle2, Loader2, Copy, ArrowLeft, Sparkles, Lock, Code, Star, Layout,
  Mic, Pause, Play, Bot, FileText, Video, Music, Camera, BookOpen, Crown, Wrench,
  ShoppingBag, Megaphone, Rocket
} from 'lucide-react';
import SEO from '../components/SEO';

/* ------------------------------------------------------------------ */
/*  Design tokens + component classes (scoped under .sl)               */
/* ------------------------------------------------------------------ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

.sl{
  --sl-bg:#0A0A0F; --sl-bg2:#0F1117;
  --sl-surface:rgba(255,255,255,.04); --sl-surface2:rgba(255,255,255,.07);
  --sl-border:rgba(255,255,255,.10);
  --sl-text:#F8FAFC; --sl-muted:#94A3B8;
  --sl-good:#10B981; --sl-bad:#EF4444;
  --sl-blue:#3B82F6; --sl-violet:#8B5CF6; --sl-ring:#60A5FA;
  --sl-glow:.34; --sl-nav:rgba(10,10,15,.72);
  background:var(--sl-bg); color:var(--sl-text);
  font-family:'Cairo','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  isolation:isolate;
}
.sl[data-theme="light"]{
  --sl-bg:#F8FAFC; --sl-bg2:#EEF2F7;
  --sl-surface:rgba(255,255,255,.75); --sl-surface2:#FFFFFF;
  --sl-border:rgba(15,23,42,.10);
  --sl-text:#0F172A; --sl-muted:#475569;
  --sl-good:#047857; --sl-bad:#B91C1C;
  --sl-blue:#2563EB; --sl-violet:#7C3AED; --sl-ring:#2563EB;
  --sl-glow:.16; --sl-nav:rgba(248,250,252,.82);
}
.sl-latin{font-family:'Plus Jakarta Sans','Inter',system-ui,sans-serif}
.sl-text{color:var(--sl-text)}
.sl-muted{color:var(--sl-muted)}
.sl-good{color:var(--sl-good)}
.sl-bad{color:var(--sl-bad)}
.sl-bg2{background:var(--sl-bg2)}
.sl-grad{background:linear-gradient(90deg,var(--sl-blue),var(--sl-violet),var(--sl-blue));background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sl-shift 9s ease-in-out infinite alternate}
.sl-card{background:var(--sl-surface);border:1px solid var(--sl-border);border-radius:20px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.sl-inner{background:var(--sl-surface2);border:1px solid var(--sl-border);border-radius:12px}
.sl-divider{border-top:1px solid var(--sl-border)}
.sl-btn{background:linear-gradient(135deg,#2563EB,#7C3AED);color:#fff;font-weight:700;border-radius:12px;box-shadow:0 10px 30px -10px rgba(124,58,237,.65);transition:filter .2s,transform .2s}
.sl-btn:hover{filter:brightness(1.12)}
.sl-ghost{background:var(--sl-surface);color:var(--sl-text);border:1px solid var(--sl-border);font-weight:700;border-radius:12px;transition:background .2s,border-color .2s}
.sl-ghost:hover{background:var(--sl-surface2);border-color:var(--sl-muted)}
.sl-chip{background:var(--sl-surface);border:1px solid var(--sl-border);border-radius:999px;color:var(--sl-text)}
.sl-tint{background:color-mix(in srgb,var(--sl-blue) 14%,transparent);color:var(--sl-text);border:1px solid color-mix(in srgb,var(--sl-blue) 30%,transparent)}
.sl-iconbox{background:linear-gradient(135deg,color-mix(in srgb,var(--sl-blue) 28%,transparent),color-mix(in srgb,var(--sl-violet) 28%,transparent));border:1px solid var(--sl-border);color:var(--sl-text)}
.sl-popular{background:linear-gradient(var(--sl-bg2),var(--sl-bg2)) padding-box,linear-gradient(135deg,var(--sl-blue),var(--sl-violet)) border-box;border:2px solid transparent;border-radius:20px}

/* segmented control (pricing) */
.sl-seg{display:inline-flex;gap:4px;padding:6px;background:var(--sl-surface);border:1px solid var(--sl-border);border-radius:18px}
.sl-seg-btn{display:inline-flex;align-items:center;gap:8px;padding:.65rem 1.5rem;border-radius:13px;border:1px solid transparent;font-weight:700;font-size:.9rem;color:var(--sl-muted);transition:background .2s,color .2s,border-color .2s}
.sl-seg-btn:hover{color:var(--sl-text)}
.sl-seg-btn[aria-checked="true"]{background:var(--sl-surface2);color:var(--sl-text);border-color:var(--sl-border)}

/* inputs */
.sl-field:focus-within{outline:2px solid var(--sl-ring);outline-offset:2px}
.sl .sl-input{outline:none!important;background:transparent;border:none}
.sl input::placeholder{color:var(--sl-muted);opacity:.85}
.sl input[type=range]{accent-color:var(--sl-violet);width:100%}
.sl button{cursor:pointer}
.sl :is(a,button,input,select):focus-visible{outline:2px solid var(--sl-ring);outline-offset:2px;border-radius:8px}

/* ambient glows (animated) */
.sl-ambient{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:-1}
.sl-glow{position:absolute;border-radius:50%;background:radial-gradient(closest-side,var(--c,var(--sl-blue)),transparent);opacity:var(--sl-glow);will-change:transform,opacity;pointer-events:none}
@keyframes sl-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-90px,60px,0) scale(1.18)}}
@keyframes sl-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(100px,-50px,0) scale(1.12)}}
@keyframes sl-drift-c{0%,100%{transform:translate3d(0,0,0) scale(1.05)}50%{transform:translate3d(-60px,-80px,0) scale(.92)}}
@keyframes sl-breathe{0%,100%{opacity:calc(var(--sl-glow)*.65)}50%{opacity:var(--sl-glow)}}
.sl-drift-a{animation:sl-drift-a 20s ease-in-out infinite,sl-breathe 8s ease-in-out infinite}
.sl-drift-b{animation:sl-drift-b 26s ease-in-out infinite,sl-breathe 10s ease-in-out infinite}
.sl-drift-c{animation:sl-drift-c 23s ease-in-out infinite,sl-breathe 9s ease-in-out infinite}
@keyframes sl-shift{from{background-position:0% 50%}to{background-position:100% 50%}}

@keyframes sl-wave{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}
.sl-bar{display:block;width:4px;border-radius:4px;background:linear-gradient(to top,var(--sl-blue),var(--sl-violet));transform-origin:center;animation:sl-wave 1.15s ease-in-out infinite}
.sl-paused .sl-bar{animation-play-state:paused}
@keyframes sl-ping{75%,100%{transform:scale(2.4);opacity:0}}
.sl-ping{position:absolute;inset:0;border-radius:999px;background:var(--sl-bad);animation:sl-ping 1.6s cubic-bezier(0,0,.2,1) infinite}
@media (prefers-reduced-motion:reduce){
  .sl-bar,.sl-ping,.sl-grad,.sl-drift-a,.sl-drift-b,.sl-drift-c{animation:none!important}
}
`;

const fmtUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function AnimatedNumber({ value, format = (v) => Math.round(v).toLocaleString('en-US') }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const raf = useRef(0);

  useEffect(() => {
    if (reduce) { setDisplay(value); from.current = value; return undefined; }
    const start = performance.now();
    const a = from.current;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 450);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = a + (value - a) * eased;
      from.current = v;
      setDisplay(v);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, reduce]);

  return <span dir="ltr" className="tabular-nums inline-block">{format(display)}</span>;
}

/* ------------------------------------------------------------------ */
/*  Hero: link shortener (existing behavior kept)                      */
/* ------------------------------------------------------------------ */
function HeroShortener() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = (e) => {
    e.preventDefault();
    if (!url) return;
    setStatus('loading');

    // Simulate API delay
    setTimeout(() => {
      const randomStr = Math.random().toString(36).substring(2, 7);
      setShortUrl(`by-smartlink.com/${randomStr}`);
      setStatus('success');
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="sl-card p-6 sm:p-8 w-full text-right">
        <div className="flex items-center justify-center mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb,var(--sl-good) 16%,transparent)', color: 'var(--sl-good)' }}>
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
        </div>
        <h3 className="text-2xl font-extrabold mb-2 text-center">تمت حماية رابطك وهو يعمل الآن!</h3>
        <p className="sl-muted mb-6 font-medium text-center leading-relaxed">انسخ رابطك الذكي الجديد. لرؤية من يضغط عليه وحجب البوتات، أنشئ حسابك المجاني.</p>

        <div className="sl-inner flex flex-col sm:flex-row items-center gap-3 p-3 mb-5">
          <div className="flex-1 font-mono text-lg font-bold truncate px-3 text-left w-full" dir="ltr" style={{ color: 'var(--sl-blue)' }}>
            {shortUrl}
          </div>
          <button type="button" onClick={copyToClipboard} className="sl-ghost w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2">
            {copied ? <CheckCircle2 className="w-5 h-5 sl-good" aria-hidden="true" /> : <Copy className="w-5 h-5" aria-hidden="true" />}
            {copied ? 'تم النسخ!' : 'نسخ'}
          </button>
        </div>

        <Link to={`/register?redirect=dashboard&url=${encodeURIComponent(url)}`} className="sl-btn w-full py-4 text-base flex items-center justify-center gap-2">
          احصل على رابطي وشاهد التحليلات <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
        <p className="text-xs text-center sl-muted font-bold mt-4">لا يتطلب بطاقة ائتمانية</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleShorten} className="w-full">
      <div className="sl-card sl-field p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2" style={{ borderRadius: 24 }}>
        <label htmlFor="hero-url" className="sr-only">رابطك الطويل</label>
        <div className="flex items-center flex-1 px-4 py-3 gap-3 min-w-0">
          <Link2 className="w-5 h-5 sl-muted flex-shrink-0" aria-hidden="true" />
          <input
            id="hero-url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="الصق رابطك الطويل هنا..."
            className="sl-input w-full sl-text text-base font-medium text-right"
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="sl-btn px-7 py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ borderRadius: 18 }}
        >
          {status === 'loading' ? (
            <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> جاري الاختصار...</>
          ) : (
            <>اختصار وحماية <ArrowLeft className="w-5 h-5" aria-hidden="true" /></>
          )}
        </button>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold sl-muted">
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 sl-good" aria-hidden="true" /> تجربة مجانية 14 يوم</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 sl-good" aria-hidden="true" /> يحجب البوتات فوراً</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 sl-good" aria-hidden="true" /> تحليلات دقيقة</span>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero: savings calculator                                           */
/* ------------------------------------------------------------------ */
function Slider({ id, label, value, min, max, step, onChange, display }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-3">
        <label htmlFor={id} className="text-sm font-semibold sl-text">{label}</label>
        <span className="text-sm font-bold sl-text tabular-nums" dir="ltr">{display}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function SavingsCalculator() {
  const [fee, setFee] = useState(3000);
  const [spend, setSpend] = useState(20000);
  const [bots, setBots] = useState(15);

  const yearlyFees = fee * 12;
  const exposed = Math.round((spend * bots) / 100);

  return (
    <div className="sl-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-extrabold sl-text">كم تكلّفك وكالتك التسويقية؟</h2>
        <span className="sl-chip text-xs font-bold px-2.5 py-1">حاسبة</span>
      </div>

      <div className="space-y-6 mb-8">
        <Slider id="calc-fee" label="أجر الوكالة شهرياً" value={fee} min={500} max={10000} step={250} onChange={setFee} display={fmtUSD(fee)} />
        <Slider id="calc-spend" label="الإنفاق الإعلاني الشهري" value={spend} min={1000} max={100000} step={1000} onChange={setSpend} display={fmtUSD(spend)} />
        <Slider id="calc-bots" label="نسبة الزيارات الوهمية أو غير الصالحة" value={bots} min={5} max={40} step={1} onChange={setBots} display={`${bots}%`} />
      </div>

      <div className="sl-inner p-5 mb-4">
        <p className="text-sm sl-muted mb-1">ما توفّره سنوياً من أجور الوكالات</p>
        <p className="text-4xl sm:text-5xl font-black sl-good leading-tight">
          <AnimatedNumber value={yearlyFees} format={fmtUSD} />
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="sl-inner p-4">
          <p className="text-xs sl-muted mb-1">تكلفة الوكالة شهرياً</p>
          <p className="text-lg font-extrabold sl-text"><AnimatedNumber value={fee} format={fmtUSD} /></p>
        </div>
        <div className="sl-inner p-4">
          <p className="text-xs sl-muted mb-1">ميزانية معرّضة للبوتات شهرياً</p>
          <p className="text-lg font-extrabold sl-bad"><AnimatedNumber value={exposed} format={fmtUSD} /></p>
        </div>
      </div>

      <Link to="/register" className="sl-btn w-full py-3.5 text-sm flex items-center justify-center gap-2">
        استبدل وكالتك، ابدأ مجاناً <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      </Link>
      <p className="text-xs sl-muted mt-3 text-center">أرقام توضيحية بناءً على مدخلاتك. النتائج الفعلية تختلف.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Audience tabs                                                      */
/* ------------------------------------------------------------------ */
const AUDIENCES = [
  {
    id: 'ecom', label: 'المتاجر الإلكترونية', icon: ShoppingBag,
    problem: 'ميزانية إعلانات تيك توك وميتا تذهب لنقرات بوتات لا تشتري أبداً.',
    note: 'يعمل مع Shopify وWooCommerce.',
    points: [
      'احجب نقرات البوتات ومزارع السيرفرات قبل أن تكلّفك مالاً',
      'وجّه كل مشترٍ لصفحة الدفع المحلية بعملته ولغته',
      'اعرف أي إعلان حقق عائد ROAS الفعلي، وليس مجرد نقرات'
    ],
    caption: 'حملة تجريبية',
    rows: [
      { l: 'نقرات بوتات محجوبة', v: '612', tone: 'bad' },
      { l: 'زوار حقيقيون', v: '3,598', tone: '' },
      { l: 'ROAS للمجموعة B', v: '3.1x', tone: 'good' }
    ]
  },
  {
    id: 'media', label: 'مشترو الإعلانات', icon: Megaphone,
    problem: 'أدوات مثل Voluum وClickMagick تكلّف من 99 إلى 299 دولاراً شهرياً وتحتاج أسبوعاً لتعلّمها.',
    note: 'مصمّم للسرعة وبتكلفة أقل.',
    points: [
      'توجيه فائق السرعة خلال أجزاء من الثانية',
      'تتبّع Postback وSub-IDs بنصف التكلفة',
      'روابط بعلامتك التجارية على نطاقك المخصص'
    ],
    caption: 'قواعد توجيه تجريبية',
    rows: [
      { l: 'iOS', v: 'App Store', tone: '' },
      { l: 'فرنسا', v: '/fr-fr', tone: '' },
      { l: 'Postback، sub_id: tt_ad_42', v: '$38.00', tone: 'good' }
    ]
  },
  {
    id: 'creators', label: 'المؤسسون وصنّاع المحتوى', icon: Rocket,
    problem: 'لا تستطيع تحمّل تكلفة وكالة، وصفحة البايو التقليدية لا تبيع شيئاً.',
    note: 'بدون برمجة، جاهز خلال دقيقتين.',
    points: [
      'اجمع مشتركي النشرة البريدية من مركز تسويق ذكي',
      'بِع منتجاتك الرقمية بروابط دفع فورية',
      'احتفظ بـ 95% من كل عملية بيع'
    ],
    caption: 'نشاط مركز تجريبي',
    rows: [
      { l: 'مشتركون جدد اليوم', v: '+48', tone: 'good' },
      { l: 'دليل PDF بسعر $19', v: '$18.05 لك', tone: 'good' },
      { l: 'نقرات الروابط', v: '1,204', tone: '' }
    ]
  }
];

function AudienceSection() {
  const [active, setActive] = useState('ecom');
  const a = AUDIENCES.find((x) => x.id === active);

  return (
    <section className="py-24 sl-bg2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-snug">وكيل واحد، مصمّم لطريقة عملك</h2>
          <p className="text-lg sl-muted">اختر وضعك لترى ماذا يفعل الوكيل من أجلك.</p>
        </div>

        <div role="tablist" aria-label="لمن صُمم سمارت لينك" className="flex flex-wrap gap-2 mb-8">
          {AUDIENCES.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`aud-tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`aud-panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm ${active === t.id ? 'sl-btn' : 'sl-ghost'}`}
            >
              <t.icon className="w-4 h-4" aria-hidden="true" /> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={a.id}
            role="tabpanel"
            id={`aud-panel-${a.id}`}
            aria-labelledby={`aud-tab-${a.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-2 gap-6 items-stretch"
          >
            <div className="sl-card p-8">
              <p className="text-2xl font-extrabold mb-6 leading-relaxed">{a.problem}</p>
              <ul className="space-y-4 mb-6">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0 sl-good" aria-hidden="true" />
                    <span className="sl-text leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm sl-muted">{a.note}</p>
            </div>

            <div className="sl-card p-8 flex flex-col justify-center">
              <p className="text-sm font-bold sl-muted mb-4">{a.caption}</p>
              <div className="space-y-3">
                {a.rows.map((r) => (
                  <div key={r.l} className="sl-inner flex items-center justify-between gap-4 px-4 py-4">
                    <span className="text-sm sl-muted">{r.l}</span>
                    <span dir="ltr" className={`text-xl font-black tabular-nums ${r.tone === 'bad' ? 'sl-bad' : r.tone === 'good' ? 'sl-good' : 'sl-text'}`}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature visuals                                                    */
/* ------------------------------------------------------------------ */
const BLOCKED = [
  { who: 'مركز بيانات AWS', src: 'TikTok Ads', geo: 'US' },
  { who: 'متصفح بلا واجهة', src: 'Meta Ads', geo: 'DE' },
  { who: 'مزرعة بروكسي', src: 'Google Ads', geo: 'VN' },
  { who: 'مركز بيانات OVH', src: 'TikTok Ads', geo: 'FR' },
  { who: 'نقّار آلي', src: 'Meta Ads', geo: 'BR' },
  { who: 'مركز بيانات Azure', src: 'Google Ads', geo: 'IN' }
];

function ShieldCard() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(5);

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  const items = Array.from({ length: 4 }, (_, k) => {
    const id = tick - k;
    return { id, ...BLOCKED[((id % 6) + 6) % 6] };
  });

  return (
    <div className="sl-card p-8 grid sm:grid-cols-2 gap-8 items-center h-full">
      <div>
        <div className="w-11 h-11 rounded-xl sl-iconbox flex items-center justify-center mb-4"><Shield className="w-5 h-5" aria-hidden="true" /></div>
        <h3 className="text-xl font-extrabold mb-2">درع حماية المرور المتقدم</h3>
        <p className="text-sm sl-muted leading-relaxed mb-4">قلّل هدر الميزانية الإعلانية من خلال فلترة الزيارات الآلية. نظام فلترة متعدد الإشارات يضمن تركيز ميزانيتك على التفاعل الحقيقي.</p>
        <p className="text-sm sl-text flex items-baseline gap-2">
          <span className="sl-bad font-black text-2xl"><AnimatedNumber value={1284 + tick} /></span>
          <span className="sl-muted">نقرة بوت محجوبة في هذه العينة</span>
        </p>
      </div>

      <div className="sl-inner p-4" aria-label="عينة من نقرات البوتات المحجوبة">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold sl-muted">
          <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
            <span className="sl-ping"></span>
            <span className="relative w-2.5 h-2.5 rounded-full" style={{ background: 'var(--sl-bad)' }}></span>
          </span>
          معاينة حيّة، بيانات تجريبية
        </div>
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.li
                key={it.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-2 text-xs px-3 py-2 rounded-lg"
                style={{ background: 'color-mix(in srgb,var(--sl-bad) 10%,transparent)', border: '1px solid color-mix(in srgb,var(--sl-bad) 30%,transparent)' }}
              >
                <span className="sl-text font-semibold">{it.who}</span>
                <span className="sl-muted" dir="ltr">{it.src}, {it.geo}</span>
                <span className="sl-bad font-bold">محجوب</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

function VoiceAgentCard() {
  const [playing, setPlaying] = useState(true);
  const bars = Array.from({ length: 30 }, (_, i) => ({ h: 22 + ((i * 37) % 70), d: (i * 0.07).toFixed(2) }));

  return (
    <div className="sl-card p-8 grid sm:grid-cols-2 gap-8 items-center h-full">
      <div>
        <div className="w-11 h-11 rounded-xl sl-iconbox flex items-center justify-center mb-4"><Mic className="w-5 h-5" aria-hidden="true" /></div>
        <h3 className="text-xl font-extrabold mb-2">وكيل التسويق الصوتي بالذكاء الاصطناعي</h3>
        <p className="text-sm sl-muted leading-relaxed">اسأله عن أداء حملاتك واستمع لإحاطة صوتية: ما الذي نجح، وأين تسرّبت الميزانية، وإلى أين تنقل الإنفاق.</p>
      </div>

      <div className="sl-inner p-5">
        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'إيقاف حركة المعاينة الصوتية' : 'تشغيل حركة المعاينة الصوتية'}
            className="sl-btn w-11 h-11 flex items-center justify-center flex-shrink-0"
            style={{ borderRadius: 999 }}
          >
            {playing ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
          </button>
          <div className={`flex items-center justify-between flex-1 h-12 ${playing ? '' : 'sl-paused'}`} aria-hidden="true">
            {bars.map((b, i) => (
              <span key={i} className="sl-bar" style={{ height: `${b.h}%`, animationDelay: `${b.d}s` }}></span>
            ))}
          </div>
        </div>
        <p className="text-xs font-bold sl-muted mb-1">إحاطة نموذجية</p>
        <p className="text-sm sl-text leading-relaxed">أمس أرسل تيك توك 4,210 نقرة. 612 منها من مراكز بيانات وتم حجبها. المجموعة B تحقق 3.1x ROAS، انقل الميزانية إليها.</p>
      </div>
    </div>
  );
}

function FeatureCard({ f }) {
  return (
    <div className="sl-card p-6">
      <div className="w-11 h-11 rounded-xl sl-iconbox flex items-center justify-center mb-4"><f.icon className="w-5 h-5" aria-hidden="true" /></div>
      <h3 className="text-lg font-extrabold mb-2">{f.title}</h3>
      <p className="text-sm sl-muted leading-relaxed">{f.desc}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works                                                       */
/* ------------------------------------------------------------------ */
function HowItWorksSection() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "إنشاء روابط ذكية", desc: "الصق الرابط، خصص الاسم المختصر، وأضف التصنيفات.", icon: Link2 },
    { title: "الاستهداف الذكي", desc: "وجّه المستخدمين حسب الجهاز أو الموقع الجغرافي.", icon: Target },
    { title: "بناء صفحة البايو", desc: "اسحب وأفلت الروابط، اختر القالب، وانشر.", icon: Layout },
    { title: "تتبّع التحليلات", desc: "رؤى فورية عن النقرات والموقع ونظام التشغيل.", icon: BarChart3 }
  ];

  return (
    <section id="how-it-works" className="py-24 sl-bg2 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-snug">كل ما تحتاجه في منصة واحدة</h2>
          <p className="text-lg sl-muted">جولة سريعة في كيفية عمل سمارت لينك لإدارة وتحسين تواجدك الرقمي.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-3">
            {steps.map((s, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setStep(i)}
                aria-current={step === i ? 'step' : undefined}
                className={`w-full flex items-start gap-4 p-4 text-right transition-all ${step === i ? 'sl-card' : 'opacity-70 hover:opacity-100'}`}
                style={step === i ? undefined : { border: '1px solid transparent', borderRadius: 20 }}
              >
                <div className="w-10 h-10 rounded-xl sl-iconbox flex items-center justify-center flex-shrink-0"><s.icon className="w-5 h-5" aria-hidden="true" /></div>
                <div>
                  <p className="font-extrabold text-lg sl-text">{s.title}</p>
                  <p className="text-sm sl-muted leading-relaxed mt-1">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="sl-card p-8 h-96 flex flex-col justify-center items-center text-center overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-sm">
                {step === 0 && (
                  <div className="sl-inner p-6">
                    <p className="text-xs font-bold sl-muted mb-4 text-right">الصق وأنشئ</p>
                    <div dir="ltr" className="sl-card p-2 text-left mb-4 text-sm overflow-hidden whitespace-nowrap font-mono sl-muted" style={{ borderRadius: 8 }}>https://myshop.com/super-sale</div>
                    <div className="flex gap-2 items-center mb-4 justify-start">
                      <span className="text-sm sl-muted">الاسم المختصر:</span>
                      <span className="sl-tint px-2 py-1 rounded text-xs font-bold">summer-sale</span>
                    </div>
                    <div className="sl-btn w-full py-2 text-sm">إنشاء رابط ذكي</div>
                  </div>
                )}
                {step === 1 && (
                  <div className="sl-inner p-6">
                    <p className="text-xs font-bold sl-muted mb-4 text-right">إضافة قواعد الاستهداف</p>
                    <div className="space-y-3">
                      <div className="sl-card flex items-center gap-3 p-3" style={{ borderRadius: 10 }}>
                        <Smartphone className="w-4 h-4 sl-muted" aria-hidden="true" />
                        <div className="flex-1 text-right">
                          <p className="text-sm font-bold sl-text">iOS</p>
                          <p className="text-xs sl-muted">App Store</p>
                        </div>
                      </div>
                      <div className="sl-card flex items-center gap-3 p-3" style={{ borderRadius: 10 }}>
                        <Globe className="w-4 h-4 sl-muted" aria-hidden="true" />
                        <div className="flex-1 text-right">
                          <p className="text-sm font-bold sl-text">فرنسا</p>
                          <p className="text-xs sl-muted">/fr-fr</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="sl-inner p-6 text-center">
                    <p className="text-xs font-bold sl-muted mb-4 text-right">تصميم صفحة البايو</p>
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 sl-iconbox"></div>
                    <p className="font-bold sl-text text-sm">Sarah Creator</p>
                    <p className="text-xs sl-muted mb-4" dir="ltr">@sarah_designs</p>
                    <div className="space-y-2">
                      <div className="h-8 rounded w-full" style={{ background: 'var(--sl-border)' }}></div>
                      <div className="h-8 rounded w-full" style={{ background: 'var(--sl-border)' }}></div>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="sl-inner p-6">
                    <p className="text-xs font-bold sl-muted mb-4 text-right">تحليل النتائج</p>
                    <div className="flex items-end h-24 gap-2 mb-4 justify-between">
                      {[30, 50, 40, 70, 90, 60].map((h, i) => (
                        <div key={i} className="w-8 rounded-t" style={{ height: `${h}%`, background: 'linear-gradient(to top,var(--sl-blue),var(--sl-violet))' }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between sl-divider pt-4">
                      <div className="text-right">
                        <p className="text-2xl font-black sl-text">12.5k</p>
                        <p className="text-xs sl-muted">النقرات</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black sl-text">iOS</p>
                        <p className="text-xs sl-muted">أفضل جهاز</p>
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

/* ------------------------------------------------------------------ */
/*  FAQ (all 9 original questions)                                     */
/* ------------------------------------------------------------------ */
function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqs = [
    { q: "لماذا أحتاج سمارت لينك إذا كان لدي مختصر روابط؟", a: "مختصرات الروابط التقليدية تحسب النقرات فقط. سمارت لينك يذهب أعمق بتتبّع بيانات نظام التشغيل والموقع الجغرافي ومصدر الزيارات حتى تكشف النية الحقيقية وراء حركة مرورك." },
    { q: "كيف يزيد استهداف الأجهزة (iOS/Android) من التحويلات؟", a: "بدلاً من إرباك المستخدمين بزرين، تنشئ رابط ذكي واحد. نكتشف جهازهم فوراً ونوجّه مستخدمي iOS لمتجر آبل وأندرويد لغوغل بلاي." },
    { q: "هل يمكنني تتبّع نقرات الروابط مجاناً؟", a: "نعم! نؤمن أن التحليلات العميقة يجب أن تكون متاحة للجميع. تحصل على تحليلات فورية لجميع روابطك مجاناً تماماً." },
    { q: "هل يمكنني استخدام نطاقي المخصص؟", a: "بالتأكيد. يمكنك ربط نطاقك الخاص للحفاظ على هوية علامتك التجارية." },
    { q: "كيف أنشئ رابط بايو مجاني؟", a: "سجّل حسابك، اختر اسم المستخدم، والصق روابطك. يمكنك تخصيص صفحة البايو بالقوالب والنشر خلال أقل من دقيقتين." },
    { q: "ما هو أفضل بديل لبرنامج ClickMagick في عام 2026؟", a: "سمارت لينك هو البديل الأفضل، يقدم حماية من البوتات وتتبع دقيق للروابط مع باقة أساسية مجانية، ليوفر عليك 99 دولار شهرياً." },
    { q: "كيف أحجب زيارات البوتات الوهمية من إعلانات فيسبوك وجوجل؟", a: "يمكنك حجبها باستخدام منصة تتبع روابط تحتوي على درع حماية. سمارت لينك يكتشف ويحظر البوتات والـ VPN تلقائياً لتضمن أن بكسل التتبع الخاص بك يعمل للبشر الحقيقيين فقط." },
    { q: "كيف أتتبع روابط التسويق بالعمولة بدون امتلاك موقع إلكتروني؟", a: "لا تحتاج لموقع! يمكنك استخدام سمارت لينك لإنشاء صفحة بايو مجانية ووضع جميع روابطك بداخلها ونشر رابط واحد فقط على حساباتك في السوشيال ميديا." },
    { q: "هل موقع Linktree جيد للتسويق بالعمولة؟", a: "منصة Linktree أساسية جداً وتفتقر للتحليلات العميقة. المسوق المحترف يحتاج أداة مثل سمارت لينك لتوفر له تتبع الأجهزة والدول، وحماية من البوتات مباشرة من صفحة البايو." },
    { q: "كيف أوجه الزيارات بناءً على دولة ونوع جهاز الزائر؟", a: "باستخدام محرك التوجيه الذكي في سمارت لينك، يمكنك تعيين قواعد لتوجيه زوار أمريكا لعرض معين، وزوار أوروبا لعرض آخر من خلال رابط واحد فقط. كما يمكنك التوجيه حسب نوع الجهاز iOS أو أندرويد." }
  ];

  return (
    <section id="faq" className="py-24 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">الأسئلة الشائعة</h2>
          <p className="text-lg sl-muted">كل ما تحتاج معرفته عن سمارت لينك.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="sl-card overflow-hidden" style={{ borderRadius: 14 }}>
              <h3>
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  aria-expanded={openFAQ === i}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-right"
                >
                  <span className="font-bold sl-text text-base sm:text-lg flex-1 ml-4 leading-relaxed">{faq.q}</span>
                  <ChevronLeft className={`w-5 h-5 sl-muted flex-shrink-0 transition-transform duration-200 ${openFAQ === i ? '-rotate-90' : ''}`} aria-hidden="true" />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {openFAQ === i && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-5 sm:mx-6 pb-6 pt-4 sl-muted text-base leading-relaxed text-right sl-divider">
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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function LandingPageAR() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const reduce = useReducedMotion();

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

  const enter = (delay = 0) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay } };

  const features = [
    { icon: Zap, title: 'التحسين التلقائي', desc: 'خوارزمية الأداء لدينا توجّه حركة المرور تلقائياً للنسخة الأفضل أداءً في اختبارات A/B، مما يزيد كفاءة التحويل.' },
    { icon: BarChart3, title: 'تحليلات الكفاءة', desc: 'رؤى فورية لحملاتك. شاهد بالضبط كم تم تقليل الهدر الإعلاني وكم تم استرداد الأداء.' },
    { icon: Smartphone, title: 'استهداف الأجهزة بدقة', desc: 'وجّه مستخدمي iOS لمتجر آبل وأندرويد لغوغل بلاي فوراً. أزل الاحتكاك وتأكد أن كل مستخدم يصل للوجهة الصحيحة.' },
    { icon: Globe, title: 'حماية الحملات العالمية', desc: 'أعد توجيه المستخدمين حسب البلد أو اللغة بزمن صفر. حافظ على تحويلات عالية وملاءمة محلية.' },
    { icon: Code, title: 'واجهة برمجية للمؤسسات', desc: 'ادمج محرك حماية الأداء مباشرة في سير عملك أو منتجك لتوفير قيمة مضافة لعملائك.' }
  ];

  const sellItems = [
    { icon: FileText, l: 'أدلة PDF' }, { icon: Video, l: 'فيديوهات حصرية' },
    { icon: Link2, l: 'روابط سرية' }, { icon: Wrench, l: 'قوالب وأدوات' },
    { icon: Music, l: 'ملفات صوتية' }, { icon: Camera, l: 'بريستات' },
    { icon: BookOpen, l: 'كتب إلكترونية' }, { icon: Crown, l: 'وصول مميز' }
  ];

  const navLink = 'text-sm font-semibold sl-muted hover:text-[color:var(--sl-text)] transition-colors';
  const footLink = 'hover:text-[color:var(--sl-text)]';

  return (
    <div dir="rtl" className="sl min-h-screen font-cairo transition-colors duration-300 overflow-x-hidden" data-theme={darkMode ? 'dark' : 'light'}>
      <style>{STYLES}</style>
      <SEO
        title="سمارت لينك — أفضل برنامج تتبع للتسويق بالعمولة (البديل الأقوى لـ ClickMagick)"
        description="هل تبحث عن أفضل برنامج تتبع للتسويق بالعمولة؟ سمارت لينك هو البديل الأول لـ ClickMagick. احجب البوتات، تتبع الروابط، وضاعف أرباحك."
      />

      {/* Animated ambient glows */}
      <div className="sl-ambient" aria-hidden="true">
        <span className="sl-glow sl-drift-a" style={{ '--c': 'var(--sl-blue)', width: 680, height: 680, top: '-12%', right: '-10%' }}></span>
        <span className="sl-glow sl-drift-b" style={{ '--c': 'var(--sl-violet)', width: 620, height: 620, top: '38%', left: '-14%' }}></span>
        <span className="sl-glow sl-drift-c" style={{ '--c': 'var(--sl-blue)', width: 560, height: 560, bottom: '-18%', right: '18%' }}></span>
      </div>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled ? { background: 'var(--sl-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--sl-border)' } : { background: 'transparent' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/ar" className="flex items-center gap-2">
              <img src="/logo-v1.svg" alt="Smart Link" className="w-8 h-8" />
              <span className="sl-latin text-2xl font-extrabold sl-grad">Smart Link.</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={navLink}>المميزات</a>
              <a href="#how-it-works" className={navLink}>كيف يعمل</a>
              <a href="#pricing" className={navLink}>الأسعار</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/" className={`${navLink} sl-latin flex items-center gap-1`} title="English">
                <Globe className="w-4 h-4" aria-hidden="true" /> English
              </Link>
              <button onClick={toggleDarkMode} aria-label={darkMode ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'} className="p-2 rounded-lg sl-muted hover:bg-[var(--sl-surface2)] transition-colors flex items-center justify-center">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/login" className="text-sm font-bold sl-text px-4 py-2 hover:opacity-70 transition-opacity">تسجيل الدخول</Link>
              <Link to="/register" className="sl-btn text-sm px-6 py-2.5 flex items-center justify-center">ابدأ مجاناً</Link>
            </div>

            <div className="md:hidden flex items-center gap-3">
              <Link to="/" className="text-sm font-medium sl-muted sl-latin flex items-center gap-1">
                <Globe className="w-4 h-4" aria-hidden="true" /> En
              </Link>
              <button onClick={toggleDarkMode} aria-label={darkMode ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'} className="p-2 sl-muted rounded-full">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="القائمة" aria-expanded={mobileMenuOpen} className="p-2 sl-muted">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden sl-divider" style={{ background: 'var(--sl-bg)' }}>
                <div className="flex flex-col gap-4 p-4">
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="sl-text font-medium">المميزات</a>
                  <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="sl-text font-medium">كيف يعمل</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="sl-text font-medium">الأسعار</a>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="sl-muted sl-latin">English</Link>
                  <div className="sl-divider my-2"></div>
                  <Link to="/login" className="sl-text font-bold text-center py-2">تسجيل الدخول</Link>
                  <Link to="/register" className="sl-btn text-center py-3">ابدأ مجاناً</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            <div className="text-right">
              <motion.div {...enter(0)} className="sl-chip inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold mb-6">
                <Bot className="w-4 h-4" style={{ color: 'var(--sl-violet)' }} aria-hidden="true" /> المنصة الأقوى لتتبع التسويق بالعمولة
              </motion.div>
              <motion.h1 {...enter(0.08)} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.3] mb-6">
                <span className="block">اطرد وكالتك التسويقية.</span>
                <span className="block sl-grad mt-1 pb-2">تعرّف على وكيلك التسويقي الذكي المستقل.</span>
              </motion.h1>
              <motion.h2 {...enter(0.16)} className="text-lg sl-muted mb-8 max-w-xl leading-relaxed font-semibold">
                هل تبحث عن <strong className="sl-text">بديل ClickMagick</strong>؟ سمارت لينك هو أداة التتبع الأذكى. احمِ ميزانيتك من البوتات ووجه زياراتك بدقة متناهية.
              </motion.h2>
              <motion.div {...enter(0.24)} className="mb-10">
                <HeroShortener />
              </motion.div>
              <motion.div {...enter(0.3)} className="flex flex-wrap items-center gap-6 text-sm sl-muted font-semibold">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /><span>بدون بطاقة ائتمان</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /><span>مجاني للأبد</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /><span>جاهز خلال دقيقتين</span></div>
              </motion.div>
            </div>
            <motion.div {...enter(0.2)}>
              <SavingsCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <AudienceSection />

      {/* Features */}
      <section id="features" className="py-24 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="sl-chip inline-flex items-center px-3 py-1.5 text-sm font-semibold mb-4">المميزات الأساسية</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-snug">أدوات متقدمة لنجاح حملاتك</h2>
            <p className="text-lg sl-muted">كل ما تحتاجه لإدارة الروابط وتتبع الجمهور وتنمية أعمالك.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="md:col-span-2"><ShieldCard /></div>
            <FeatureCard f={features[0]} />
            <FeatureCard f={features[1]} />
            <div className="md:col-span-2"><VoiceAgentCard /></div>
            <FeatureCard f={features[2]} />
            <FeatureCard f={features[3]} />
            <FeatureCard f={features[4]} />

            {/* Creator Paywall */}
            <div className="sl-card p-8 md:col-span-2 lg:col-span-3 grid md:grid-cols-2 gap-8 items-center" style={{ borderColor: 'color-mix(in srgb,var(--sl-blue) 40%,transparent)' }}>
              <div>
                <div className="w-12 h-12 rounded-xl sl-btn flex items-center justify-center mb-5"><Lock className="w-6 h-6" aria-hidden="true" /></div>
                <h3 className="text-2xl font-black mb-3">جدار الدفع للمبدعين</h3>
                <p className="text-sm sl-muted leading-relaxed">بِع المنتجات الرقمية والأدلة الحصرية أو الروابط المميزة مباشرة من صفحة البايو. ابدأ بالربح من جمهورك فوراً.</p>
              </div>
              <div className="sl-inner p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--sl-blue)' }} aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold sl-text mb-1">مدعوم بأمان من Stripe</p>
                    <p className="text-xs sl-muted leading-relaxed">نستخدم Stripe لمعالجة المدفوعات. أموالك محمية وتُحوّل مباشرة لحسابك البنكي.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Creator Monetization */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="sl-tint inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold mb-4">لصنّاع المحتوى</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-snug">حوّل صفحة البايو إلى مصدر دخل</h2>
            <p className="text-lg sl-muted leading-relaxed">بدون برمجة. بدون إعداد معقد. فقط أضف سعراً لمحتواك وابدأ بالربح — متابعوك يدفعون مباشرة من رابط البايو.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { title: 'ربط حسابك البنكي', desc: 'اربط حسابك على Stripe بسهولة من خلال لوحة التحكم الآمنة.' },
              { title: 'إنشاء منتجك', desc: 'أضف قسم "جدار الدفع"، حدد السعر، واربط محتواك السري.' },
              { title: 'استلام الأرباح', desc: 'جمهورك يدفع بأمان عبر Stripe. الأموال تُحوّل لحسابك فوراً.' }
            ].map((s, i) => (
              <div key={i} className="sl-card p-6 text-right">
                <div className="w-8 h-8 rounded-full sl-btn text-sm font-bold flex items-center justify-center mb-5" style={{ borderRadius: 999 }}>{i + 1}</div>
                <h3 className="text-xl font-extrabold mb-2">{s.title}</h3>
                <p className="text-sm sl-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="sl-card p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-extrabold mb-6">ماذا يمكنك أن تبيع؟</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {sellItems.map((it) => (
                <div key={it.l} className="sl-inner flex flex-col items-center gap-2 p-3">
                  <it.icon className="w-5 h-5" style={{ color: 'var(--sl-violet)' }} aria-hidden="true" />
                  <span className="text-xs font-bold sl-text">{it.l}</span>
                </div>
              ))}
            </div>
            <Link to="/register" className="sl-btn inline-flex px-6 py-3 text-sm">ابدأ البيع مجاناً</Link>
            <p className="mt-4 text-xs sl-muted">نأخذ 5% فقط من كل عملية بيع. تحتفظ بـ 95%.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sl-bg2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-center mb-14">ماذا يقول المستخدمون</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { quote: "Tested SmartLink today, quick honest review. Setup was simple, the dashboard is clean, and everythin...", author: "Karl Beismann", role: "@karlbeis", link: "https://x.com/karlbeis" },
              { quote: "Makes sharing one link for multiple destinations feel easy and tidy, that’s useful for campaigns or social bios.", author: "Vineer", role: "@vineerpasam", link: "https://x.com/vineerpasam" },
              { quote: "It's a solid tool for creators and businesses who want real data instead of guesses. Clean dashboard and real-time link tracking. Good for link-in-bio pages and short links.", author: "Chandan H", role: "@_Chandan_17", link: "https://x.com/_Chandan_17" }
            ].map((t, i) => (
              <figure key={i} dir="ltr" className="sl-card p-8 text-left flex flex-col font-sans">
                <div className="flex gap-1 mb-4" style={{ color: '#FBBF24' }} aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" aria-hidden="true" />)}
                </div>
                <blockquote className="text-sm sl-text leading-relaxed mb-6 flex-1">"{t.quote}"</blockquote>
                <figcaption>
                  <p className="font-bold sl-text text-sm">{t.author}</p>
                  <a href={t.link} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: 'var(--sl-blue)' }}>{t.role}</a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">خطط مرنة لكل مرحلة</h2>
            <p className="text-lg sl-muted mb-8 max-w-2xl mx-auto">ابدأ مجاناً، ترقّى مع نموك. بدون رسوم خفية، إلغاء في أي وقت.</p>
            <div role="radiogroup" aria-label="دورة الفوترة" className="sl-seg">
              <button type="button" role="radio" aria-checked={!isYearly} onClick={() => setIsYearly(false)} className="sl-seg-btn">شهري</button>
              <button type="button" role="radio" aria-checked={isYearly} onClick={() => setIsYearly(true)} className="sl-seg-btn">
                سنوي <span className="text-xs font-extrabold sl-good">وفّر 25%</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan) => {
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
                <div key={plan.id} className={`relative p-8 flex flex-col ${plan.popular ? 'sl-popular md:scale-[1.03] z-10' : 'sl-card'}`}>
                  {plan.popular && <div className="sl-btn absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs w-max" style={{ borderRadius: 999 }}>الأكثر شعبية</div>}
                  <div className="mb-6">
                    <h3 className="text-xl font-black mb-2">{arName}</h3>
                    <p className="text-sm sl-muted">{arDesc}</p>
                  </div>
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-black" dir="ltr">{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                    <span className="text-sm font-medium sl-muted">/شهر</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {arFeatures.map((f, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 sl-good" aria-hidden="true" />
                        <span className="text-sm sl-text leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleCheckout(plan, isYearly)} className={`w-full py-3 text-sm mb-3 ${plan.popular ? 'sl-btn' : 'sl-ghost'}`}>
                    {arCta}
                  </button>
                  {plan.trialAvailable && (
                    <button onClick={handleStartTrial} className="sl-tint w-full py-2.5 text-xs font-bold rounded-lg">
                      جرّب مجاناً لمدة {plan.trialDays} أيام
                    </button>
                  )}
                  {plan.id !== 'free' && <p className="text-center mt-3 text-xs sl-muted">إلغاء في أي وقت، بدون أسئلة</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="relative max-w-5xl mx-auto overflow-hidden text-center sl-card py-16 px-6" style={{ borderRadius: 32 }}>
          <span className="sl-glow sl-drift-b" style={{ '--c': 'var(--sl-blue)', width: 480, height: 480, top: -220, left: '20%' }} aria-hidden="true"></span>
          <span className="sl-glow sl-drift-a" style={{ '--c': 'var(--sl-violet)', width: 420, height: 420, bottom: -220, right: '15%' }} aria-hidden="true"></span>
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-snug">مستعد للتسويق بذكاء؟</h2>
            <p className="text-lg sl-muted mb-10 max-w-xl mx-auto leading-relaxed">انضم لأكثر من 10,000 مبدع وشركة يستخدمون سمارت لينك لتحسين تواجدهم الرقمي.</p>
            <Link to="/register" className="sl-btn inline-flex px-8 py-4 text-base items-center gap-2">
              ابدأ الآن — مجاناً <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
            <p className="mt-6 text-sm sl-muted flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /> بدون بطاقة ائتمان • إلغاء في أي وقت
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* About */}
      <section className="py-24 sl-bg2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-6 leading-snug">مهمتنا: تمكين المؤسسين والمبدعين</h2>
              <p className="sl-muted mb-6 leading-relaxed">
                سمارت لينك وُلد من فكرة بسيطة: أدوات التسويق الاحترافية لا يجب أن تكون محبوسة خلف اشتراكات مكلفة.
              </p>
              <p className="sl-muted leading-relaxed mb-8">
                سواء كنت مؤسس SaaS يطلق منتجه الأول، أو مسوّق يحسّن حملاته، أو مبدع يبني علامته — نوفر لك أدوات التحليلات والاستهداف التي تحتاجها للنجاح.
              </p>
              <p className="text-sm font-bold sl-text flex items-center gap-2"><Sparkles className="w-4 h-4" style={{ color: 'var(--sl-violet)' }} aria-hidden="true" /> صُنع بحب من فريق عالمي متخصص</p>
            </div>
            <div className="space-y-6">
              {[
                { title: 'الخصوصية أولاً', desc: 'لا نتتبّع مستخدميك شخصياً. فقط بيانات نظيفة وقابلة للتنفيذ.', icon: Shield },
                { title: 'أداء في الحمض النووي', desc: 'روابط خفيفة تُحمّل بالمللي ثانية عبر العالم.', icon: Zap },
                { title: 'آمن وموثوق', desc: 'وقت تشغيل 99.9% مع أمان بمستوى المؤسسات لكل رابط.', icon: Lock }
              ].map((v, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl sl-iconbox flex items-center justify-center flex-shrink-0"><v.icon className="w-5 h-5" aria-hidden="true" /></div>
                  <div>
                    <h3 className="font-extrabold sl-text mb-1">{v.title}</h3>
                    <p className="text-sm sl-muted leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 sl-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/ar" className="flex items-center gap-2 mb-4">
                <img src="/logo-v1.svg" alt="Smart Link" className="w-10 h-10" />
                <span className="sl-latin text-2xl font-extrabold sl-text">Smart Link</span>
              </Link>
              <p className="text-sm sl-muted mb-6 max-w-sm leading-relaxed">منصة إدارة الروابط المتقدمة للمبدعين العصريين.</p>
            </div>
            <div>
              <h3 className="font-bold sl-text mb-4">المنتج</h3>
              <ul className="space-y-3 text-sm sl-muted">
                <li><Link to="/dashboard" className={footLink}>لوحة التحكم</Link></li>
                <li><Link to="/pricing" className={footLink}>الأسعار</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold sl-text mb-4">الحلول</h3>
              <ul className="space-y-3 text-sm sl-muted">
                <li><Link to="/for-creators" className={footLink}>للمبدعين</Link></li>
                <li><Link to="/for-marketers" className={footLink}>للمسوقين</Link></li>
                <li><Link to="/for-ecommerce" className={footLink}>للتجارة الإلكترونية</Link></li>
                <li><Link to="/for-affiliates" className={footLink}>للمسوقين بالعمولة</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold sl-text mb-4">أدوات مجانية</h3>
              <ul className="space-y-3 text-sm sl-muted">
                <li><Link to="/tools" className="font-bold" style={{ color: 'var(--sl-blue)' }}>جميع الأدوات</Link></li>
                <li><Link to="/tools/qr-code-generator" className={footLink}>صانع QR Code</Link></li>
                <li><Link to="/tools/utm-builder" className={footLink}>منشئ روابط UTM</Link></li>
                <li><Link to="/tools/meta-tag-generator" className={footLink}>مولد Meta Tags</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold sl-text mb-4">الموارد</h3>
              <ul className="space-y-3 text-sm sl-muted">
                <li><Link to="/faq" className={footLink}>الأسئلة الشائعة</Link></li>
                <li><Link to="/blog" className={footLink}>المدونة</Link></li>
                <li><a href="mailto:support@by-smartlink.com" className={footLink}>الدعم الفني</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 sl-divider flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm sl-muted">© 2026 سمارت لينك. جميع الحقوق محفوظة.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://www.uneed.best/tool/smart-link" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://www.uneed.best/EMBED3.png" alt="Uneed Embed Badge" className="h-10" />
              </a>
              <a href="https://www.saashub.com/smart-link-pro?utm_source=badge&utm_campaign=badge&utm_content=smart-link-pro&badge_variant=color&badge_kind=approved" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="Smart Link Pro badge" className="h-10" />
              </a>
              <div className="flex gap-4 md:mr-4">
                <Link to="/privacy" className={`text-sm sl-muted ${footLink}`}>سياسة الخصوصية</Link>
                <Link to="/terms" className={`text-sm sl-muted ${footLink}`}>شروط الخدمة</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}