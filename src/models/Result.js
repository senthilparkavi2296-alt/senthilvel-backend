const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  marks: [{
    subjectName: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    remarks: { type: String }
  }],
  totalMarksObtained: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  grade: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pass', 'Fail', 'Absent'],
    default: 'Pass'
  },
  teacherRemarks: {
    type: String
  }
}, { timestamps: true });

// A student can only have one result per exam
resultSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
