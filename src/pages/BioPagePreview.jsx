import { useState, useEffect } from 'react';
import { Loader, ExternalLink, LinkIcon, Instagram, Twitter, Github, Linkedin, Globe, CheckCircle } from 'lucide-react';

const themes = {
    default: 'bg-[#f3f4f6]',
    dark: 'bg-[#1e1e1e]',
    blue: 'bg-blue-50',
    gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    midnight: 'bg-slate-900',
};

const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    website: Globe,
    youtube: Globe,
    tiktok: Globe
};

// Simplified Preview Component (Gravatar Style)
export default function BioPagePreview({ previewData }) {
    if (!previewData) return null;

    const currentTheme = previewData.theme || 'default';
    const themeClass = themes[currentTheme] || themes.default;
    const isDark = ['dark', 'midnight', 'gradient'].includes(currentTheme);
    const cardClass = isDark ? 'bg-black/20 backdrop-blur-md border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900';

    return (
        <div className={`min-h-full w-full ${themeClass} transition-colors duration-500 overflow-x-hidden rounded-[2rem] flex flex-col`}>

            {/* Banner */}
            <div className={`h-24 w-full ${isDark ? 'bg-white/5' : 'bg-gray-200/50'}`}></div>

            <div className="px-4 -mt-12 pb-8 flex-1">
                {/* Card */}
                <div className={`rounded-3xl shadow-lg p-6 border ${cardClass} text-center relative overflow-hidden`}>

                    {/* Avatar */}
                    <div className="relative inline-block mb-3">
                        <div className={`w-28 h-28 rounded-full p-1 ${isDark ? 'bg-black' : 'bg-white'} shadow-md mx-auto`}>
                            {previewData.avatar ? (
                                <img
                                    src={previewData.avatar}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-4xl">👤</div>
                            )}
                        </div>
                    </div>

                    {/* Name & Handle */}
                    <div className="mb-4">
                        <h1 className="text-2xl font-extrabold tracking-tight mb-0.5">
                            {previewData.displayName || "Your Name"}
                        </h1>
                        <p className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                            @{previewData.username || "username"}
                        </p>
                    </div>

                    {/* Bio */}
                    {previewData.bio && (
                        <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                            {previewData.bio}
                        </p>
                    )}

                    {/* Links */}
                    <div className="space-y-2 text-left">
                        {previewData.customLinks && previewData.customLinks.length > 0 ? (
                            previewData.customLinks.map((link, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-2.5 rounded-xl border ${isDark
                                            ? 'bg-white/5 border-white/10'
                                            : 'bg-gray-50 border-gray-100'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg mr-3 ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                        {link.icon || '🔗'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs truncate">{link.title || link.url}</p>
                                        <p className={`text-[10px] truncate ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{link.url}</p>
                                    </div>
                                    <CheckCircle className={`w-4 h-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
                                </div>
                            ))
                        ) : (
                            <div className="p-4 border-2 border-dashed border-gray-300/50 rounded-xl text-center text-xs text-gray-400">
                                Add verified links
                            </div>
                        )}
                    </div>

                    {/* Socials */}
                    {previewData.socialLinks && previewData.socialLinks.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-200/20 flex justify-center gap-3">
                            {previewData.socialLinks.map((s, i) => {
                                const Icon = socialIcons[s.platform] || Globe;
                                return (
                                    <div key={i} className={`text-gray-400`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                )
                            })}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
