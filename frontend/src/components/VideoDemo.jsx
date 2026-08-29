import React from 'react';

export default function VideoDemo() {
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
