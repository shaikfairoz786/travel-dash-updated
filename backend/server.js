const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
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

// Define allowed origins dynamically based on env or defaults
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.BACKEND_URL || 'http://localhost:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Apply basic security headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow images to be loaded cross-origin easily
}));

app.use(express.json());

// Set trust proxy (important for Render/Railway so rate limit & secure cookies read correct IP)
app.set('trust proxy', 1);

// Configure session middleware securely for production
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Setup API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests side this IP, please try again in 15 minutes.' }
});

// Apply rate limiting specifically to all our APIs
app.use("/api", apiLimiter);

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
