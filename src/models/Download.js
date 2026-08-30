const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Circulars', 'Timetables', 'Forms', 'Schedules', 'Other'], default: 'Other' },
  fileUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Download', downloadSchema);
