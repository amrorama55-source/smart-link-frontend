import { useState, useEffect } from 'react';
import { ExternalLink, Instagram, Twitter, Github, Linkedin, Globe } from 'lucide-react';

import { themes as themeData } from '../utils/bioThemes';

const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    website: Globe,
    youtube: Globe,
    tiktok: Globe
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

            <div className="px-5 -mt-10 pb-10 flex-1">
                <div className="text-center mb-10">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full p-0.5 bg-white/20 backdrop-blur-sm shadow-xl mx-auto overflow-hidden border-2 border-white/30">
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
                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--bio-text-primary)' }}>
                            {previewData.displayName || "Your Name"}
                        </h1>
                        <p className="text-sm font-semibold opacity-70" style={{ color: 'var(--bio-text-secondary)' }}>
                            @{previewData.username || "username"}
                        </p>
                    </div>

                    {/* Bio */}
                    {previewData.bio && (
                        <p className="text-sm leading-relaxed mb-8 px-2 font-medium opacity-90" style={{ color: 'var(--bio-text-primary)' }}>
                            {previewData.bio}
                        </p>
                    )}

                    {/* Socials */}
                    {previewData.socialLinks && previewData.socialLinks.length > 0 && (
                        <div className="flex justify-center flex-wrap gap-3 mb-8">
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
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {previewData.customLinks && previewData.customLinks.length > 0 ? (
                        previewData.customLinks.map((link, index) => (
                            <div
                                key={index}
                                className="flex items-center px-4 py-3.5 rounded-2xl border-2 shadow-md"
                                style={{
                                    backgroundColor: 'var(--bio-link-bg)',
                                    borderColor: 'var(--bio-link-border)',
                                    color: 'var(--bio-text-primary)'
                                }}
                            >
                                <div className="w-8 flex justify-center text-lg">{link.icon || '🔗'}</div>
                                <div className="flex-1 min-w-0 px-2">
                                    <p className="font-bold text-xs truncate">{link.title || link.url}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 opacity-30" />
                            </div>
                        ))
                    ) : (
                        <div className="p-8 border-2 border-dashed border-gray-400/30 rounded-2xl text-center text-xs text-gray-400 font-medium">
                            No links added yet
                        </div>
                    )}
                </div>

                {/* ✅ Powered by Smart Link — لوقو الموقع الحقيقي من public/logo.svg */}
                <div className="mt-10 text-center">
                    <a
                        href="https://www.smart-link.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full no-underline"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            textDecoration: 'none'
                        }}
                    >
                        {/* ✅ الشعار الحقيقي من public/logo.svg */}
                        <img
                            src="/logo.svg"
                            alt="Smart Link"
                            className="w-4 h-4 rounded flex-shrink-0"
                            style={{ display: 'block' }}
                        />
                        <span
                            className="text-[10px] font-bold tracking-wide"
                            style={{ color: 'var(--bio-text-secondary)', opacity: 0.6 }}
                        >
                            Powered by <span style={{ opacity: 1 }}>Smart Link</span>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}