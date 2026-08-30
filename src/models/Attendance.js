const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  section: {
    type: String,
    default: 'A'
  },
  records: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Half-day'],
      default: 'Present'
    },
    remarks: {
      type: String
    }
  }],
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Ensure unique attendance per class/section per date
attendanceSchema.index({ date: 1, className: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
