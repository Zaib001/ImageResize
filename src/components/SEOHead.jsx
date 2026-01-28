import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
    title,
    description,
    slug = '',
    image = '',
    article = false,
    keywords = 'image resize, photo editor, online image tool, blog'
}) => {
    const siteName = 'Resizely.Core';
    const siteUrl = window.location.origin;
    const fullUrl = `${siteUrl}${slug ? (slug.startsWith('/') ? slug : `/${slug}`) : ''}`;
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Professional Imaging Engine`;
    const defaultDescription = 'Professional high-performance image synthesis and manipulation platform for enterprise assets.';
    const finalDescription = description || defaultDescription;
    const finalImage = image || `${siteUrl}/og-image.jpg`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:type" content={article ? 'article' : 'website'} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": article ? "BlogPosting" : "WebPage",
                    "headline": title || siteName,
                    "description": finalDescription,
                    "image": finalImage,
                    "url": fullUrl,
                    "publisher": {
                        "@type": "Organization",
                        "name": siteName,
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${siteUrl}/logo.png`
                        }
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEOHead;
