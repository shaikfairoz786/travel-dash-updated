const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'travel_app_uploads', // The folder name in your Cloudinary account
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 1000, crop: "limit" }], // Optional: automatically resize large images
  },
});

// Configure multer
const upload = multer({
  storage: storage,
  // We no longer need fileFilter because CloudinaryStorage params handle allowedFormats
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit still applies before it uploads
});

// Export upload middleware
module.exports = {
  uploadImages: upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
    { name: 'image', maxCount: 1 }, // Added for Blog
  ]),
  upload,
};
