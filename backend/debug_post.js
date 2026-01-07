const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function main() {
    try {
        // 1. Login to get token (using admin credentials)
        // We can use the promote_admin script logic to just GET a user and generate a token? 
        // Actually, let's just log in with the admin user we verified (admin@example.com / Admin123456)
        // OR just modify this script to generate a token directly using jwt library, since we are on the server side code!
        // That's easier and avoids network call for login.

        const jwt = require('jsonwebtoken');
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        // Get the admin user
        const adminUser = await prisma.user.findUnique({ where: { email: 'shaik.fairoz9786@gmail.com' } });
        if (!adminUser) {
            console.error('Admin user not found for token generation');
            return;
        }

        const token = jwt.sign(
            { userId: adminUser.id, role: adminUser.role },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '1h' }
        );

        console.log('Generated Token for:', adminUser.email);

        // 2. Prepare Form Data
        const form = new FormData();
        form.append('title', 'Debug Blog Post');
        form.append('slug', 'debug-blog-post-' + Date.now());
        form.append('content', '<p>This is a test.</p>');
        form.append('author', 'Debugger');
        form.append('published', 'true');

        // Attach a dummy image if possible, or skip image to see if it works without image
        // Let's create a dummy text file to act as image or just try first without image (if optional)?
        // The controller says: if (req.files && ...) so image is optional.
        // Let's try WITHOUT image first. If that works, we try WITH image.

        console.log('Sending POST request to http://localhost:5000/api/blogs ...');

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
