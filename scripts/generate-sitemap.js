import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = 'https://xresize-backend.onrender.com';
const FRONTEND_URL = 'https://xresizer.com';

async function generateSitemap() {
    try {
        console.log('Fetching published blogs...');
        const response = await axios.get(`${BACKEND_URL}/api/blogs?status=published&limit=100`);
        const blogs = response.data.data.blogs;

        console.log(`Found ${blogs.length} published blogs`);

        const staticPages = [
            { loc: '/', changefreq: 'weekly', priority: '1.0' },
            { loc: '/about', changefreq: 'monthly', priority: '0.5' },
            { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
            { loc: '/terms', changefreq: 'yearly', priority: '0.3' },
            { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
            { loc: '/blog', changefreq: 'weekly', priority: '0.8' }
        ];

        const seoKBPages = [
            '/compress-jpg-to-10kb',
            '/compress-jpg-to-20kb',
            '/compress-jpg-to-30kb',
            '/compress-jpg-to-50kb',
            '/compress-jpg-to-100kb'
        ].map(loc => ({ loc, changefreq: 'monthly', priority: '0.7' }));

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add static pages
        staticPages.forEach(page => {
            xml += `
  <url>
    <loc>${FRONTEND_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
        });

        // Add SEO KB pages
        seoKBPages.forEach(page => {
            xml += `
  <url>
    <loc>${FRONTEND_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
        });

        // Add blog posts
        blogs.forEach(blog => {
            const lastmod = new Date(blog.updatedAt).toISOString().split('T')[0];
            xml += `
  <url>
    <loc>${FRONTEND_URL}/blog/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        xml += `
</urlset>`;

        // Write to public directory
        const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
        fs.writeFileSync(publicPath, xml);
        console.log(`✅ Sitemap generated successfully at ${publicPath}`);
        console.log(`   Total URLs: ${staticPages.length + seoKBPages.length + blogs.length}`);

        // Also write to dist if it exists
        const distPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
        if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
            fs.writeFileSync(distPath, xml);
            console.log(`✅ Sitemap also copied to ${distPath}`);
        }

    } catch (error) {
        console.error('❌ Error generating sitemap:', error.message);
        process.exit(1);
    }
}

generateSitemap();
