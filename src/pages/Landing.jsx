import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PLANS } from '../utils/plans';
import { useAuth } from '../context/AuthContext';
import {
  Link2, Menu, X, Moon, Sun, ChevronRight,
  BarChart3, Globe, Smartphone, Target, Zap, Shield,
  CheckCircle, ArrowRight, Sparkles, Lock, Code, Star, Play, Layout,
  Mic, Pause, Bot, FileText, Video, Music, Camera, BookOpen, Crown, Wrench,
  ShoppingBag, Megaphone, Rocket, TrendingUp
} from 'lucide-react';
import SEO from '../components/SEO';

/* ------------------------------------------------------------------ */
/*  Design tokens + component classes (scoped under .sl)               */
/*  Dark-first. Tokens follow the brief; button fills are one step     */
/*  deeper than the accent gradient so white labels keep >= 4.5:1.     */
/* ------------------------------------------------------------------ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

.sl{
  isolation:isolate;
  --sl-bg:#0A0A0F; --sl-bg2:#0F1117;
  --sl-surface:rgba(255,255,255,.04); --sl-surface2:rgba(255,255,255,.07);
  --sl-border:rgba(255,255,255,.10);
  --sl-text:#F8FAFC; --sl-muted:#94A3B8;
  --sl-good:#10B981; --sl-bad:#EF4444;
  --sl-blue:#3B82F6; --sl-violet:#8B5CF6; --sl-ring:#60A5FA;
  --sl-glow:.38; --sl-nav:rgba(10,10,15,.72);
  background:var(--sl-bg); color:var(--sl-text);
  font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
}
.sl[data-theme="light"]{
  --sl-bg:#F8FAFC; --sl-bg2:#EEF2F7;
  --sl-surface:rgba(255,255,255,.75); --sl-surface2:#FFFFFF;
  --sl-border:rgba(15,23,42,.10);
  --sl-text:#0F172A; --sl-muted:#475569;
  --sl-good:#047857; --sl-bad:#B91C1C;
  --sl-blue:#2563EB; --sl-violet:#7C3AED; --sl-ring:#2563EB;
  --sl-glow:.14; --sl-nav:rgba(248,250,252,.82);
}
.sl-display{font-family:'Plus Jakarta Sans','Inter',system-ui,sans-serif;}
.sl-text{color:var(--sl-text)}
.sl-muted{color:var(--sl-muted)}
.sl-good{color:var(--sl-good)}
.sl-bad{color:var(--sl-bad)}
.sl-bg2{background:var(--sl-bg2)}
.sl-grad{background:linear-gradient(90deg,var(--sl-blue),var(--sl-violet),var(--sl-blue));background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sl-shift 9s ease-in-out infinite alternate}
.sl-card{background:var(--sl-surface);border:1px solid var(--sl-border);border-radius:20px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.sl-inner{background:var(--sl-surface2);border:1px solid var(--sl-border);border-radius:12px}
.sl-divider{border-top:1px solid var(--sl-border)}
.sl-btn{background:linear-gradient(135deg,#2563EB,#7C3AED);color:#fff;font-weight:600;border-radius:12px;box-shadow:0 10px 30px -10px rgba(124,58,237,.65);transition:filter .2s,transform .2s}
.sl-btn:hover{filter:brightness(1.12)}
.sl-ghost{background:var(--sl-surface);color:var(--sl-text);border:1px solid var(--sl-border);font-weight:600;border-radius:12px;transition:background .2s,border-color .2s}
.sl-ghost:hover{background:var(--sl-surface2);border-color:var(--sl-muted)}
.sl-chip{background:var(--sl-surface);border:1px solid var(--sl-border);border-radius:999px;color:var(--sl-text)}
.sl-tint{background:color-mix(in srgb,var(--sl-blue) 14%,transparent);color:var(--sl-text);border:1px solid color-mix(in srgb,var(--sl-blue) 30%,transparent)}
.sl-iconbox{background:linear-gradient(135deg,color-mix(in srgb,var(--sl-blue) 28%,transparent),color-mix(in srgb,var(--sl-violet) 28%,transparent));border:1px solid var(--sl-border);color:var(--sl-text)}
.sl-popular{background:linear-gradient(var(--sl-bg2),var(--sl-bg2)) padding-box,linear-gradient(135deg,var(--sl-blue),var(--sl-violet)) border-box;border:2px solid transparent;border-radius:20px}
.sl-seg{display:inline-flex;gap:4px;padding:6px;background:var(--sl-surface);border:1px solid var(--sl-border);border-radius:18px}
.sl-seg-btn{display:inline-flex;align-items:center;gap:8px;padding:.65rem 1.5rem;border-radius:13px;border:1px solid transparent;font-weight:600;font-size:.9rem;color:var(--sl-muted);transition:background .2s,color .2s,border-color .2s}
.sl-seg-btn:hover{color:var(--sl-text)}
.sl-seg-btn[aria-checked="true"]{background:var(--sl-surface2);color:var(--sl-text);border-color:var(--sl-border)}

/* ambient glows (animated) */
.sl-ambient{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:-1}
.sl-glow{position:absolute;border-radius:50%;background:radial-gradient(closest-side,var(--c,var(--sl-blue)),transparent);opacity:var(--sl-glow);will-change:transform,opacity;pointer-events:none}
@keyframes sl-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(90px,60px,0) scale(1.18)}}
@keyframes sl-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-100px,-50px,0) scale(1.12)}}
@keyframes sl-drift-c{0%,100%{transform:translate3d(0,0,0) scale(1.05)}50%{transform:translate3d(60px,-80px,0) scale(.92)}}
@keyframes sl-breathe{0%,100%{opacity:calc(var(--sl-glow)*.65)}50%{opacity:var(--sl-glow)}}
.sl-drift-a{animation:sl-drift-a 20s ease-in-out infinite,sl-breathe 8s ease-in-out infinite}
.sl-drift-b{animation:sl-drift-b 26s ease-in-out infinite,sl-breathe 10s ease-in-out infinite}
.sl-drift-c{animation:sl-drift-c 23s ease-in-out infinite,sl-breathe 9s ease-in-out infinite}
@keyframes sl-shift{from{background-position:0% 50%}to{background-position:100% 50%}}
.sl button{cursor:pointer}
.sl :is(a,button,input,select):focus-visible{outline:2px solid var(--sl-ring);outline-offset:2px;border-radius:8px}
.sl input[type=range]{accent-color:var(--sl-violet);width:100%}

