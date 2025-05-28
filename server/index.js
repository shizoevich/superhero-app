const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');
const cloudinary = require('cloudinary').v2;

const heroRoutes = require('./routes/heroes');
const uploadRoutes = require('./routes/upload'); // ✅ Тільки один раз
// Якщо потрібно — імпортуй parser ось так:
const upload = require('./middleware/upload'); // ✅ middleware можна назвати "upload"

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use('/api/upload', uploadRoutes);          // наприклад: POST /api/upload
app.use('/api/heroes', heroRoutes);           // наприклад: POST /api/heroes

// DB Connection
db.sequelize.authenticate()
  .then(() => console.log('🟢 DB connected!'))
  .catch(err => console.error('🔴 DB connection failed:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
