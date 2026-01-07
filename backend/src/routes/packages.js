const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');
const packageController = require('../controllers/packageController');

// ===== ADMIN ROUTES FIRST =====
router.get('/admin/all',
  authenticateToken, authorizeRoles('admin'),
  packageController.getAllPackagesAdmin
);

router.get('/admin/:id',
  authenticateToken, authorizeRoles('admin'),
  packageController.getPackageById
);

router.post('/',
  authenticateToken, 
  authorizeRoles('admin'),
  (req, res, next) => {
    uploadImages(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message || 'File upload error' });
      }
      next();
    });
  },
  packageController.createPackage
);

router.put('/admin/:id',
  authenticateToken, authorizeRoles('admin'),
  uploadImages,
  packageController.updatePackage
);

router.delete('/admin/:id',
  authenticateToken, authorizeRoles('admin'),
  packageController.deletePackage
);

// ===== PUBLIC ROUTES AFTER =====
router.get('/', packageController.getAllPackages);
router.get('/:slug', packageController.getPackageBySlug);

module.exports = router;
