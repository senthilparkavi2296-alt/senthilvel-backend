const mongoose = require('mongoose');

const facultySchema = mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String },
  experience: { type: String },
  department: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
