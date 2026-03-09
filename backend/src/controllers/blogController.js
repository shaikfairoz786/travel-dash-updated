const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Get all blogs (Public) - supports pagination
exports.getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const blogs = await prisma.blog.findMany({
            where: { published: true },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.blog.count({ where: { published: true } });

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching blogs' });
    }
};

// Get single blog by slug (Public)
exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await prisma.blog.findUnique({
            where: { slug }
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching blog' });
    }
};

// Admin: Get all blogs (including unpublished)
exports.getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admin blogs' });
    }
};

// Admin: Create Blog
exports.createBlog = async (req, res) => {
    try {
        const { title, slug, content, author, published } = req.body;

        let image = null;
        if (req.files && req.files.image && req.files.image[0]) {
            image = req.files.image[0].path;
        }

        const newBlog = await prisma.blog.create({
            data: {
                title,
                slug,
                content,
                image,
                author: author || 'TravelTemplate Team',
                published: published === 'true' || published === true
            }
        });

        res.status(201).json(newBlog);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Slug must be unique' });
        }
        res.status(500).json({ error: 'Error creating blog' });
    }
};

// Admin: Update Blog
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, content, author, published } = req.body;

        const existingBlog = await prisma.blog.findUnique({ where: { id } });
        if (!existingBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        let image = existingBlog.image;
        if (req.files && req.files.image && req.files.image[0]) {
            // Ideally delete old image from Cloudinary here
            image = req.files.image[0].path;
        }

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                image,
                author,
                published: published === 'true' || published === true
            }
        });

        res.json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating blog' });
    }
};

// Admin: Delete Blog
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.blog.delete({ where: { id } });
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting blog' });
    }
};
