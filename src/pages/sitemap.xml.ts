import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const siteUrl = 'https://ericmaster.github.io';

// List of static pages
const staticPages = [
  '/',
  '/about',
  '/blog',
  '/resources',
  '/work',
];

// Get all blog post slugs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const postsDir = path.join(__dirname, 'posts');
const postFiles = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  : [];

// Only include published posts in the sitemap
const publishedPostFiles = postFiles.filter(f => {
  const content = fs.readFileSync(path.join(postsDir, f), 'utf-8');
  // Look for 'published: true' in the frontmatter
  return /^---[\s\S]*?published:\s*true[\s\S]*?---/.test(content);
});
const postUrls = publishedPostFiles.map(f => `/posts/${f.replace(/\.md$/, '')}`);

const allUrls = [...staticPages, ...postUrls];

const lastmod = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    url => `  <url>\n    <loc>${siteUrl}${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  )
  .join('\n')}
</urlset>`;

export async function GET() {
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
