import { useState } from 'react';
import { Copy, CheckCircle, Zap, Shield, HelpCircle, Code2, ArrowRight } from 'lucide-react';

export default function PostbackIntegrationCard({ shortCode }) {
  const [copiedPostback, setCopiedPostback] = useState(false);
  const [copiedMacro, setCopiedMacro] = useState(false);

  const postbackUrl = `https://api.by-smartlink.com/api/conversions/postback?clickid={click_id}&payout={payout}`;
  const macroExample = `{clickid}`;

  const copyPostback = () => {
    navigator.clipboard.writeText(postbackUrl);
    setCopiedPostback(true);
    setTimeout(() => setCopiedPostback(false), 2000);
  };

  const copyMacro = () => {
    navigator.clipboard.writeText(macroExample);
    setCopiedMacro(true);
    setTimeout(() => setCopiedMacro(false), 2000);
  };

  return (
    <div className="bg-[#0E1322] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-white">S2S Postback & Sub-ID Tracking</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Affiliates & Media Buyers
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Voluum & ClickMagick alternative — track conversions server-to-server with 0ms latency</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1: Destination URL Macro */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Step 1: Pass {'{clickid}'} In Your Destination URL
            </span>
            <button
              type="button"
              onClick={copyMacro}
              className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copiedMacro ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedMacro ? 'Copied Macro' : 'Copy {clickid}'}
            </button>
          </div>
          <p className="text-xs text-gray-300 mb-2 leading-relaxed">
            Append the macro to your affiliate link (e.g., <code className="bg-black/40 px-1.5 py-0.5 rounded text-cyan-300 font-mono">https://network.com/offer?sub1={'{clickid}'}</code>). We dynamically replace it with a unique ID for every click.
          </p>
        </div>

        {/* Step 2: Postback URL */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Step 2: Set Server Postback in Your Network / CRM
            </span>
            <button
              type="button"
              onClick={copyPostback}
              className="text-xs font-bold text-white flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md active:scale-95"
            >
              {copiedPostback ? <CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPostback ? 'Postback Copied!' : 'Copy Postback URL'}
            </button>
          </div>
          <div className="bg-black/50 border border-white/10 rounded-xl p-3 font-mono text-xs text-gray-200 break-all select-all">
            {postbackUrl}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            When a conversion fires, replace <code className="text-cyan-300 font-mono">{'{click_id}'}</code> with the received sub-ID and <code className="text-emerald-300 font-mono">{'{payout}'}</code> with the commission amount. Conversions will immediately credit in your real-time analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
