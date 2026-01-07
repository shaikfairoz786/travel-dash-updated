const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');
const blogController = require('../controllers/blogController');

// ===== ADMIN ROUTES =====
router.get('/admin/all',
    authenticateToken, authorizeRoles('admin'),
    blogController.getAllBlogsAdmin
);

router.post('/',
    authenticateToken, authorizeRoles('admin'),
    (req, res, next) => {
        uploadImages(req, res, (err) => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    blogController.createBlog
);

router.put('/:id',
    authenticateToken, authorizeRoles('admin'),
    (req, res, next) => {
        uploadImages(req, res, (err) => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    blogController.updateBlog
);

router.delete('/:id',
    authenticateToken, authorizeRoles('admin'),
    blogController.deleteBlog
);

// ===== PUBLIC ROUTES =====
router.get('/', blogController.getAllBlogs);
router.get('/:slug', blogController.getBlogBySlug);

module.exports = router;
