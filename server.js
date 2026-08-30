require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
app.get('/', (req, res) => {
  res.send('Senthilvel School API is running');
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/pages', require('./src/routes/pageRoutes'));
app.use('/api/gallery', require('./src/routes/galleryRoutes'));
app.use('/api/events', require('./src/routes/eventRoutes'));
app.use('/api/faculty', require('./src/routes/facultyRoutes'));
app.use('/api/downloads', require('./src/routes/downloadRoutes'));
app.use('/api/menus', require('./src/routes/menuRoutes'));
app.use('/api/students', require('./src/routes/studentRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/fee-structures', require('./src/routes/feeStructureRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/exams', require('./src/routes/examRoutes'));
app.use('/api/settings', require('./src/routes/settingRoutes'));

// ── ONE-TIME SETUP ROUTE ─────────────────────────────────────────
// Visit GET /setup to auto-create the admin user. Disable after first use.
app.get('/setup', async (req, res) => {
  try {
    const User = require('./src/models/User');
    const bcrypt = require('bcryptjs');
    const existing = await User.findOne({ email: 'admin@senthilvel.com' });
    if (existing) {
      return res.json({ success: true, message: '✅ Admin already exists! Login with: admin@senthilvel.com / admin123' });
    }
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Super Admin', email: 'admin@senthilvel.com', password: hashed, role: 'admin' });
    res.json({ success: true, message: '✅ Admin created! Login with: admin@senthilvel.com / admin123' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
