const axios = require('axios');

async function main() {
    try {
        const loginUrl = 'http://localhost:5000/api/auth/login';
        const adminUrl = 'http://localhost:5000/api/blogs/admin/all';

        // Login as Admin
        console.log('Attempting to login as admin@example.com (Password: Admin123456)...');
        const loginRes = await axios.post(loginUrl, {
            email: 'admin@example.com',
            password: 'Admin123456'
        });

        if (loginRes.data.accessToken) {
            console.log('Login Successful!');
            console.log('Token:', loginRes.data.accessToken.substring(0, 20) + '...');
            const token = loginRes.data.accessToken;

            // Access Admin Route
            console.log('Attempting to fetch Admin Blogs...');
            const blogsRes = await axios.get(adminUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Admin Access Granted!');
            console.log('Blogs Found:', blogsRes.data.length);
        } else {
            console.error('Login Failed (No Token)!', loginRes.data);
        }

    } catch (error) {
        if (error.response) {
            console.error('FAILED:', error.response.status, error.response.data);
        } else {
            console.error('ERROR:', error.message);
        }
    }
}

main();
