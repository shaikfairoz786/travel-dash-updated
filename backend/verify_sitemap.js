const axios = require('axios');

async function checkSitemap() {
    try {
        console.log('Fetching sitemap from http://localhost:5000/sitemap.xml ...');
        const response = await axios.get('http://localhost:5000/sitemap.xml');

        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers['content-type']);
        console.log('\n--- Sitemap Content Snippet (First 500 chars) ---');
        console.log(response.data.substring(0, 500));
        console.log('...\n');

        if (response.data.includes('<loc>')) {
            console.log('✅ Sitemap structure looks correct (XML tags found).');
        } else {
            console.error('❌ Sitemap seems to be missing XML tags.');
        }

        if (response.data.includes('/blogs/')) {
            console.log('✅ Dynamic Blog routes found.');
        } else {
            console.warn('⚠️ No /blogs/ routes found. (Maybe no blogs are published yet?)');
        }

    } catch (error) {
        if (error.response) {
            console.error('FAILED:', error.response.status, error.response.data);
        } else {
            console.error('ERROR:', error.message);
        }
    }
}

checkSitemap();
