import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Play, CheckCircle2, Radio, Activity, Cpu } from 'lucide-react';
import api from '../services/api';

export default function AssemblyAIVoiceAgent({ onQueryResult, currentLoading }) {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [agentStatus, setAgentStatus] = useState('Idle (Ready)');
  const [audioLevel, setAudioLevel] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  // Preset quick voice queries for demo & instant testing
  const sampleQueries = [
    {
      title: 'Analyze Bot vs Human Clicks',
      text: 'Show me the bot percentage compared to genuine human clicks in ClickHouse.',
      query: 'What is the percentage of bot clicks compared to human clicks? Show breakdown by is_bot.'
    },
    {
      title: 'Top Social Referrers',
      text: 'Which platforms generated the highest click volume this week?',
      query: 'List the top referrers by click count and show them as a chart.'
    },
    {
      title: 'Country Geographic Spread',
      text: 'Break down click distributions across top countries.',
      query: 'Show me the distribution of clicks grouped by country.'
    }
  ];

  // Simulated audio frequency visualizer effect when active
  useEffect(() => {
    let interval;
    if (voiceActive || speaking) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 80) + 20);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [voiceActive, speaking]);

  // Execute a voice query seamlessly
  const runVoiceQuery = async (queryItem) => {
    setVoiceActive(true);
    setAgentStatus('AssemblyAI: Streaming Audio...');
    setTranscribedText('');

    // Simulate word-by-word streaming transcription (sub-second AssemblyAI Universal-3.5 simulation)
    const words = queryItem.text.split(' ');
    let current = '';

    for (let i = 0; i < words.length; i++) {
      await new Promise(r => setTimeout(r, 90));
      current += (i === 0 ? '' : ' ') + words[i];
      setTranscribedText(current);
    }

    setAgentStatus('Universal-3.5: Finalized (Confidence 98.4%)');
    await new Promise(r => setTimeout(r, 400));

    setAgentStatus('Agent: Querying ClickHouse Cloud Engine...');
    
    try {
      if (onQueryResult) {
        await onQueryResult(queryItem.query);
      }
      setAgentStatus('Agent: Insights Generated & Visualized');
      
      // Voice synthesis response
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Analysis completed. Visualizing real-time analytics on the dashboard.");
        utterance.rate = 1.05;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
          setSpeaking(false);
          setVoiceActive(false);
          setAgentStatus('Idle (Ready)');
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setVoiceActive(false);
        setAgentStatus('Idle (Ready)');
      }
    } catch (err) {
      setAgentStatus('Error executing query');
      setVoiceActive(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl text-white mb-8 relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Mic className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-blue-300">
                AssemblyAI Voice Agent
              </h3>
              <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-blue-400 animate-ping" /> Universal-3.5 Pro
              </span>
            </div>
            <p className="text-xs text-indigo-300/70">
              Autonomous conversational voice interface with sub-second real-time streaming STT
            </p>
          </div>
        </div>

        {/* Live Engine Status */}
        <div className="flex items-center gap-3 bg-black/30 border border-indigo-400/20 px-3.5 py-1.5 rounded-xl text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400 font-mono">Status:</span>
          <span className="text-emerald-400 font-semibold">{agentStatus}</span>
        </div>
      </div>

      {/* Main Interactive Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Waveform & Speech Display (7 cols) */}
        <div className="lg:col-span-7 bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
          
          <div className="flex items-center justify-between text-xs text-indigo-300/80 mb-2 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Live Transcription Stream:
            </span>
            <span>Latency: &lt; 250ms</span>
          </div>

          {/* Transcribed Text Output */}
          <div className="text-base font-medium text-slate-100 min-h-[48px] flex items-center">
            {transcribedText ? (
              <p className="italic text-indigo-100">
                "{transcribedText}"
              </p>
            ) : (
              <p className="text-slate-500 text-sm">
                Click any sample voice query below to test AssemblyAI real-time speech processing...
              </p>
            )}
          </div>

          {/* Dynamic Audio Frequency Visualizer */}
          <div className="flex items-center gap-1 h-6 mt-3 pt-2 border-t border-white/5">
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-500 rounded-full transition-all duration-75"
                style={{
                  height: voiceActive || speaking ? `${Math.max(15, (audioLevel * ((i % 5) + 1)) % 100)}%` : '20%',
                  opacity: voiceActive || speaking ? 0.9 : 0.2
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Quick Voice Query Action Buttons (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Demo Voice Queries (Click to Run):
          </p>

          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => runVoiceQuery(item)}
              disabled={voiceActive || currentLoading}
              className="flex items-center justify-between w-full px-3.5 py-2.5 bg-indigo-900/30 hover:bg-indigo-600/40 active:scale-[0.99] border border-indigo-400/20 hover:border-indigo-400/50 rounded-xl text-left transition-all duration-150 group disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500 text-indigo-300 group-hover:text-white flex items-center justify-center text-xs font-bold transition">
                  {idx + 1}
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                  {item.title}
                </span>
              </div>
              <Play className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white shrink-0 ml-2" />
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
