import { useState, useEffect } from 'react';
import { MoreHorizontal, Instagram, Twitter, Github, Linkedin, Globe, Youtube, Mail, Ghost, Music } from 'lucide-react';

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
            className="min-h-full w-full transition-colors duration-500 overflow-x-hidden rounded-[2rem] flex flex-col"
            style={{
                ...currentTheme.variables,
                background: currentTheme.variables['--bio-bg'],
                backdropFilter: currentTheme.variables['--bio-backdrop'] || 'none'
            }}
        >
            {/* Top Spacing */}
            <div className="h-20 w-full"></div>

            <div className="px-5 -mt-10 pb-20 flex-1 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4 pt-6">
                    <div className="w-24 h-24 rounded-full p-0.5 bg-white/10 backdrop-blur-md shadow-xl mx-auto overflow-hidden ring-2 ring-white/30">
                        {previewData.avatar ? (
                            <img
                                src={previewData.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-3xl">👤</div>
                        )}
                    </div>
                </div>

                {/* Name & Handle */}
                <div className="mb-4">
                    <h1 className="text-xl font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--bio-text-primary)' }}>
                        {previewData.displayName || "Your Name"}
                    </h1>
                    <p className="text-[13px] font-semibold opacity-75" style={{ color: 'var(--bio-text-secondary)' }}>
                        @{previewData.username || "username"}
                    </p>
                </div>

                {/* Bio */}
                {previewData.bio && (
                    <p className="text-[14px] leading-relaxed mb-5 px-3 font-medium opacity-90" style={{ color: 'var(--bio-text-primary)' }}>
                        {previewData.bio}
                    </p>
                )}

                {/* Socials - Moved up */}
                {previewData.socialLinks && previewData.socialLinks.length > 0 && (
                    <div className="flex justify-center flex-wrap gap-3 mb-6">
                        {previewData.socialLinks.map((s, i) => {
                            const Icon = socialIcons[s.platform] || Globe;
                            return (
                                <div
                                    key={i}
                                    className="p-2.5 rounded-full shadow-sm"
                                    style={{ backgroundColor: 'var(--bio-link-bg)', color: 'var(--bio-text-primary)' }}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Links - Pill Shaped */}
                <div className="flex flex-col items-center space-y-3 w-full">
                    {previewData.customLinks && previewData.customLinks.length > 0 ? (
                        previewData.customLinks.map((link, index) => (
                            <div
                                key={index}
                                className="relative flex items-center p-1 rounded-full border-2 shadow-sm w-full"
                                style={{
                                    backgroundColor: 'var(--bio-link-bg)',
                                    borderColor: 'var(--bio-link-border)',
                                    color: 'var(--bio-text-primary)'
                                }}
                            >
                                {/* Left Icon */}
                                <div className="absolute left-1 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                                    {link.icon || '🔗'}
                                </div>
                                
                                {/* Centered Text */}
                                <div className="flex-1 py-3 px-12 text-center">
                                    <p className="font-bold text-[14px] truncate">{link.title || link.url}</p>
                                </div>
                                
                                {/* Right Icon */}
                                <div className="absolute right-3 flex items-center justify-center">
                                    <MoreHorizontal className="w-4 h-4 opacity-40" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 border-2 border-dashed border-gray-400/30 rounded-2xl text-center text-xs text-gray-400 font-medium w-full">
                            No links added yet
                        </div>
                    )}
                </div>

                {/* ✅ Powered by Smart Link Floating Footer */}
                <div className="absolute bottom-5 w-full left-0 right-0 px-4 flex justify-center pointer-events-none">
                    <div
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full shadow-lg border"
                        style={{
                            backgroundColor: 'var(--bio-card-bg)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            borderColor: 'var(--bio-card-border)',
                        }}
                    >
                        <img
                            src="/logo-v1.svg"
                            alt="Smart Link"
                            className="w-4 h-4 rounded flex-shrink-0"
                            style={{ display: 'block' }}
                        />
                        <span
                            className="text-[11px] font-bold tracking-wide"
                            style={{ color: 'var(--bio-text-primary)' }}
                        >
                            Join <span className="opacity-70 mx-0.5">@{previewData.username || 'username'}</span> on SmartLink
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}