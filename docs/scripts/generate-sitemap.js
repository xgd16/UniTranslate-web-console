const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const hostname = 'https://uni-translate-doc.todream.net';

const pages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/guide/', changefreq: 'weekly', priority: 0.9 },
  { url: '/guide/getting-started', changefreq: 'weekly', priority: 0.8 },
  { url: '/guide/configuration', changefreq: 'weekly', priority: 0.8 },
  { url: '/guide/web-console', changefreq: 'weekly', priority: 0.8 },
  { url: '/guide/authentication', changefreq: 'weekly', priority: 0.8 },
  { url: '/api/', changefreq: 'weekly', priority: 0.9 },
  { url: '/api/translation', changefreq: 'weekly', priority: 0.8 },
  { url: '/api/platform', changefreq: 'weekly', priority: 0.8 },
  { url: '/api/statistics', changefreq: 'weekly', priority: 0.8 },
  { url: '/api/system', changefreq: 'weekly', priority: 0.8 },
];

async function generateSitemap() {
  try {
    const stream = new SitemapStream({ hostname });
    const data = await streamToPromise(Readable.from(pages).pipe(stream));
    const outDir = path.resolve(__dirname, '../dist');
    
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), data.toString());
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
