const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');
dotenv.config();

// Initialize Passport Google Strategy
require('./src/config/passport');

const routes = require("./src/routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middleware/errorHandler");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Determine correct uploads directory
const localUploadDir = path.join(__dirname, "public/uploads");
const tmpUploadDir = "/tmp/uploads";

// Railway/Vercel use /tmp for uploads (ephemeral)
let finalUploadDir = fs.existsSync(tmpUploadDir)
  ? tmpUploadDir
  : localUploadDir;

// Ensure folder exists (for local runs)
if (!fs.existsSync(finalUploadDir)) {
  fs.mkdirSync(finalUploadDir, { recursive: true });
}

console.log(`🖼️ Serving uploads from: ${finalUploadDir}`);

// ✅ Serve uploaded images
app.use("/uploads", express.static(finalUploadDir));

// ✅ Serve React build (after uploads)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ Sitemap Route
const sitemapController = require('./src/controllers/sitemapController');
app.get('/sitemap.xml', sitemapController.generateSitemap);

// ✅ API routes
app.use("/api", routes);

// ✅ Client-side routing fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
