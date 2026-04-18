import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
    const siteTitle = 'Smart Link - Elite Link Management Platform';
    const finalTitle = title ? `${title} | Smart Link` : siteTitle;
    const defaultDescription = 'Smart Link is an enterprise-grade platform for shrinking links, tracking conversions, running A/B tests, and building elegant bio pages.';
    const finalDescription = description || defaultDescription;
    const finalImage = image || 'https://www.smart-link.website/logo-v1.svg'; // Or a dedicated Open Graph image
    const finalUrl = url || 'https://www.smart-link.website';

    return (
        <Helmet>
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
        </Helmet>
    );
}
