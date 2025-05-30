const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const db = require('./models');
const path = require('path');

const heroRoutes = require('./routes/heroes');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Cloud name:', process.env.CLOUD_NAME);

app.use('/api/images', uploadRoutes);
app.use('/api/heroes', heroRoutes);

db.sequelize.authenticate()
  .then(() => console.log('🟢 DB connected!'))
  .catch(err => console.error('🔴 DB connection failed:', err));

app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
