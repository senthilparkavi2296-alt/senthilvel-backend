require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
