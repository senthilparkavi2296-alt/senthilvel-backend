const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  name: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  studentId: { type: String, unique: true },
  dateOfBirth: { type: Date, required: true },
  mobile: { type: String },
  parentName: { type: String },
  parentMobile: { type: String },
  email: { type: String },
  className: { type: String, required: true },
  section: { type: String },
  rollNumber: { type: String },
  academicYear: { type: String, default: '2024-25' },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