@keyframes sl-wave{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}
.sl-bar{display:block;width:4px;border-radius:4px;background:linear-gradient(to top,var(--sl-blue),var(--sl-violet));transform-origin:center;animation:sl-wave 1.15s ease-in-out infinite}
.sl-paused .sl-bar{animation-play-state:paused}
@keyframes sl-ping{75%,100%{transform:scale(2.4);opacity:0}}
.sl-ping{position:absolute;inset:0;border-radius:999px;background:var(--sl-bad);animation:sl-ping 1.6s cubic-bezier(0,0,.2,1) infinite}
@media (prefers-reduced-motion:reduce){
  .sl-bar,.sl-ping,.sl-grad,.sl-drift-a,.sl-drift-b,.sl-drift-c{animation:none!important}
  .sl *{scroll-behavior:auto!important}
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

  return <span className="tabular-nums">{format(display)}</span>;
}

function Slider({ id, label, value, min, max, step, onChange, display }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="text-sm font-medium sl-text">{label}</label>
        <span className="text-sm font-bold sl-text tabular-nums">{display}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero: interactive agency-savings calculator                        */
/* ------------------------------------------------------------------ */
function SavingsCalculator() {
  const [fee, setFee] = useState(3000);
  const [spend, setSpend] = useState(20000);
  const [bots, setBots] = useState(15);

  const yearlyFees = fee * 12;
  const exposed = Math.round((spend * bots) / 100);

  return (
    <div className="sl-card p-6 sm:p-8 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="sl-display text-lg font-bold sl-text">What is your agency costing you?</h2>
        <span className="sl-chip text-xs font-semibold px-2.5 py-1">Calculator</span>
      </div>

      <div className="space-y-6 mb-8">
        <Slider id="calc-fee" label="Agency fee per month" value={fee} min={500} max={10000} step={250} onChange={setFee} display={fmtUSD(fee)} />
        <Slider id="calc-spend" label="Monthly ad spend" value={spend} min={1000} max={100000} step={1000} onChange={setSpend} display={fmtUSD(spend)} />
        <Slider id="calc-bots" label="Traffic that is bots or invalid" value={bots} min={5} max={40} step={1} onChange={setBots} display={`${bots}%`} />
      </div>

      <div className="sl-inner p-5 mb-4">
        <p className="text-sm sl-muted mb-1">Agency fees you stop paying each year</p>
        <p className="sl-display text-4xl sm:text-5xl font-extrabold sl-good">
          <AnimatedNumber value={yearlyFees} format={fmtUSD} />
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="sl-inner p-4">
          <p className="text-xs sl-muted mb-1">Agency cost per month</p>
          <p className="text-lg font-bold sl-text"><AnimatedNumber value={fee} format={fmtUSD} /></p>
        </div>
        <div className="sl-inner p-4">
          <p className="text-xs sl-muted mb-1">Ad budget exposed to bots / month</p>
          <p className="text-lg font-bold sl-bad"><AnimatedNumber value={exposed} format={fmtUSD} /></p>
        </div>
      </div>

      <Link to="/register" className="sl-btn w-full py-3.5 text-sm flex items-center justify-center gap-2">
        Replace your agency, start free <ArrowRight className="w-4 h-4" />
      </Link>
      <p className="text-xs sl-muted mt-3 text-center">Illustrative numbers based on your inputs. Actual results vary.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Audience tabs (3 pillars)                                          */
/* ------------------------------------------------------------------ */
const AUDIENCES = [
  {
    id: 'ecom', label: 'E-commerce & DTC', icon: ShoppingBag,
    problem: 'Your TikTok and Meta budget is paying for bot clicks that never buy.',
    note: 'Works with Shopify and WooCommerce.',
    points: [
      'Block datacenter and bot clicks before they cost you money',
      'Send each buyer to the local checkout in their currency and language',
      'See which ad earned real ROAS, not just clicks'
    ],
    caption: 'Sample campaign',
    rows: [
      { l: 'Bot clicks blocked', v: '612', tone: 'bad' },
      { l: 'Real visitors', v: '3,598', tone: '' },
      { l: 'ROAS, ad set B', v: '3.1x', tone: 'good' }
    ]
  },
  {
    id: 'media', label: 'Media buyers', icon: Megaphone,
    problem: 'Voluum and ClickMagick cost $99 to $299 a month and take a week to learn.',
    note: 'Built for speed and low cost.',
    points: [
      'Sub-second routing for every click',
      'Postback and Sub-ID tracking at half the cost',
      'Branded links on your own custom domain'
    ],
    caption: 'Sample routing rules',
    rows: [
      { l: 'iOS', v: 'App Store', tone: '' },
      { l: 'France', v: '/fr-fr', tone: '' },
      { l: 'Postback, sub_id tt_ad_42', v: '$38.00', tone: 'good' }
    ]
  },
  {
    id: 'creators', label: 'Founders & creators', icon: Rocket,
    problem: "You can't afford an agency, and a basic bio page doesn't sell anything.",
    note: 'No code, live in 2 minutes.',
    points: [
      'Collect newsletter subscribers from a smart marketing hub',
      'Sell digital products with instant checkout links',
      'Keep 95% of every sale'
    ],
    caption: 'Sample hub activity',
    rows: [
      { l: 'New subscribers today', v: '+48', tone: 'good' },
      { l: 'PDF guide sold at $19', v: '$18.05 kept', tone: 'good' },
      { l: 'Link clicks', v: '1,204', tone: '' }
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
          <h2 className="sl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">One agent, built for how you actually sell</h2>
          <p className="text-lg sl-muted">Pick your situation to see what the agent does for you.</p>
        </div>

        <div role="tablist" aria-label="Who is Smart Link for" className="flex flex-wrap gap-2 mb-8">
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
              <t.icon className="w-4 h-4" /> {t.label}
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
              <p className="sl-display text-2xl font-bold mb-6 leading-snug">{a.problem}</p>
              <ul className="space-y-4 mb-6">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 sl-good" aria-hidden="true" />
                    <span className="sl-text">{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm sl-muted">{a.note}</p>
            </div>

            <div className="sl-card p-8 flex flex-col justify-center">
              <p className="text-sm font-semibold sl-muted mb-4">{a.caption}</p>
              <div className="space-y-3">
                {a.rows.map((r) => (
                  <div key={r.l} className="sl-inner flex items-center justify-between px-4 py-4">
                    <span className="text-sm sl-muted">{r.l}</span>
                    <span className={`sl-display text-xl font-extrabold tabular-nums ${r.tone === 'bad' ? 'sl-bad' : r.tone === 'good' ? 'sl-good' : 'sl-text'}`}>{r.v}</span>
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
/*  Feature visuals: live bot shield + voice agent                     */
/* ------------------------------------------------------------------ */
const BLOCKED = [
  { who: 'Datacenter, AWS', src: 'TikTok Ads', geo: 'US' },
  { who: 'Headless browser', src: 'Meta Ads', geo: 'DE' },
  { who: 'Proxy farm', src: 'Google Ads', geo: 'VN' },
  { who: 'Datacenter, OVH', src: 'TikTok Ads', geo: 'FR' },
  { who: 'Scripted clicker', src: 'Meta Ads', geo: 'BR' },
  { who: 'Datacenter, Azure', src: 'Google Ads', geo: 'IN' }
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
    <div className="sl-card p-8 md:col-span-2 grid sm:grid-cols-2 gap-8 items-center">
      <div>
        <div className="w-11 h-11 rounded-xl sl-iconbox flex items-center justify-center mb-4"><Shield className="w-5 h-5" /></div>
        <h3 className="sl-display text-xl font-bold mb-2">Advanced Traffic Shield</h3>
        <p className="text-sm sl-muted leading-relaxed mb-4">Reduce ad waste from automated traffic. Our multi-signal filtering ensures your budget is focused on real human engagement.</p>
        <p className="text-sm sl-text">
          <span className="sl-bad font-bold text-2xl sl-display tabular-nums"><AnimatedNumber value={1284 + tick} /></span>
          <span className="sl-muted ml-2">bot clicks blocked in this sample</span>
        </p>
      </div>

      <div className="sl-inner p-4" aria-label="Sample feed of blocked bot clicks">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold sl-muted">
          <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
            <span className="sl-ping"></span>
            <span className="relative w-2.5 h-2.5 rounded-full" style={{ background: 'var(--sl-bad)' }}></span>
          </span>
          Live preview, sample data
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
                className="flex items-center justify-between text-xs px-3 py-2 rounded-lg"
                style={{ background: 'color-mix(in srgb,var(--sl-bad) 10%,transparent)', border: '1px solid color-mix(in srgb,var(--sl-bad) 30%,transparent)' }}
              >
                <span className="sl-text font-medium">{it.who}</span>
                <span className="sl-muted">{it.src}, {it.geo}</span>
                <span className="sl-bad font-bold">Blocked</span>
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
    <div className="sl-card p-8 md:col-span-2 grid sm:grid-cols-2 gap-8 items-center">
      <div className="sm:order-2">
        <div className="w-11 h-11 rounded-xl sl-iconbox flex items-center justify-center mb-4"><Mic className="w-5 h-5" /></div>
        <h3 className="sl-display text-xl font-bold mb-2">AI Voice Marketing Agent</h3>
        <p className="text-sm sl-muted leading-relaxed">Ask how your campaigns are doing and get a spoken briefing: what worked, what leaked budget, and where to move spend next.</p>
      </div>

      <div className="sl-inner p-5 sm:order-1">
        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause voice preview animation' : 'Play voice preview animation'}
            className="sl-btn w-11 h-11 flex items-center justify-center flex-shrink-0"
            style={{ borderRadius: 999 }}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <div className={`flex items-center justify-between flex-1 h-12 ${playing ? '' : 'sl-paused'}`} aria-hidden="true">
            {bars.map((b, i) => (
              <span key={i} className="sl-bar" style={{ height: `${b.h}%`, animationDelay: `${b.d}s` }}></span>
            ))}
          </div>
        </div>
        <p className="text-xs font-semibold sl-muted mb-1">Example briefing</p>
        <p className="text-sm sl-text leading-relaxed">Yesterday TikTok sent 4,210 clicks. 612 came from datacenters and were blocked. Ad set B returns 3.1x ROAS, so shift budget there.</p>
      </div>
    </div>
  );
}

function FeatureCard({ f }) {
  return (
    <div className="sl-card p-6">
      <div className="w-11 h-11 rounded-xl sl-iconbox flex items-center justify-center mb-4"><f.icon className="w-5 h-5" /></div>
      <h3 className="sl-display text-lg font-bold mb-2">{f.title}</h3>
      <p className="text-sm sl-muted leading-relaxed">{f.desc}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works (same 4 steps and mock panels)                        */
/* ------------------------------------------------------------------ */
function HowItWorksSection() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Create Smart Links", desc: "Paste URL, customize alias, and add tags.", icon: Link2 },
    { title: "Smart Targeting", desc: "Route users by Device (iOS/Android) or Location.", icon: Target },
    { title: "Build Bio Page", desc: "Drag & drop links, choose themes, and publish.", icon: Layout },
    { title: "Track Analytics", desc: "Real-time insights on clicks, location, and OS.", icon: BarChart3 }
  ];

  return (
    <section id="how-it-works" className="py-24 sl-bg2 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2 className="sl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Everything You Need, In One Platform</h2>
          <p className="text-lg sl-muted">Take a tour of how Smart Link helps you manage and optimize your digital presence.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-3">
            {steps.map((s, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setStep(i)}
                aria-current={step === i ? 'step' : undefined}
                className={`w-full flex items-start gap-4 p-4 text-left transition-all ${step === i ? 'sl-card' : 'opacity-70 hover:opacity-100'}`}
                style={step === i ? undefined : { border: '1px solid transparent', borderRadius: 20 }}
              >
                <div className="w-10 h-10 rounded-xl sl-iconbox flex items-center justify-center flex-shrink-0"><s.icon className="w-5 h-5" /></div>
                <div>
                  <p className="font-bold text-lg sl-text">{s.title}</p>
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
                    <p className="text-xs font-bold sl-muted mb-4 text-left">1. Paste and create</p>
                    <div className="sl-card rounded p-2 text-left mb-4 text-sm overflow-hidden whitespace-nowrap font-mono sl-muted" style={{ borderRadius: 8 }}>https://myshop.com/super-sale</div>
                    <div className="flex gap-2 items-center mb-4 justify-start">
                      <span className="text-sm sl-muted">Custom Alias:</span>
                      <span className="sl-tint px-2 py-1 rounded text-xs font-bold">summer-sale</span>
                    </div>
                    <div className="sl-btn w-full py-2 text-sm">Create Smart Link</div>
                  </div>
                )}
                {step === 1 && (
                  <div className="sl-inner p-6">
                    <p className="text-xs font-bold sl-muted mb-4 text-left">2. Add targeting rules</p>
                    <div className="space-y-3">
                      <div className="sl-card flex items-center gap-3 p-3" style={{ borderRadius: 10 }}>
                        <Smartphone className="w-4 h-4 sl-muted" />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold sl-text">iOS</p>
                          <p className="text-xs sl-muted">App Store</p>
                        </div>
                      </div>
                      <div className="sl-card flex items-center gap-3 p-3" style={{ borderRadius: 10 }}>
                        <Globe className="w-4 h-4 sl-muted" />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold sl-text">France</p>
                          <p className="text-xs sl-muted">/fr-fr</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="sl-inner p-6 text-center">
                    <p className="text-xs font-bold sl-muted mb-4 text-left">3. Design bio page</p>
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 sl-iconbox"></div>
                    <p className="font-bold sl-text text-sm">Sarah Creator</p>
                    <p className="text-xs sl-muted mb-4">@sarah_designs</p>
                    <div className="space-y-2">
                      <div className="h-8 rounded w-full" style={{ background: 'var(--sl-border)' }}></div>
                      <div className="h-8 rounded w-full" style={{ background: 'var(--sl-border)' }}></div>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="sl-inner p-6">
                    <p className="text-xs font-bold sl-muted mb-4 text-left">4. Analyze results</p>
                    <div className="flex items-end h-24 gap-2 mb-4 justify-between">
                      {[30, 50, 40, 70, 90, 60].map((h, i) => (
                        <div key={i} className="w-8 rounded-t" style={{ height: `${h}%`, background: 'linear-gradient(to top,var(--sl-blue),var(--sl-violet))' }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between sl-divider pt-4">
                      <div className="text-left">
                        <p className="text-2xl font-bold sl-text">12.5k</p>
                        <p className="text-xs sl-muted">Clicks</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold sl-text">iOS</p>
                        <p className="text-xs sl-muted">Top Device</p>
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
/*  FAQ (same questions and answers)                                   */
/* ------------------------------------------------------------------ */
function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqs = [
    { q: "Why do I need Smart Link if I already have a link shortener?", a: "Traditional shorteners just count clicks. Smart Link goes deeper by tracking OS data, geolocation, and referrer metrics so you can expose the true intent behind your traffic, not just the volume." },
    { q: "How does device targeting (iOS/Android) increase conversions?", a: "Instead of overwhelming users with two buttons, you create one Smart Link. We instantly detect their device and route iOS users to the App Store and Android users to Google Play, drastically reducing friction." },
    { q: "Can I track my link clicks for free?", a: "Yes! We believe deep analytics should be accessible to everyone. You get real-time analytics for all your links, including device, location, and click-through data—all completely free." },
    { q: "Can I use my own custom domain?", a: "Absolutely. You can connect your own domain (e.g., links.yourbrand.com) to maintain full brand consistency across all touchpoints." },
    { q: "How do I create a free link in bio?", a: "Simply sign up, claim your username, and paste your URLs. You can customize your bio page with themes and go live in less than 2 minutes." }
  ];

  return (
    <section id="faq" className="py-24 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="sl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-lg sl-muted">Everything you need to know about Smart Link.</p>
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
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="font-semibold sl-text text-base sm:text-lg flex-1 pr-4">{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 sl-muted transition-transform duration-200 ${openFAQ === i ? 'rotate-90' : ''}`} aria-hidden="true" />
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
                    <div className="px-5 sm:px-6 pb-6 pt-4 sl-muted text-base leading-relaxed sl-divider mx-5 sm:mx-6" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === null ? true : saved === 'true'; // dark-first
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const reduce = useReducedMotion();

  const SUCCESS_URL = 'https://www.by-smartlink.com/success';

  const handleStartTrial = () => {
    window.location.href = '/register?trial=true';
  };

  const buildCheckoutUrl = (baseUrl, userId) => {
    if (!baseUrl) return null;
    const url = new URL(baseUrl);
    if (userId) url.searchParams.set('checkout[custom][user_id]', userId);
    url.searchParams.set('checkout[success_url]', SUCCESS_URL);
    return url.toString();
  };

  const handleCheckout = (plan, yearly) => {
    if (plan.id === 'free') { window.location.href = '/register'; return; }
    if (plan.id === 'trial') { window.location.href = '/register?trial=true'; return; }
    if (!user) { window.location.href = '/register?redirect=pricing'; return; }
    const rawUrl = yearly ? plan.checkoutUrl.yearly : plan.checkoutUrl.monthly;
    const checkoutUrl = buildCheckoutUrl(rawUrl, user?._id || user?.id);
    if (!checkoutUrl) { alert('Checkout link not available'); return; }
    window.location.href = checkoutUrl;
  };

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); }
    else { document.documentElement.classList.remove('dark'); }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const enter = (delay = 0) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay } };

  const features = [
    { icon: Zap, title: 'Auto-Pilot Optimization', desc: 'Our performance algorithm automatically routes your traffic to the winning A/B variant, maximizing conversion efficiency.' },
    { icon: BarChart3, title: 'Efficiency Analytics', desc: 'Real-time campaign insights. See exactly how much ad waste was reduced and how much performance was recovered.' },
    { icon: Smartphone, title: 'Precision Geotargeting', desc: 'Route iOS users to the App Store and Android to Google Play instantly. Eliminate friction and ensure accuracy.' },
    { icon: Globe, title: 'Global Campaign Guard', desc: 'Redirect users based on their country or language with 0ms latency. Keep your international marketing high-converting.' },
    { icon: Code, title: 'Enterprise Integration API', desc: 'Integrate our performance protection engine directly into your own workflow or SaaS product to provide enhanced value.' }
  ];
  const sellItems = [
    { icon: FileText, l: 'PDF Guides' }, { icon: Video, l: 'Exclusive Videos' },
    { icon: Link2, l: 'Secret Links' }, { icon: Wrench, l: 'Templates & Tools' },
    { icon: Music, l: 'Audio Files' }, { icon: Camera, l: 'Photo Presets' },
    { icon: BookOpen, l: 'E-Books' }, { icon: Crown, l: 'Premium Access' }
  ];

  const navLink = 'text-sm font-medium sl-muted hover:text-[color:var(--sl-text)] transition-colors';

  return (
    <div className="sl min-h-screen transition-colors duration-300" data-theme={darkMode ? 'dark' : 'light'}>
      <style>{STYLES}</style>
      <SEO
        title="Smart Link — Marketing Infrastructure for Affiliates, Creators & Media Buyers"
        description="Replace ClickMagick, Voluum & Linktree with one platform. Geo Targeting, Bot Protection, Deep Analytics & A/B Testing."
      />

      {/* Animated ambient glows */}
      <div className="sl-ambient" aria-hidden="true">
        <span className="sl-glow sl-drift-a" style={{ '--c': 'var(--sl-blue)', width: 680, height: 680, top: '-12%', left: '-10%' }}></span>
        <span className="sl-glow sl-drift-b" style={{ '--c': 'var(--sl-violet)', width: 620, height: 620, top: '38%', right: '-14%' }}></span>
        <span className="sl-glow sl-drift-c" style={{ '--c': 'var(--sl-blue)', width: 560, height: 560, bottom: '-18%', left: '18%' }}></span>
      </div>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled ? { background: 'var(--sl-nav)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--sl-border)' } : { background: 'transparent' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-v1.svg" alt="Smart Link" className="w-8 h-8" />
              <span className="sl-display text-xl font-extrabold sl-grad">Smart Link</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={navLink}>Features</a>
              <a href="#how-it-works" className={navLink}>How It Works</a>
              <a href="#pricing" className={navLink}>Pricing</a>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/ar" className={`${navLink} font-cairo`}>العربية</Link>
              <button onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} className="p-2 rounded-lg sl-muted hover:bg-[var(--sl-surface2)] transition-colors flex items-center justify-center">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link to="/login" className="text-sm font-semibold sl-text">Login</Link>
              <Link to="/register" className="sl-btn text-sm px-5 py-2.5 flex items-center justify-center">Get Started</Link>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} className="p-2 sl-muted">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" aria-expanded={mobileMenuOpen} className="p-2 sl-muted">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden sl-divider" style={{ background: 'var(--sl-bg)' }}>
                <div className="flex flex-col gap-4 p-4">
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="sl-text font-medium">Features</a>
                  <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="sl-text font-medium">How It Works</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="sl-text font-medium">Pricing</a>
                  <Link to="/ar" onClick={() => setMobileMenuOpen(false)} className="sl-muted font-cairo">العربية</Link>
                  <div className="sl-divider my-2"></div>
                  <Link to="/login" className="sl-text font-semibold">Login</Link>
                  <Link to="/register" className="sl-btn text-center py-3">Get Started</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            <div>
              <motion.div {...enter(0)} className="sl-chip inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium mb-6">
                <Bot className="w-4 h-4" style={{ color: 'var(--sl-violet)' }} aria-hidden="true" /> Autonomous AI Marketing Agent
              </motion.div>
              <motion.h1 {...enter(0.08)} className="sl-display text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05] mb-6">
                <span className="block">Fire Your Marketing Agency.</span>
                <span className="block sl-grad mt-2">Meet Your Autonomous AI Marketing Agent.</span>
              </motion.h1>
              <motion.p {...enter(0.16)} className="text-lg sl-muted mb-6 max-w-xl leading-relaxed">
                Built by an affiliate marketer who was tired of flying blind. It blocks bot clicks, routes every visitor by country and device, and briefs you by voice, so everything that happens after the click is finally visible.
              </motion.p>
              <motion.ul {...enter(0.22)} className="flex flex-wrap gap-2 mb-8" aria-label="Capabilities">
                {[
                  { i: Target, t: 'Geo Targeting' }, { i: Shield, t: 'Bot Protection' },
                  { i: BarChart3, t: 'Deep Analytics' }, { i: TrendingUp, t: 'A/B Testing' }
                ].map((c) => (
                  <li key={c.t} className="sl-chip flex items-center gap-2 px-3 py-1.5 text-sm font-medium">
                    <c.i className="w-4 h-4 sl-muted" aria-hidden="true" /> {c.t}
                  </li>
                ))}
              </motion.ul>
              <motion.div {...enter(0.28)} className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register" className="sl-btn w-full sm:w-auto px-7 py-3.5 text-sm flex justify-center items-center gap-2">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })} className="sl-ghost w-full sm:w-auto px-7 py-3.5 text-sm flex justify-center items-center gap-2">
                  See how it works <Play className="w-4 h-4" />
                </button>
              </motion.div>
              <motion.div {...enter(0.34)} className="flex flex-wrap items-center gap-6 text-sm sl-muted font-medium">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /><span>No credit card</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /><span>Free forever</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /><span>Setup in 2 min</span></div>
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
            <h2 className="sl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Stop Paying For 3 Tools. Get All of It Free.</h2>
            <p className="text-lg sl-muted">Everything you need to manage your links, track your audience, and grow your brand online.</p>
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
                <div className="w-12 h-12 rounded-xl sl-btn flex items-center justify-center mb-5"><Lock className="w-6 h-6" /></div>
                <h3 className="sl-display text-2xl font-bold mb-3">Creator Paywall</h3>
                <p className="text-sm sl-muted leading-relaxed">Sell digital products, exclusive guides, or premium links directly from your Bio Page. Start earning from your audience instantly.</p>
              </div>
              <div className="sl-inner p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--sl-blue)' }} aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold sl-text mb-1">Securely powered by Stripe</p>
                    <p className="text-xs sl-muted leading-snug">We use Stripe to process payments. Your funds are protected and transferred directly to your bank account with zero hassle.</p>
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
            <div className="sl-tint inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium mb-4">For Content Creators</div>
            <h2 className="sl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Turn Your Bio Page Into A Revenue Stream</h2>
            <p className="text-lg sl-muted">No coding. No complicated setup. Just add a price to your content and start earning — your followers pay directly through your bio link.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { title: 'Connect Your Bank', desc: 'Easily link your Stripe account through our secure dashboard.' },
              { title: 'Create Your Product', desc: 'Add a "Paywall" block, set your desired price, and link your secret content.' },
              { title: 'Collect Revenue', desc: 'Your audience pays securely via Stripe. Money is transferred to your account instantly.' }
            ].map((s, i) => (
              <div key={i} className="sl-card p-6 text-left">
                <div className="w-8 h-8 rounded-full sl-btn text-sm font-bold flex items-center justify-center mb-5" style={{ borderRadius: 999 }}>{i + 1}</div>
                <h3 className="sl-display text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm sl-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="sl-card p-8 text-center max-w-3xl mx-auto">
            <h3 className="sl-display text-xl font-bold mb-6">What Can You Sell?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {sellItems.map((it) => (
                <div key={it.l} className="sl-inner flex flex-col items-center gap-2 p-3">
                  <it.icon className="w-5 h-5" style={{ color: 'var(--sl-violet)' }} aria-hidden="true" />
                  <span className="text-xs font-bold sl-text">{it.l}</span>
                </div>
              ))}
            </div>
            <Link to="/register" className="sl-btn inline-flex px-6 py-3 text-sm">Start Selling for Free</Link>
            <p className="mt-4 text-xs sl-muted">We only take 5% per sale. You keep 95%.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sl-bg2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sl-display text-3xl font-extrabold text-center mb-14">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { quote: "Tested SmartLink today, quick honest review. Setup was simple, the dashboard is clean, and everythin...", author: "Karl Beismann", role: "@karlbeis", link: "https://x.com/karlbeis" },
              { quote: "Makes sharing one link for multiple destinations feel easy and tidy, that’s useful for campaigns or social bios.", author: "Vineer", role: "@vineerpasam", link: "https://x.com/vineerpasam" },
              { quote: "It's a solid tool for creators and businesses who want real data instead of guesses. Clean dashboard and real-time link tracking. Good for link-in-bio pages and short links.", author: "Chandan H", role: "@_Chandan_17", link: "https://x.com/_Chandan_17" }
            ].map((t, i) => (
              <figure key={i} className="sl-card p-8 text-left flex flex-col">
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
            <h2 className="sl-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Flexible Plans for Every Stage</h2>
            <p className="text-lg sl-muted mb-8 max-w-2xl mx-auto">Start for free, upgrade as you grow. No hidden fees, cancel anytime.</p>
            <div role="radiogroup" aria-label="Billing period" className="sl-seg">
              <button type="button" role="radio" aria-checked={!isYearly} onClick={() => setIsYearly(false)} className="sl-seg-btn">Monthly</button>
              <button type="button" role="radio" aria-checked={isYearly} onClick={() => setIsYearly(true)} className="sl-seg-btn">
                Yearly <span className="text-xs font-bold sl-good">Save 25%</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`relative p-8 flex flex-col ${plan.popular ? 'sl-popular md:scale-[1.03] z-10' : 'sl-card'}`}>
                {plan.popular && <div className="sl-btn absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs w-max" style={{ borderRadius: 999 }}>Most Popular</div>}
                <div className="mb-6">
                  <h3 className="sl-display text-xl font-bold mb-2 uppercase">{plan.name}</h3>
                  <p className="text-sm sl-muted">{plan.description}</p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="sl-display text-4xl font-extrabold">{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                  <span className="text-sm font-medium sl-muted">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 sl-good" aria-hidden="true" />
                      <span className="text-sm sl-text">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout(plan, isYearly)} className={`w-full py-3 text-sm mb-3 ${plan.popular ? 'sl-btn' : 'sl-ghost'}`}>
                  {plan.cta}
                </button>
                {plan.trialAvailable && (
                  <button onClick={handleStartTrial} className="sl-tint w-full py-2.5 text-xs font-semibold rounded-lg">
                    Try free for {plan.trialDays} days
                  </button>
                )}
                {plan.id !== 'free' && <p className="text-center mt-3 text-xs sl-muted">Cancel anytime, no questions asked</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="relative max-w-5xl mx-auto overflow-hidden text-center sl-card py-16 px-6" style={{ borderRadius: 32 }}>
          <span className="sl-glow sl-drift-b" style={{ '--c': 'var(--sl-blue)', width: 480, height: 480, top: -220, left: '20%' }} aria-hidden="true"></span>
          <span className="sl-glow sl-drift-a" style={{ '--c': 'var(--sl-violet)', width: 420, height: 420, bottom: -220, right: '15%' }} aria-hidden="true"></span>
          <div className="relative max-w-2xl mx-auto">
            <h2 className="sl-display text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">Ready to link smarter?</h2>
            <p className="text-lg sl-muted mb-10 max-w-xl mx-auto leading-relaxed">Early access — join the founders who get it before everyone else.</p>
            <Link to="/register" className="sl-btn inline-flex px-8 py-4 text-base items-center gap-2">
              See What Happens After Your Clicks <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm sl-muted flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 sl-good" aria-hidden="true" /> Cancel anytime
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
              <h2 className="sl-display text-3xl font-extrabold mb-6">Our Mission: Empowering Founders & Creators</h2>
              <p className="sl-muted mb-6 leading-relaxed">
                Smart Link was born from a simple idea: professional-grade marketing tools shouldn't be locked behind expensive subscriptions for those just starting out.
              </p>
              <p className="sl-muted leading-relaxed mb-8">
                Whether you are a SaaS founder launching your first product, a marketer optimizing campaigns, or a creator building your brand, we provide the analytics and targeting tools you need to succeed.
              </p>
              <p className="text-sm font-semibold sl-text flex items-center gap-2"><Sparkles className="w-4 h-4" style={{ color: 'var(--sl-violet)' }} aria-hidden="true" /> Built with love by a global team of specialists.</p>
            </div>
            <div className="space-y-6">
              {[
                { title: 'Privacy First', desc: "We don't track your users personally. Only clean, actionable data.", icon: Shield },
                { title: 'Performance DNA', desc: 'Lightweight links that load in milliseconds across the globe.', icon: Zap },
                { title: 'Secure & Reliable', desc: '99.9% uptime with enterprise-grade security for every link.', icon: Lock }
              ].map((v, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl sl-iconbox flex items-center justify-center flex-shrink-0"><v.icon className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold sl-text mb-1">{v.title}</h3>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/logo-v1.svg" alt="Smart Link" className="w-8 h-8" />
                <span className="sl-display text-xl font-extrabold sl-grad">Smart Link</span>
              </Link>
              <p className="text-sm sl-muted mb-6 max-w-sm">The advanced link management platform for modern creators.</p>
            </div>
            <div>
              <h3 className="font-semibold sl-text mb-4">Product</h3>
              <ul className="space-y-3 text-sm sl-muted">
                <li><Link to="/dashboard" className="hover:text-[color:var(--sl-text)]">Dashboard</Link></li>
                <li><Link to="/pricing" className="hover:text-[color:var(--sl-text)]">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold sl-text mb-4">Solutions</h3>
              <ul className="space-y-3 text-sm sl-muted">
                <li><Link to="/for-creators" className="hover:text-[color:var(--sl-text)]">For Creators</Link></li>
                <li><Link to="/for-marketers" className="hover:text-[color:var(--sl-text)]">For Marketers</Link></li>
                <li><Link to="/for-ecommerce" className="hover:text-[color:var(--sl-text)]">For E-commerce</Link></li>
                <li><Link to="/for-affiliates" className="hover:text-[color:var(--sl-text)]">For Affiliates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold sl-text mb-4">Resources</h3>
              <ul className="space-y-3 text-sm sl-muted">
                <li><Link to="/faq" className="hover:text-[color:var(--sl-text)]">FAQ</Link></li>
                <li><Link to="/blog" className="hover:text-[color:var(--sl-text)]">Blog</Link></li>
                <li><a href="mailto:support@by-smartlink.com" className="hover:text-[color:var(--sl-text)]">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 sl-divider flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm sl-muted">© 2026 Smart Link. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://www.uneed.best/tool/smart-link" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://www.uneed.best/EMBED3.png" alt="Uneed Embed Badge" className="h-10" />
              </a>
              <a href="https://www.saashub.com/smart-link-pro?utm_source=badge&utm_campaign=badge&utm_content=smart-link-pro&badge_variant=color&badge_kind=approved" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="Smart Link Pro badge" className="h-10" />
              </a>
              <div className="flex gap-4 md:ml-4">
                <Link to="/privacy" className="text-sm sl-muted hover:text-[color:var(--sl-text)]">Privacy Policy</Link>
                <Link to="/terms" className="text-sm sl-muted hover:text-[color:var(--sl-text)]">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}