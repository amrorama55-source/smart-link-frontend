import { useState, useEffect } from 'react';
import { MoreHorizontal, Instagram, Twitter, Github, Linkedin, Globe, Youtube, Mail, Ghost, Music, X, Send } from 'lucide-react';
import api from '../services/api';

import { themes as themeData } from '../utils/bioThemes';

const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    x: Twitter,
    github: Github,
    linkedin: Linkedin,
    youtube: Youtube,
    tiktok: Music,
    snapchat: Ghost,
    email: Mail,
    website: Globe
};

export default function BioPagePreview({ previewData }) {
    if (!previewData) return null;

    const currentTheme = themeData[previewData.theme] || themeData.default;

    return (
        <div
            className="min-h-full w-full transition-all duration-500 overflow-x-hidden rounded-[2.5rem] flex flex-col relative selection:bg-violet-500/30"
            style={{
                ...currentTheme.variables,
                background: currentTheme.variables['--bio-bg'],
                backdropFilter: currentTheme.variables['--bio-backdrop'] || 'none'
            }}
        >
            {/* Ambient Background Light Reflector */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none"></div>

            {/* Top Spacing */}
            <div className="h-16 w-full relative z-10"></div>

            <div className="px-6 -mt-8 pb-24 flex-1 text-center relative z-10 flex flex-col items-center">
                {/* Avatar with Organic Glow Ring */}
                <div className="relative inline-block mb-4 pt-4 group">
                    <div className="w-24 h-24 rounded-full p-1 bg-white/20 backdrop-blur-md shadow-2xl mx-auto overflow-hidden ring-4 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                        {previewData.avatar ? (
                            <img
                                src={previewData.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-3xl text-white shadow-inner">
                                👤
                            </div>
                        )}
                    </div>
                </div>

                {/* Name & Handle */}
                <div className="mb-3 max-w-[280px]">
                    <h1 className="text-xl font-black tracking-tight mb-1" style={{ color: 'var(--bio-text-primary)' }}>
                        {previewData.displayName || "Your Name"}
                    </h1>
                    <p className="text-xs font-bold tracking-wide opacity-75 inline-block px-3 py-0.5 rounded-full bg-black/5 dark:bg-white/5" style={{ color: 'var(--bio-text-secondary)' }}>
                        @{previewData.username || "username"}
                    </p>
                </div>

                {/* Bio */}
                {previewData.bio && (
                    <p className="text-xs sm:text-[13px] leading-relaxed mb-6 max-w-[290px] font-medium opacity-90" style={{ color: 'var(--bio-text-primary)' }}>
                        {previewData.bio}
                    </p>
                )}

                {/* Socials - Clean Organic Capsules */}
                {previewData.socialLinks && previewData.socialLinks.length > 0 && (
                    <div className="flex justify-center flex-wrap gap-2.5 mb-6 max-w-[280px]">
                        {previewData.socialLinks.map((s, i) => {
                            const Icon = socialIcons[s.platform] || Globe;
                            return (
                                <div
                                    key={i}
                                    className="w-9 h-9 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border"
                                    style={{
                                        backgroundColor: 'var(--bio-link-bg)',
                                        borderColor: 'var(--bio-link-border)',
                                        color: 'var(--bio-text-primary)'
                                    }}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Blocks - Tactile Pill Links & Cards */}
                <div className="flex flex-col items-center space-y-3.5 w-full max-w-[320px]">
                    {[...(previewData.customLinks || []).map(l => ({ ...l, type: 'link' })), ...(previewData.blocks || [])]
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((block, index) => {
                            if (block.type === 'header') {
                                return (
                                    <h3 key={index} className="w-full text-left font-black text-sm px-2 pt-3 opacity-90 tracking-tight" style={{ color: 'var(--bio-text-primary)' }}>
                                        {block.title}
                                    </h3>
                                );
                            }

                            if (block.type === 'newsletter') {
                                return (
                                    <div
                                        key={index}
                                        className="w-full p-5 rounded-3xl border shadow-md text-left space-y-3 transition-all duration-200"
                                        style={{
                                            backgroundColor: 'var(--bio-card-bg)',
                                            borderColor: 'var(--bio-link-border)',
                                            color: 'var(--bio-text-primary)'
                                        }}
                                    >
                                        <div className="space-y-0.5">
                                            <h4 className="font-extrabold text-sm">{block.title || "Join my Newsletter"}</h4>
                                            <p className="text-[11px] opacity-75">{block.content || "Stay updated with my latest news."}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <input 
                                                type="email" 
                                                placeholder="Enter your email" 
                                                className="w-full p-2.5 rounded-xl text-xs border bg-white/10 border-white/15 focus:ring-2 focus:ring-violet-500 outline-none"
                                            />
                                            <button className="w-full py-2.5 px-4 bg-white text-gray-900 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-transform hover:opacity-90">
                                                Subscribe
                                            </button>
                                        </div>
                                    </div>
                                );
                            }                            // Tactile Rounded Link Button
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (block.type === 'paywall' && block.settings?.checkoutUrl) {
                                            window.open(block.settings.checkoutUrl, '_blank');
                                        } else if (block.url) {
                                            window.open(block.url, '_blank');
                                        }
                                    }}
                                    className="group relative flex items-center p-1.5 rounded-2xl border shadow-sm w-full transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] cursor-pointer overflow-hidden"
                                    style={{
                                        backgroundColor: 'var(--bio-link-bg)',
                                        borderColor: 'var(--bio-link-border)',
                                        color: 'var(--bio-text-primary)'
                                    }}
                                >
                                    {/* Left Icon Capsule */}
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-black/5">
                                        {block.icon || (block.type === 'paywall' ? '🔐' : block.type === 'file' ? '📁' : '🔗')}
                                    </div>
                                    
                                    {/* Centered Title — truncated so it never overflows */}
                                    <div className="flex-1 py-2 px-2 text-center min-w-0">
                                        <p className="font-extrabold text-xs tracking-tight truncate leading-snug">
                                            {block.title || block.url}
                                        </p>
                                    </div>
                                    
                                    {/* Right Badge / Action — only show for paywall, hide dots for normal links */}
                                    {block.type === 'paywall' && (
                                        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px] font-black bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full whitespace-nowrap">
                                                BUY
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    }
                    
                    {(!previewData.customLinks || previewData.customLinks.length === 0) && (!previewData.blocks || previewData.blocks.length === 0) && (
                        <div className="p-6 border-2 border-dashed border-gray-400/20 rounded-2xl text-center text-xs text-gray-400 font-semibold w-full">
                            ✨ Your links will show up here
                        </div>
                    )}
                </div>

                {/* Minimal branding — tiny and unobtrusive at very bottom */}
                <div className="mt-8 mb-6 w-full flex justify-center">
                    <span className="flex items-center gap-1 opacity-30">
                        <img src="/logo-v1.svg" alt="" className="w-2.5 h-2.5 rounded" style={{ display: 'block' }} />
                        <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: 'var(--bio-text-secondary)' }}>
                            by-smartlink.com
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}