require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGO_URI = 'mongodb://localhost:27017/senthilvel-cms';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@senthilvel.com' });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Super Admin',
      email: 'admin@senthilvel.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created successfully! Email: admin@senthilvel.com / Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createAdmin();
