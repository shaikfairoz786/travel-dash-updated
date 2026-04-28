const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.generateSitemap = async (req, res) => {
  try {
    const baseUrl = 'https://travel-dash-updateded.vercel.app/'; // Replace with actual domain

    // Fetch dynamic content
    const packages = await prisma.package.findMany({ where: { active: true } });
    const blogs = await prisma.blog.findMany({ where: { published: true } });

    // Static Routes
    const staticRoutes = [
      '',
      '/about-us',
      '/contact',
      '/packages',
      '/blogs',
      '/impact',
      '/impact/village-of-lum',
      '/impact/rafis-house-our-first-homestay',
      '/impact/farmers-innovation-center',
      '/impact/womens-weaver-cooperative',
      '/impact/waste-warriors-of-the-hills',
      '/impact/education-for-all',
      '/plan-my-trip',
      '/login',
      '/register'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add Static Routes
    staticRoutes.forEach(route => {
      xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add Packages
    packages.forEach(pkg => {
      xml += `
  <url>
    <loc>${baseUrl}/package/${pkg.slug}</loc>
    <lastmod>${pkg.createdAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    });

    // Add Blogs
    blogs.forEach(blog => {
      xml += `
  <url>
    <loc>${baseUrl}/blogs/${blog.slug}</loc>
    <lastmod>${blog.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
};
