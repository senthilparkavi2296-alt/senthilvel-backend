const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  className: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true,
    default: '2024-25'
  },
  date: {
    type: Date,
    required: true
  },
  subjects: [{
    name: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
