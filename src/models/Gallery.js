const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
