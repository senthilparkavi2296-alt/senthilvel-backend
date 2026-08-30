const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
