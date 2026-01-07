const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const adminUser = await prisma.user.findUnique({ where: { email: 'shaik.fairoz9786@gmail.com' } });
        if (!adminUser) { console.error('Admin user not found'); return; }

        const token = jwt.sign(
            { userId: adminUser.id, role: adminUser.role },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '1h' }
        );

        // Create a dummy image file
        const dummyImagePath = path.join(__dirname, 'test_image.txt');
        fs.writeFileSync(dummyImagePath, 'fake image content');
        // Note: The middleware checks for mimetype startsWith('image/'). 
        // FormData usually auto-detects mime based on extension.
        // Let's name it test.jpg so it mimics an image
        const jpgPath = path.join(__dirname, 'test.jpg');
        fs.writeFileSync(jpgPath, 'fake image bytes');

        const form = new FormData();
        form.append('title', 'Debug Blog Post WITH Image');
        form.append('slug', 'debug-blog-post-img-' + Date.now());
        form.append('content', '<p>This is a test with image.</p>');
        form.append('author', 'Debugger');
        form.append('published', 'true');
        // Append image
        form.append('image', fs.createReadStream(jpgPath));

        console.log('Sending POST request with IMAGE to http://localhost:5000/api/blogs ...');

        const response = await axios.post('http://localhost:5000/api/blogs', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        console.log('Success!', response.status, response.data);

    } catch (error) {
        if (error.response) {
            console.error('Response Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Network Error (No Response):', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

main();
