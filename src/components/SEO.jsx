import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url, videoData }) {
    const siteTitle = 'Smart Link — Marketing Infrastructure for Affiliates, Creators & Media Buyers';
    const finalTitle = title ? `${title} | Smart Link` : siteTitle;
    const defaultDescription = 'Replace ClickMagick, Voluum & Linktree with one platform. Geo Targeting, Bot Protection, Deep Analytics & A/B Testing.';
    const finalDescription = description || defaultDescription;
    const finalImage = image || 'https://www.by-smartlink.com/twitter-poster.png';
    
    // Improved Canonical Logic: Use provided URL or construct from current path
    const baseUrl = 'https://www.by-smartlink.com';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const finalUrl = url || `${baseUrl}${currentPath === '/' ? '' : currentPath}`;

    const videoSchema = videoData ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": videoData.title,
        "description": videoData.description,
        "thumbnailUrl": videoData.thumbnailUrl || [
            "https://www.by-smartlink.com/og-image.png"
        ],
        "uploadDate": videoData.uploadDate || "2026-04-21T00:00:00Z",
        "duration": videoData.duration || "PT1M33S",
        "contentUrl": "https://www.by-smartlink.com/marketing-demo.mp4",
        "embedUrl": "https://www.by-smartlink.com/",
        "potentialAction": {
            "@type": "SeekToAction",
            "target": "https://www.by-smartlink.com/marketing-demo.mp4?t={seek_to_second_number}",
            "startOffset-input": "required name=seek_to_second_number"
        }
    } : null;

    return (
        <Helmet>
            {/* Canonical Link */}
            <link rel="canonical" href={finalUrl} />

            {/* Standard Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />

            {/* Structured Data */}
            {videoSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(videoSchema)}
                </script>
            )}
        </Helmet>
    );
}
